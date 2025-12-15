// tabs.js — provides multi-tab EditorView creation
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { xml } from "@codemirror/lang-xml";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import * as fx from "./functions.js";
import { defaultKeymap } from "@codemirror/commands";
import { foldGutter, indentUnit, bracketMatching } from "@codemirror/language";
import { openModal } from "./modals.js";
import { oneDark } from "@codemirror/theme-one-dark";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { EditorView } from "@codemirror/view";
import { autocompletion, completionKeymap, closeBrackets } from "@codemirror/autocomplete";

// Helper: Attach minimal CodeMirror 5-compatible API on a CM6 EditorView instance
export function attachCM5Compat(editor) {
    if (!editor) return;

    // getWrapperElement -> CM6 uses DOM via editor.dom
    editor.getWrapperElement = () => editor.dom;

    // getValue/setValue
    editor.getValue = () => editor.state.doc.toString();
    editor.setValue = (val = "") => {
        editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: String(val) } });
    };

    // replaceSelection(text)
    editor.replaceSelection = (text) => {
        fx.insertText(editor, String(text));
    };

    // refresh -> requestMeasure (forces re-measure/layout)
    editor.refresh = () => editor.requestMeasure();

    // getCursor(from/to/null) -> returns CM5-like cursor {line, ch}
    editor.getCursor = (which = "from") => {
        const sel = editor.state.selection.main;
        const pos = which === "to" ? sel.to : (which === "head" ? sel.head : sel.from);
        const line = editor.state.doc.lineAt(pos);
        return { line: line.number - 1, ch: pos - line.from };
    };

    // getLine(n) where n is 0-based
    editor.getLine = (n) => {
        const lineNo = Number(n) + 1;
        return editor.state.doc.line(lineNo).text;
    };

    // indexFromPos({line,ch})
    editor.indexFromPos = (cursor) => {
        if (typeof cursor === "number") return cursor;
        return editor.state.doc.line(cursor.line + 1).from + cursor.ch;
    };

    // posFromIndex
    editor.posFromIndex = (index) => {
        const line = editor.state.doc.lineAt(index);
        return { line: line.number - 1, ch: index - line.from };
    };

    // replaceRange(text, from, to)
    editor.replaceRange = (text, from, to) => {
        const getIndex = p => (typeof p === 'number') ? p : (p ? editor.state.doc.line(p.line + 1).from + p.ch : 0);
        const fromIdx = getIndex(from);
        const toIdx = getIndex(to === undefined ? from : to);
        editor.dispatch({ changes: { from: fromIdx, to: toIdx, insert: String(text) } });
    };
    // setCursor
    editor.setCursor = (cursor) => {
        if (!cursor) return;
        const pos = typeof cursor === 'number' ? cursor : editor.indexFromPos(cursor);
        editor.dispatch({ selection: { anchor: pos, head: pos } });
    };
    // setSelection(from, to) — legacy API: from/to cursor objects
    editor.setSelection = (from, to) => {
        const posFrom = (typeof from === 'number') ? from : editor.indexFromPos(from);
        const posTo = (typeof to === 'number') ? to : editor.indexFromPos(to);
        editor.dispatch({ selection: { anchor: posFrom, head: posTo } });
    };
    // getSelection() — returns selected text
    editor.getSelection = () => {
        const sel = editor.state.selection.main;
        return editor.state.doc.slice(sel.from, sel.to).toString();
    };
}

const tabs = {};
let tabOrder = [];
let activeTab = "default";
let editorArea;

// Global settings compartments per editor
function makeTheme(name){
  // Custom dracula-inspired theme
  const draculaTheme = EditorView.theme({
    '&': { color: '#f8f8f2', backgroundColor: '#282a36' },
    '.cm-content': { caretColor: '#f8f8f0' },
    '&.cm-focused .cm-cursor': { borderLeftColor: '#f8f8f0' },
    '.cm-gutters': { backgroundColor: '#282a36', color: '#6272a4', border: 'none' },
    '.cm-activeLine': { backgroundColor: '#44475a' },
    '.cm-activeLineGutter': { backgroundColor: '#44475a' },
    '&.cm-focused .cm-selectionBackground, ::selection': { backgroundColor: '#44475a' }
  }, { dark: true });
  
  const lightA = EditorView.theme({
    '&': { color: '#111', backgroundColor: '#fafafa' },
    '.cm-content': { caretColor: '#111' },
    '&.cm-focused .cm-cursor': { borderLeftColor: '#111' },
    '.cm-gutters': { backgroundColor: '#f0f0f0', color: '#666', border: 'none' }
  }, { dark: false });
  
  const lightB = EditorView.theme({
    '&': { color: '#222', backgroundColor: '#fffef7' },
    '.cm-content': { caretColor: '#333' },
    '&.cm-focused .cm-cursor': { borderLeftColor: '#333' },
    '.cm-gutters': { backgroundColor: '#fff6d5', color: '#775', border: 'none' }
  }, { dark: false });
  
  const themes = { 
    light: lightA, 
    light2: lightB, 
    dark: oneDark, 
    github: githubDark, 
    dracula: draculaTheme 
  };
  return themes[name] || themes.light;
}

