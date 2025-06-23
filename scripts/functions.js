//Modal handling
function openModal(purpose, tabName = "") {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("surveyModal"));
    const title = document.getElementById("modalTitle");

    // Hide all modal sections
    document.querySelectorAll(".modal-section").forEach(section => {
        section.style.display = "none";
    });

    if (purpose === "tab") {
        const tabInput = document.getElementById("tab_name");
        title.textContent = "Create a New Tab";
        document.querySelector(".new-tab").style.display = "block";
        document.getElementById("tabError").style.display = "none";
        tabInput.focus();
    } else if (purpose === "new-survey") {
        title.textContent = "Create a New Survey";
        document.querySelector(".new-survey").style.display = "block";
        document.getElementById("genXML").onclick = () => validateFormAndGenerateXML('survey');
    } else if (purpose === "delete-tab") {
        title.textContent = "Confirm Tab Deletion";
        document.querySelector(".delete-tab").style.display = "block";
        document.getElementById("tabToDeleteName").textContent = tabName;
        tabPendingDeletion = tabName;
    } else if (purpose === "new-ihut") {
        title.textContent = "Create a New IHUT";
        document.querySelector(".new-ihut").style.display = "block";
        document.getElementById("genIHUTXML").onclick = () => validateFormAndGenerateXML('ihut');

    }
    modal.show();
}

// download files
function sanitizeFilename(name) {
    return name
    .replace(/[^a-z0-9_\-\.]/gi, "_") // keep letters, numbers, underscores, hyphens, dots
    .replace(/_+/g, "_") // collapse multiple underscores
    .replace(/^_+|_+$/g, "") // trim leading/trailing underscores
    .substring(0, 100); // limit length if needed
}
// folding for custom XML tags
function customTagRangeFinder(cm, start) {
    const lineText = cm.getLine(start.line);
    const openTagMatch = lineText.match(/<([a-zA-Z0-9_-]+)(\s[^>]*)?>/);

    if (!openTagMatch)
        return null;

    const tagName = openTagMatch[1];

    const excludedTags = ["survey", "note"];
    if (excludedTags.includes(tagName.toLowerCase()))
        return null;

    const startCh = lineText.indexOf("<" + tagName);
    const startPos = CodeMirror.Pos(start.line, startCh);

    let depth = 1;
    const maxLine = cm.lastLine();

    for (let i = start.line + 1; i <= maxLine; i++) {
        const text = cm.getLine(i);

        const selfClosing = new RegExp(`<${tagName}[^>]*?/>`, "g");
        const openTags = (text.match(new RegExp(`<${tagName}(\\s[^>]*)?>`, "g")) || []).length;
        const closeTags = (text.match(new RegExp(`</${tagName}>`, "g")) || []).length;
        const selfClosingCount = (text.match(selfClosing) || []).length;

        depth += openTags - closeTags - selfClosingCount;

        if (depth === 0) {
            const endCh = cm.getLine(i).indexOf(`</${tagName}>`) + `</${tagName}>`.length;
            return {
                from: startPos,
                to: CodeMirror.Pos(i, endCh)
            };
        }
    }

    return null;
}
//Save/load functions
function saveEditorContent() {
    if (activeTab) {
        tabs[activeTab] = window.editor.getValue();
        localStorage.setItem("editorTabs", JSON.stringify(tabs));
    }
}

function manualSaveEditorContent() {
    saveEditorContent(); // Save all tabs

    // Show notification
    const notification = document.getElementById("saveNotification");
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3500);
}

function loadEditorContent() {
    const savedTabs = JSON.parse(localStorage.getItem("editorTabs"));
    if (savedTabs) {
        tabs = savedTabs;
        renderTabs();
        switchTab(activeTab || "default");
    }
}

// TABS
let tabs = {
default:
    ""
};
let activeTab = "default";

function addTab() {
    openModal("tab");
}
function requestTabDeletion(tabName) {
    openModal("delete-tab", tabName);
}

