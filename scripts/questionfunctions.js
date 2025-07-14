// make radio
function makeRadio() {
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        //  Convert numbering format (e.g., "1.2" → "1_2")
        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        //  Extract label
        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        //  Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        //  Ensure label starts with "Q" if it's numeric
        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        //  Capture title
        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        //  Remove title from input
        input = input.replace(title, "").trim();

        //  Determine comment based on content
        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            console.log(set);
            const is2D = input.includes("<row") && input.includes("<col");
            comment = is2D
                 ? `<comment>${set.radio2d}</comment>\n`
                 : `<comment>${set.radio}</comment>\n`;
        }

        //  Compose final question output
        let xmlItems = input.includes("<comment>")
             ? `<radio label="${label.trim()}">\n  <title>${title.trim()}</title>\n  ${input}\n</radio>\n<suspend/>`
             : `<radio label="${label.trim()}">\n  <title>${title.trim()}</title>\n  ${comment}  ${input}\n</radio>\n<suspend/>`;

        window.editor.replaceSelection(xmlItems)
        return xmlItems;

    } catch (error) {
        console.error("makeRadio clip failed:", error);
        return "";
    }
}

//make rating
function makeRating() {
    let selectedText = getInputOrLine();
    let surveyLanguage = localStorage.getItem("surveyLanguage");

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        let input = selectedText.trim();
        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");
        input = input.replace(/\n\n+/g, "\n");
        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");
        if (!isNaN(label[0])) {
            label = "Q" + label;
        }
        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }
        input = input.replace(title, "").trim();

        let shuffle = "";
        let style = "";
        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            const is2D = input.includes("<row") && input.includes("<col");
            comment = is2D
                 ? `<comment>${set.radio2d}</comment>\n`
                 : `<comment>${set.radio}</comment>\n`;
        }

        if (input.includes("<row") && input.includes("<col")) {
            let sections = input.split("  ");
            sections.forEach(section => {
                if (section.includes("value=")) {
                    shuffle = section.includes("<col") ? ` shuffle="rows"` : ` shuffle="cols"`;
                }
            });
        }

        let xmlItems = input.includes("<comment>")
             ? `<radio label="${label.trim()}"${shuffle}${style} type="rating">\n  <title>${title.trim()}</title>\n  ${input}\n</radio>\n<suspend/>`
             : `<radio label="${label.trim()}"${shuffle}${style} type="rating">\n  <title>${title.trim()}</title>\n  ${comment}  ${input}\n</radio>\n<suspend/>`;

        window.editor.replaceSelection(xmlItems);
        return xmlItems;

    } catch (error) {
        console.error("makeRatingQuestion clip failed:", error);
        return "";
    }
}

// make checkbox
function makeCheckbox() {
    let selectedText = getInputOrLine();
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    const shouldRecode = document.getElementById("ihut_chckbox_recode")?.value === "Yes";

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        input = input.replace(/\n\n+/g, "\n");

        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        input = input.replace(title, "").trim();

        let notaArray = [">None of the above", ">None of these"];
        notaArray.forEach(nota => {
            if (input.includes(nota)) {
                input = input.replace(nota, ` exclusive="1" randomize="0"${nota}`);
            }
        });

        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            comment = `<comment>${set.checkbox}</comment>\n`;
        }

        let xmlItems = input.includes("<comment>")
             ? `<checkbox label="${label.trim()}" atleast="1">\n  <title>${title.trim()}</title>\n  ${input}\n</checkbox>\n<suspend/>`
             : `<checkbox label="${label.trim()}" atleast="1">\n  <title>${title.trim()}</title>\n  ${comment}  ${input}\n</checkbox>\n<suspend/>`;

        if (shouldRecode) {
            const execLabel = label.trim();
            const hiddenTitle = `HIDDEN: record ${label.trim()} answers`;

            const recodeBlock = `\n<text label="h${execLabel}" where="execute,survey,report">
  <title>${hiddenTitle}</title>
  <exec>
chkbox_recode(thisQuestion)
  </exec>
</text>
<suspend/>`;

            xmlItems += `\n${recodeBlock}`;
        }
        window.editor.replaceSelection(xmlItems);
        return xmlItems;
    } catch (error) {
        console.error("makeCheckbox clip failed:", error);
        return "";
    }
}

