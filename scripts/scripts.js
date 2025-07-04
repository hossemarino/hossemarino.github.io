
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
    const controlElements = document.getElementById("controlElements");
    const questionTypes = document.getElementById("questionTypes");
    const questionElements = document.getElementById("questionElements");
    const questionAttroibutes = document.getElementById("attributesCommands");
    const miscelaneousCommands = document.getElementById("miscellaneousCommands");

    const standardsTab = document.getElementById("standardQuestions");
    const copyProtection = document.getElementById("standardCopyProtection");
    const mouseoverPopUp = document.getElementById("standardMouseover");
    const standardMiscelaneousCommands = document.getElementById("standardMiscellaneousCommands");

    const stylesTab = document.getElementById("styleCreation");

    const increaseFontButton = document.getElementById("increaseFont");
    const decreaseFontButton = document.getElementById("decreaseFont");

    editor = getActiveEditor();

    const commandGroups = {
        control: {
            "add term": addTerm,
            "add quota": addQuota,
            "validate tag": validateTag,
            "exec tag": execTag,
            "resource tag": makeRes,
            "block tag": wrapInBlock,
            "block tag (randomize children)": wrapInBlockRandomize,
            "loop tag": addLoopBlock,
            "make looprows": makeLooprows,
            "make markers": makeMarker,
            "make condition": makeCondition,
        },
        elements: {
            "make rows": makeRows,
            "make rows (rating l-h)": makeRowsLow,
            "make rows (rating h-l)": makeRowsHigh,
            "make columns": makeCols,
            "make columns (rating l-h)": makeColsLow,
            "make columns (rating h-l)": makeColsHigh,
            "make choices": makeChoices,
            "make choices (rating l-h)": makeChoicesLow,
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
            "make autosum": makeAutosum,
            "make autosum (percent)": makeAutosumPercent,
            "make survey comment": makeSurveyComment,
            "make pipe": makePipe
        },
        attr: {
            "open-end": addOpen,
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
            "add values": addValues,
            "add values l-h": addValuesLow,
            "add values h-l": addValuesHigh,
            "add alt label": addAltlabel,
            "add rating direction reversed": addRatingDirection,
            "swap rows and cols": swapRowCol,
        },
        misc: {
            "make note": makeNote,
            "brbr": brbr,
            "br": br,
            "lis": lis,
            "ol": makeOl,
            "ul": makeUl,
            "make link href": makeHref,
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
        },
        styles: {}

    };

    const containers = {
        control: controlElements,
        types: questionTypes,
        elements: questionElements,
        attr: questionAttroibutes,
        misc: miscelaneousCommands,
        standards: standardsTab,
        copyprotection: copyProtection,
        mouseoverpopup: mouseoverPopUp,
        standardsmisc: standardMiscelaneousCommands,
        styles: stylesTab
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
        autoCloseTags: false,
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
                editor.setValue(e.target.result);
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

    });

    function validateFormAndGenerateXML(mode) {
        const formId = mode === 'ihut' ? '#ihutSurveyForm' : '#surveyForm';
        const inputs = document.querySelectorAll(`${formId} input, ${formId} select`);
        let allFilled = true;

        inputs.forEach(input => {
            const inputId = input.id;
            const value = input.value.trim();

            // IHUT-specific conditional skip
            if (mode === 'ihut' &&
                (inputId === "ihut_QBAPI" || inputId === "ihut_eventID")) {

                const setupType = document.getElementById("ihut_setup_type").value;
                const isQualBoardAPI = setupType === "QualBoard - status API" || setupType === "QualBoard - user creation API";

                if (!isQualBoardAPI && !value) {
                    input.classList.remove("is-invalid"); // Not required
                    return;
                }
            }

            if (!value) {
                allFilled = false;
                input.classList.add("is-invalid");
            } else {
                input.classList.remove("is-invalid");
            }
        });

        if (!allFilled) {
            alert("Please fill in all required fields.");
            return;
        }

        if (mode === 'survey')
            generateXML();
        else if (mode === 'ihut')
            generateIHUTXML();

    }

    function setCursorAfterLastNote() {
        editor = getActiveEditor();
        editor.setCursor({
            line: 513,
            ch: 0
        });
    }

    function generateXML() {
        const surveyNumber = document.getElementById("survey_number").value;
        const clientName = document.getElementById("client_name").value;
        const surveyName = document.getElementById("survey_name").value;
        const secretSampleCode = document.getElementById("secret_sample_code").value;
        const s2s = document.getElementById("s2s").value;
        const stl_wf = document.getElementById("stl_wf").value;
        const portal = document.getElementById("portal").value;
        const useu = document.getElementById("useu").value;
        const surveyLanguage = document.getElementById("survey_language").value;

        let langCode = "";
        if (surveyLanguage === "Base English") {
            langCode = "english";
            setSurveyLanguage('english');
        } else if (surveyLanguage === "Base German") {
            langCode = "german";
            setSurveyLanguage('german');

        } else if (surveyLanguage === "Base French") {
            langCode = "french";
            setSurveyLanguage('french');

        }

        let portalLinks = "";
        let logos = "";
        if (portal === "Eli Lilly") {
            portalLinks = LILLY[0];
            logos = LILLY[1]
        }
        if (portal === "Schlesinger") {
            portalLinks = SAGO[0];
            logos = SAGO[1];
        }

        let privacyPolicy = "";
        if (useu === 'US' || (useu === "EU" && langCode === "english")) {
            privacyPolicy = `<style cond="list in ['0','1'] or (list in ['2'] and vendorid in ['1234','1235'])" name="survey.respview.footer.support"><![CDATA[
<a href="https://www.focusgroup.com/Page/PrivacyPolicy" target="_blank">\${res.privacy}</a> - <a href="mailto:help@focusgroup.com?Subject=${surveyNumber}" target="_blank">\${res.helpText}</a>
]]></style>
`;
        }
        if (useu === 'EU' && langCode === "german") {
            privacyPolicy = `<style cond="list in ['0','1'] or (list in ['2'] and vendorid in ['1234','1235'])" name="survey.respview.footer.support"><![CDATA[
<a href="https://www.sagunsdiemeinung.de/Page/PrivacyPolicy" target="_blank">\${res.privacy}</a> - <a href="mailto:QuantProjectManagement@sago.com?subject=${surveyNumber}" target="_blank">\${res.helpText}</a>
]]></style>
`;
        }
        if (useu === 'EU' && langCode === "french") {
            privacyPolicy = `<style cond="list in ['0','1'] or (list in ['2'] and vendorid in ['1234','1235'])" name="survey.respview.footer.support"><![CDATA[
<a href="https://www.opinionspartagees.fr/Page/PrivacyPolicy" target="_blank">\${res.privacy}</a> - <a href="mailto:QuantProjectManagement@sago.com?subject=${surveyNumber}" target="_blank">\${res.helpText}</a>
]]></style>
`;
        }

        let s2sText = s2s === "No" ? "" : `${S2S_TEXT}`;

        let stlwftext = stl_wf === "No" ? "" : `${STL_WF_TEXT}`;

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<survey 
  alt="${surveyNumber} - ${clientName} - ${surveyName}"
  autosave="1"
  autosaveKey="identifier,code,CRID"
  browserDupes=""
  builderCompatible="1"
  compat="153"
  delphi="1"
  watermark:fontSize="16"
  displayOnError="all"
  extraVariables="record,decLang,list,userAgent,flashDetected,api,dupe"
  featurephoneNotAllowedMessage="The device you are using is not allowed to take this survey."
  fir="on"
  html:showNumber="0"
  mobile="compat"
  mobileDevices="smartphone,tablet,desktop"
  name="Survey"
  setup="term,decLang,quota,time"
  ss:disableBackButton="1"
  ss:hideProgressBar="0"
  ss:listDisplay="1"
  lang="${langCode}"
  ${portalLinks}
  state="testing">
  
<res label="sys_surveyCompleted">&amp;nbsp;</res>
<res label="privacy">Privacy Policy</res>
<res label="helpText">Help</res>
<res label="dialogClose">Close</res>

<samplesources default="1">
  <samplesource list="1">
    <title>SAGO Test</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="code"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for your participation and sharing your opinions with us! Your efforts are greatly appreciated. You may close your browser window now.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>

  <samplesource list="2">
    <title>SAGO Live</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="vendorid"/>
    <var name="RID" unique="1"/>
    <var name="CRID" unique="1"/>
    <var name="Matching_Unique_ID"/>
    <var name="VRID"/>
    <exit cond="terminated" url="https://surveys.sample-cube.com/ending/?RS=3&amp;RID=\${RID}"/>
    <exit cond="qualified" url="https://surveys.sample-cube.com/ending/?RS=1&amp;RID=\${RID}&amp;secret=${secretSampleCode}"/>
    <exit cond="overquota" url="https://surveys.sample-cube.com/ending/?RS=2&amp;RID=\${RID}"/>
    </samplesource>
</samplesources>

<radio 
  label="vvendorid">
  <title>vendorid</title>
  <virtual>
#### ADD NEW VENDOR IDS AS NEW ROWS IN THIS QUESTION WITH THE RELEVANT VALUE 
bucketize(vendorid)
  </virtual>

  <row label="none">No vendorid Variable</row>
  <row label="1234">FocusGroup Consumer US</row>
  <row label="1235">FocusGroup Healthcare US</row>
  <row label="other">Other</row>
</radio>

${SAGO_CSS}

${UI_DIALOG_CLOSE}
${GROUP_SHUFFLE}

${logos}
${privacyPolicy}
<style cond="list not in ['0','1'] or (list in ['2'] and vendorid not in ['1234','1235'])" name="survey.logo"/>
<style cond="list not in ['0','1'] or (list in ['2'] and vendorid not in ['1234','1235'])" name="survey.respview.footer.support"/>
${COPY_PROTECTION}
${PRETEST_LABELS_DISPLAY}

<style cond="list!='0'" name="button.goback"/>

<suspend/>

<html label="list1_live" cond="list == '1' and gv.survey.root.state.live" final="1" where="survey">You are missing information in the URL. Please verify the URL with the original invite.</html>

<note>First survey screen: Consent page and ResearchDefender</note>

<label label="template_point_1" />

${CONSENT_QUESTION}
${RESDEF}

<note>Second screen: Rest of survey</note>

<label label="template_point_2" />
<note>/
/ ********************************************************************* /
/ ********************************************************************* /
/ ******************* INSERT REST OF SURVEY HERE ********************** /
/ ********************************************************************* /
/ ********************************************************************* /
/</note>



${REVIEW_QUESTION}
${s2sText}
${stlwftext}
</survey>`;
        editor = getActiveEditor();
        if (editor) {
            editor.setValue(xmlContent);
            setTimeout(() => {
                editor.focus();
                setCursorAfterLastNote();
            }, 100);
        } else {
            console.error("CodeMirror editor not initialized!");
        }

        let modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
        if (modal) {
            modal.hide();
        }

    }

    function generateIHUTXML() {
        const get = (id) => document.getElementById(id).value;

        const xmlData = {
            hutNumber: get("ihut_survey_number"),
            clientName: get("ihut_client_name"),
            projectName: get("ihut_survey_name"),
            surveyType: get("ihut_survey_type"),
            setupType: get("ihut_setup_type"),
            qbApiKey: get("ihut_QBAPI"),
            eventId: get("ihut_eventID"),
            redirects: get("ihut_redirects"),
            recodeCheckbox: get("ihut_chckbox_recode"),
            verity: get("ihut_verity"),
            contactQuestion: get("ihut_contact_question")
        };
        console.log(xmlData);
        let OTS = xmlData.setupType == "QualMobile (OTS)" ? true : false;
        console.log(OTS);
        let extraVariables = '';

        if (xmlData.surveyType === "Questionnaire/Diary") {
            extraVariables = `  extraVariables="record,decLang,list,userAgent,flashDetected"`
        } else {
            extraVariables = `  extraVariables="record,decLang,list,userAgent,flashDetected,api,dupe"`
        }

        let qbres = xmlData.setupType !== "QualBoard - user creation API" ? "" : `${QUALBOARD_USER_CREATION_API_RES}`;

        let redirects = ``;

        let redirecrts_contd = ``;

        if (xmlData.surveyType === "CLT") {
            redirects = `
  <samplesource list="2">
    <title>Sago Live</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="vendorid"/>
    <var name="code" unique="1"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for taking our survey. Your efforts are greatly appreciated! 
    Please raise your hand and let your Server know you have answered all the questions so they may initial your index card to bring to the front desk to check out.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
        } else if (xmlData.redirects === "SAMS/Complex Surveys(CS)") {
            redirects = `
  <samplesource list="2">
    <title>SAMS / Complex Survey (CS)</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="ESERID" unique="1"/>
    <var name="samsid" required="1"/>
    <exit cond="terminated" url="https://survey3.schlesingergroup.com/survey/forms/redirect.aspx?STATUS=T&amp;ESERID=\${ESERID}"/>
    <exit cond="qualified" url="https://survey3.schlesingergroup.com/survey/forms/redirect.aspx?STATUS=S&amp;ESERID=\${ESERID}" timeout="10">On the next screen, you will be asked to schedule for an appointment. This is NOT a scheduled date and time you need to be available but only a PLACEHOLDER, so our system includes you as qualified for the study.  Additionally, please note, we will NOT reach out via phone to confirm you but will send you confirmation details via email only and No Phone Call.</exit>
    <exit cond="overquota" url="https://survey3.schlesingergroup.com/survey/forms/redirect.aspx?STATUS=Q&amp;ESERID=\${ESERID}"/>
  </samplesource>`;
        } else if (xmlData.redirects === "Esearch") {
            redirects = `
  <samplesource list="2">
    <title>Esearch</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="code" unique="1"/>
    <exit cond="terminated" url="http://www.esearch.com/survey/message.epl?surveyID=SG021023-POD&amp;response=2&amp;userID=\${code}"/>
    <exit cond="qualified" url=http://www.esearch.com/survey/message.epl?surveyID=SG021023-POD&amp;response=2&amp;userID=\${code}"/>
    <exit cond="overquota" url="http://www.esearch.com/survey/message.epl?surveyID=SG021023-POD&amp;response=1&amp;userID=\${code}"/>
  </samplesource>`;
        } else if (OTS) {
            redirects = `
  <samplesource list="2">
    <title>Default End Page Text OTS</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="cf1" required="1"/>
    <var name="ParticipantQuestionID" unique="1"/>
    <var name="participantID" required="1"/>
    <var name="assignmentID" required="1"/>
    <exit cond="terminated">OOPS! Something went wrong. Please send us an email at <a href="mailto:ihuthelp@sago.com?Subject=${xmlData.hutNumber}" target="_blank">ihuthelp@sago.com</a> and include a screenshot of the error message you received. </exit>
    <exit cond="qualified">Thank you for your participation and for sharing your opinions with us! Your efforts are greatly appreciated.<br/><br/><div class="closing-screen">To ensure your responses are saved, please click the white "X" in the top right-hand corner of your screen. Once clicked, you will return to the QualMobile app to complete the assignment.</div></exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
        } else {
            redirects = `
  <samplesource list="2">
    <title>Default End Page Text</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="code"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for your participation and sharing your opinions with us! Your efforts are greatly appreciated. You may close your browser window now.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
        }

        if (xmlData.setupType === "QualBoard - status API") {
            redirecrts_contd = `
  <samplesource list="3">
    <title>QualBoard</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="Rn" required="1"/>
    <var name="userId" required="1"/>
    <var name="eventId" required="1"/>
    <var name="questionId" required="1"/>
    <var name="sesskey" unique="1"/>
    <var name="surveyNumber"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified" url="https://qualboard.com/participate/#/projects/[$externalParameters.projectId$]/group-discussions/\${eventId}/"/>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
        } else if (xmlData.setupType === "QualBoard - user creation API") {
            redirecrts_contd = `
  <samplesource list="3">
    <title>QualBoard</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="Rn" required="1"/>
    <var name="userId" required="1"/>
    <var name="eventId" required="1"/>
    <var name="questionId" required="1"/>
    <var name="sesskey" unique="1"/>
    <var name="surveyNumber"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for your participation and sharing your opinions with us! Your efforts are greatly appreciated. You may close your browser window now.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
        }

        let ihutCSS = ``;

        if (xmlData.surveyType !== "Screener" && OTS) {
            ihutCSS = IHUT_OTS_CSS;
        }

        let consentQ = '';
        if (xmlData.surveyType !== "CLT") {
            consentQ = CONSENT_QUESTION
                if (xmlData.surveyType !== "Screener")
                    suspend = '<suspend/>'
        }

        let cltNote = ``;
        if (xmlData.surveyType === "CLT") {
            cltNote = CLTNOTE;
        }
        let ots_api = ``;
        let restOfSurvey_1 = ``;
        let restOfSurvey_2 = ``;
        let restOfSurvey_3 = ``;
        let QualBoardAPI = ``;

        if (xmlData.surveyType !== "CLT") {
            if (xmlData.setupType === 'QualBoard - status API') {
                QualBoardAPI = `<block label="bQualBoard">
  <logic label="QualBoard" api:method="POST" api:url="https://api.qualboard.com/api/events/\${eventId}/questions/\${questionId}/external-redirect-callback?userId=\${userId}&amp;X-External-Redirect=${xmlData.qbApiKey}" uses="api.1"/>
  <text 
   label="QualBoard_LIVE_RESPONSE"
   size="40"
   sst="0"
   where="execute,survey,report">
    <title>Hidden: QualBoard API Live response if any.</title>
    <exec>
tq = thisQuestion

# Initialize
tq.val = None

response = QualBoard.r

print response.encode('utf-8-sig')
    </exec>

  </text>

  <suspend/>
</block>`;
            }

            if (xmlData.setupType === 'QualBoard - user creation API') {
                restOfSurvey_1 = CONTACT_QUESTION_IHUT;
                restOfSurvey_1 += `<textarea
  label="QUALBOARD_DATA"
  where="execute,survey,report">
  <title>Hidden: Qual Board API DATA</title>
  <exec>
tq = thisQuestion

# Initialize
tq.rHead.val = None
tq.rData.val = None

p.aHead = {'contentType': 'application/x-www-form-urlencoded; charset=UTF-8'}

p.aData = {
'Email'           : '%s' % contact.r9.unsafe_val,
'FirstName'       : '%s' % contact.r1.unsafe_val,
'LastName'         : '%s' % contact.r2.unsafe_val,
'DisplayName'       : '%s' % contact.r1.unsafe_val,
'ApiKey'            : '${xmlData.qbApiKey}',
'SetTempPassword'   : 'True',
'ResponseFormat'    : '0',
'LanguageCode'      : 'en',
'EventId'           : '${xmlData.eventId}',
'GroupTags'         : '',
}

p.logicURL = "Email=%(Email)s&amp;FirstName=%(FirstName)s&amp;LastName=%(LastName)s&amp;DisplayName=%(DisplayName)s&amp;ApiKey=%(ApiKey)s&amp;SetTempPassword=%(SetTempPassword)s&amp;ResponseFormat=%(ResponseFormat)s&amp;LanguageCode=%(LanguageCode)s&amp;EventId=%(EventId)s&amp;GroupTags=%(GroupTags)s" % p.aData

print p.logicURL

tq.rHead.val = str(p.aHead).replace("'",'*').replace('*','"')
tq.rData.val = str(p.aData).replace("'",'*').replace('*','"')
  </exec>

  <row label="rHead">aHead</row>
  <row label="rData">aData</row>
</textarea>

<suspend/>

<logic label="QualBoard" api:data="QUALBOARD_DATA.rData.unsafe_val" api:headers="{'contentType': 'application/x-www-form-urlencoded;charset=UTF-8', 'Authorization': '${xmlData.qbApiKey}'}" api:method="GET" api:params="{'withCredentials': 'tru?', 'dataType':  'html'}" api:url="https://api.qualboard.com/api/v4/users/import?\${p.logicURL}" uses="api.1"/>
<text 
  label="QUALBOARD_RESPONSE"
  size="40"
  sst="0"
  where="execute,survey,report">
  <title>Hidden: API response.</title>
  <exec>
tq = thisQuestion

# Initialize
for each_row in tq.rows:
	each_row.val = None  

response = QualBoard.r
print response


for key, item in response.items():
	print key, item

for each_row in tq.rows:
	if response[each_row.label]:
		each_row.val = response[each_row.label]

print QualBoard.status
  </exec>

  <row label="isNewUser">isNewUser</row>
  <row label="password">password</row>
  <row label="userId">userId</row>
  <row label="error">error</row>
</text>

<suspend/>

<block label="respondent_email" cond="QUALBOARD_RESPONSE.isNewUser.val == 'True'">
  <pipe label="pass_pipe" capture="">
    <case label="r1" cond="QUALBOARD_RESPONSE.password.val not in ['', None]">\${QUALBOARD_RESPONSE.password.val}</case>
    <case label="r2" cond="1">None</case></pipe>
  <logic label="email" email:company="Qualtrics" email:content="\${res.qual_email}" email:recipient="\${contact.r9.unsafe_val}" email:sender="support@qualboard.com" email:subject="Welcome to QualBoard" uses="email.1"/>
</block>
`;
            }

            if (xmlData.surveyType === "Questionnaire/Diary" && OTS) {
                ots_api = OTS_API
            }

            if (xmlData.surveyType === "Screener" && OTS) {
                restOfSurvey_2 = CONTACT_QUESTION_IHUT;
                restOfSurvey_2 += OTS_SCREENER_PART_1;

                if (xmlData.verity === "Yes") {
                    restOfSurvey_2 += VERITY_API;
                }

                restOfSurvey_2 += OTS_SCREENER_PART_2(xmlData.hutNumber);
            }

            if (xmlData.verity === "Yes" && xmlData.setupType !== "QualBoard - user creation API" && xmlData.contactQuestion === "Yes") {
                restOfSurvey_3 = CONTACT_QUESTION_IHUT;
                if (!restOfSurvey_2.includes(VERITY_API)) {
                    restOfSurvey_3 += VERITY_API;
                }

            }
        }

        const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<survey 
  alt="${xmlData.hutNumber} - ${xmlData.clientName} - ${xmlData.projectName}"
  autosave="1"
  autosaveKey="code,sesskey,ESERID,ParticipantQuestionID"
  browserDupes=""
  builderCompatible="1"
  compat="153"
  delphi="1"
  watermark:fontSize="16"
  displayOnError="all"