function truncateLabel(label, max = 24) {
    return label.length > max ? label.slice(0, max) + "…" : label;
}

function switchTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    window.editor.setValue(tabs[tabName]);
}

function renderTabs() {
    const tabsContainer = document.getElementById("tabs");
    tabsContainer.innerHTML = ""; // Start fresh

    // Default tab
    const defaultTab = document.createElement("div");
    defaultTab.className = "tab";
    defaultTab.textContent = "Default";
    defaultTab.dataset.tab = "default";
    defaultTab.onclick = () => switchTab("default");
    defaultTab.style.position = "relative";
    tabsContainer.appendChild(defaultTab);

    // Other saved tabs
    Object.keys(tabs).forEach(tabName => {
        if (tabName !== "default") {
            const tabElement = document.createElement("div");
            tabElement.className = "tab";
            tabElement.dataset.tab = tabName;
            tabElement.style.position = "relative";

            const tabText = document.createElement("span");
            tabText.className = "tab-label";
            tabText.textContent = truncateLabel(tabName);
            tabText.title = tabName; // Tooltip with full name

            tabElement.appendChild(tabText);

            const closeButton = document.createElement("button");
            closeButton.textContent = "✖";
            closeButton.className = "close-tab";
            closeButton.onclick = (e) => {
                e.stopPropagation(); // Prevent tab switch when clicking ✖
                requestTabDeletion(tabName);

            };

            tabElement.appendChild(closeButton);
            tabElement.onclick = () => switchTab(tabName);

            tabsContainer.appendChild(tabElement);

            // delete tab from middle mouse button click
            tabElement.addEventListener("mousedown", (e) => {
                if (e.button === 1) { // Middle mouse button
                    console.log("trigger?")
                    e.preventDefault(); // Prevent default browser behavior (like opening in new tab)
                    requestTabDeletion(tabName);
                }
            });
        }
    });

    // "Add Tab" button
    const addTabButton = document.createElement("button");
    addTabButton.id = "addTabButton";
    addTabButton.textContent = "➕ Add Tab";
    addTabButton.onclick = () => openModal("tab");
    tabsContainer.appendChild(addTabButton);

    // Apply active class
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
        if (tab.dataset.tab === activeTab)
            tab.classList.add("active");
    });
}

function confirmTabCreation() {
    const tabNameInput = document.getElementById("tab_name");
    const errorDisplay = document.getElementById("tabError");
    const tabName = tabNameInput.value.trim();

    // Clear previous error
    errorDisplay.textContent = "";
    errorDisplay.style.display = "none";

    if (!tabName) {
        errorDisplay.textContent = "Tab name cannot be empty.";
        errorDisplay.style.display = "block";
        return;
    }

    const tabAlreadyExists = tabs[tabName] !== undefined || document.querySelector(`.tab[data-tab="${tabName}"]`);

    if (!tabName) {
        errorDisplay.textContent = "Tab name cannot be empty.";
        errorDisplay.style.display = "block";
        return;
    }

    if (tabAlreadyExists) {
        errorDisplay.textContent = "A tab with this name already exists.";
        errorDisplay.style.display = "block";
        return;
    }

    tabs[tabName] = ""; // Initialize content
    activeTab = tabName;

    // Deactivate all other tabs
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));

    // Create the tab element
    const tabElement = document.createElement("div");
    tabElement.className = "tab active";
    tabElement.dataset.tab = tabName;
    tabElement.style.position = "relative";
    tabElement.onclick = () => switchTab(tabName);

    const tabText = document.createElement("span");
    tabText.textContent = tabName;
    tabElement.appendChild(tabText);

    const closeButton = document.createElement("button");
    closeButton.textContent = "✖";
    closeButton.className = "close-tab";
    closeButton.onclick = (e) => {
        e.stopPropagation();
        requestTabDeletion(tabName);
    };
    tabElement.appendChild(closeButton);

    document.getElementById("tabs").insertBefore(tabElement, document.getElementById("addTabButton"));

    // Update editor and save
    window.editor.setValue("");
    saveEditorContent();
    renderTabs();
    switchTab(tabName);

    // Clear input field
    tabNameInput.value = "";

    // Hide modal
    bootstrap.Modal.getInstance(document.getElementById("surveyModal")).hide();
}

