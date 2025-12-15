import { getInputOrLine } from './functions.js';
import { US_STATES } from './vars.js';

// STANDARDS
export function makeStateSelect({
    addRecode = false
} = {}) {
    try {
        const editor = window.editor;
        const inputText = getInputOrLine().trim();

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

export function makeStateOnly() {
    makeStateSelect({
        addRecode: false
    });
}

export function makeStateWithRecode() {
    makeStateSelect({
        addRecode: true
    });
}

export function makeStateCheckbox() {
    try {
        const editor = window.editor;
        const inputText = getInputOrLine().trim();

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

export function makeCountrySelectISO() {
    try {
        const editor = window.editor;
        const inputText = getInputOrLine().trim();

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
export function addCopyProtection() {
    xmlItems = COPY_PROTECTION;
    window.editor.replaceSelection(xmlItems);
}

export function makeUnselectableSpan() {
    const selectedText = getInputOrLine();
    const html = `<span style="-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;" unselectable="on" ondragstart="return false" oncontextmenu="return false">${selectedText.trim()}</span>`;
    window.editor.replaceSelection(html);
}

export function makeUnselectableDiv() {
    const selectedText = getInputOrLine();
    const html = `<div style="-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;" unselectable="on" ondragstart="return false" oncontextmenu="return false">${selectedText.trim()}</div>`;
    window.editor.replaceSelection(html);
}

export function addUnselectableAttributes() {
    const attrs = ` style="-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;" unselectable="on" ondragstart="return false" oncontextmenu="return false"`;
    window.editor.replaceSelection(attrs);
}

export function addMouseoverTemplate() {
    const attrs = `<span class="self-tooltip">(MOUSE OVER TEXT HERE)</span><span class="tooltip-content">(MOUSEOVER CONTENT HERE)</span>`;
    window.editor.replaceSelection(attrs);
}

export function addPopupTemplate() {
    const attrs = `<span class="self-popup" onclick="Survey.uidialog.make($(this).next('.popup-content'), {width: Math.min(320, $(window).width()), height: Math.min(240, $(window).height()), title: ''} );">(POP-UP TEXT HERE)</span><div class="popup-content">(POP-UP CONTENT HERE)</div>`;
    window.editor.replaceSelection(attrs);
}

export function addvStatusVirtual() {
    window.editor.replaceSelection(VSTATUS)
}

export function addvChange() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    window.editor.replaceSelection(vChange(formattedDate).trim());
}

export function addShuffleRowsVirtual() {
    window.editor.replaceSelection(SHUFFLE_ROWS_VIRTUAL)
}