${extraVariables}
  featurephoneNotAllowedMessage="The device you are using is not allowed to take this survey."
  fir="on"
  html:showNumber="0"
  mobile="compat"
  mobileDevices="smartphone,tablet,desktop"
  name="Survey"
  setup="term,decLang,quota,time"
  ss:disableBackButton="1"
  ss:hideProgressBar="0"
  ss:listDisplay="1"
  ss:includeJS="https://surveys.sago.com/survey/selfserve/1819/jtsfiles/jts_static_108.js"
  ss:includeCSS="https://surveys.sago.com/survey/selfserve/1819/jtsfiles/jts_static_104.css"
  state="testing">

<res label="privacy">Privacy Policy</res>
<res label="helpText">Help</res>
<res label="dialogClose">Close</res>
${qbres}
<samplesources default="1">
  <samplesource list="1">
    <title>Sago Test</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="code"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for your participation and sharing your opinions with us! Your efforts are greatly appreciated. You may close your browser window now.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>
${redirects}
${redirecrts_contd}
</samplesources>

${IHUT_CSS}

${ihutCSS}

${UI_DIALOG_CLOSE}

${GROUP_SHUFFLE}

${CHECKBOX_RECODE}

${IHUT_LOGO}

<style name="survey.respview.footer.support"><![CDATA[
<a href="https://www.focusgroup.com/Page/PrivacyPolicy" target="_blank">\${res.privacy}</a> - <a href="mailto:help@focusgroup.com?Subject=${xmlData.hutNumber}" target="_blank">\${res.helpText}</a>
]]></style>