function closeTab(tabName) {
    if (tabName === "default") {
        alert("You cannot close the default tab!");
        return;
    }

    delete tabs[tabName];
    localStorage.setItem("editorTabs", JSON.stringify(tabs));

    document.querySelector(`[data-tab="${tabName}"]`).remove();

    // Switch to default tab if the closed tab was active
    if (activeTab === tabName) {
        switchTab("default");
    }
}

//FORMATTING STUFF:
function wrapSelection(tag) {
    let editor = window.editor;
    let selection = editor.getSelection();

    if (selection) {
        let tagRegex = new RegExp(`^<${tag}>.*</${tag}>$`);
        if (tagRegex.test(selection)) {
            console.error(`Selection is already wrapped in <${tag}>!`);
            return;
        }

        let from = editor.getCursor("from");
        let to = editor.getCursor("to");

        let wrappedText = `<${tag}>${selection}</${tag}>`;
        editor.replaceRange(wrappedText, from, to);

        let insertStart = editor.indexFromPos(from);
        let insertEnd = insertStart + wrappedText.length;

        let closingTagRegex = new RegExp(`</${tag}>`);
        let match = closingTagRegex.exec(wrappedText);

        if (match) {
            let closingTagEndOffset = wrappedText.indexOf(match[0]) + match[0].length;
            let newToPos = editor.posFromIndex(insertStart + closingTagEndOffset);
            editor.setSelection(from, newToPos);
        } else {
            console.warn("Could not find closing tag position correctly.");
        }

        editor.focus();
    }
}

function toTitleCase(str) {
    const acronyms = ["us", "uk", "eu", "xml", "id", "qa"]; // Add more as needed

    return str
    .toLowerCase()
    .split(/(\s|-)/) // keep spaces and hyphens
    .map(part => {
        if (acronyms.includes(part))
            return part.toUpperCase();
        return /^[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part;
    })
    .join("");
}

// CONTROL ELEMENTS
// termination
function addTerm() {
    const selectedText = window.editor.getSelection();
    const html = `<term label="term_" cond="${selectedText.trim()}"></term>`;
    window.editor.replaceSelection(html);
}

// quota tag
function addQuota() {
    const selectedText = window.editor.getSelection();
    const html = `<quota label="quota_${selectedText.trim()}" sheet="${selectedText.trim()}" overquota="noqual"/>`;
    window.editor.replaceSelection(html);
}

// validate tag
function validateTag() {
    const selectedText = window.editor.getSelection();

    const html = `
  <validate>
${selectedText.trim()}

  <validate>`;
    window.editor.replaceSelection(html);
}

// validate tag
function execTag() {
    const selectedText = window.editor.getSelection();

    const html = `
  <exec>
${selectedText.trim()}

  <exec>`;
    window.editor.replaceSelection(html);
}

// res
function makeRes() {
    const selectedText = window.editor.getSelection();

    try {
        if (!selectedText.trim()) {
            alert("No text selected!");
            return;
        }

        let input = selectedText;

        // Replace tabs with spaces
        input = input.replace(/\t+/g, " ");

        // Remove spaces-only lines
        input = input.replace(/\n +\n/g, "\n\n");

        // Collapse multiple line breaks to a single one
        input = input.replace(/\n{2,}/g, "\n");

        // Split and clean lines
        const lines = input.trim().split("\n").map(line =>
                line.replace(/^[a-zA-Z0-9]{1,2}[.:)]\s+/, "").trim());

        // Output wrapped <res> blocks
        return lines
        .filter(Boolean)
        .map(line => `<res label="">${line}</res>`)
        .join("\n");

    } catch (err) {
        console.error("makeRes() failed:", err);
        return "";
    }
}

