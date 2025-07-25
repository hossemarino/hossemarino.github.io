// editor selection
function getInputOrLine() {
    editor = getActiveEditor();
    const sel = editor.getSelection();
    return sel.trim() || editor.getLine(editor.getCursor().line)?.trim() || "";
}

function setCursorAfterLine(l) {
    editor = getActiveEditor();
    editor.setCursor({
        line: l,
        ch: 0
    });
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
    if (activeTab && tabs[activeTab]?.editor) {
        const content = tabs[activeTab].editor.getValue();
        localStorage.setItem(`editorTab_${activeTab}`, content);
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

function loadEditorContent(tabName) {
    const savedContent = localStorage.getItem(`editorTab_${tabName}`);
    if (savedContent && tabs[tabName]?.editor) {
        tabs[tabName].editor.setValue(savedContent);
    }
}

// CONTROL ELEMENTS
// termination
function addTerm() {
    const selectedText = getInputOrLine();
    const html = `<term label="term_" cond="${selectedText.trim()}"></term>`;
    window.editor.replaceSelection(html);
}

// quota tag
function addQuota() {
    const selectedText = getInputOrLine();
    const html = `<quota label="quota_${selectedText.trim()}" sheet="${selectedText.trim()}" overquota="noqual"/>`;
    window.editor.replaceSelection(html);
}

// validate tag
function validateTag() {
    const selectedText = getInputOrLine();
    const html = `  <validate>
${selectedText.trim()}

  </validate>`;
    window.editor.replaceSelection(html);
}

// exec tag
function execTag() {
    const selectedText = getInputOrLine();

    const html = `  <exec>
${selectedText.trim()}

  </exec>`;
    window.editor.replaceSelection(html);
}

// virtual tag
function virtualTag() {
    const selectedText = getInputOrLine();

    const html = `  <virtual>
${selectedText.trim()}

  </virtual>`;
    window.editor.replaceSelection(html);
}

// res
function makeRes() {
    const editor = window.editor;
    const selectedText = getInputOrLine();

    try {
        if (!selectedText.trim()) {
            alert("No text selected!");
            return;
        }

        let input = selectedText;

        input = input.replace(/\t+/g, " ");
        input = input.replace(/\n +\n/g, "\n\n");
        input = input.replace(/\n{2,}/g, "\n");

        const lines = input.trim().split("\n").map(line =>
                line.replace(/^[a-zA-Z0-9]{1,2}[.:)]\s+/, "").trim());

        const result = lines
            .filter(Boolean)
            .map(line => `<res label="">${line}</res>`)
            .join("\n");

        editor.replaceSelection(result); // ✅ Output applied here

    } catch (err) {
        console.error("makeRes() failed:", err);
        alert("Could not process RES tags.");
    }
}
// block tag
function wrapInBlock() {
    try {
        const editor = window.editor;
        const input = getInputOrLine().trim();

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
        const input = getInputOrLine().trim();

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
        const selection = getInputOrLine().trim();

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
        const rawInput = getInputOrLine().trim();

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
    let selectedText = getInputOrLine();
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
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `<condition label="" cond="">${line}</condition >`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// FUNCTIONS FOR ROWS, COLS and CHOICES
function extractNumberAndText(line) {
    const match = line.match(/^(\d+)\.\s*(.*)/);
    if (match) {
        return { number: match[1], text: match[2] };
    }
    return null;
}

function buildXmlTag(tagName, lines, numbered) {
    const count = lines.length;

    return lines.map((line, i) => {
        const parsed = extractNumberAndText(line);
        let idx, label, valueAttr, content;

        if (numbered === "low" || numbered === "high") {
            idx = numbered === "high" ? count - i : i + 1;
            label = `${tagName[0]}${idx}`;
            valueAttr = ` value="${idx}"`;
            content = parsed ? parsed.text : line;
        } else {
            if (parsed) {
                idx = parsed.number;
                content = parsed.text;
            } else {
                idx = i + 1;
                content = line;
            }
            label = `${tagName[0]}${idx}`;
            valueAttr = "";
        }

        return `  <${tagName} label="${label}"${valueAttr}>${content}</${tagName}>`;
    }).join("\n");
}

function makeRows(numbered) {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    const lines = selectedText.split("\n").map(line => line.trim()).filter(Boolean);
    const xmlItems = buildXmlTag("row", lines, numbered);
    window.editor.replaceSelection(xmlItems);
}

function makeCols(numbered) {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    const lines = selectedText.split("\n").map(line => line.trim()).filter(Boolean);
    const xmlItems = buildXmlTag("col", lines, numbered);
    window.editor.replaceSelection(xmlItems);
}

function makeChoices(numbered) {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    const lines = selectedText.split("\n").map(line => line.trim()).filter(Boolean);
    const xmlItems = buildXmlTag("choice", lines, numbered);
    window.editor.replaceSelection(xmlItems);
}

// NOANSWER
function makeNoAnswer() {
    let selectedText = getInputOrLine();
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
    let selectedText = getInputOrLine();
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
    let selection = getInputOrLine();

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
    let selectedText = getInputOrLine();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);

    let xmlItems = "";
    lines.forEach((line, index) => {
        xmlItems += `  <case label="c${index + 1}" cond="">${line}</case>\n`;
    });

    xmlItems += `  <case label="cn" cond="1">DEFAULT</case>\n`;

    window.editor.replaceSelection(xmlItems);
}

// Autofill rows for pipe
function makeAutoFillRows() {
    let selectedText = getInputOrLine();

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

//add class names
function addSurveyClassNames(type = "row") {
    const editor = getActiveEditor();
    const selection = editor.getSelection();
    const isCursorOnly = selection.length === 0;

    const typeMap = {
        row: {
            tags: ["row"],
            attr: 'ss:rowClassNames=""'
        },
        col: {
            tags: ["col"],
            attr: 'ss:colClassNames=""'
        },
        choice: {
            tags: ["choice"],
            attr: 'ss:choiceClassNames=""'
        },
        group: {
            tags: ["group"],
            attr: 'ss:groupClassNames=""'
        },
        comment: {
            tags: ["comment"],
            attr: 'ss:commentClassNames=""'
        },
        question: {
            tags: ["radio", "checkbox", "select", "text", "textarea", "number", "float"],
            attr: 'ss:questionClassNames=""'
        }
    };

    const rule = typeMap[type.toLowerCase()];
    if (!rule)
        return;

    if (isCursorOnly) {
        // No selection: just insert attribute at cursor
        editor.replaceSelection(" " + rule.attr);
    } else {
        // Update selected text
        const updated = selection.split("\n").map(line => {
            for (const tag of rule.tags) {
                const tagRegex = new RegExp(`<${tag}\\b`);
                if (tagRegex.test(line.trim()) && !line.includes(rule.attr)) {
                    return line.replace(/<(\w+)(\s|>)/, `<$1 ${rule.attr}$2`);
                }
            }
            return line;
        }).join("\n");

        editor.replaceSelection(updated);
    }
}

//add Add colWidth
function addColWidth() {
    xmlItems = ` ss:colWidth=""`;
    window.editor.replaceSelection(xmlItems);
}
//add Add legendColWidth
function addLegendColWidth() {
    xmlItems = ` ss:legendColWidth=""`;
    window.editor.replaceSelection(xmlItems);
}

// add groups
function addGroups() {
    try {
        const editor = window.editor;
        const selectedText = getInputOrLine();

        if (!selectedText.trim()) {
            alert("Please select one or more lines to apply groups=\"\".");
            return;
        }

        const targetTags = ["group", "col", "row", "choice"];
        let changesMade = false;

        const modifiedText = selectedText.replace(
                /^(\s*)<(\w+)([^>]*?)>/gm,
                (full, indent, tagName, attrs) => {
                if (targetTags.includes(tagName) && !/groups\s*=/.test(attrs)) {
                    changesMade = true;
                    return `${indent}<${tagName}${attrs} groups="">`;
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
function addValues(mode) {
    const editor = window.editor;
    const selected = getInputOrLine(editor);
    const targetTags = ["row", "col", "choice"];

    let count = 1;
    let total = 0;
    let changed = false;

    // Pre-count for "high" mode
    if (mode === "high") {
        const matches = [...selected.matchAll(/<(\w+)([^>]*?)>/g)];
        total = matches.filter(([_, tag]) => targetTags.includes(tag)).length;
        count = total;
    }

    const updated = selected.replace(/<(\w+)([^>]*?)>/g, (full, tag, attrs) => {
        if (!targetTags.includes(tag))
            return full;

        const cleaned = attrs.replace(/\svalue=".*?"/, "");

        if (mode === "low") {
            return `<${tag}${cleaned} value="${count++}">`;
        }

        if (mode === "high") {
            return `<${tag}${cleaned} value="${count--}">`;
        }

        // Default: add empty value only if missing
        if (!/value\s*=/.test(attrs)) {
            changed = true;
            return `<${tag}${attrs} value="">`;
        }

        return full;
    });

    if (mode || changed) {
        editor.replaceSelection(updated);

    } else {
        alert('No missing value="" attributes found on <row>, <col>, or <choice>.');
    }
}

// swap rows and cols and vice versa
function swapRowCol() {
    try {
        const editor = window.editor;
        const selected = getInputOrLine();

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

// add altlabel
function addAltlabel() {
    const selectedText = getInputOrLine();
    const cleaned = selectedText.trim().replace(/\s+/g, "_");
    const html = ` altlabel="${cleaned}"`;
    window.editor.replaceSelection(html);
}

// add ratinDirection
function addRatingDirection() {
    const selectedText = getInputOrLine();
    const html = ` ratingDirection="reverse"`;
    window.editor.replaceSelection(html);
}
// make link href
function makeHref() {
    try {
        const editor = window.editor;
        const input = getInputOrLine().trim();

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
    let selectedText = getInputOrLine();

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
    const selectedText = getInputOrLine();
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
    const selectedText = getInputOrLine();
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

// pre texts
function addPreText() {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:preText="\${res.$ {
            selectedText.trim()
        }
}"`;
    window.editor.replaceSelection(xmlContent);
}

function addPreTextInternal() {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:preText="\${res['%s,preText' % this.label]}"`;
    window.editor.replaceSelection(xmlContent);
}

function makePreTextResInternal() {
    const selectedText = getInputOrLine();
    const xmlContent = `<res label="preText">${selectedText.trim()}</res>`;
    window.editor.replaceSelection(xmlContent);
}

// post text
function addPostText() {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:postText="\${res.$ {
            selectedText.trim()
        }
}"`;
    window.editor.replaceSelection(xmlContent);
}

function addPostTextInternal() {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:postText="\${res['%s,postText' % this.label]}"`;
    window.editor.replaceSelection(xmlContent);
}

function makePostTextResInternal() {
    const selectedText = getInputOrLine();
    const xmlContent = `<res label="postText">${selectedText.trim()}</res>`;
    window.editor.replaceSelection(xmlContent);
}

// add contact q
function addContactQuestion() {
    const xmlContent = CONTACT_QUESTION;
    window.editor.replaceSelection(xmlContent);
}

function addContactQuestionIHUT() {
    const xmlContent = CONTACT_QUESTION_IHUT;
    window.editor.replaceSelection(xmlContent);
}

function relabelSelection() {
    const editor = getActiveEditor(); // Assumes your existing method
    const inputText = editor.getSelection();
    if (!inputText)
        return;

    const lines = inputText.trim().split("\n");
    if (!lines.length)
        return;

    const labelMatch = lines[0].match(/label=['"](\w+)['"]/);
    const elementMatch = lines[0].match(/<col|<row|<choice/);

    if (!labelMatch || !elementMatch)
        return;

    const startLabel = labelMatch[1];
    const startElement = elementMatch[0].slice(1);
    const nonAlphaPart = startLabel.replace(/[a-zA-Z]*/g, "");
    const isAlphanumeric = /^\d+$/.test(nonAlphaPart);
    const baseValue = isAlphanumeric
         ? parseInt(nonAlphaPart, 10)
         : startLabel.charCodeAt(0);

    let count = -1;

    const updated = lines.map(line => {
        if (new RegExp(`<${startElement}`).test(line.trim())) {
            count++;
            const newLabel = isAlphanumeric
                 ? startLabel.replace(/\d+/, baseValue + count)
                 : String.fromCharCode(baseValue + count);
            return line.replace(/label=['"]\w+['"]/, `label="${newLabel}"`);
        }
        return line;
    });

    editor.replaceSelection(updated.join("\n"));
}

// make image
function makeImageTags() {
    const selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    const lines = selectedText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line);

    const imgTags = lines.map(src => `<img src="${src}" />`).join("\n");

    window.editor.replaceSelection(imgTags);
}

// reusable list functions
function makeReusableList() {
    const selectedText = getInputOrLine();
    const xmlContent = `<define label="">\n  ${selectedText.trim()}\n</define>`;
    window.editor.replaceSelection(xmlContent);
}

function callReusableList() {
    const selectedText = getInputOrLine();
    const xmlContent = `<insert source="${selectedText.trim()}"/>`;
    window.editor.replaceSelection(xmlContent);
}