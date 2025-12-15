import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { xml } from "@codemirror/lang-xml";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { defaultKeymap } from "@codemirror/commands";
import { Compartment } from "@codemirror/state";
import { autocompletion, completionKeymap, closeBrackets } from "@codemirror/autocomplete";

import { oneDark } from "@codemirror/theme-one-dark";
import { githubLight } from "@uiw/codemirror-theme-github";

import { indentUnit, foldGutter, foldEffect, unfoldEffect, foldService, bracketMatching } from "@codemirror/language";

const myFoldExtension = foldGutter({
    openText: "▼",
    closedText: "▶"
});

const savedDoc = localStorage.getItem("lastEditorContent");
const startDoc = savedDoc ?? "";

import * as fx from "./functions.js";
import * as qx from "./questionfunctions.js";
import * as sx from "./standards.js";
import * as stx from "./styles.js";
import * as tab from "./tabs.js";
import * as cv from "./vars.js";
import * as s from "./styles.js";
import { openModal, validateFormAndGenerateXML } from "./modals.js";

// Expose for legacy/global callers
if (typeof window !== 'undefined') {
    window.openModal = openModal;
    window.validateFormAndGenerateXML = validateFormAndGenerateXML;
}

let savedTheme;
let savedWordWrap;
let savedFontSize
let savedLanguage
export function getActiveEditor() {
    return tab.getActiveEditor();
}
// Expose for legacy/global callers
if (typeof window !== 'undefined') window.getActiveEditor = getActiveEditor;

let lastCommand = "";

let activeTab = "default";
let tabPendingDeletion = null;