// block tag
function wrapInBlock() {
    try {
        const editor = window.editor;
        const input = editor.getSelection().trim();

        if (!input) {
            alert("No content selected.");
            return;
        }

        const xml = `<block label="" cond="1">
${input}
</block>`;

        editor.replaceSelection(xml);
    } catch (err) {
        console.error("wrapInBlock() failed:", err);
        alert("Could not wrap content in <block>.");
    }
}

// block tag randomizeChildren
function wrapInBlockRandomize() {
    try {
        const editor = window.editor;
        const input = editor.getSelection().trim();

        if (!input) {
            alert("No content selected.");
            return;
        }

        const xml = `<block label="" cond="1" randomizeChildren="1">
${input}
</block>`;

        editor.replaceSelection(xml);
    } catch (err) {
        console.error("wrapInBlock() failed:", err);
        alert("Could not wrap content in <block>.");
    }
}

// LOOP tag
function addLoopBlock() {
    try {
        const editor = window.editor;
        const selection = editor.getSelection().trim();

        if (!selection) {
            alert("No content selected.");
            return;
        }

        const tagPattern = /(radio|checkbox|text|textarea|block|number|float|select|html)/;

        // Extract existing <looprow> elements
        const looprowRegex = /<looprow[\s\S]*?<\/looprow>/gi;
        const matchedLoopRows = selection.match(looprowRegex) || [];
        const loopRows = matchedLoopRows
            .map(row => `  ${row.trim()}\n`)
            .join("\n");
        const mainBlock = selection.replace(looprowRegex, "").trim();

        // Extract all loopvar names
        const loopVarNames = [];
        const varMatchRegex = /<loopvar\s+name="([^"]+)"/gi;
        let match;
        while ((match = varMatchRegex.exec(loopRows))) {
            const varName = match[1].trim();
            if (varName && !loopVarNames.includes(varName)) {
                loopVarNames.push(varName);
            }
        }

        const varsAttr = loopVarNames.join(", ");

        const hasAltLabel = mainBlock.includes("altlabel");

        const updated = hasAltLabel
             ? mainBlock.replace(
                new RegExp(
`<${tagPattern.source}([\\s\\S]*?)label="([^"]+)"([\\s\\S]*?)altlabel="([^"]+)"`,
                    "g"),
                (_match, tag, pre, label, between, alt) =>
`<${tag}${pre}label="${label.trim()}_[loopvar: label]"${between}altlabel="${alt.trim()}_[loopvar:label]"`)
             : mainBlock.replace(
                new RegExp(`<${tagPattern.source}([\\s\\S]*?)label="([^"]+)"`, "g"),
                (_match, tag, pre, label) =>
`<${tag}${pre}label="${label.trim()}_[loopvar: label]"`);

        const wrapped = `<loop label="" vars="${varsAttr}" title=" " suspend="0">
  <block label="">

${updated}

  </block>

${loopRows || `  <looprow label="" cond="">
    <loopvar name=""></loopvar>
  </looprow>`}

</loop>`;

        editor.replaceSelection(wrapped);
    } catch (err) {
        console.error("addLoopBlock() failed:", err);
        alert("Could not process loop template.");
    }
}

// make looprows
function makeLooprows() {
    try {
        const editor = window.editor;
        const rawInput = editor.getSelection().trim();

        if (!rawInput) {
            alert("No content selected.");
            return;
        }

        // Clean tabs and normalize spacing
        let cleaned = rawInput
            .replace(/\t+/g, " ")
            .replace(/\n +\n/g, "\n\n")
            .replace(/\n{2,}/g, "\n")
            .trim()
            .split("\n")
            .map(line => line.replace(/^[a-zA-Z0-9]{1,2}[.:)\s]+\s*/, "").trim())
            .filter(line => line.length > 0);

        const result = cleaned
            .map((line, i) => `  <looprow label="${i + 1}">\n    <loopvar name="var">${line}</loopvar>\n  </looprow>`)
            .join("\n");

        editor.replaceSelection(result);
    } catch (err) {
        console.error("makeLooprows() failed:", err);
        alert("Could not generate looprow XML.");
    }
}
// make markers
function makeMarker() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `<marker name="${line}" cond=""/>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// make markers
function makeCondition() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `<condition label="" cond="">${line}</condition >`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// FUNCTIONS FOR ROWS
function makeRows() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `  <row label="r${index + 1}">${line}</row>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

