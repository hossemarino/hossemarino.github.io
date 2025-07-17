// STYLES FUNCTIONS
function groupStylesByPrefix(definitions) {
    const groups = {};
    definitions.forEach(({ label })=>{
        const [prefix] = label.split(".");
        if (!groups[prefix]) groups[prefix] = [];
        groups[prefix].push(label);
    });
    // Sort groups alphabetically, then each group’s labels
    Object.keys(groups).forEach((prefix)=>{
        groups[prefix].sort((a, b)=>a.localeCompare(b));
    });
    return Object.fromEntries(Object.entries(groups).sort(([a], [b])=>a.localeCompare(b)));
}
function getSurveyStyles() {
    mode = ` mode="${document.getElementById("styleDropdownMode").value}"` || "";
    return SURVEY_STYLE_DEFINITIONS.map(({ label, body })=>({
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
// pretest labels display
function addPretestLabelsDisplay() {
    const xmlContent = `<style cond="list=='0'" arg:html_lbls="0" arg:qn_lbls="1" mode="after" name="respview.client.js"><![CDATA[
<script>
$ (document).ready(function(){
	//Show question labels
	if('$(qn_lbls)' == 1){
		$ ('form#primary').find('div[id^="question_"]').each(function(){
			$ (this).find('.question-text').prepend($ (this).attr('id').replace('question_','') + '. ');
		})
	}
	
	//Show <html> labels
	if('$(html_lbls)' == 1){
		$ ('form#primary').find('div[id^="comment_"]').each(function(){
			$ (this).find('.comment-text').prepend($ (this).attr('id').replace('comment_','') + '. ');
		})
	}
});
</script>
]]></style>
`;
    window.editor.replaceSelection(xmlContent);
}
function addLeftBlankLegend() {
    const selectedText = getInputOrLine();
    const xmlContent = `  <res label="leftLegend">${selectedText}</res>
  <style name="question.left-blank-legend"><![CDATA[
<$(tag) class="pseudo-col-legend nonempty cell">\${res["%s,leftLegend" % this.label]}</$(tag)>
]]></style>`;
    window.editor.replaceSelection(xmlContent);
}
function addMaxDiff() {
    const xmlContent = `
<style name="question.top-legend"> <![CDATA[
\\@if ec.simpleList
    $(legends)
\\@else
\\@if this.styles.ss.colLegendHeight
    <\$(tag) class="row row-col-legends row-col-legends-top \${"mobile-top-row-legend " if mobileOnly else ""}\${"GtTenColumns " if ec.colCount > 10 else ""}colCount-\$(colCount)" style="height:\${this.styles.ss.colLegendHeight};">
\\@else
    <\$(tag) class="row row-col-legends row-col-legends-top \${"mobile-top-row-legend " if mobileOnly else ""}\${"GtTenColumns " if ec.colCount > 10 else ""}colCount-\$(colCount)">
\\@endif
    \${legends.split("</th>")[0]}</th>
    \$(left)
    \${legends.split("</th>")[1]}</th>
</\$(tag)>
\\@if not simple
</tbody>
<tbody>
\\@endif
\\@endif
]]></style>
<style name="question.row"> <![CDATA[
\\@if ec.simpleList
\$(elements)
\\@else
\\@if this.styles.ss.rowHeight
    <\$(tag) class="row row-elements \$(style) colCount-\$(colCount)" style="height:\${this.styles.ss.rowHeight};">
\\@else
    <\$(tag) class="row row-elements \$(style) colCount-\$(colCount)">
\\@endif
\${elements.split("</td>")[0]}</td>
\$(left)
\${elements.split("</td>")[1]}</td>
</\$(tag)>
\\@endif
]]></style>

`;
    window.editor.replaceSelection(xmlContent);
}
function addColFixDeclaration() {
    const xmlContent = `<style label="colFix" name="question.element"> <![CDATA[
\@if ec.simpleList
<div class="element \$(rowStyle) \$(levels) \$(extraClasses) \${col.group.styles.ss.groupClassNames if col.group else (row.group.styles.ss.groupClassNames if row.group else "")} \$(col.styles.ss.colClassNames) \$(row.styles.ss.rowClassNames) \${"clickableCell" if isClickable else ""} row-\${ec.row.label if ec.row.label else "1"} col-\${ec.col.label if ec.col.label else "1"}" data-row="\${ec.row.label if ec.row.label else "1"}" data-col="\${ec.col.label if ec.col.label else "1"}"\$(extra)>
    \${v2_insertStyle('el.label.start')}
    \$(text)
    \${v2_insertStyle('el.label.end')}
</div>
\@else
<\$(tag) \$(headers) class="cell nonempty element \$(levels) \${"desktop" if this.grouping.cols else "mobile"} border-collapse \$(extraClasses) \${col.group.styles.ss.groupClassNames if col.group else (row.group.styles.ss.groupClassNames if row.group else "")} \$(col.styles.ss.colClassNames) \$(row.styles.ss.rowClassNames) \${"clickableCell" if isClickable else ""} row-\${ec.row.label if ec.row.label else "1"} col-\${ec.col.label if ec.col.label else "1"}" data-row="\${ec.row.label if ec.row.label else "1"}" data-col="\${ec.col.label if ec.col.label else "1"}"\$(extra)>
    \${v2_insertStyle('el.label.start')}
    \$(text)
    \${v2_insertStyle('el.label.end')}
</\$(tag)>
\@endif
]]></style>
<style label="colFix" name="el.select.element"> <![CDATA[
<option value="\$(value)" \$(selected) class="\${choice.styles.ss.choiceClassNames if ec.choice else ""} ch-\${choice.label if choice.label else "1"}" data-choice="\${choice.label if choice.label else "1"}">\$(text)</option>
]]></style>`;
    window.editor.replaceSelection(xmlContent);
}
function addColFixCall() {
    const xmlContent = `<style copy="colFix" />`;
    window.editor.replaceSelection(xmlContent);
}

//# sourceMappingURL=survey3.fb4fbbf7.js.map
