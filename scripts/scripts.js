let savedTheme;
let savedWordWrap;
let savedFontSize
let savedLanguage
function getActiveEditor() {
    return tabs[activeTab]?.editor;
}
let lastCommand = "";

document.addEventListener("DOMContentLoaded", () => {

    editorArea = document.getElementById("editorArea");
    savedTheme = localStorage.getItem("editorTheme") || "default";
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
    const stylesCommands = document.getElementById("stylesCommands");

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

    editor = getActiveEditor();

    const commandGroups = {
        newsurvey: {
            "new sago survey": () => openModal("new-survey"),
            "new sago ihut survey": () => openModal('new-ihut'),
        },
        control: {
            "add term": addTerm,
            "add quota": addQuota,
            "validate tag": validateTag,
            "exec tag": execTag,
            "virtual tag": virtualTag,
            "resource tag": makeRes,
            "block tag": wrapInBlock,
            "block tag (randomize children)": wrapInBlockRandomize,
            "loop tag": addLoopBlock,
            "make looprows": makeLooprows,
            "make markers": makeMarker,
            "make condition": makeCondition,
        },
        elements: {
            "make rows": () => makeRows(),
            "make rows (rating l-h)": () => makeRows("low"),
            "make rows (rating h-l)": () => makeRows("high"),
            "make columns": () => makeCols(),
            "make columns (rating l-h)": () => makeCols("low"),
            "make columns (rating h-l)": () => makeCols("high"),
            "make choices": () => makeChoices(),
            "make choices (rating l-h)": () => makeChoices("low"),
            "make choices (rating h-l)": () => makeChoices("high"),
            "make noanswer": makeNoAnswer,
            "make groups": makeGroups,
            "make question comment": addCommentQuestion,
            "make case": makeCase,
            "make autofill rows": makeAutoFillRows
        },
        types: {
            "make radio": makeRadio,
            "make rating": makeRating,
            "make starrating": makeStarrating,
            "make checkbox": makeCheckbox,
            "make select": makeSelect,
            "make sliderpoints": makeSliderpoints,
            "make text": makeText,
            "make textarea": makeTextarea,
            "make number": makeNumber,
            "make slidernumber": makeSlidernumber,
            "make float": makeFloat,
            "make autosum": () => makeAutosum("number"),
            "make autosum (percent)": () => makeAutosum("percent"),
            "make survey comment": makeSurveyComment,
            "make pipe": makePipe,
            "make autofill": makeAutofill,
            "make image upload": makeImageUpload,
            "make reusable list": makeReusableList,
            "recall reusable list": callReusableList,
        },
        attr: {
            "add open-end": addOpen,
            "add exclusive": addExclusive,
            "add aggregate": addAggregate,
            "add randomize='0'": addRandomize0,
            "add optional": addOptional,
            "add shuffle rows": addShuffleRows,
            "add shuffle cols": addShuffleCols,
            "add shuffle rows/cols": addShuffleRowsCols,
            "add where='execute'": addExecute,
            "add grouping/adim cols": addGroupingCols,
            "add grouping/adim rows": addGroupingRows,
            "add groups": addGroups,
            "add values": () => addValues(),
            "add values l-h": () => addValues("low"),
            "add values h-l": () => addValues("high"),
            "add alt label": addAltlabel,
            "add rating direction reversed": addRatingDirection,
            "add row shuffle": () => elShuffle("row"),
            "add col shuffle": () => elShuffle("col"),
            "add choice shuffle": () => elShuffle("choice"),
            "swap rows and cols": swapRowCol,

        },
        preposttext: {
            "add pretext": addPreText,
            "add pretext (internal)": addPreTextInternal,
            "make pretext res (internal)": makePreTextResInternal,
            "add posttext": addPostText,
            "add posttext (internal)": addPostTextInternal,
            "make posttext res (internal)": makePostTextResInternal,
        },
        stylescommands: {
            "add row class": () => addSurveyClassNames("row"),
            "add col class": () => addSurveyClassNames("col"),
            "add choice class": () => addSurveyClassNames("choice"),
            "add group class": () => addSurveyClassNames("group"),
            "add comment class": () => addSurveyClassNames("comment"),
            "add question class": () => addSurveyClassNames("question"),
            "add colwidth": addColWidth,
            "add legend col width (left/right legend)": addLegendColWidth,
        },
        misc: {
            "make note": makeNote,
            "brbr": brbr,
            "br": br,
            "lis": lis,
            "ol": makeOl,
            "ul": makeUl,
            "make link href": makeHref,
            "make image": makeImageTags,
            "resource tag (call internal)": callInternalRes,
            "add html table": () => openModal("new-table"),
            "relabel elements": relabelSelection,
            "add contact question": addContactQuestion,
            "add ihut contact question": addContactQuestionIHUT,
        },
        standards: {
            "us states": makeStateOnly,
            "us states + region recode": makeStateWithRecode,
            "us states checkbox": makeStateCheckbox,
            "countries": makeCountrySelectISO,

        },
        copyprotection: {
            "add survey copy protection": addCopyProtection,
            "make unselectable (span)": makeUnselectableSpan,
            "make unselectable (div)": makeUnselectableDiv,
            "add unselectable attributes": addUnselectableAttributes

        },
        mouseoverpopup: {
            "mouseover": () => openModal("new-mouseover"),
            "mouseover (template)": addMouseoverTemplate,
            "popup": () => openModal("new-popup"),
            "popup (template)": addPopupTemplate,
        },
        standardsmisc: {
            "add status virtual": addvStatusVirtual,
            "add change virtual": addvChange,
            "shuffle rows virtual": addShuffleRowsVirtual,
            "random order tracker": () => openModal("random-order-tracker"),
            "dupe check by variable": () => openModal("dupe-check"),
        },
        styles: {
            "new style": () => openModal("new-style"),
            "new style (blank)": addNewStyleBlank,
        },
        stylesxml: {
            "new style wtih label": addNewStyleBlankwithLabel,
            "style copy/call": addStyleCopy,
            "survey wide css": addSurveyWideCSS,
            "survey wide js": addSurveyWideJS,
            "question specific css": addQuestionSpecificCSS,
            "question specific js (after question)": addQuestionSpecificJSAfterQ,
            "question specific js (in <head>)": addQuestionSpecificJSInHead,
        },
        stylesreadytouse: {
            "pipe number question in table": () => openModal("pipe-in-number"),
            "left-blank legend": addLeftBlankLegend,
            "disable continue button": () => openModal("disable-continue"),
            "add max diff style": addMaxDiff,
            "add question labels display": addPretestLabelsDisplay,

        },
        stylescomponents: {
            "add colfix declaration": addColFixDeclaration,
            "add colfix call": addColFixCall,
        }

    };

    const containers = {
        newsurvey: newSurvey,
        control: controlElements,
        types: questionTypes,
        elements: questionElements,
        attr: questionAttributes,
        preposttext: prePostText,
        stylescommands: stylesCommands,
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
    document.getElementById("createTabBtn").onclick = confirmTabCreation;

    let selectedIndex = -1;

    // Create & append default textarea
    const defaultTextArea = document.createElement("textarea");
    editorArea.appendChild(defaultTextArea);

    // Initialize CodeMirror
    const defaultEditor = CodeMirror.fromTextArea(defaultTextArea, {
        mode: "application/xml",
        theme: savedTheme,
        lineNumbers: true,
        smartIndent: true,

        autoCloseTags: true,
        autoCloseBrackets: true,
        matchTags: {
            bothTags: true
        },
        lineWrapping: savedWordWrap,
        foldGutter: true,
        foldOptions: {
            rangeFinder: CodeMirror.helpers.fold.custom
        },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],

        extraKeys: {
            "Ctrl-Q": function (cm) {
                cm.foldCode(cm.getCursor());
            },
            "Ctrl-B": () => wrapSelection("b"),
            "Ctrl-I": () => wrapSelection("i"),
            "Ctrl-U": () => wrapSelection("u"),
            "Ctrl-Alt-S": () => wrapSelection("sup"),
            "Ctrl-Alt-B": () => wrapSelection("sub"),
            "Esc": () => {
                const editor = getActiveEditor();
                const isBoxVisible = commandBox.style.display !== "none";

                if (isBoxVisible) {
                    commandBox.style.display = "none";
                    commandInput.value = "";
                    selectedIndex = -1;
                    editor.focus();
                } else {
                    positionCommandBox();
                    commandBox.style.display = "block";
                    commandInput.value = lastCommand || "";
                    updateSuggestions(commandInput.value);
                    commandInput.focus();
                    commandInput.select();
                    updateSuggestions(commandInput.value);
                }
            },
            Tab: (cm) => cm.replaceSelection("\t", "end"),
            Enter: (cm) => {
                const cur = cm.getCursor();
                const line = cm.getLine(cur.line);
                const indentMatch = line.match(/^([ \t]+)/);
                const indent = indentMatch ? indentMatch[1] : "";
                cm.replaceSelection("\n" + indent, "start");

                // Move the cursor to the correct position after insertion
                const newPos = {
                    line: cur.line + 1,
                    ch: indent.length
                };
                cm.setCursor(newPos);
            },
            "Ctrl-Space": "autocomplete",
            "Shift-Alt-F": () => formatXml(),

        },
        hintOptions: {
            schemaInfo: SURVEY_SCHEMA,
            completeSingle: false,
            customInsert: function (cm, data, completion) {
                const tagName = completion.text;
                const cursor = cm.getCursor();
                const token = cm.getTokenAt(cursor);

                const tagInfo = SURVEY_SCHEMA[tagName];
                const hasChildren = Array.isArray(tagInfo?.children) && tagInfo.children.length > 0;
                const hasAttrs = tagInfo?.attrs && Object.keys(tagInfo.attrs).length > 0;

                // Replace the current token (e.g., "<suspend") with full tag
                const from = {
                    line: cursor.line,
                    ch: token.start
                };
                const to = {
                    line: cursor.line,
                    ch: token.end
                };

                let tagText;
                if (!hasChildren && !hasAttrs) {
                    tagText = `<${tagName}/>`;
                    cm.replaceRange(tagText, from, to);
                    cm.setCursor({
                        line: cursor.line,
                        ch: from.ch + tagText.length
                    });
                } else {
                    tagText = `<${tagName}></${tagName}>`;
                    cm.replaceRange(tagText, from, to);
                    cm.setCursor({
                        line: cursor.line,
                        ch: from.ch + tagName.length + 2
                    });
                }
            }
        }
    });

    tabs["default"] = {
        editor: defaultEditor,
        textarea: defaultTextArea
    };

    configureEditor(defaultEditor);
    initTabs(editorArea);

    // Register fold helpers
    CodeMirror.registerHelper("fold", "custom", customTagRangeFinder);

    defaultEditor.setOption("foldOptions", {
        widget: (from, to) => {
            const startLine = defaultEditor.getLine(from.line);
            const tagMatch = startLine.match(/<([a-zA-Z0-9_-]+)/);
            const tagName = tagMatch ? tagMatch[1] : "…";
            return `<${tagName}><--></${tagName}>`;
        }
    });

    defaultEditor.on("change", () => {
        saveEditorContent();
        saveAllTabs();
    });
    const editorInput = defaultEditor.getInputField();

    // fold all button
    let isFolded = false;

    document.getElementById("toggleFoldBtn").onclick = () => {
        const totalLines = editor.lineCount();

        for (let i = 0; i < totalLines; i++) {
            editor.foldCode(CodeMirror.Pos(i, 0), null, isFolded ? "unfold" : "fold");
        }
        isFolded = !isFolded;
    };

    // editor font size edit. Saves and loads the custom setting in the localstorage
    let fontSize = parseInt(localStorage.getItem("fontSize") || 14); // Initialize at top

    function updateFontSize(size) {
        fontSize = Math.max(10, Math.min(24, size));
        localStorage.setItem("fontSize", fontSize);

        Object.values(tabs).forEach(({
                editor
            }) => {
            editor.getWrapperElement().style.fontSize = `${fontSize}px`;
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
                link.textContent = toTitleCase(cmd);
                link.onclick = () => validateAndExecuteCommand(cmd);
                container.appendChild(link);

                const suggestion = document.createElement("li");
                suggestion.textContent = toTitleCase(cmd);
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
            editor.focus();
            break;
        case "Escape":
            event.preventDefault();
            commandBox.style.display = "none";
            commandInput.value = "";
            selectedIndex = -1;
            editor.focus();
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
        let commandBox = document.getElementById("commandBox");
        editor = getActiveEditor();

        if (commandBox.style.display !== "none" && !commandBox.contains(event.target)) {
            commandBox.style.display = "none";
            commandInput.value = "";
            selectedIndex = -1;
            editor.focus();
        }
    });

    populateCommands();
    // auto loads and sets the values for theme and wordwrap
    document.getElementById("themeSelector").value = savedTheme;
    document.getElementById("wordWrapToggle").checked = savedWordWrap;

    // define the editor theme and save it in the localstorage
    document.getElementById("themeSelector").addEventListener("change", function () {
        editor = getActiveEditor();
        let selectedTheme = this.value;
        editor.setOption("theme", selectedTheme);
        localStorage.setItem("editorTheme", selectedTheme);
    });

    // toggle word wrap and save it in the localstorage
    document.getElementById("wordWrapToggle").addEventListener("change", function () {
        editor = getActiveEditor();
        let isChecked = this.checked;
        editor.setOption("lineWrapping", isChecked);
        localStorage.setItem("wordWrap", isChecked);
    });

    // when creating new tab or survey, and enter is pressed, call error if something's wrong, else continue
    document.addEventListener("keydown", (event) => {
        const modal = document.getElementById("surveyModal");
        const isVisible = modal?.classList.contains("show");

        if (event.key === "Enter" && isVisible) {
            event.preventDefault();

            const actions = [{
                    selector: ".new-tab",
                    action: confirmTabCreation
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
                }, {
                    selector: ".new-table",
                    action: () => document.getElementById("genTable").click()
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
                    const label = toTitleCase(cmd);
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
        // positioning of the command pallette box
        window.positionCommandBox = function positionCommandBox() {
            editor = getActiveEditor();
            let cursor = editor.cursorCoords();
            commandBox.style.left = `${cursor.left}px`;
            commandBox.style.top = `${cursor.top - 30}px`;
        }
        // if command is valid, execute it
        // fail if not


        function validateAndExecuteCommand(command) {
            editor = getActiveEditor();
            if (!command) {
                alert("Command cannot be empty!");
                return;
            }
            lastCommand = command;
            processCommand(command);
            editor.focus();

        }
        //process the command
        function processCommand(command) {
            const normalized = command.toLowerCase();

            // Search across all groups in commandGroups
            for (const group of Object.values(commandGroups)) {
                if (group[normalized]) {
                    group[normalized]();
                    return;
                }
            }

            console.error("Unknown command:", command);
            alert(`Unknown command: "${command}"`);
        }

        //confirm delete tab
        document.getElementById("confirmDeleteTabBtn").onclick = () => {
            if (tabPendingDeletion) {
                closeTab(tabPendingDeletion);
                tabPendingDeletion = null;
                bootstrap.Modal.getInstance(document.getElementById("surveyModal")).hide();
            }
        };

        document.getElementById("downloadTabBtn").onclick = () => {
            editor = getActiveEditor();
            const content = editor.getValue();
            const rawName = activeTab || "untitled";
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
            if (!tabName || !tabs[tabName])
                return;

            const { editor } = tabs[tabName];

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
                requestTabDeletion(tabName);
                break;
            }

            document.getElementById("tabContextMenu").style.display = "none";
        });

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

        // custom tools - question comments
        function renderCommentEditor(language = "english") {
            const container = document.getElementById("commentInputs");
            container.innerHTML = "";
            const saved = localStorage.getItem(`comments_${language}`);
            if (saved) {
                comments[language] = JSON.parse(saved);
            }
            Object.entries(comments[language]).forEach(([type, text]) => {

                const label = document.createElement("label");
                label.textContent = `${type} comment:`;
                label.classList.add("form-label");

                const input = document.createElement("input");
                input.value = text;
                input.dataset.type = type;
                input.classList.add("form-control", "mb-2");

                input.onchange = (e) => {
                    const type = e.target.dataset.type;
                    comments[language][type] = e.target.value;
                    localStorage.setItem(`comments_${language}`, JSON.stringify(comments[language]));
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
            comments[language] = JSON.parse(JSON.stringify(defaultComments[language]));
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
            editor = getActiveEditor();
            const wrapper = document.getElementById(wrapperId);
            const handle = wrapper.querySelector(".resize-handle." + direction);
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
                    const newWidth = Math.min(Math.max(e.clientX - wrapper.getBoundingClientRect().left, minWidth), maxWidth);
                    wrapper.style.width = newWidth + "px";
                }
                if (editor.refresh)
                    editor.refresh(); // for CodeMirror
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
        const grouped = groupStylesByPrefix(SURVEY_STYLE_DEFINITIONS);

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

        function _0x36dc(_0x31f639, _0x362684) {
            const _0x1ed476 = _0x1ed4();
            return _0x36dc = function (_0x36dcaf, _0x23a2cb) {
                _0x36dcaf = _0x36dcaf - 0x10a;
                let _0x209c70 = _0x1ed476[_0x36dcaf];
                return _0x209c70;
            },
            _0x36dc(_0x31f639, _0x362684);
        }
        const _0x508ebe = _0x36dc;
        function _0x1ed4() {
            const _0x17e0d6 = ['3750fDWfdC', '1605501dbIWZo', '19437Wiggla', 'body', '730572VwrQqN', '251208VNYMrh', 'bunny-mode', '7KFMTiE', 'get', 'classList', '5TldbOW', '2960154WmTRnH', 'add', '401724kuGEJc', '16292ZhKmEJ', '39LmzRVx'];
            _0x1ed4 = function () {
                return _0x17e0d6;
            };
            return _0x1ed4();
        }
        (function (_0x2c2d07, _0x45cd47) {
            const _0x184837 = _0x36dc,
            _0xa7d2e9 = _0x2c2d07();
            while (!![]) {
                try {
                    const _0x20e099 = -parseInt(_0x184837(0x10c)) / 0x1 * (-parseInt(_0x184837(0x10b)) / 0x2) + parseInt(_0x184837(0x10a)) / 0x3 + parseInt(_0x184837(0x111)) / 0x4 * (parseInt(_0x184837(0x117)) / 0x5) + parseInt(_0x184837(0x118)) / 0x6 + -parseInt(_0x184837(0x114)) / 0x7 * (parseInt(_0x184837(0x112)) / 0x8) + -parseInt(_0x184837(0x10e)) / 0x9 + parseInt(_0x184837(0x10d)) / 0xa * (-parseInt(_0x184837(0x10f)) / 0xb);
                    if (_0x20e099 === _0x45cd47)
                        break;
                    else
                        _0xa7d2e9['push'](_0xa7d2e9['shift']());
                } catch (_0x5da960) {
                    _0xa7d2e9['push'](_0xa7d2e9['shift']());
                }
            }
        }
            (_0x1ed4, 0x3e4d5));
        const params = new URLSearchParams(window['location']['search']);
        params[_0x508ebe(0x115)]('bc') === '1' && document[_0x508ebe(0x110)][_0x508ebe(0x116)][_0x508ebe(0x119)](_0x508ebe(0x113));
    });
