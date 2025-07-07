// STYLES FUNCTIONS
function groupStylesByPrefix(definitions) {
    const groups = {};

    definitions.forEach(({
            label
        }) => {
        const [prefix] = label.split(".");
        if (!groups[prefix])
            groups[prefix] = [];
        groups[prefix].push(label);
    });

    // Sort groups alphabetically, then each group’s labels
    Object.keys(groups).forEach(prefix => {
        groups[prefix].sort((a, b) => a.localeCompare(b));
    });

    return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)));
}
function getSurveyStyles() {
    mode = ` mode="${document.getElementById("styleDropdownMode").value}"` || "";
    return SURVEY_STYLE_DEFINITIONS.map(({
            label,
            body
        }) => ({
            label,
            value: `<style name="${label}"${mode}><![CDATA[\n${body}\n]]></style>`
        }));
}

// styles elements and attributes
function addNewStyleBlank() {
    const selectedText = getInputOrLine();
    const xmlContent = `<style name=""> <![CDATA[

]]></style>`;
    window.editor.replaceSelection(xmlContent);
}

function addNewStyleBlankwithLabel() {
    const selectedText = getInputOrLine();
    const xmlContent = `<style name="" label=""> <![CDATA[

]]></style>`;
    window.editor.replaceSelection(xmlContent);
}

function addStyleCopy() {
    const selectedText = getInputOrLine();
    const xmlContent = `<style copy=""/>`;
    window.editor.replaceSelection(xmlContent);
}

function addSurveyWideCSS() {
    const selectedText = getInputOrLine();
    const xmlContent = `<style mode="after" name="respview.client.css"><![CDATA[
<style type="text/css">
${selectedText}
</style>
]]></style>`;
    window.editor.replaceSelection(xmlContent);
}

function addSurveyWideJS() {
    const selectedText = getInputOrLine();
    const xmlContent = `<style mode="after" name="respview.client.js"> <![CDATA[
<script>
${selectedText}
</script>
]]></style>`;
    window.editor.replaceSelection(xmlContent);
}

function addQuestionSpecificCSS() {
    const selectedText = getInputOrLine();
    const xmlContent = `<style name="page.head"><![CDATA[
<style type="text/css">
#question_$(this.label) {

}
</style>
]]></style>`;
    window.editor.replaceSelection(xmlContent);
}

function addQuestionSpecificJSAfterQ() {
    const selectedText = getInputOrLine();
    const xmlContent = `<style name="question.footer" mode="after" wrap="ready" ><![CDATA[
let $q = $ ("#question_$(this.label)");
]]></style>`;
    window.editor.replaceSelection(xmlContent);
}

function addQuestionSpecificJSInHead() {
    const selectedText = getInputOrLine();
    const xmlContent = `<style name="page.head" wrap="ready" ><![CDATA[
let $q = $ ("#question_$(this.label)");
]]></style>`;
    window.editor.replaceSelection(xmlContent);
}
