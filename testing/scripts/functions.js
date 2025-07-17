// functions.js

import { EditorSelection } from "@codemirror/state";

// 🔧 Utility: Resolve editorView globally if not passed
const getView = view => view || (typeof editorView !== "undefined" ? editorView : null);

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

// =============================
// 📩 BASIC INSERT HELPERS
// =============================
export function insertText(view, text) {
    view = getView(view);
    const sel = view.state.selection.main;
    view.dispatch({
        changes: {
            from: sel.from,
            to: sel.to,
            insert: text
        },
        scrollIntoView: true
    });
}

export function getInputOrLine(view) {
    view = getView(view);
    const { state } = view;
    const sel = state.selection.main;
    const selected = state.doc.slice(sel.from, sel.to).toString().trim();
    if (selected)
        return selected;
    return state.doc.lineAt(sel.from).text.trim();
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
export const addOptional = view => addAttribute(view, `o ptional="1"`);
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
export function makeLooprows(view) {
    const raw = getInputOrLine(view).trim();
    if (!raw)
        return;

    const lines = raw.replace(/\t+/g, " ").replace(/\n +\n/g, "\n\n").replace(/\n{2,}/g, "\n")
        .split("\n").map(line => line.replace(/^[a-zA-Z0-9]{1,2}[.:)\s]+\s*/, "").trim()).filter(Boolean);

    const output = lines.map((line, i) =>
`  <looprow label="${i + 1}">\n    <loopvar name="var">${line}</loopvar>\n  </looprow>`).join("\n");

    insertText(view, output);
}

// You can expand this further with `addLoopBlock(view)` and others later

// ==============================
// 🧠 EXPORT DEFAULT (optional)
// ==============================
// Optional: export all functions together
// export default {
//   wrapSelection,
//   makeRes,
//   addTerm,
//   addQuota,
//   makeRows,
//   makeCols,
//   makeChoices,
//   swapRowCol,
//   makeOl,
//   makeUl,
//   makeHref,
//   makeCase,
//   makeCondition,
//   ...
// };
