//FORMATTING STUFF:
function addLineBreaksBetweenTags(xmlString) {
    const lines = xmlString.split("\n");
    const output = [];

    for (let i = 0; i < lines.length; i++) {
        const current = lines[i].trim();
        const next = lines[i + 1]?.trim();

        output.push(lines[i]);

        if (
            current.startsWith("</") &&
            next &&
            next.startsWith("<") &&
            !next.startsWith("</") &&
            !next.startsWith("<![CDATA[") &&
            !next.startsWith("<!--")) {
            output.push(""); // insert blank line
        }
    }

    return output.join("\n");
}

function formatXml() {
    const rawXml = editor.getValue();
    const beautified = vkbeautify.xml(rawXml, 2);
    const spaced = addLineBreaksBetweenTags(beautified);
    editor.setValue(spaced);
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wrapSelection(tag) {
    const editor = window.editor;
    const selection = getInputOrLine();

    if (!selection)
        return;

    const from = editor.getCursor("from");
    const to = editor.getCursor("to");

    const openingTag = `<${tag}>`;
    const closingTag = `</${tag}>`;

    const tagRegex = new RegExp(`^${escapeRegex(openingTag)}(.*)${escapeRegex(closingTag)}$`, "s");

    if (tagRegex.test(selection)) {
        const innerText = selection.replace(tagRegex, "$1");
        editor.replaceRange(innerText, from, to);
        editor.setSelection(from, editor.posFromIndex(editor.indexFromPos(from) + innerText.length));
    } else {
        const wrappedText = `${openingTag}${selection}${closingTag}`;
        editor.replaceRange(wrappedText, from, to);

        const insertStart = editor.indexFromPos(from);
        const insertEnd = insertStart + wrappedText.length;
        const newTo = editor.posFromIndex(insertEnd);

        editor.setSelection(from, newTo);
    }

    editor.focus();
}

function toTitleCase(str) {
    const acronyms = ["us", "uk", "eu", "xml", "id", "qa", "br", "brbr", "li", "ol", "ul", "css", "js", "ihut"];
    const lowercases = ["res"];

    return str
    .toLowerCase()
    .split(/(\s|-)/) // keep spaces and hyphens
    .map(part => {
        if (acronyms.includes(part)) {
            return part.toUpperCase();
        }
        if (lowercases.includes(part)) {
            return part;
        }
        return /^[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part;
    })
    .join("");
}