let currentTheme = 'light';
let currentWrap = true;

// 🧠 Create a new EditorView instance
export function createEditorView(doc = "", themeName = 'light', wrap = true) {
    // Per-editor language compartment and update listener to switch language depending on surrounding XML tag
    const langCompartment = new Compartment();
        const themeCompartment = new Compartment();
        const wrapCompartment = new Compartment();
    let currentLangKey = "xml";

    function findParentTagAtPos(doc, pos) {
        const before = doc.sliceString(0, pos);
        const openMatches = [...before.matchAll(/<([a-zA-Z0-9_-]+)(\s[^>]*)?>/g)];
        if (openMatches.length === 0) return null;
        const lastOpen = openMatches[openMatches.length - 1];
        const tag = lastOpen[1];
        const after = doc.sliceString(pos);
        if (after.indexOf(`</${tag}>`) !== -1) return tag;
        return null;
    }

    const languageSwitchListener = EditorView.updateListener.of(update => {
        if (!update.selectionSet && !update.docChanged) return;
        const pos = update.state.selection.main.head;
        const tag = findParentTagAtPos(update.state.doc, pos);
        let newLang = xml();
        let newKey = "xml";

        if (tag && ["exec", "validate", "virtual"].includes(tag)) {
            newLang = python();
            newKey = "python";
        } else if (tag === "style") {
            newLang = css();
            newKey = "css";
        } else if (tag === "script") {
            newLang = javascript();
            newKey = "javascript";
        }


        if (newKey !== currentLangKey) {
            update.view.dispatch({ effects: langCompartment.reconfigure(newLang) });
            currentLangKey = newKey;
        }
    });

    // Create off-DOM, we will attach active editor only
    const offscreenParent = document.createElement('div');
    const editor = new EditorView({
        parent: offscreenParent,
        state: EditorState.create({
            doc,
            extensions: [
                basicSetup,
                lineNumbers(),
                foldGutter(),
                indentUnit.of("   "),
                langCompartment.of(xml()),
                bracketMatching(),
                closeBrackets(),
                wrapCompartment.of(wrap ? EditorView.lineWrapping : []),
                themeCompartment.of(makeTheme(themeName)),
                EditorView.theme({
                    '&': { 
                        height: '100%',
                        overflow: 'hidden'
                    },
                    '.cm-scroller': { 
                        overflow: 'auto',
                        height: '100%'
                    }
                }),
                autocompletion(),
                languageSwitchListener,
                keymap.of([
                    ...completionKeymap,{
                            key: "Tab",
                            run: view => {
                                view.dispatch(view.state.replaceSelection("\t"));
                                return true;
                            }
                        }, {
                            key: "Enter",
                            run: view => {
                                const { from } = view.state.selection.main;
                                const line = view.state.doc.lineAt(from);
                                const indent = line.text.match(/^([ \t]+)/)?.[1] || "";
                                view.dispatch(view.state.replaceSelection("\n" + indent));
                                return true;
                            }
                        }, {
                            key: "Ctrl-b",
                            run: () => fx.wrapSelection(tabs[activeTab].editor, "b")
                        }, {
                            key: "Ctrl-i",
                            run: () => fx.wrapSelection(tabs[activeTab].editor, "i")
                        }, {
                            key: "Ctrl-u",
                            run: () => fx.wrapSelection(tabs[activeTab].editor, "u")
                        }, {
                            key: "Esc",
                            run: view => {
                                const ed = tabs[activeTab].editor;
                                console.log("Esc pressed in tab:", activeTab, ed);
                                const sel = ed.state.selection.main;
                                const selectedText = ed.state.doc.slice(sel.from, sel.to).toString();
                                if (sel.from !== sel.to && selectedText.includes("\n")) {
                                    ed.dispatch({ selection: { anchor: sel.to } });
                                    return true;
                                }
                                if (typeof window !== 'undefined' && typeof window.toggleCommandPalette === 'function') {
                                    window.toggleCommandPalette();
                                    return true;
                                }
                                return false;
                            }
                        },
                    ...defaultKeymap
                    ])
                ]
            })
    });

            // Compatibility wrappers for legacy CodeMirror 5-style API used across
        // the codebase (window.editor.replaceSelection, getValue, setValue, getLine, getCursor, etc.).
        // We prefer using the native CM6 API where possible, but a shim avoids
        // making tons of changes across many helper files.
        attachCM5Compat(editor);
    // keep compartments for global reconfig
    editor.__cmCompartments = { lang: langCompartment, theme: themeCompartment, wrap: wrapCompartment };
    return editor;
}

export function initTabs(container) {
    editorArea = container;
    const savedTabs = JSON.parse(localStorage.getItem("editorTabs") || "{}");
    tabOrder = JSON.parse(localStorage.getItem("tabOrder") || "[]");
    activeTab = localStorage.getItem("activeTab") || "default";

    Object.entries(savedTabs).forEach(([name, data]) => {
        const editor = createEditorView(data.content, currentTheme, currentWrap);
        tabs[name] = { editor };
        if (!tabOrder.includes(name)) tabOrder.push(name);
    });

    if (!tabs["default"])
        createTab("default");

    renderTabs();
    switchTab(tabs[activeTab] ? activeTab : "default");
}