function makeRowsLow() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `  <row label="r${index + 1}" value="${index + 1}">${line}</row>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

function makeRowsHigh() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let length = lines.length;

    let xmlItems = lines.map((line, index) =>
`  <row label="r${length - index}" value="${length - index}">${line}</row>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// FUNCTIONS FOR COLUMNS
function makeCols() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `  <col label="c${index + 1}">${line}</col>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

function makeColsLow() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `  <col label="c${index + 1}" value="${index + 1}">${line}</col>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

function makeColsHigh() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let length = lines.length;

    let xmlItems = lines.map((line, index) =>
`  <col label="c${length - index}" value="${length - index}">${line}</col>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// FUNCTIONS FOR CHOICES
function makeChoices() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `  <choice label="ch${index + 1}">${line}</choice>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

function makeChoicesLow() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `  <choice label="ch${index + 1}" value="${index + 1}">${line}</choice>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

function makeChoicesHigh() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let length = lines.length;

    let xmlItems = lines.map((line, index) =>
`  <choice label="ch${length - index}" value="${length - index}">${line}</choice>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// NOANSWER
function makeNoAnswer() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `  <noanswer label="n${index + 1}">${line}</noanswer>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// GROUPS
function makeGroups() {
    let selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `  <group label="g${index + 1}">${line}</group>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// QUESTION COMMENT
function addCommentQuestion() {
    let selection = window.editor.getSelection();

    if (selection) {
        let xmlItems = `  <comment>${selection}</comment>`;
        window.editor.replaceSelection(xmlItems);
    } else {
        alert("No text selected!");
        return "";
    }
}

// CASES for pipe
function makeCase() {
    let selectedText = window.editor.getSelection();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);

    let xmlItems = "";
    lines.forEach((line, index) => {
        xmlItems += `  <case label="r${index + 1}" cond="">${line}</case>\n`;
    });

    xmlItems += `  <case label="r${lines.length + 1}" cond="1">DEFAULT</case>\n`;

    window.editor.replaceSelection(xmlItems);
}

// Autofill rows for pipe
function makeAutoFillRows() {
    let selectedText = window.editor.getSelection();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);

    let xmlItems = "";
    lines.forEach((line, index) => {
        xmlItems += `  <row label="r${index + 1}" autofill="">${line}</row>\n`;
    });

    xmlItems += `  <row label="none" autofill="thisQuestion.count == 0"><i>None of These Classifications Apply</i></row>\n`;

    window.editor.replaceSelection(xmlItems);
}

//miscelaneous
//add 2 break lines
function brbr() {
    xmlItems = `<br/><br/>`;
    window.editor.replaceSelection(xmlItems);
}
//add break line
function br() {
    xmlItems = `<br/>`;
    window.editor.replaceSelection(xmlItems);
}

//add open end
function addOpen() {
    xmlItems = ` open="1" openSize="25" randomize="0"`;
    window.editor.replaceSelection(xmlItems);
}
//add exclusive
function addExclusive() {
    xmlItems = ` exclusive="1" randomize="0"`;
    window.editor.replaceSelection(xmlItems);
}
//add aggregate
function addAggregate() {
    xmlItems = ` aggregate="0" percentages="0"`;
    window.editor.replaceSelection(xmlItems);
}
//add randomize="0"
function addRandomize0() {
    xmlItems = ` randomize="0"`;
    window.editor.replaceSelection(xmlItems);
}

//add optional
function addOptional() {
    xmlItems = ` optional="1"`;
    window.editor.replaceSelection(xmlItems);
}

//add shuffle rows
function addShuffleRows() {
    xmlItems = ` shuffle="rows"`;
    window.editor.replaceSelection(xmlItems);
}