// make Starrating
function makeStarrating() {
    let selectedText = getInputOrLine();
    let surveyLanguage = localStorage.getItem("surveyLanguage");

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        input = input.replace(/\n\n+/g, "\n");

        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        input = input.replace(title, "").trim();

        let xmlItems = `<select label="${label.trim()}"\n  optional="0"\n  starrating:star_selected_css="color: rgb(107,193,116);"\n  uses="starrating.5">\n  <title>${title.trim()}</title>\n  ${input}\n</select>\n<suspend/>`

            window.editor.replaceSelection(xmlItems);
        return xmlItems;
    } catch (error) {
        console.error("makeStarrating clip failed:", error);
        return "";
    }
}

// make Select
function makeSelect() {
    let selectedText = getInputOrLine();
    let surveyLanguage = localStorage.getItem("surveyLanguage");

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        input = input.replace(/\n\n+/g, "\n");

        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        input = input.replace(title, "").trim();

        let xmlItems = `<select label="${label.trim()}" optional="0">\n  <title>${title.trim()}</title>\n  ${input}\n</select>\n<suspend/>`

            window.editor.replaceSelection(xmlItems);
        return xmlItems;
    } catch (error) {
        console.error("makeSelect clip failed:", error);
        return "";
    }
}

// make Sliderpoints
function makeSliderpoints() {
    let selectedText = getInputOrLine();
    let surveyLanguage = localStorage.getItem("surveyLanguage");

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        input = input.replace(/\n\n+/g, "\n");

        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        input = input.replace(title, "").trim();

        let xmlItems = `<select label="${label.trim()}" \n  optional="0"\n  sliderpoints:handle_css="background-color: rgb(107,193,116);"\n  sliderpoints:legend_selected_css="color: rgb(107,193,116);"\n  ss:questionClassNames="sq-sliderpoints"\n  uses="sliderpoints.3">\n  <title>${title.trim()}</title>\n  ${input}\n</select>\n<suspend/>`

            window.editor.replaceSelection(xmlItems);
        return xmlItems;
    } catch (error) {
        console.error("makeSliderpoints clip failed:", error);
        return "";
    }
}

// make text
function makeText() {
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        // Convert numbering format (e.g., "1.2" → "1_2")
        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        // Extract label
        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        // Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        // Ensure label starts with "Q" if it's numeric
        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        // Capture title
        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        input = input.replace(title, "").trim();

        // Determine comment
        let comment = "";
        const hasComment = input.includes("<comment>");
        if (!hasComment) {
            const set = comments[surveyLanguage] || comments.english;
            comment = `<comment>${set.text}</comment>\n`;
        }

        const bodyContent = input.trim();
        const finalComment = !hasComment ? comment.trim() : "";

        // Compose final output
        let xmlItems = `<text label="${label.trim()}" size="40" optional="0">\n  <title>${title.trim()}</title>\n`;

        if (finalComment || bodyContent) {
            if (finalComment)
                xmlItems += `  ${finalComment}\n`;
            if (bodyContent)
                xmlItems += `  ${bodyContent}\n`;
        }

        xmlItems += `</text>\n<suspend/>`;

        window.editor.replaceSelection(xmlItems);
        return xmlItems;

    } catch (error) {
        console.error("makeText clip failed:", error);
        return "";
    }
}

// make textarea
function makeTextarea() {
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        //  Convert numbering format (e.g., "1.2" → "1_2")
        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        //  Extract label
        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        //  Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        //  Ensure label starts with "Q" if it's numeric
        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        //  Capture title
        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        //  Remove title from input
        input = input.replace(title, "").trim();

        //  Determine comment based on content
        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            comment = `<comment>${set.text}</comment>\n`
        }

        
        //  Trim any blank lines after comment (and entire body if empty)
        const bodyContent = input.trim();
        const needsComment = !input.includes("<comment>");
        const finalComment = needsComment ? `${comment.trim()}\n` : "";

        let xmlItems = `<textarea label="${label.trim()}" optional="0">\n  <title>${title.trim()}</title>\n`;

        if (finalComment || bodyContent) {
            if (finalComment)
                xmlItems += `  ${finalComment}`;
            if (bodyContent)
                xmlItems += `  ${bodyContent}\n`;
        }

        xmlItems += `</textarea>\n<suspend/>`;
        window.editor.replaceSelection(xmlItems)
        return xmlItems;

    } catch (error) {
        console.error("makeTextarea clip failed:", error);
        return "";
    }
}

