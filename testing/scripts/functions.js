// functions.js

import { EditorSelection } from "@codemirror/state";
import { getActiveEditor } from './tabs.js';

// Helper to safely get editor
function getEditor() {
    const ed = getActiveEditor();
    if (!ed) {
        console.warn("Editor not ready");
        return null;
    }
    return ed;
}

// Insert text at current cursor or replace selection
export function insertText(view, text) {
    const sel = view.state.selection.main;
    view.dispatch({ changes: { from: sel.from, to: sel.to, insert: text } });
}

// editor selection - get selected text or current line
export function getInputOrLine(view) {
    view = getView(view);
    if (!view) return "";
    const sel = view.state.selection.main;
    const selectedText = view.state.doc.sliceString(sel.from, sel.to).trim();
    return selectedText || view.state.doc.lineAt(sel.head).text.trim() || "";
}

export function setCursorAfterLine(l) {
    const view = getView();
    if (!view) return;
    view.setCursor({
        line: l,
        ch: 0
    });
}

// 🔧 Utility: Resolve editorView globally if not passed
const getView = view => view || getEditor();

// ==============================
// 🧩 TEXT FORMATTING & WRAPPING
// ==============================
export function wrapSelection(view, tag) {
    view = getView(view);
    const { state } = view;
    const sel = state.selection.main;

    if (sel.empty)
        return false;

    const txt = state.doc.slice(sel.from, sel.to).toString();
    if (new RegExp(`^<${tag}>.*</${tag}>$`).test(txt))
        return false;

    const wrapped = `<${tag}>${txt}</${tag}>`;
    const transaction = state.update({
        changes: {
            from: sel.from,
            to: sel.to,
            insert: wrapped
        },
        selection: EditorSelection.range(
            sel.from + `<${tag}>`.length,
            sel.from + wrapped.length - `</${tag}>`.length),
        scrollIntoView: true
    });

    view.dispatch(transaction);
    return true;
}

export function toTitleCase(str) {
    const acronyms = ["us", "uk", "eu", "xml", "id", "qa", "br", "brbr", "li", "ol", "ul", "css", "js", "ihut"];
    const lowercases = ["res"];

    return str.toLowerCase()
    .split(/(\s|-)/)
    .map(part => acronyms.includes(part) ? part.toUpperCase()
         : lowercases.includes(part) ? part
         : /^[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part)
    .join("");
}
// ==============================
// 📦 CONTROL TAG INSERTIONS
// ==============================
export function addTerm(view) {
    const text = getInputOrLine(view);
    insertText(view, `<term label="term_" cond="${text}"></term>`);
}
export function addQuota(view) {
    const text = getInputOrLine(view);
    insertText(view, `<quota label="quota_${text}" sheet="${text}" overquota="noqual"/>`);
}
export function validateTag(view) {
    const text = getInputOrLine(view);
    insertText(view, `<validate>\n${text}\n</validate>`);
}
export function virtualTag(view) {
    const text = getInputOrLine(view);
    insertText(view, `<virtual>\n${text}\n</virtual>`);
}
export function execTag(view) {
    const text = getInputOrLine(view);
    insertText(view, `<exec>\n${text}\n</exec>`);
}

// ==============================
// 🔁 LIST GENERATORS (RES, ROW, COL, CHOICE, etc.)
// ==============================
export function makeRes(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const lines = raw.replace(/\t+/g, " ")
        .replace(/\n +\n/g, "\n\n")
        .replace(/\n{2,}/g, "\n")
        .trim()
        .split("\n")
        .map(line => line.replace(/^[a-zA-Z0-9]{1,2}[.:)]\s+/, "").trim());

    const output = lines.filter(Boolean)
        .map(line => `<res label="">${line}</res>`)
        .join("\n");

    insertText(view, output);
}

export function makeRows(view, numbered) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    const count = lines.length;

    const output = lines.map((line, i) => {
        const idx = numbered === "high" ? count - i : i + 1;
        const valueAttr = numbered === "low" || numbered === "high" ? ` value="${idx}"` : "";
        return `<row label="r${idx}"${valueAttr}>${line}</row>`;
    }).join("\n");

    insertText(view, output);
}

export function makeCols(view, numbered) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    const count = lines.length;

    const output = lines.map((line, i) => {
        const idx = numbered === "high" ? count - i : i + 1;
        const valueAttr = numbered === "low" || numbered === "high" ? ` value="${idx}"` : "";
        return `<col label="c${idx}"${valueAttr}>${line}</col>`;
    }).join("\n");

    insertText(view, output);
}