//add shuffle cols
function addShuffleCols() {
    xmlItems = ` shuffle="cols"`;
    window.editor.replaceSelection(xmlItems);
}

//add shuffle rows and cols
function addShuffleRowsCols() {
    xmlItems = ` shuffle="rows,cols"`;
    window.editor.replaceSelection(xmlItems);
}

//add where="execute"
function addExecute() {
    xmlItems = ` where="execute"`;
    window.editor.replaceSelection(xmlItems);
}

//add Add Grouping/Adim Cols
function addGroupingCols() {
    xmlItems = ` grouping="cols" adim="cols"`;
    window.editor.replaceSelection(xmlItems);
}

//add Add Grouping/Adim Rows
function addGroupingRows() {
    xmlItems = ` grouping="rows" adim="rows"`;
    window.editor.replaceSelection(xmlItems);
}

// add groups
function addGroups() {
    try {
        const editor = window.editor;
        const selectedText = editor.getSelection();

        if (!selectedText.trim()) {
            alert("Please select one or more lines to apply groups=\"\".");
            return;
        }

        const targetTags = ["group", "col", "row", "choice"];
        let changesMade = false;

        const modifiedText = selectedText.replace(
                /<(\w+)([^>]*?)>/g,
                (full, tagName, attrs) => {
                if (targetTags.includes(tagName) && !/groups\s*=/.test(attrs)) {
                    changesMade = true;
                    return `<${tagName}${attrs} groups="">`;
                }
                return full;
            });

        if (!changesMade) {
            alert('No <group>, <choice>, <col>, or <row> tags missing groups="" found.');
            return;
        }

        editor.replaceSelection(modifiedText);
    } catch (err) {
        console.error("addGroups() failed:", err);
        alert("Something went wrong while adding groups=\"\" attributes.");
    }
}

// add values
function addValues() {
    const editor = window.editor;
    const selected = editor.getSelection();
    const targetTags = ["row", "col", "choice"];
    let changed = false;

    const updated = selected.replace(
            /<(\w+)([^>]*?)>/g,
            (full, tag, attrs) => {
            if (targetTags.includes(tag) && !/value\s*=/.test(attrs)) {
                changed = true;
                return `<${tag}${attrs} value="">`;
            }
            return full;
        });

    if (changed)
        editor.replaceSelection(updated);
    else
        alert('No missing value="" attributes found on <row>, <col>, or <choice>.');
}

// add values L-H
function addValuesLow() {
    const editor = window.editor;
    const selected = editor.getSelection();
    const targetTags = ["row", "col", "choice"];
    let count = 1;

    const updated = selected.replace(
            /<(\w+)([^>]*?)>/g,
            (full, tag, attrs) => {
            if (targetTags.includes(tag)) {
                const cleaned = attrs.replace(/\svalue=".*?"/, ""); // Remove existing value
                return `<${tag}${cleaned} value="${count++}">`;
            }
            return full;
        });

    editor.replaceSelection(updated);
}
// add values H-L
function addValuesHigh() {
    const editor = window.editor;
    const selected = editor.getSelection();
    const targetTags = ["row", "col", "choice"];
    let matches = [...selected.matchAll(/<(\w+)([^>]*?)>/g)];
    let total = matches.filter(([_, tag]) => targetTags.includes(tag)).length;
    let count = total;

    const updated = selected.replace(
            /<(\w+)([^>]*?)>/g,
            (full, tag, attrs) => {
            if (targetTags.includes(tag)) {
                const cleaned = attrs.replace(/\svalue=".*?"/, "");
                return `<${tag}${cleaned} value="${count--}">`;
            }
            return full;
        });

    editor.replaceSelection(updated);
}