// make number
function makeNumber() {
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        //  Convert numbering format (e.g., "1.2" → "1_2")
        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        //  Extract label
        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        //  Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        //  Ensure label starts with "Q" if it's numeric
        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        //  Capture title
        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        //  Remove title from input
        input = input.replace(title, "").trim();

        //  Determine comment based on content
        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            comment = `<comment>${set.number}</comment>\n`
        }

        //  Compose final question output
        const bodyContent = input.trim();
        const needsComment = !input.includes("<comment>");
        const finalComment = needsComment ? `${comment.trim()}\n` : "";

        let xmlItems = `<number label="${label.trim()}" size="3" optional="0" verify="range(0,99999)">\n  <title>${title.trim()}</title>\n`;

        if (finalComment || bodyContent) {
            if (finalComment)
                xmlItems += `  ${finalComment}`;
            if (bodyContent)
                xmlItems += `  ${bodyContent}\n`;
        }

        xmlItems += `</number>\n<suspend/>`;

        window.editor.replaceSelection(xmlItems)
        return xmlItems;

    } catch (error) {
        console.error("makeNumber clip failed:", error);
        return "";
    }
}

// make slidernumber
function makeSlidernumber() {
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        //  Convert numbering format (e.g., "1.2" → "1_2")
        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        //  Extract label
        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        //  Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        //  Ensure label starts with "Q" if it's numeric
        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        //  Capture title
        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        //  Remove title from input
        input = input.replace(title, "").trim();

        //  Determine comment based on content
        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            comment = `<comment>${set.slidernumber}</comment>\n`
        }
        const bodyContent = input.trim();
        const needsComment = !input.includes("<comment>");
        const finalComment = needsComment ? `${comment.trim()}\n` : "";
        const legendsBlock = `  <res label="lLegend">LeftLegend Text</res>\n  <res label="mLegend">MidLegend Text</res>\n  <res label="rLegend">RightLegend Text</res>`;

        let xmlItems = `<number label="${label.trim()}"
  size="3"
  optional="0"
  verify="range(0,100)"
  slidernumber:handle_active_css="background: #8de no-repeat; border-color:#8de;"
  slidernumber:handle_css="background: #8de no-repeat; border-color:#8de;"
  slidernumber:handle_offscale_css="background: #8de no-repeat; border-color:#8de;"
  slidernumber:leftLegend="\${res['${label.trim()},lLegend']}"
  slidernumber:midLegend="\${res['${label.trim()},mLegend']}"
  slidernumber:rightLegend="\${res['${label.trim()},rLegend']}"
  slidernumber:track_range_css="background-color: rgb(107,193,116);"
  uses="slidernumber.6">\n  <title>${title.trim()}</title>\n`;

        if (finalComment || bodyContent) {
            if (finalComment)
                xmlItems += `  ${finalComment}`;
            if (bodyContent)
                xmlItems += `  ${bodyContent}\n`;
        }

        xmlItems += `${legendsBlock}\n</number>\n<suspend/>`;
        window.editor.replaceSelection(xmlItems)
        return xmlItems;

    } catch (error) {
        console.error("makeSlidernumber clip failed:", error);
        return "";
    }
}