export function makeChoices(view, numbered) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    const count = lines.length;

    const output = lines.map((line, i) => {
        const idx = numbered === "high" ? count - i : i + 1;
        const valueAttr = numbered === "low" || numbered === "high" ? ` value="${idx}"` : "";
        return `<choice label="ch${idx}"${valueAttr}>${line}</choice>`;
    }).join("\n");

    insertText(view, output);
}

// NOANSWER
export function makeNoAnswer(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

    let xmlItems = lines.map((line, index) => `  <noanswer label="n${index + 1}">${line}</noanswer>`).join("\n");

    insertText(view, xmlItems);
}

// groups
export function makeGroups(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

    let xmlItems = lines.map((line, index) => `  <group label="g${index + 1}">${line}</group>`).join("\n");

    insertText(view, xmlItems); 
}


// Autofill rows for pipe
export function makeAutoFillRows(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;


    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

    let xmlItems = "";
    lines.forEach((line, index) => {
        xmlItems += `  <row label="r${index + 1}" autofill="">${line}</row>\n`;
    });

    xmlItems += `  <row label="none" autofill="thisQuestion.count == 0"><i>None of These Classifications Apply</i></row>\n`;

    insertText(view, xmlItems); 
}

// ==============================
// 🎛️ ATTRIBUTE HELPERS
// ==============================
export function addAttribute(view, attr) {
    insertText(view, ` ${attr}`);
}
export const br = view => insertText(view, `<br/>`);
export const brbr = view => insertText(view, `<br/><br/>`);
export const addOpen = view => addAttribute(view, ` open="1" openSize="25" randomize="0"`);
export const addExclusive = view => addAttribute(view, ` exclusive="1" randomize="0"`);
export const addAggregate = view => addAttribute(view, ` aggregate="0" percentages="0"`);
export const addRandomize0 = view => addAttribute(view, ` randomize="0"`);
export const addOptional = view => addAttribute(view, ` optional="1"`);
export const addShuffleRows = view => addAttribute(view, ` shuffle="rows"`);
export const addShuffleCols = view => addAttribute(view, ` shuffle="cols"`);
export const addShuffleRowsCols = view => addAttribute(view, ` shuffle="rows,cols"`);
export const addExecute = view => addAttribute(view, ` where="execute"`);
export const addGroupingCols = view => addAttribute(view, ` grouping="cols" adim="cols"`);
export const addGroupingRows = view => addAttribute(view, ` grouping="rows" adim="rows"`);
export const addRowClassNames = view => addAttribute(view, ` ss:rowClassNames=""`);
export const addColClassNames = view => addAttribute(view, ` ss:colClassNames=""`);
export const addChoiceClassNames = view => addAttribute(view, ` ss:choiceClassNames=""`);
export const addRatingDirection = view => addAttribute(view, ` ratingDirection="reverse"`);
export function addAltlabel(view) {
    const raw = getInputOrLine(view);
    const cleaned = raw.trim().replace(/\s+/g, "_");
    const html = ` altlabel="${cleaned}"`;
    window.editor.replaceSelection(html);
}
// ==============================
// 🧠 PRETEXT / POSTTEXT / RES WRAPPERS
// ==============================
export const addPreText = view => {
    const val = getInputOrLine(view).trim();
    insertText(view, ` ss:preText="\${res.$ {
            val
        }
}"`);
};
export const addPostText = view => {
    const val = getInputOrLine(view).trim();
    insertText(view, ` ss:postText="\${res.$ {
            val
        }
}"`);
};
export const makePreTextResInternal = view => {
    const val = getInputOrLine(view).trim();
    insertText(view, `<res label="preText">${val}</res>`);
};
export const makePostTextResInternal = view => {
    const val = getInputOrLine(view).trim();
    insertText(view, `<res label="postText">${val}</res>`);
};