// Expose tabPendingDeletion to modals.js
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'tabPendingDeletion', {
        get: () => tabPendingDeletion,
        set: (val) => { tabPendingDeletion = val; }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const editorArea = document.getElementById("editorArea");

    savedTheme = localStorage.getItem("editorTheme") || "light";
    savedWordWrap = localStorage.getItem("wordWrap") === "true";
    savedLanguage = localStorage.getItem("surveyLanguage") || "english";
    savedFontSize = localStorage.getItem("fontSize") || 14;

    let commandInput = document.getElementById("commandInput");
    let commandBox = document.getElementById("commandBox");
    let commandSuggestions = document.getElementById("commandSuggestions");

    const surveyLanguageDropdown = document.getElementById("surveyLanguage");
    const newSurvey = document.getElementById("newSurvey");
    const controlElements = document.getElementById("controlElements");
    const questionTypes = document.getElementById("questionTypes");
    const questionElements = document.getElementById("questionElements");
    const questionAttributes = document.getElementById("attributesCommands");
    const prePostText = document.getElementById("prePostText");
    const miscelaneousCommands = document.getElementById("miscellaneousCommands");

    const standardsTab = document.getElementById("standardQuestions");
    const copyProtection = document.getElementById("standardCopyProtection");
    const mouseoverPopUp = document.getElementById("standardMouseover");
    const standardMiscelaneousCommands = document.getElementById("standardMiscellaneousCommands");

    const stylesTab = document.getElementById("styleCreation");
    const stylesTabXML = document.getElementById("styleCreationXML");
    const stylesReadyToUse = document.getElementById("readyToUse");
    const stylesComponents = document.getElementById("sstyleComponents");

    const increaseFontButton = document.getElementById("increaseFont");
    const decreaseFontButton = document.getElementById("decreaseFont");

    // Position command palette at the end of selection (below cursor)
    function positionCommandBox() {
        const editor = window.editorView || getActiveEditor?.();
        if (!editor) {
            console.warn('No editor found for command palette positioning');
            return;
        }
        const pos = editor.state.selection.main.to; // Use selection end
        const coords = editor.coordsAtPos(pos);
        if (coords) {
            // Position below the cursor line with proper viewport awareness
            let left = coords.left;
            let top = coords.bottom + 5;
            
            // Ensure the command box stays within viewport
            const boxWidth = 320; // Approximate width of command box
            const boxHeight = 350; // Approximate max height
            
            if (left + boxWidth > window.innerWidth) {
                left = window.innerWidth - boxWidth - 10;
            }
            if (top + boxHeight > window.innerHeight) {
                // Position above cursor if not enough space below
                top = coords.top - boxHeight - 5;
            }
            
            commandBox.style.left = `${Math.max(10, left)}px`;
            commandBox.style.top = `${Math.max(10, top)}px`;
            commandBox.style.display = 'block';
        }
    }

    const commandGroups = {
        newsurvey: {
            "new sago survey": () => openModal("new-survey"),
            "new sago ihut survey": () => openModal('new-ihut'),
        },
        control: {
            
            "add term": () => fx.addTerm(getActiveEditor()),
            "add quota": () => fx.addQuota(getActiveEditor()),
            "validate tag": () => fx.validateTag(getActiveEditor()),
            "exec tag": () => fx.execTag(getActiveEditor()),
            "resource tag": () => fx.makeRes(getActiveEditor()),
            "block tag": () => wrapInBlock(getActiveEditor()),
            "block tag (randomize children)": () => wrapInBlockRandomize(getActiveEditor()),
            "loop tag": () => addLoopBlock(getActiveEditor()),
            "make looprows": () => makeLooprows(getActiveEditor()),
            "make markers": () => makeMarker(getActiveEditor()),
            "make condition": () => makeCondition(getActiveEditor()),
        },
        elements: {
            "make rows": () => fx.makeRows(getActiveEditor()),
            "make rows (rating l-h)": () => fx.makeRows(getActiveEditor(), 'low'),
            "make rows (rating h-l)": () => fx.makeRows(getActiveEditor(), 'high'),
            "make columns": () => fx.makeCols(getActiveEditor()),
            "make columns (rating l-h)": () => fx.makeCols(getActiveEditor(), 'low'),
            "make columns (rating h-l)": () => fx.makeCols(getActiveEditor(), 'high'),
            "make choices": () => fx.makeChoices(getActiveEditor()),
            "make choices (rating l-h)": () => fx.makeChoices(getActiveEditor(), 'low'),
            "make choices (rating h-l)": () => fx.makeChoices(getActiveEditor(), 'high'),
            "make noanswer": () => fx.makeNoAnswer(getActiveEditor()),
            "make groups": () => fx.makeGroups(getActiveEditor()),
            "make question comment": () => fx.addCommentQuestion(getActiveEditor()),
            "make case": () => fx.makeCase(getActiveEditor()),
            "make autofill rows": () => fx.makeAutoFillRows(getActiveEditor()),
        },
        types: {
            
            "make radio": () => qx.makeRadio(getActiveEditor()),
            "make rating": () => qx.makeRating(getActiveEditor()),
            "make starrating": () => qx.makeStarrating(getActiveEditor()),
            "make checkbox": () => qx.makeCheckbox(getActiveEditor()),
            "make select": () => qx.makeSelect(getActiveEditor()),
            "make sliderpoints": () => qx.makeSliderpoints(getActiveEditor()),
            "make text": () => qx.makeText(getActiveEditor()),
            "make textarea": () => qx.makeTextarea(getActiveEditor()),
            "make number": () => qx.makeNumber(getActiveEditor()),
            "make slidernumber": () => qx.makeSlidernumber(getActiveEditor()),
            "make float": () => qx.makeFloat(getActiveEditor()),
            "make autosum": () => qx.makeAutosum(getActiveEditor()),
            "make autosum (percent)": () => qx.makeAutosumPercent(getActiveEditor()),
            "make survey comment": () => qx.makeSurveyComment(getActiveEditor()),
            "make pipe": () => qx.makePipe(getActiveEditor()),
        },
        attr: {
            
            "open-end": () => fx.addOpen(getActiveEditor()),
            "add exclusive": () => fx.addExclusive(getActiveEditor()),
            "add aggregate": () => fx.addAggregate(getActiveEditor()),
            "add randomize='0'": () => fx.addRandomize0(getActiveEditor()),
            "add optional": () => fx.addOptional(getActiveEditor()),
            "add shuffle rows": () => fx.addShuffleRows(getActiveEditor()),
            "add shuffle cols": () => fx.addShuffleCols(getActiveEditor()),
            "add shuffle rows/cols": () => fx.addShuffleRowsCols(getActiveEditor()),
            "add where='execute'": () => fx.addExecute(getActiveEditor()),
            "add grouping/adim cols": () => fx.addGroupingCols(getActiveEditor()),
            "add grouping/adim rows": () => fx.addGroupingRows(getActiveEditor()),
            "add groups": () => fx.addGroups(getActiveEditor()),
            "add values": () => fx.addValues(getActiveEditor()),
            "add values l-h": () => fx.addValuesLow(getActiveEditor()),
            "add values h-l": () => fx.addValuesHigh(getActiveEditor()),
            "add alt label": () => fx.addAltlabel(getActiveEditor()),
            "add rating direction reversed": () => fx.addRatingDirection(getActiveEditor()),
            "add row class": () => fx.addRowClassNames(getActiveEditor()),
            "add col class": () => fx.addColClassNames(getActiveEditor()),
            "add choice class": () => fx.addChoiceClassNames(getActiveEditor()),
            "swap rows and cols": () => fx.swapRowCol(getActiveEditor()),

        },
        preposttext: {
            "add pretext": () => fx.addPreText(getActiveEditor()),
            "add pretext (internal)": () => fx.addPreTextInternal(getActiveEditor()),
            "make pretext res (internal)": () => fx.makePreTextResInternal(getActiveEditor()),
            "add posttext": () => fx.addPostText(getActiveEditor()),
            "add posttext (internal)": () => fx.addPostTextInternal(getActiveEditor()),
            "make posttext res (internal)": () => fx.makePostTextResInternal(getActiveEditor()),
        },
        misc: {
            "make note": () => qx.makeNote(getActiveEditor()),
            "brbr": () => fx.brbr(getActiveEditor()),
            "br": () => fx.br(getActiveEditor()),
            "lis": () => fx.lis(getActiveEditor()),
            "ol": () => fx.makeOl(getActiveEditor()),
            "ul": () => fx.makeUl(getActiveEditor()),
            "make link href": () => fx.makeHref(getActiveEditor()),
            "add contact question": () => fx.addContactQuestion(getActiveEditor()),
            "add ihut contact question": () => fx.addContactQuestionIHUT(getActiveEditor()),
        },
        standards: {
            
            "us states": () => sx.makeStateOnly(getActiveEditor()),
            "us states + region recode": () => sx.makeStateWithRecode(getActiveEditor()),
            "us states checkbox": () => sx.makeStateCheckbox(getActiveEditor()),
            "countries": () => sx.makeCountrySelectISO(getActiveEditor()),

        },
        copyprotection: {
            
            "add survey copy protection": () => sx.addCopyProtection(getActiveEditor()),
            "make unselectable (span)": () => sx.makeUnselectableSpan(getActiveEditor()),
            "make unselectable (div)": () => sx.makeUnselectableDiv(getActiveEditor()),
            "add unselectable attributes": () => sx.addUnselectableAttributes(getActiveEditor()),

        },
        mouseoverpopup: {
            
            "mouseover": () => openModal("new-mouseover"),
            "mouseover (template)": () => sx.addMouseoverTemplate(getActiveEditor()),
            "popup": () => openModal("new-popup"),
            "popup (template)": () => addPopupTemplate(getActiveEditor()),
        },
        standardsmisc: {
            
            "add status virtual": () => sx.addvStatusVirtual(getActiveEditor()),
            "add change virtual": () => sx.addvChange(getActiveEditor()),
            "shuffle rows virtual": () => sx.addShuffleRowsVirtual(getActiveEditor()),
            "random order tracker": () => openModal("random-order-tracker"),
            "dupe check by variable": () => openModal("dupe-check"),
        },
        styles: {
            
            "new style": () => openModal("new-style"),
            "new style (blank)": () => stx.addNewStyleBlank(getActiveEditor()),
        },
        stylesxml: {
            
            "new style wtih label": () => stx.addNewStyleBlankwithLabel(getActiveEditor()),
            "style copy/call": () => stx.addStyleCopy(getActiveEditor()),
            "survey wide css": () => stx.addSurveyWideCSS(getActiveEditor()),
            "survey wide js": () => stx.addSurveyWideJS(getActiveEditor()),
            "question specific css": () => stx.addQuestionSpecificCSS(getActiveEditor()),
            "question specific js (after question)": () => stx.addQuestionSpecificJSAfterQ(getActiveEditor()),
            "question specific js (in <head>)": () => stx.addQuestionSpecificJSInHead(getActiveEditor()),
        },
        stylesreadytouse: {
            
            "pipe number question in table": () => openModal("pipe-in-number"),
            "left-blank legend": () => stx.addLeftBlankLegend(getActiveEditor()),
            "disable continue button": () => openModal("disable-continue"),
            "add max diff style": () => stx.addMaxDiff(getActiveEditor()),
            "add element labels display": () => stx.addPretestLabelsDisplay(getActiveEditor()),

        },
        stylescomponents: {
            
            "add colfix declaration": () => addColFixDeclaration(getActiveEditor()),
            "add colfix call": () => addColFixCall(getActiveEditor()),
        }

    };

    const containers = {
        newsurvey: newSurvey,
        control: controlElements,
        types: questionTypes,
        elements: questionElements,
        attr: questionAttributes,
        preposttext: prePostText,
        misc: miscelaneousCommands,
        standards: standardsTab,
        copyprotection: copyProtection,
        mouseoverpopup: mouseoverPopUp,
        standardsmisc: standardMiscelaneousCommands,
        styles: stylesTab,
        stylesxml: stylesTabXML,
        stylesreadytouse: stylesReadyToUse,
        stylescomponents: stylesComponents
    };

    document.getElementById("addTabButton").onclick = () => openModal("tab");
    document.getElementById("createTabBtn").onclick = tab.confirmTabCreation;

    let selectedIndex = -1;

    // Initialize CodeMirror
    function getSurroundingTag(code) {
        const openTags = [...code.matchAll(/<([a-zA-Z0-9]+)(\s[^>]*)?>/g)];
        const closeTags = [...code.matchAll(/<\/([a-zA-Z0-9]+)>/g)];

        if (openTags.length === 0)
            return null;

        // Find the deepest open tag that isn't yet closed
        for (let i = openTags.length - 1; i >= 0; i--) {
            const tagName = openTags[i][1];
            const stillOpen = closeTags.filter(t => t[1] === tagName).length < openTags.filter(t => t[1] === tagName).length;
            if (stillOpen)
                return tagName;
        }

        // Fallback: return last open tag
        return openTags[openTags.length - 1][1];
    }
    // (conditionalPython removed; per-tab editors handle language switching internally)
    // Initialize tabs system; editors are created per tab and only the active one is mounted
    tab.initTabs(editorArea);

    function customTagFold(state, lineStart) {
        const line = state.doc.lineAt(lineStart);
        const match = line.text.match(/<([a-zA-Z0-9_-]+)([^>]*)>/);
        const tagName = match?.[1];

        if (!tagName)
            return null;

        for (let i = line.number + 1; i <= state.doc.lines; i++) {
            const next = state.doc.line(i);
            if (next.text.includes(`</${tagName}>`)) {
                return {
                    from: line.from,
                    to: next.to
                };
            }
        }

        return null;
    }

    // Assuming you have access to the EditorView instance as `editorView`
    document.getElementById("boldBtn").addEventListener("click", () => fx.wrapSelection(getActiveEditor(), "b"));
    document.getElementById("italicBtn").addEventListener("click", () => fx.wrapSelection(getActiveEditor(), "i"));
    document.getElementById("underlineBtn").addEventListener("click", () => fx.wrapSelection(getActiveEditor(), "u"));
    document.getElementById("superscriptBtn").addEventListener("click", () => fx.wrapSelection(getActiveEditor(), "sup"));
    document.getElementById("subscriptBtn").addEventListener("click", () => fx.wrapSelection(getActiveEditor(), "sub"));

    // Fold button handler moved below to use getActiveEditor
    document.getElementById("addTabButton").addEventListener("click", () => tab.addTab());

    // Expose toggleCommandPalette for Esc keymap in per-tab editors
    window.toggleCommandPalette = function toggleCommandPalette(){
        const editor = getActiveEditor();
        const sel = editor.state.selection.main;
        const selectedText = editor.state.doc.slice(sel.from, sel.to).toString();
        if (sel.from !== sel.to && selectedText.includes("\n")) {
            editor.dispatch({ selection: { anchor: sel.to } });
            return;
        }
        const isBoxVisible = commandBox.style.display !== "none";
        if (isBoxVisible) {
            commandBox.style.display = "none";
            commandInput.value = "";
            selectedIndex = -1;
            editor?.focus();
        } else {
            positionCommandBox();
            commandBox.style.display = "block";
            commandInput.value = lastCommand || "";
            updateSuggestions(commandInput.value);
            commandInput.focus();
            commandInput.select();
            updateSuggestions(commandInput.value);
        }
    };

    // Manual save support (if a button exists) and global function
    const manualBtn = document.getElementById("manualSaveBtn");
    if (manualBtn) manualBtn.addEventListener("click", () => tab.saveAllTabs());
    window.manualSave = () => tab.saveAllTabs();

    // fold all button
    let isFolded = false;

    document.getElementById("toggleFoldBtn").addEventListener("click", () => {
        const editor = getActiveEditor();
        const ranges = [];

        for (let i = 1; i <= editor.state.doc.lines; i++) {
            const line = editor.state.doc.line(i);
            if (/<([a-zA-Z0-9_-]+)([^>]*)>/.test(line.text)) {
                const tag = RegExp.$1;
                // Find matching closing tag (very basic; could be replaced with syntaxTree)
                for (let j = i + 1; j <= editor.state.doc.lines; j++) {
                    const close = editor.state.doc.line(j);
                    if (close.text.includes(`</${tag}>`)) {
                        ranges.push({
                            from: line.from,
                            to: close.to
                        });
                        break;
                    }
                }
            }
        }

        editor.dispatch({
            effects: isFolded
             ? ranges.map(r => unfoldEffect.of(r))
             : ranges.map(r => foldEffect.of(r))
        });

        isFolded = !isFolded;
    });

    // editor font size edit. Saves and loads the custom setting in the localstorage
    let fontSize = parseInt(localStorage.getItem("fontSize") || 14); // Initialize at top

    function updateFontSize(size) {
        fontSize = Math.max(10, Math.min(24, size));
        localStorage.setItem("fontSize", fontSize);

        Object.values(tabs).forEach(({
                editor
            }) => {
            editor.dom.style.fontSize = `${fontSize}px`;
        });

        document.querySelector(".fsize").textContent = `${fontSize}px`;
    }

    increaseFontButton.addEventListener("click", () => {
        updateFontSize(fontSize + 1);
    });

    decreaseFontButton.addEventListener("click", () => {
        updateFontSize(fontSize - 1);
    });

    // Apply initial font size on load
    updateFontSize(fontSize);

    // on change of the dropdown, sets and saves the survey language
    surveyLanguageDropdown.value = savedLanguage;

    surveyLanguageDropdown.addEventListener("change", () => {
        const selectedLang = surveyLanguageDropdown.value.toLowerCase();
        localStorage.setItem("surveyLanguage", selectedLang);
        renderCommentEditor(selectedLang);
    });

    // auto loads and sets the survey language
    function setSurveyLanguage(language) {
        surveyLanguageDropdown.value = language;
        localStorage.setItem("surveyLanguage", language);
    }

    window.setSurveyLanguage = setSurveyLanguage;

    // populates commands in the toolbox according to the definition of the const commandGroups
    function populateCommands() {
        commandSuggestions.innerHTML = "";

        Object.entries(commandGroups).forEach(([group, commands]) => {
            const container = containers[group];
            container.innerHTML = "";

            Object.keys(commands).forEach(cmd => {
                const link = document.createElement("a");
                link.href = "javascript:void(0);";
                link.textContent = fx.toTitleCase(cmd);
                link.onclick = () => validateAndExecuteCommand(cmd);
                container.appendChild(link);

                const suggestion = document.createElement("li");
                suggestion.textContent = fx.toTitleCase(cmd);
                suggestion.addEventListener("click", () => {
                    commandInput.value = cmd;
                    validateAndExecuteCommand(cmd);
                    commandBox.style.display = "none";
                    commandInput.value = "";
                });
                commandSuggestions.appendChild(suggestion);
            });
        });
    }

    // defines different behaviours for command pallette box - navigating with arrow keys, cycling with tab and shift-tab
    // escape button calls the command pallette box when the editor is on focus

    commandInput.addEventListener("blur", () => {
        // Optional safeguard if needed
        setTimeout(() => {
            if (document.activeElement !== commandInput) {
                commandBox.style.display = "none";
                selectedIndex = -1;
            }
        }, 100);
    });
    // executes a valid command on enter
    commandInput.addEventListener("keydown", (event) => {
        editor = getActiveEditor();
        let items = commandSuggestions.querySelectorAll("li");

        switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            if (selectedIndex < items.length - 1) {
                selectedIndex++;
            } else {
                selectedIndex = 0;
            }
            highlightSelection();
            break;

        case "ArrowUp":
            event.preventDefault();
            if (selectedIndex > 0) {
                selectedIndex--;
            } else {
                selectedIndex = items.length - 1;
            }
            highlightSelection();
            break;

        case "Enter":
            event.preventDefault();
            if (selectedIndex >= 0) {
                commandInput.value = items[selectedIndex].textContent;
            }
            validateAndExecuteCommand(commandInput.value.trim());
            commandBox.style.display = "none";
            commandInput.value = "";
            selectedIndex = -1;
            getActiveEditor()?.focus(); ;
            break;
        case "Escape":
            event.preventDefault();
            commandBox.style.display = "none";
            commandInput.value = "";
            selectedIndex = -1;
            getActiveEditor()?.focus(); ;
            break;
        case "Tab":
            event.preventDefault();
            if (items.length > 0) {
                if (event.shiftKey) {
                    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                } else {
                    selectedIndex = (selectedIndex + 1) % items.length;
                }
                highlightSelection();
            }
            break;

        default:
            return;
        }
    });

    // hide the command pallette box when clicked outside of it
    document.addEventListener("click", (event) => {
        const commandBox = document.getElementById("commandBox");
        const clickedInside = commandBox.contains(event.target);

        if (commandBox.style.display !== "none" && !clickedInside) {
            commandBox.style.display = "none";
            commandInput.value = "";
            selectedIndex = -1;

            const ed = getActiveEditor?.();
            ed?.focus();
        }
    });

    populateCommands();

    // auto loads and sets the values for theme and wordwrap
    document.getElementById("themeSelector").value = savedTheme;
    document.getElementById("wordWrapToggle").checked = savedWordWrap;
    // apply persisted settings globally
    tab.setTheme(savedTheme || 'light');
    tab.setWordWrap(!!savedWordWrap);

    // define the editor theme and save it in the localstorage
    document.getElementById("themeSelector").addEventListener("change", function () {
        const selectedTheme = this.value; // light, light2, dark, dark2
        localStorage.setItem("editorTheme", selectedTheme);
        tab.setTheme(selectedTheme);
    });

    // toggle word wrap and save it in the localstorage
    document.getElementById("wordWrapToggle").addEventListener("change", function () {
        const isChecked = this.checked;
        localStorage.setItem("wordWrap", isChecked);

        tab.setWordWrap(isChecked);

    });
    // when creating new tab or survey, and enter is pressed, call error if something's wrong, else continue
    document.addEventListener("keydown", (event) => {
        const modal = document.getElementById("surveyModal");
        const isVisible = modal?.classList.contains("show");

        if (event.key === "Enter" && isVisible) {
            event.preventDefault();

            const actions = [{
                    selector: ".new-tab",
                    action: tab.confirmTabCreation
                }, {
                    selector: ".new-survey",
                    action: () => validateFormAndGenerateXML("survey")
                }, {
                    selector: ".new-ihut",
                    action: () => validateFormAndGenerateXML("ihut")
                }, {
                    selector: ".rename-tab",
                    action: () => document.getElementById("confirmRenameTabBtn").click()
                }, {
                    selector: ".new-mouseover",
                    action: () => document.getElementById("genMO").click()
                }, {
                    selector: ".new-popup",
                    action: () => document.getElementById("genPopup").click()
                }, {
                    selector: ".random-order-tracker",
                    action: () => document.getElementById("genRandomOrder").click()
                }, {
                    selector: ".dupe-check",
                    action: () => document.getElementById("genDupeCheck").click()
                }, {
                    selector: ".new-style",
                    action: () => document.getElementById("genNewStyle").click()
                }, {
                    selector: ".pipe-in-number",
                    action: () => document.getElementById("genPipeNumber").click()
                }, {
                    selector: ".disable-continue",
                    action: () => document.getElementById("genDisableContinue").click()
                }
            ];

            for (const { selector, action } of actions) {
                    const el = document.querySelector(selector);
                    if (el && el.style.display !== "none") {
                        action();
                        break;
                    }
                }
            }
        });

        //execute updateSuggestions on input in the command pallete box
        commandInput.addEventListener("input", () => {
            updateSuggestions(commandInput.value.trim());
        });

        // common autosuggest - if command name is with the name currently being entered, show them, hide the rest
        window.updateSuggestions = function updateSuggestions(input = "") {
            commandSuggestions.innerHTML = "";
            selectedIndex = -1;

            const query = input.trim().toLowerCase();
            const results = [];

            Object.entries(commandGroups).forEach(([group, commands]) => {
                Object.keys(commands).forEach(cmd => {
                    const label = fx.toTitleCase(cmd);
                    const cmdLower = cmd.toLowerCase();
                    const labelLower = label.toLowerCase();

                    let matchScore = 0;

                    if (cmdLower.startsWith(query))
                        matchScore = 3;
                    else if (labelLower.startsWith(query))
                        matchScore = 2;
                    else if (cmdLower.includes(query) || labelLower.includes(query))
                        matchScore = 1;

                    if (matchScore > 0 || !query) {
                        results.push({
                            cmd,
                            label,
                            matchScore
                        });
                    }
                });
            });

            results
            .sort((a, b) => b.matchScore - a.matchScore || a.label.localeCompare(b.label))
            .forEach(({
                    cmd,
                    label
                }, index) => {
                const suggestion = document.createElement("li");
                suggestion.textContent = label;

                suggestion.addEventListener("click", () => {
                    commandInput.value = cmd;
                    validateAndExecuteCommand(cmd);
                    commandBox.style.display = "none";
                    commandInput.value = "";
                });

                commandSuggestions.appendChild(suggestion);
            });

            if (results.length > 0) {
                selectedIndex = 0;
                highlightSelection();
            }
        }
        // highlight the command in the command pallette that's on focus rn
        function highlightSelection() {
            let items = commandSuggestions.querySelectorAll("li");

            items.forEach((item, index) => {
                item.classList.toggle("selected", index === selectedIndex);

                if (index === selectedIndex) {
                    item.scrollIntoView({
                        block: "nearest",
                        behavior: "smooth"
                    });
                    window.scrollTo({
                        top: item.getBoundingClientRect().top + window.scrollY - 100,
                        behavior: "smooth"
                    });
                }
            });
        }
        // if command is valid, execute it
        // fail if not
        function validateAndExecuteCommand(command) {
            const editor = window.editorView || getActiveEditor?.();
            if (!command) {
                alert("Command cannot be empty!");
                return;
            }
            lastCommand = command;
            processCommand(command);
            editor?.focus();
        }

        //process the command
        function processCommand(command) {
            const normalized = command.toLowerCase();

            for (const group of Object.values(commandGroups)) {
                if (group[normalized]) {
                    group[normalized](); // Run the matched command
                    return;
                }
            }

            console.error("Unknown command:", command);
            alert(`Unknown command: "${command}"`);
        }

        //confirm delete tab
        document.getElementById("confirmDeleteTabBtn").onclick = () => {
            if (tabPendingDeletion) {
                tab.closeTab(tabPendingDeletion);
                tabPendingDeletion = null;
                bootstrap.Modal.getInstance(document.getElementById("surveyModal")).hide();
            }
        };

        document.getElementById("downloadTabBtn").onclick = () => {
            editor = getActiveEditor();
            const content = editor.getValue();
            const rawName = tab.getActiveTabName?.() || "untitled";
            const safeName = sanitizeFilename(rawName) || "untitled";
            const filename = `${safeName}.xml`;

            const blob = new Blob([content], {
                type: "text/xml"
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        };

        document.getElementById("clearStorageBtn").onclick = () => openModal("delete-all-data");

        let contextTabName = null;

        // binding context menu to tabs
        document.getElementById("tabs").addEventListener("contextmenu", (e) => {
            const tab = e.target.closest(".tab");
            if (!tab)
                return;
            e.preventDefault();

            contextTabName = tab.dataset.tab;
            const menu = document.getElementById("tabContextMenu");
            menu.style.display = "block";
            menu.style.position = "absolute";
            menu.style.left = `${e.pageX}px`;
            menu.style.top = `${e.pageY}px`;
            menu.style.opacity = "1"; // ensure it's not accidentally transparent
            menu.style.pointerEvents = "auto"; // just in case it's been disabled
        });

        // close the context menu when clicked outside of it
        document.addEventListener("click", () => {
            document.getElementById("tabContextMenu").style.display = "none";
        });

        // binding the items of the context menu to their respective functions
        document.getElementById("tabContextMenu").addEventListener("click", (e) => {
            e.preventDefault();
            const action = e.target.dataset.action;
            const tabName = contextTabName;
            const editor = tab.getEditorByName(tabName);
            if (!tabName || !editor) return;

            switch (action) {
            case "save": {
                    const safeName = sanitizeFilename(tabName) || "untitled";
                    const content = editor.getValue();
                    const blob = new Blob([content], {
                        type: "text/xml"
                    });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `${safeName}.xml`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    break;
                }
            case "copy": {
                    const content = editor.getValue();
                    navigator.clipboard.writeText(content).then(() => {
                        const notification = document.getElementById("copyNotification");
                        if (notification) {
                            notification.style.display = "block";
                            setTimeout(() => {
                                notification.style.display = "none";
                            }, 3500);
                        }
                    });
                    break;
                }
            case "close":
                tab.requestTabDeletion(tabName);
                break;
            }

            document.getElementById("tabContextMenu").style.display = "none";
        });
        /*
        // drag and drop event
        editor = getActiveEditor();
        editor.getWrapperElement().addEventListener("dragover", (event) => {
        event.preventDefault(); // Prevent default browser behavior
        event.dataTransfer.dropEffect = "copy";
        });

        editor.getWrapperElement().addEventListener("drop", (event) => {
        editor = getActiveEditor();
        event.preventDefault();

        const file = event.dataTransfer.files[0];
        if (!file)
        return;

        const reader = new FileReader();
        reader.onload = (e) => {
        editor.replaceSelection(e.target.result);
        };

        reader.readAsText(file);
        });

        editor.getWrapperElement().addEventListener("dragenter", () => {
        editor = getActiveEditor();
        editor.getWrapperElement().classList.add("dragging");
        });

        editor.getWrapperElement().addEventListener("dragleave", () => {
        editor = getActiveEditor();
        editor.getWrapperElement().classList.remove("dragging");
        });
         */
        // custom tools - question comments
        function renderCommentEditor(language = "english") {
            const container = document.getElementById("commentInputs");
            container.innerHTML = "";
            const saved = localStorage.getItem(`comments_${language}`);
            if (saved) {
                cv.comments[language] = JSON.parse(saved);
                cv.comments
            }
            Object.entries(cv.comments[language]).forEach(([type, text]) => {

                const label = document.createElement("label");
                label.textContent = `${type} comment:`;
                label.classList.add("form-label");

                const input = document.createElement("input");
                input.value = text;
                input.dataset.type = type;
                input.classList.add("form-control", "mb-2");

                input.onchange = (e) => {
                    const type = e.target.dataset.type;
                    cv.comments[language][type] = e.target.value;
                    localStorage.setItem(`comments_${language}`, JSON.stringify(cv.comments[language]));
                };

                container.appendChild(label);
                container.appendChild(input);
            });

            // Optional reset button
            const resetBtn = document.createElement("button");
            resetBtn.textContent = "Reset to Defaults";
            resetBtn.className = "btn btn-warning mt-2";
            resetBtn.onclick = () => resetComments(language);
            container.appendChild(resetBtn);
        }
        renderCommentEditor(savedLanguage);

        // reset custom comments to defalt
        function resetComments(language) {
            localStorage.removeItem(`comments_${language}`);
            cv.comments[language] = JSON.parse(JSON.stringify(cv.defaultComments[language]));
            renderCommentEditor(language);
        }

        // recode checkbox option load/save
        const recodeToggleToolbar = document.getElementById("recodeToggleToolbar");
        const recodeToggleModal = document.getElementById("ihut_chckbox_recode");

        // Load saved setting into both
        const saved = localStorage.getItem("ihutCheckboxRecode") || "No";
        recodeToggleToolbar.value = saved;
        recodeToggleModal.value = saved;

        // Sync changes from toolbar ➝ modal
        recodeToggleToolbar.addEventListener("change", () => {
            const val = recodeToggleToolbar.value;
            localStorage.setItem("ihutCheckboxRecode", val);
            recodeToggleModal.value = val;
        });

        // Sync changes from modal ➝ toolbar
        recodeToggleModal.addEventListener("change", () => {
            const val = recodeToggleModal.value;
            localStorage.setItem("ihutCheckboxRecode", val);
            recodeToggleToolbar.value = val;
        });

        const toggleBtn = document.getElementById("toggleToolbox");
        toggleBtn.onclick = () => {
            const wrapper = document.getElementById("toolboxWrapper");
            wrapper.classList.toggle("collapsed");
            toggleBtn.textContent = wrapper.classList.contains("collapsed") ? "›" : "‹";
        };

        document.getElementById("toggleToolbarBtn").onclick = function () {
            const toolbar = document.querySelector(".editor-toolbar");
            toolbar.classList.toggle("collapsed");

            this.textContent = toolbar.classList.contains("collapsed") ? "▼" : "▲";
            if (targetSelector.includes("toolbar") && editor?.refresh) {
                setTimeout(() => editor.refresh(), 310);
            }

        };

        //resize
        function makeResizable(wrapperId, direction = "vertical") {
            const wrapper = document.getElementById(wrapperId);
            const handle = wrapper?.querySelector(`.resize-handle.${direction}`);
            if (!handle || !wrapper)
                return;

            let isResizing = false;

            handle.addEventListener("mousedown", e => {
                isResizing = true;
                document.body.style.cursor = handle.style.cursor;
                e.preventDefault();
            });

            document.addEventListener("mousemove", e => {
                if (!isResizing)
                    return;

                if (direction === "vertical") {
                    const newHeight = e.clientY - wrapper.getBoundingClientRect().top;
                    wrapper.style.height = newHeight + "px";
                } else {
                    const maxWidth = 500;
                    const minWidth = 200;
                    const newWidth = Math.min(
                            Math.max(e.clientX - wrapper.getBoundingClientRect().left, minWidth),
                            maxWidth);
                    wrapper.style.width = newWidth + "px";
                }

                // Refresh editor layout in CM6
                const editor = window.editorView || getActiveEditor?.();
                editor?.requestMeasure(); // Triggers layout recalculation
            });

            document.addEventListener("mouseup", () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = "default";
                }
            });
        }

        const toolbox = document.getElementById("toolbox");
        toolbox.style.width = "350px"; // or your default width

        makeResizable("toolbar", "vertical");
        makeResizable("toolbox", "horizontal");

        const select = document.getElementById("styleDropdown");
        const grouped = s.groupStylesByPrefix(cv.SURVEY_STYLE_DEFINITIONS);

        Object.entries(grouped).forEach(([prefix, labels]) => {
            const group = document.createElement("optgroup");
            group.label = prefix;

            labels.forEach(label => {
                const option = document.createElement("option");
                option.value = label;
                option.textContent = label;
                group.appendChild(option);
            });

            select.appendChild(group);
        });
        document.querySelectorAll(".commands-header.collapsible").forEach(header => {
            header.addEventListener("click", () => {
                const body = header.nextElementSibling;
                if (body.classList.contains("collapsed")) {
                    body.classList.remove("collapsed");
                } else {
                    body.classList.add("collapsed");
                }
            });
        });

    });
