const tabs = {};
let activeTab = "default";
let editorArea;

function getCodeMirrorSettings(theme, wordWrap) {
    return {
        mode: "application/xml",
        theme: theme,
        lineNumbers: true,
        autoCloseTags: true,
        smartIndent: true,

        autoCloseBrackets: true,
        matchTags: {
            bothTags: true
        },
        lineWrapping: wordWrap,

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
        }

    };
}

function initTabs(targetArea) {
    editorArea = targetArea;
    const savedTabs = JSON.parse(localStorage.getItem("editorTabs")) || {};
    activeTab = localStorage.getItem("activeTab") || "default";

    Object.entries(savedTabs).forEach(([name, data]) => {
        if (name === "default" && tabs["default"])
            return;

        const textarea = document.createElement("textarea");
        editorArea.appendChild(textarea);

        const editor = CodeMirror.fromTextArea(textarea, getCodeMirrorSettings(savedTheme, savedWordWrap));
        editor.setValue(data.content);
        editor.getWrapperElement().style.display = "none";

        configureEditor(editor);
        tabs[name] = {
            editor,
            textarea
        };
    });

    if (!tabs["default"]) {
        createTab("default");
    }
    if (tabs["default"]?.editor && savedTabs["default"]?.content) {
        tabs["default"].editor.setValue(savedTabs["default"].content);
    }

    renderTabs();
    switchTab(tabs[activeTab] ? activeTab : "default");
}

function createTab(name) {
    if (tabs[name])
        return;

    const textarea = document.createElement("textarea");
    editorArea.appendChild(textarea);

    const editor = CodeMirror.fromTextArea(textarea, getCodeMirrorSettings(savedTheme, savedWordWrap));
    configureEditor(editor);
    editor.getWrapperElement().style.display = "none";

    tabs[name] = {
        editor,
        textarea
    };
    activeTab = name;

    saveAllTabs();
    renderTabs();
    switchTab(name);
}

function switchTab(name) {
    activeTab = name;

    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.querySelector(`[data-tab="${name}"]`)?.classList.add("active");

    Object.values(tabs).forEach(({
            editor
        }) => {
        editor.getWrapperElement().style.display = "none";
    });

    const editor = tabs[name]?.editor;
    if (editor) {
        editor.getWrapperElement().style.display = "block";
        editor.focus();
    }

    localStorage.setItem("activeTab", name);
    document.title = `Survey Editor – editing: ${name}`;
}

function closeTab(name) {
    if (name === "default")
        return;

    const tab = tabs[name];
    if (!tab)
        return;
    requestTabDeletion(name)
    tab.editor.getWrapperElement()?.remove();
    tab.textarea?.remove();
    delete tabs[name];

    const savedTabs = JSON.parse(localStorage.getItem("editorTabs") || "{}");
    delete savedTabs[name];
    localStorage.setItem("editorTabs", JSON.stringify(savedTabs));

    document.querySelector(`[data-tab="${name}"]`)?.remove();

    if (activeTab === name) {
        switchTab("default");
    }

    renderTabs();
    saveAllTabs();
}

function configureEditor(editor) {
    CodeMirror.registerHelper("fold", "custom", customTagRangeFinder);

    editor.setOption("foldOptions", {
        widget: (from, to) => {
            const startLine = editor.getLine(from.line);
            const tagMatch = startLine.match(/<([a-zA-Z0-9_-]+)/);
            const tagName = tagMatch ? tagMatch[1] : "…";
            return `<${tagName}><--></${tagName}>`;
        }
    });

    editor.on("change", saveAllTabs);
}

function getActiveEditor() {
    return tabs[activeTab]?.editor;
}

function saveAllTabs() {
    const toSave = {};
    Object.entries(tabs).forEach(([name, tab]) => {
        toSave[name] = {
            content: tab.editor.getValue(),
            theme: tab.editor.getOption("theme"),
            wordWrap: tab.editor.getOption("lineWrapping")
        };
    });

    localStorage.setItem("editorTabs", JSON.stringify(toSave));
    localStorage.setItem("activeTab", activeTab);
}

function renderTabs() {
    const tabsContainer = document.getElementById("tabs");
    if (!tabsContainer)
        return;

    tabsContainer.innerHTML = ""; // Start fresh

    Object.keys(tabs).forEach(tabName => {
        const tabElement = document.createElement("div");
        tabElement.className = "tab";
        tabElement.dataset.tab = tabName;
        tabElement.style.position = "relative";

        const tabText = document.createElement("span");
        tabText.className = "tab-label";
        tabText.textContent = truncateLabel(tabName);
        tabText.title = tabName;

        tabElement.appendChild(tabText);

        if (tabName !== "default") {
            const closeButton = document.createElement("button");
            closeButton.textContent = "✖";
            closeButton.className = "close-tab";
            closeButton.onclick = (e) => {
                e.stopPropagation();
                requestTabDeletion(tabName);
            };
            tabElement.appendChild(closeButton);

            tabElement.addEventListener("mousedown", (e) => {
                if (e.button === 1) {
                    e.preventDefault();
                    requestTabDeletion(tabName);
                }
            });
        }

        tabElement.onclick = () => switchTab(tabName);
        tabsContainer.appendChild(tabElement);
    });

    // "Add Tab" button
    const addTabButton = document.createElement("button");
    addTabButton.id = "addTabButton";
    addTabButton.title = "Add New Tab";
    addTabButton.textContent = "➕";
    addTabButton.onclick = () => openModal("tab");
    tabsContainer.appendChild(addTabButton);

    // Highlight active
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
        if (tab.dataset.tab === activeTab)
            tab.classList.add("active");
    });
}

// TABs
function addTab() {
    openModal("tab");
}

let tabPendingDeletion = null;

function requestTabDeletion(tabName) {
    tabPendingDeletion = tabName;
    openModal("delete-tab", tabName); // Show confirmation modal
}

function truncateLabel(label, max = 12) {
    return label.length > max ? label.slice(0, max) + "…" : label;
}

function confirmTabCreation() {
    const tabNameInput = document.getElementById("tab_name");
    const errorDisplay = document.getElementById("tabError");
    const tabName = tabNameInput.value.trim();

    errorDisplay.textContent = "";
    errorDisplay.style.display = "none";

    if (!tabName) {
        errorDisplay.textContent = "Tab name cannot be empty.";
        errorDisplay.style.display = "block";
        return;
    }

    if (tabs[tabName]) {
        errorDisplay.textContent = "A tab with this name already exists.";
        errorDisplay.style.display = "block";
        return;
    }

    createTab(tabName);

    tabNameInput.value = "";
    bootstrap.Modal.getInstance(document.getElementById("surveyModal")).hide();
}