// ==============================
// 🔄 ROW/COL SWAPPING
// ==============================
export function swapRowCol(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const lines = raw.split("\n").map(line => {
        let modified = line;
        if (/<row/.test(modified)) {
            modified = modified.replace(/(<\/?)row/g, "$1col")
                .replace(/label=(["'])r(\d)/g, 'label=$1c$2');
        } else if (/<col/.test(modified)) {
            modified = modified.replace(/(<\/?)col/g, "$1row")
                .replace(/label=(["'])c(\d)/g, 'label=$1r$2');
        }
        return modified;
    });

    insertText(view, lines.join("\n"));
}

// ==============================
// 🔗 MARKUPS & LINKS
// ==============================
export function makeHref(view) {
    const text = getInputOrLine(view).trim();
    if (!text)
        return;
    insertText(view, `<a href="${text}" target="_blank">${text}</a>`);
}

export function lis(view) {
    const text = getInputOrLine(view).trim();
    if (!text)
        return;

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const output = lines.map(line => `  <li>${line}</li>`).join("\n");
    insertText(view, output);
}

export function makeOl(view) {
    const text = getInputOrLine(view).trim();
    if (!text || !text.includes("<li"))
        return;
    insertText(view, `<ol>\n  ${text}\n</ol>`);
}

export function makeUl(view) {
    const text = getInputOrLine(view).trim();
    if (!text || !text.includes("<li"))
        return;
    insertText(view, `<ul>\n  ${text}\n</ul>`);
}

// ==============================
// 🧠 GROUPS / VALUES INJECTION
// ==============================
export function addGroups(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const tags = ["group", "col", "row", "choice"];
    let changed = false;

    const updated = raw.replace(/<(\w+)([^>]*?)>/g, (full, tagName, attrs) => {
        if (tags.includes(tagName) && !/groups\s*=/.test(attrs)) {
            changed = true;
            return `<${tagName}${attrs} groups="">`;
        }
        return full;
    });

    if (changed)
        insertText(view, updated);
}

export function addValues(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const tags = ["row", "col", "choice"];
    let changed = false;

    const updated = raw.replace(/<(\w+)([^>]*?)>/g, (full, tagName, attrs) => {
        if (tags.includes(tagName) && !/value\s*=/.test(attrs)) {
            changed = true;
            return `<${tagName}${attrs} value="">`;
        }
        return full;
    });

    if (changed)
        insertText(view, updated);
}

export function addValuesLow(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const tags = ["row", "col", "choice"];
    let count = 1;

    const updated = raw.replace(/<(\w+)([^>]*?)>/g, (full, tag, attrs) => {
        if (tags.includes(tag)) {
            const cleaned = attrs.replace(/\svalue=".*?"/, "");
            return `<${tag}${cleaned} value="${count++}">`;
        }
        return full;
    });

    insertText(view, updated);
}

export function addValuesHigh(view) {
    const raw = getInputOrLine(view);
    if (!raw.trim())
        return;

    const tags = ["row", "col", "choice"];
    const matches = [...raw.matchAll(/<(\w+)([^>]*?)>/g)];
    let total = matches.filter(([_, tag]) => tags.includes(tag)).length;
    let count = total;

    const updated = raw.replace(/<(\w+)([^>]*?)>/g, (full, tag, attrs) => {
        if (tags.includes(tag)) {
            const cleaned = attrs.replace(/\svalue=".*?"/, "");
            return `<${tag}${cleaned} value="${count--}">`;
        }
        return full;
    });

    insertText(view, updated);
}

// ==============================
// 🗂️ COMMENT & CASE BLOCKS
// ==============================
export function addCommentQuestion(view) {
    const text = getInputOrLine(view).trim();
    if (text)
        insertText(view, `<comment>${text}</comment>`);
}

export function makeCase(view) {
    const text = getInputOrLine(view);
    if (!text.trim())
        return;

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    let xml = lines.map((line, i) => `  <case label="c${i + 1}" cond="">${line}</case>`).join("\n");
    xml += `\n  <case label="cn" cond="1">DEFAULT</case>`;
    insertText(view, xml);
}

export function makeCondition(view) {
    const text = getInputOrLine(view);
    if (!text.trim())
        return;

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const xml = lines.map(line => `<condition label="" cond="">${line}</condition>`).join("\n");
    insertText(view, xml);
}

// ==============================
// 🔁 LOOP & VIRTUAL BLOCKS
// ==============================
// block tag
export function wrapInBlock() {
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
export function wrapInBlockRandomize() {
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

// loop tag
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

// ==============================

// make looprows
export function makeLooprows() {
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
export function makeMarker() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    let lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    let xmlItems = lines.map((line, index) => `<marker name="${line}" cond=""/>`).join("\n");

    window.editor.replaceSelection(xmlItems);
}

// FUNCTIONS FOR ROWS, COLS and CHOICES
export function extractNumberAndText(line) {
    const match = line.match(/^([A-Za-z0-9]+)[.)]\s*(.*)$/);
    if (!match)
        return null;

    //const prefix = match[1];
    const text = match[2];

    //const isNumber = /^\d+$/.test(prefix);
    return {
        text
    };
}

export function buildXmlTag(tagName, tagLabel, lines, numbered, parse) {
    const count = lines.length;

    return lines.map((line, i) => {
        const parsed = extractNumberAndText(line);
        let label,
        valueAttr = "",
        content;

        if (numbered === "low" || numbered === "high") {
            const idx = numbered === "high" ? count - i : i + 1;
            label = `${tagLabel}${idx}`;
            valueAttr = ` value="${idx}"`;
            content = parsed ? parsed.text : line;
        } else if (parsed) {
            content = parsed.text;
            if (parsed.number !== null) {
                label = `${tagLabel}${i + 1}`;
            } else {
                label = `${tagLabel}${i + 1}`;
            }
        } else {
            label = `${tagLabel}${i + 1}`;
            content = line;
        }

        return `  <${tagName} label="${label}"${valueAttr}>${content}</${tagName}>`;
    }).join("\n");
}

//add class names
export function addSurveyClassNames(type = "row") {
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
export function addColWidth() {
    xmlItems = ` ss:colWidth=""`;
    window.editor.replaceSelection(xmlItems);
}
//add Add legendColWidth
export function addLegendColWidth() {
    xmlItems = ` ss:legendColWidth=""`;
    window.editor.replaceSelection(xmlItems);
}

// add elShuffle
export function elShuffle(el) {
    const html = ` ${el}Shuffle=""`;
    window.editor.replaceSelection(html);
}

export function makeLi(view) {
    const selectedText = getInputOrLine();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    const lines = selectedText.split("\n").map(line => line.trim()).filter(line => line);
    const xmlItems = lines.map(line => `  <li>${line}</li>`).join("\n");
    
    const editor = getEditor();
    if (editor) {
        insertText(editor, xmlItems);
    }
}

export function addPreTextRes(view) {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:preText="\${res.${selectedText.trim()}}"`;
    const editor = getEditor();
    if (editor) {
        insertText(editor, xmlContent);
    }
}

export function addPreTextInternal(view) {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:preText="\${res['%s,preText' % this.label]}"`;
    const editor = getEditor();
    if (editor) {
        insertText(editor, xmlContent);
    }
}

export function addPostTextRes(view) {
    const selectedText = getInputOrLine();
    const xmlContent = `<res label="preText">${selectedText.trim()}</res>`;
    const editor = getEditor();
    if (editor) {
        insertText(editor, xmlContent);
    }
}

export function addPostTextExternal(view) {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:postText="\${res.${selectedText.trim()}}"`;
    const editor = getEditor();
    if (editor) {
        insertText(editor, xmlContent);
    }
}

export function addPostTextInternal(view) {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:postText="\${res['%s,postText' % this.label]}"`;
    const editor = getEditor();
    if (editor) {
        insertText(editor, xmlContent);
    }
}

export function addPostTextResLabel(view) {
    const selectedText = getInputOrLine();
    const xmlContent = `<res label="postText">${selectedText.trim()}</res>`;
    const editor = getEditor();
    if (editor) {
        insertText(editor, xmlContent);
    }
}

export function callInternalRes(view) {
    const editor = window.editor;
    const selectedText = getInputOrLine();
    const xmlContent = `\${res['%s,res_label' % this.label]}`;
    window.editor.replaceSelection(xmlContent);
}

// add contact q
export function addContactQuestion() {
    const xmlContent = CONTACT_QUESTION;
    window.editor.replaceSelection(xmlContent);
}

export function addContactQuestionIHUT() {
    const xmlContent = CONTACT_QUESTION_IHUT;
    window.editor.replaceSelection(xmlContent);
}

export function relabelSelection() {
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
export function makeImageTags() {
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
export function makeReusableList() {
    const selectedText = getInputOrLine();
    const xmlContent = `<define label="">\n  ${selectedText.trim()}\n</define>`;
    window.editor.replaceSelection(xmlContent);
}

export function callReusableList() {
    const selectedText = getInputOrLine();
    const xmlContent = `<insert source="${selectedText.trim()}"/>`;
    window.editor.replaceSelection(xmlContent);
}