// make float
function makeFloat() {
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        input = selectedText.trim();

        //  Convert numbering format (e.g., "1.2" → "1_2")
        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        //  Extract label
        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        //  Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        //  Ensure label starts with "Q" if it's numeric
        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        //  Capture title
        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        //  Remove title from input
        input = input.replace(title, "").trim();

        //  Determine comment based on content
        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            comment = `<comment>${set.float}</comment>\n`
        }

        //  Compose final question output
        const bodyContent = input.trim();
        const needsComment = !input.includes("<comment>");
        const finalComment = needsComment ? `${comment.trim()}\n` : "";

        let xmlItems = `<float label="${label.trim()}" size="3" optional="0" range="0,99999">\n  <title>${title.trim()}</title>\n`;

        if (finalComment || bodyContent) {
            if (finalComment)
                xmlItems += `  ${finalComment}`;
            if (bodyContent)
                xmlItems += `  ${bodyContent}\n`;
        }

        xmlItems += `</float>\n<suspend/>`;
        window.editor.replaceSelection(xmlItems)
        return xmlItems;

    } catch (error) {
        console.error("makeNumber clip failed:", error);
        return "";
    }
}

//make autosum
function makeAutosum() {
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    let selectedText = getInputOrLine();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        let input = selectedText.trim();

        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        let openRows = [];
        let openCols = [];
        let validation = "";

        input = input.replace(/\n\n+/g, "\n");

        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        input = input.replace(title, "").trim();

        if (input.includes('open="1"')) {
            let splitInput = input.split("\n");

            splitInput.forEach(inputLine => {
                if (inputLine.includes('open="1"')) {
                    let lineLabel = inputLine.match(/label="([^"]+)"/)?.[1] || "";
                    if (inputLine.includes("<row"))
                        openRows.push(lineLabel);
                    if (inputLine.includes("<col"))
                        openCols.push(lineLabel);
                }
            });

            input = input.replace(/open="1"/g, 'open="1" openOptional="1"');

            validation = `  <validate>`;
            if (openRows.length > 0)
                validation += autosum_validate_rows;
            if (openCols.length > 0)
                validation += autosum_validate_cols;
            validation += `  </validate>\n`;
        }

        let output = input ? `  ${input}\n` : "";
        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            comment = `<comment>${set.number}</comment>\n`
        }

        let xmlItems = input.includes("<comment>")
             ? `<number label="${label.trim()}" verify="range(0,99999)" size="3" optional="1" uses="autosum.5">\n  <title>${title.trim()}</title>\n  ${validation}${output}</number>\n<suspend/>\n\n<exec>\nif ${label.trim()}.displayed:\n\tfor eachRow in ${label.trim()}.rows:\n\t\tfor eachCol in ${label.trim()}.cols:\n\t\t\tif eachRow.displayed and eachCol.displayed and eachRow[eachCol.index].val in ['', None]:\n\t\t\t\teachRow[eachCol.index].val = 0\n</exec>`
             : `<number label="${label.trim()}" verify="range(0,99999)" size="3" optional="1" uses="autosum.5">\n  <title>${title.trim()}</title>\n  ${comment}${validation}${output}</number>\n<suspend/>\n\n<exec>\nif ${label.trim()}.displayed:\n\tfor eachRow in ${label.trim()}.rows:\n\t\tfor eachCol in ${label.trim()}.cols:\n\t\t\tif eachRow.displayed and eachCol.displayed and eachRow[eachCol.index].val in ['', None]:\n\t\t\t\teachRow[eachCol.index].val = 0\n</exec>`;

        window.editor.replaceSelection(xmlItems);
        return xmlItems;

    } catch (error) {
        console.error("makeNumberQuestion clip failed:", error);
        return "";
    }
}