${COPY_PROTECTION}

${PRETEST_LABELS_DISPLAY}

<style cond="list!='0'" name="button.goback"/>

<suspend/>

<html label="list1_live" cond="list == '1' and gv.survey.root.state.live" final="1" where="survey">You are missing information in the URL. Please verify the URL with the original invite.</html>

<note>First survey screen: Intro message</note>

${consentQ}

<label label="template_point_2" />
<note>/
/ ********************************************************************* /
/ ********************************************************************* /
/ ******************* INSERT REST OF SURVEY HERE ********************** /
/ ********************************************************************* /
/ ********************************************************************* /
/</note>




${cltNote}

${restOfSurvey_1}

${ots_api}

${restOfSurvey_2}

${restOfSurvey_3}

${QualBoardAPI}
</survey>`.trim();
        editor = getActiveEditor();
        editor.setValue(xml);
        let modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
        if (modal) {
            modal.hide();
        }
    }

    function generateMO() {
        const get = (id) => document.getElementById(id).value.trim();

        const textImage = get("moTextImage") === "Yes";
        const protectPopupImage = get("moImageProtect") === "Yes";
        const text = get("moName");

        const descImage = get("moContentImage") === "Yes";
        const descImageProtected = get("moContentImageProtect") === "Yes";
        const desc = get("moContent");

        const surveyPath = "${gv.survey.path}"; // Template literal placeholder

        let textHTML = "";
        let descHTML = "";

        // Build mouseover label
        if (!textImage) {
            textHTML = text;
        } else {
            textHTML = protectPopupImage
                 ? `[protected ${text} placement=top]`
                 : `<img src="/survey/${surveyPath}/${text}" />`;
        }

        // Build mouseover content
        if (!descImage) {
            descHTML = desc;
        } else {
            descHTML = descImageProtected
                 ? `[protected ${desc} placement=top]`
                 : `<img src="/survey/${surveyPath}/${desc}" />`;
        }

        const output =
`<span class="self-tooltip">${textHTML}</span><span class="tooltip-content">${descHTML}</span>`;

        const editor = getActiveEditor();
        editor.replaceSelection(output);

        const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
        if (modal)
            modal.hide();
    }

    function generatePopup() {
        const get = (id) => document.getElementById(id).value.trim();

        const textImage = get("popupTextImage") === "Yes";
        const protectPopupImage = get("popupImageProtect") === "Yes";
        const text = get("popupTextName");

        const descImage = get("popupContentImage") === "Yes";
        const descImageProtected = get("popupContentProtect") === "Yes";
        const desc = get("popupContent");

        const surveyPath = "${gv.survey.path}"; // placeholder for server-side resolution

        const width = get("popupWidth") || "600";
        const height = get("popupHeight") || "400";
        const title = get("popupTitle") || "";
        const popupCall = `Survey.uidialog.make($(this).next('.popup-content'), {width: Math.min(${width}, $(window).width()), height: Math.min(${height}, $(window).height()), title: '${title}'} );`;

        let anchor = "";

        // Build clickable anchor element
        if (!textImage) {
            anchor = `<span class="self-popup" onclick="${popupCall}">${text}</span>`;
        } else if (protectPopupImage) {
            anchor = `<span class="self-popup" onclick="${popupCall}">[protected ${text} placement=top]</span>`;
        } else {
            anchor = `<span class="self-popup" onclick="${popupCall}"><img src="/survey/${surveyPath}/${text}" /></span>`;
        }

        // Build pop-up content element
        let content = "";

        if (!descImage) {
            content = `<div class="popup-content">${desc}</div>`;
        } else if (descImageProtected) {
            content = `<div class="popup-content">[protected ${desc} placement=top]</div>`;
        } else {
            content = `<div class="popup-content"><img src="/survey/${surveyPath}/${desc}" /></div>`;
        }

        const output = `${anchor}${content}`;

        const editor = getActiveEditor();
        editor.replaceSelection(output);

        const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
        if (modal)
            modal.hide();
    }

    function generateRandomOrderTracker() {
        const get = (id) => document.getElementById(id).value.trim();

        const loop_block = get("loop_block");
        const loop_block_label = get("loop_block_label");
        const editor = getActiveEditor();
        let output = ``;
        if (loop_block === "Loop") {
            output = `
<number label="h${loop_block_label}_order_" size="2">
  <title>Virtual: ${loop_block_label} Order</title>
  <virtual>assignRandomOrder("${loop_block_label}_expanded", "children")</virtual>
  <row label="${loop_block_label}_1_expanded">Concept 1</row>
  <row label="${loop_block_label}_2_expanded">Concept 2</row>
  <row label="${loop_block_label}_3_expanded">Concept 3</row>
</number>`;

        } else if (loop_block === "Block") {
            output = `
<number label="h${loop_block_label}_order" size="2">
  <title>Virtual: ${loop_block_label} Order</title>
  <virtual>assignRandomOrder("${loop_block_label}", "children")</virtual>
  <row label="r1">Concept 1</row>
  <row label="r2">Concept 2</row>
  <row label="r3">Concept 3</row>
</number>
<note>Change row labels to the labels of block's children, then delete this note</note>`;

        }
        editor.replaceSelection(output);
        const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
        if (modal)
            modal.hide();
    }