// swap rows and cols and vice versa
function swapRowCol() {
    try {
        const editor = window.editor;
        const selected = editor.getSelection();

        if (!selected.trim()) {
            alert("Please select some <row> or <col> tags to swap.");
            return;
        }

        const lines = selected.split("\n");
        const updated = lines.map(line => {
            let modifiedLine = line;

            if (/<row/.test(line)) {
                modifiedLine = modifiedLine
                    .replace(/(<|\/)row/g, "$1col")
                    .replace(/label=(["'])r(\d)/g, 'label=$1c$2');
            } else if (/<col/.test(line)) {
                modifiedLine = modifiedLine
                    .replace(/(<|\/)col/g, "$1row")
                    .replace(/label=(["'])c(\d)/g, 'label=$1r$2');
            }

            return modifiedLine;
        });

        const result = updated.join("\n");
        editor.replaceSelection(result);
    } catch (err) {
        console.error("swapRowCol() failed:", err);
        alert("Something went wrong during row/col swapping.");
    }
}

// make link href
function makeHref() {
    try {
        const editor = window.editor;
        const input = editor.getSelection().trim();

        if (!input) {
            alert("Please select or enter a URL.");
            return;
        }

        const href = `<a href="${input}" target="_blank">${input}</a>`;
        editor.replaceSelection(href);
    } catch (err) {
        console.error("makeHref() failed:", err);
        alert("Something went wrong while generating the hyperlink.");
    }
}

//make lis
function lis() {
    let selectedText = window.editor.getSelection();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);

    let xmlItems = "";
    lines.forEach((line) => {
        xmlItems += `  <li>${line}</li>\n`;
    });

    window.editor.replaceSelection(xmlItems);
}
// make ordered list (<ol>)
function makeOl() {
    const selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        let input = selectedText.trim();

        // Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        // Check if there is at least one <li>
        if (!input.includes("<li")) {
            alert("<ol> tag requires at least one <li> element.");
            return;
        }
        const output = `<ol>\n  ${input}\n</ol>\n`;
        window.editor.replaceSelection(output);
        return output;

    } catch (error) {
        console.error("makeOl clip failed:", error);
        alert("An error occurred while generating the <ol> tag.");
        return "";
    }
}

// make unordered list (<ul>)
function makeUl() {
    const selectedText = window.editor.getSelection();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        let input = selectedText.trim();

        // Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        // Check if there is at least one <li>
        if (!input.includes("<li")) {
            alert("<ul> tag requires at least one <li> element.");
            return;
        }
        const output = `<ul>\n  ${input}\n</ul>\n`;
        window.editor.replaceSelection(output);
        return output;

    } catch (error) {
        console.error("makeUl clip failed:", error);
        alert("An error occurred while generating the <ul> tag.");
        return "";
    }
}

function makeStateSelect({
    addRecode = false
} = {}) {
    try {
        const editor = window.editor;
        const inputText = editor.getSelection().trim();

        const match = inputText.match(/^([a-zA-Z0-9-_]+)([.:)\s])([\s\S]*)$/);
        if (!match) {
            alert("Input should start with a label and punctuation (e.g. 'Q1. Question...')");
            return;
        }

        let label = match[1];
        let title = match[3].trim().replace(/\n{2,}/g, "\n");

        if (/^\d/.test(label))
            label = "Q" + label;

        const choicesXml = US_STATES
            .map(([code, name]) => `  <choice label="${code}">${name}</choice>`)
            .join("\n");

        let xml = `<select label="${label}" optional="0">
  <title>${title}</title>
${choicesXml}
</select>
<suspend/>`;

        if (addRecode) {
            xml += `

<exec>
if ${label}.choices[${label}.ival].label in ["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA"]:
\thRegion.val = 0
elif ${label}.choices[${label}.ival].label in ["WI", "IL", "MI", "IN", "OH", "ND", "SD", "NE", "KS", "MN", "IA", "MO"]:
\thRegion.val = 1
elif ${label}.any and ${label}.choices[${label}.ival].label in ["KY", "TN", "MS", "AL", "FL", "GA", "SC", "NC", "VA", "WV", "DC", "MD", "DE", "TX", "OK", "AR", "LA"]:
\thRegion.val = 2
elif ${label}.choices[${label}.ival].label in ["MT", "ID", "WY", "NV", "UT", "CO", "AZ", "NM", "WA", "OR", "CA", "AK", "HI"]:
\thRegion.val = 3
</exec>

<radio label="hRegion" optional="1" where="execute" sst="0">
  <title>Hidden Question: Region recode</title>
  <row label="r1">Northeast (ME, NH, VT, MA, RI, CT, NY, NJ, PA)</row>
  <row label="r2">Midwest (WI, IL, MI, IN, OH, ND, SD, NE, KS, MN, IA, MO)</row>
  <row label="r3">South (KY, TN, MS, AL, FL, GA, SC, NC, VA, WV, DC, MD, DE, TX, OK, AR, LA)</row>
  <row label="r4">West (MT, ID, WY, NV, UT, CO, AZ, NM, WA, OR, CA, AK, HI)</row>
</radio>

<suspend/>`;
        }

        editor.replaceSelection(xml);
    } catch (err) {
        console.error("makeStateSelect() failed:", err);
        alert("Error generating select question.");
    }
}

function makeStateOnly() {
    makeStateSelect({
        addRecode: false
    });
}

function makeStateWithRecode() {
    makeStateSelect({
        addRecode: true
    });
}

function makeStateCheckbox() {
    try {
        const editor = window.editor;
        const inputText = editor.getSelection().trim();

        const match = inputText.match(/^([a-zA-Z0-9-_]+)([.:)\s])([\s\S]*)$/);
        if (!match) {
            alert("Input should start with a label and punctuation (e.g. 'Q1. Select your states...')");
            return;
        }

        let label = match[1];
        let title = match[3].trim().replace(/\n{2,}/g, "\n");
        if (/^\d/.test(label))
            label = "Q" + label;

        const rows = US_STATES
            .map(([code, name]) => `  <row label="${code}">${name}</row>`)
            .join("\n");

        const xml = `<checkbox label="${label}" optional="0">
  <title>${title}</title>
${rows}
</checkbox>
<suspend/>`;

        editor.replaceSelection(xml);
    } catch (err) {
        console.error("makeStateCheckbox() failed:", err);
        alert("Could not generate checkbox state list.");
    }
}

function makeCountrySelectISO() {
    try {
        const editor = window.editor;
        const inputText = editor.getSelection().trim();

        const match = inputText.match(/^([a-zA-Z0-9-_]+)([.:)\s])([\s\S]*)$/);
        if (!match) {
            alert("Expected format: Label. Question title...");
            return;
        }

        let label = match[1];
        let title = match[3].trim().replace(/\n{2,}/g, "\n");
        if (/^\d/.test(label))
            label = "Q" + label;

        const choices = COUNTRIES
            .map(([code, name]) => `  <choice label="${code}">${name}</choice>`)
            .join("\n");

        const xml = `<select label="${label}" optional="0">
  <title>${title}</title>
${choices}
</select>
<suspend/>`;

        editor.replaceSelection(xml);
    } catch (err) {
        console.error("makeCountrySelectISO() failed:", err);
        alert("Could not generate country dropdown.");
    }
}

// Add Survey Copy Protection
function addCopyProtection() {
    xmlItems = COPY_PROTECTION;
    window.editor.replaceSelection(xmlItems);
}

function makeUnselectableSpan() {
    const selectedText = window.editor.getSelection();
    const html = `<span style="-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;" unselectable="on" ondragstart="return false" oncontextmenu="return false">${selectedText.trim()}</span>`;
    window.editor.replaceSelection(html);
}

function makeUnselectableDiv() {
    const selectedText = window.editor.getSelection();
    const html = `<div style="-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;" unselectable="on" ondragstart="return false" oncontextmenu="return false">${selectedText.trim()}</div>`;
    window.editor.replaceSelection(html);
}

function addUnselectableAttributes() {
    const attrs = ` style="-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;" unselectable="on" ondragstart="return false" oncontextmenu="return false"`;
    window.editor.replaceSelection(attrs);
}
