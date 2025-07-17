// tabs.js or main.js — depending on where you want it
import * as fx from "./functions.js";

const tabs = {};
let activeTab = "default";
let editorArea;

// 🧠 Create a new EditorView instance
export function createEditorView(doc = "", theme = oneDark, wrap = true) {
    return new EditorView({
        parent: editorArea,
        state: EditorState.create({
            doc,
            extensions: [
                basicSetup,
                lineNumbers(),
                foldGutter(),
                indentUnit.of("   "),
                xml(),
                bracketMatching(),
                closeBrackets(),
                wrap ? EditorView.lineWrapping : [],
                theme,
                keymap.of([{
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
                        }
                    ])
            ]
        })
    });
}

export function initTabs(container) {
    editorArea = container;
    const savedTabs = JSON.parse(localStorage.getItem("editorTabs") || "{}");
    activeTab = localStorage.getItem("activeTab") || "default";

    Object.entries(savedTabs).forEach(([name, data]) => {
        const editor = createEditorView(data.content);
        editor.dom.style.display = "none";
        container.appendChild(editor.dom);
        tabs[name] = {
            editor
        };
    });

    if (!tabs["default"])
        createTab("default");

    renderTabs();
    switchTab(tabs[activeTab] ? activeTab : "default");
}

export function createTab(name) {
    if (tabs[name])
        return;

    const editor = createEditorView("");
    editor.dom.style.display = "none";
    editorArea.appendChild(editor.dom);
    tabs[name] = {
        editor
    };

    activeTab = name;
    saveAllTabs();
    renderTabs();
    switchTab(name);
}

export function switchTab(name) {
    activeTab = name;

    Object.values(tabs).forEach(({
            editor
        }) => {
        editor.dom.style.display = "none";
    });

    const activeEditor = tabs[name]?.editor;
    if (activeEditor) {
        activeEditor.dom.style.display = "block";
        activeEditor.focus();
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
    for (const [name, {
                editor
            }
        ] of Object.entries(tabs)) {
        saved[name] = {
            content: editor.state.doc.toString()
        };
    }
    localStorage.setItem("editorTabs", JSON.stringify(saved));
    localStorage.setItem("activeTab", activeTab);
}

export function renderTabs() {
    const tabsContainer = document.getElementById("tabs");
    if (!tabsContainer)
        return;

    tabsContainer.innerHTML = "";

    for (const tabName of Object.keys(tabs)) {
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
  // Close modal if needed
}

export function addTab() {
    openModal("tab");
}
