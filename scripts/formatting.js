//FORMATTING STUFF:
function parseXmlToDom(xmlString) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(xmlString, "application/xml");

    const errorNode = dom.querySelector("parsererror");
    if (errorNode)
        throw new Error("Invalid XML");

    return dom;
}

function formatXmlNode(node, depth = 0) {
    const INDENT = "  ";
    const pad = INDENT.repeat(depth);
    let output = "";

    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        if (text)
            output += pad + text + "\n";
        return output;
    }

    if (node.nodeType === Node.CDATA_SECTION_NODE) {
        output += pad + "<![CDATA[" + node.nodeValue + "]]>\n";
        return output;
    }

    if (node.nodeType === Node.COMMENT_NODE) {
        output += pad + `<!-- ${node.nodeValue.trim()} -->\n`;
        return output;
    }

    if (node.nodeType !== Node.ELEMENT_NODE)
        return "";

    const tagName = node.tagName;
    const attrs = Array.from(node.attributes)
        .map(attr => `${attr.name}="${attr.value}"`)
        .join(" ");

    const openingTag = `<${tagName}${attrs ? " " + attrs : ""}>`;
    const closingTag = `</${tagName}>`;

    const children = Array.from(node.childNodes);
    const isLeaf = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;

    if (isLeaf) {
        const text = children[0].nodeValue.trim();
        output += pad + openingTag + text + closingTag + "\n";
    } else if (children.length === 0) {
        output += pad + `<${tagName}${attrs ? " " + attrs : ""} />\n`;
    } else {
        output += pad + openingTag + "\n";
        for (const child of children) {
            output += formatXmlNode(child, depth + 1);
        }
        output += pad + closingTag + "\n";
    }

    return output;
}

function formatXmlRedHatStyle(xmlString) {
    const wrappedXml = `<__root__>\n${xmlString}\n</__root__>`;

    try {
        const dom = new DOMParser().parseFromString(wrappedXml, "application/xml");
        const errorNode = dom.querySelector("parsererror");
        if (errorNode)
            throw new Error("Invalid XML");

        const root = dom.documentElement;
        const children = Array.from(root.childNodes);

        return children.map(child => formatXmlNode(child, 0)).join("").trim();
    } catch (err) {
        console.error("XML formatting failed:", err);
        return xmlString;
    }
}
function extractPythonBlocks(xmlString, tags = ["exec", "virtual", "validate"]) {
    const blocks = [];
    const regex = new RegExp(`<(${tags.join("|")})[^>]*>([\\s\\S]*?)<\\/\\1>`, "gi");

    let match;
    while ((match = regex.exec(xmlString)) !== null) {
        blocks.push({
            tag: match[1],
            content: match[2].trim(),
            start: match.index,
            end: regex.lastIndex
        });
    }

    return blocks;
}

function formatPython(code) {
    const INDENT = "\t";

    // Step 1: Normalize compressed code
    const rawLines = code
        .replace(/\t+/g, "\n") // tabs used as separators
        .replace(/(?<!\\);/g, "\n") // semicolons used as separators
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const formatted = [];
    let indentLevel = 0;

    for (let line of rawLines) {
        if (/^(try:|except\b|finally:)/.test(line)) {
            formatted.push(INDENT.repeat(indentLevel) + line);
            indentLevel++;
            continue;
        }

        if (/^(def |class )/.test(line)) {
            // Insert blank line before new function for readability
            if (formatted.length > 0)
                formatted.push("");
            formatted.push(INDENT.repeat(indentLevel) + line);
            indentLevel++;
            continue;
        }

        if (/^(return|pass|break|continue)\b/.test(line)) {
            formatted.push(INDENT.repeat(Math.max(indentLevel - 1, 0)) + line);
            continue;
        }

        formatted.push(INDENT.repeat(indentLevel) + line);
    }

    return formatted.join("\n");
}

function formatPythonInXml(xmlString) {
    const blocks = extractPythonBlocks(xmlString);
    let formattedXml = xmlString;

    for (const block of blocks.reverse()) {
        const formattedCode = formatPython(block.content);
        const attrsMatch = xmlString.slice(block.start, block.end).match(/^<[^>]+>/);
        const openingTag = attrsMatch ? attrsMatch[0] : `<${block.tag}>`;
        const closingTag = `</${block.tag}>`;

        const replacement = `${openingTag}\n${formattedCode}\n${closingTag}`;
        formattedXml =
            formattedXml.slice(0, block.start) +
            replacement +
            formattedXml.slice(block.end);
    }

    return formattedXml;
}

function formatXml() {
    const rawXml = editor.getValue();

    // Step 1: Format embedded Python
    //const withFormattedPython = formatPythonInXml(rawXml);

    // Step 2: Format XML structure
    const formatted = formatXmlRedHatStyle(rawXml);

    editor.setValue(formatted);
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