//make autosum percent
function makeAutosumPercent() {
    let surveyLanguage = localStorage.getItem("surveyLanguage");
    let selectedText = getInputOrLine();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        let input = selectedText.trim();

        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        let openRows = [];
        let openCols = [];
        let validation = "";

        input = input.replace(/\n\n+/g, "\n");

        if (!isNaN(label[0])) {
            label = "Q" + label;
        }

        let title = "";
        if (input.includes("@")) {
            title = input.substring(0, input.indexOf("@"));
        } else {
            let markers = ["<row", "<col", "<choice", "<comment", "<group", "<net", "<exec"];
            let indices = markers.map(marker => input.indexOf(marker)).filter(index => index !== -1);
            let inputIndex = indices.length ? Math.min(...indices) : input.length;
            title = input.substring(0, inputIndex);
        }

        input = input.replace(title, "").trim();

        if (input.includes('open="1"')) {
            let splitInput = input.split("\n");

            splitInput.forEach(inputLine => {
                if (inputLine.includes('open="1"')) {
                    let lineLabel = inputLine.match(/label="([^"]+)"/)?.[1] || "";
                    if (inputLine.includes("<row"))
                        openRows.push(lineLabel);
                    if (inputLine.includes("<col"))
                        openCols.push(lineLabel);
                }
            });

            input = input.replace(/open="1"/g, 'open="1" openOptional="1"');

            validation = `  <validate>`;
            if (openRows.length > 0)
                validation += autosum_validate_rows;
            if (openCols.length > 0)
                validation += autosum_validate_cols;
            validation += `  </validate>\n`;
        }

        let output = input ? `  ${input}\n` : "";
        let comment = "";
        if (!input.includes("<comment>")) {
            const set = comments[surveyLanguage] || comments.english;
            comment = `<comment>${set.autosumPercent}</comment>\n`
        }

        let xmlItems = input.includes("<comment>")
             ? `<number label="${label.trim()}" verify="range(0,100)" size="3" optional="1" uses="autosum.5" amount="100" autosum:postText="%">\n  <title>${title.trim()}</title>\n  ${validation}${output}</number>\n<suspend/>\n\n<exec>\nif ${label.trim()}.displayed:\n\tfor eachRow in ${label.trim()}.rows:\n\t\tfor eachCol in ${label.trim()}.cols:\n\t\t\tif eachRow.displayed and eachCol.displayed and eachRow[eachCol.index].val in ['', None]:\n\t\t\t\teachRow[eachCol.index].val = 0\n</exec>`
             : `<number label="${label.trim()}" verify="range(0,100)" size="3" optional="1" uses="autosum.5" amount="100" autosum:postText="%">\n  <title>${title.trim()}</title>\n  ${comment}${validation}${output}</number>\n<suspend/>\n\n<exec>\nif ${label.trim()}.displayed:\n\tfor eachRow in ${label.trim()}.rows:\n\t\tfor eachCol in ${label.trim()}.cols:\n\t\t\tif eachRow.displayed and eachCol.displayed and eachRow[eachCol.index].val in ['', None]:\n\t\t\t\teachRow[eachCol.index].val = 0\n</exec>`;

        window.editor.replaceSelection(xmlItems);
        return xmlItems;

    } catch (error) {
        console.error("makeNumberQuestion clip failed:", error);
        return "";
    }
}

// make comment (<html>)
function makeSurveyComment() {
    let selectedText = getInputOrLine();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        let input = selectedText.trim();

        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        let labelMatch = input.match(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/);
        let label = labelMatch ? labelMatch[1] : "Unknown";
        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        let xmlItems = `<html label="${label.trim()}" where="survey">${input}</html>`;

        window.editor.replaceSelection(xmlItems);
        return xmlItems;

    } catch (error) {
        console.error("makeSurveyComment clip failed:", error);
        return "";
    }
}

//make pipe
function makePipe() {
    const selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        let input = selectedText.trim();

        // Remove blank lines
        input = input.replace(/\n\n+/g, "\n");

        // Check if there is at least one <case>
        if (!input.includes("<case")) {
            alert("<pipe> tag requires at least one <case> element.");
            return;
        }
        const output = `<pipe label="" capture="">\n  ${input}\n</pipe>\n`;
        window.editor.replaceSelection(output);
        return output;

    } catch (error) {
        console.error("makePipe clip failed:", error);
        alert("An error occurred while generating the <pipe> tag.");
        return "";
    }
}

// make comment (<html>)
function makeNote() {
    let selectedText = getInputOrLine();

    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }

    try {
        let input = selectedText.trim();

        input = input.replace(/^(\w?\d+)\.(\d+)/, "$1_$2");

        input = input.replace(/^([a-zA-Z0-9-_]+)(\.|:|\)|\s)/, "");

        let xmlItems = `<note>\n${input}\n</note>\n`;

        window.editor.replaceSelection(xmlItems);
        return xmlItems;

    } catch (error) {
        console.error("makeNote clip failed:", error);
        return "";
    }
}