export function createTab(name) {
    if (tabs[name])
        return;

    const editor = createEditorView("", currentTheme, currentWrap);
    tabs[name] = { editor };
    tabOrder.push(name);

    activeTab = name;
    saveAllTabs();
    renderTabs();
    switchTab(name);
}

export function switchTab(name) {
    activeTab = name;

    // ensure only one editor DOM in the container
    if (editorArea) editorArea.innerHTML = "";
    const activeEditor = tabs[name]?.editor;
    if (activeEditor && editorArea) {
        editorArea.appendChild(activeEditor.dom);
        activeEditor.focus();
        window.editor = activeEditor;
        window.editorView = activeEditor;
    }

    localStorage.setItem("activeTab", name);

    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.querySelector(`[data-tab="${name}"]`)?.classList.add("active");
}

export function closeTab(name) {
    if (name === "default")
        return;

    const tab = tabs[name];
    if (!tab)
        return;

    requestTabDeletion(name); // you can adapt this later
    tab.editor.destroy();
    tab.editor.dom.remove();
    delete tabs[name];

    const savedTabs = JSON.parse(localStorage.getItem("editorTabs") || "{}");
    delete savedTabs[name];
    localStorage.setItem("editorTabs", JSON.stringify(savedTabs));

    document.querySelector(`[data-tab="${name}"]`)?.remove();

    if (activeTab === name)
        switchTab("default");

    renderTabs();
    saveAllTabs();
}

export function getActiveEditor() {
    return tabs[activeTab]?.editor;
}

export function saveAllTabs() {
    const saved = {};
    for (const [name, { editor }] of Object.entries(tabs)) {
        saved[name] = {
            content: editor.state.doc.toString()
        };
    }
    localStorage.setItem("editorTabs", JSON.stringify(saved));
    localStorage.setItem("activeTab", activeTab);
    localStorage.setItem("tabOrder", JSON.stringify(tabOrder));
}

export function renderTabs() {
    const tabsContainer = document.getElementById("tabs");
    if (!tabsContainer)
        return;

    tabsContainer.innerHTML = "";

    const names = tabOrder.filter(n => tabs[n]);
    for (const tabName of names) {
        const tabElement = document.createElement("div");
        tabElement.className = "tab";
        tabElement.dataset.tab = tabName;
        tabElement.title = tabName;

        const tabText = document.createElement("span");
        tabText.className = "tab-label";
        tabText.textContent = truncateLabel(tabName);
        tabElement.appendChild(tabText);

        if (tabName !== "default") {
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "✖";
            closeBtn.className = "close-tab";
            closeBtn.onclick = e => {
                e.stopPropagation();
                requestTabDeletion(tabName);
            };
            tabElement.appendChild(closeBtn);
        }

        tabElement.onclick = () => switchTab(tabName);
        tabsContainer.appendChild(tabElement);
    }

    const addTabBtn = document.createElement("button");
    addTabBtn.id = "addTabButton";
    addTabBtn.title = "Add New Tab";
    addTabBtn.textContent = "➕";
    addTabBtn.onclick = () => openModal("tab");
    tabsContainer.appendChild(addTabBtn);

    tabsContainer.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === activeTab);
    });
}

export function confirmTabCreation() {
  // your logic for creating a tab — maybe from modal input
  const tabNameInput = document.getElementById("tab_name");
  const tabName = tabNameInput.value.trim();

  if (!tabName) return alert("Tab name required.");

  createTab(tabName);
  tabNameInput.value = "";
    // Close modal if open
    const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal) modal.hide();
}

export function addTab() {
    openModal("tab");
}

export function saveEditorContent() {
    if (activeTab && tabs[activeTab]?.editor) {
        const content = tabs[activeTab].editor.getValue();
        localStorage.setItem(`editorTab_${activeTab}`, content);
    }
}
export function truncateLabel(label, maxLength = 15) {
    if (label.length <= maxLength) return label;
    return label.slice(0, maxLength - 3) + "...";
}
export function requestTabDeletion(name) {
    openModal("delete-tab", name);
}

// Global controls
export function setTheme(themeName){
    currentTheme = themeName;
    Object.values(tabs).forEach(({editor}) => {
        const c = editor.__cmCompartments?.theme;
        if (c) editor.dispatch({ effects: c.reconfigure(makeTheme(themeName)) });
    });
}

export function setWordWrap(enabled){
    currentWrap = !!enabled;
    Object.values(tabs).forEach(({editor}) => {
        const c = editor.__cmCompartments?.wrap;
        if (c) editor.dispatch({ effects: c.reconfigure(enabled ? EditorView.lineWrapping : []) });
    });
}

export function forEachEditor(fn){
    Object.values(tabs).forEach(({editor}) => fn(editor));
}

export function getEditorByName(name){
    return tabs[name]?.editor || null;
}

export function getTabNames(){
    return tabOrder.slice();
}

export function getActiveTabName(){
    return activeTab;
}