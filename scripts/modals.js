//Modal handling
const modalDefinitions = {
    "tab": {
        title: "Create a New Tab",
        section: ".new-tab",
        focus: "#tab_name",
        init: () => document.getElementById("tabError").style.display = "none"
    },

    "delete-tab": {
        title: "Confirm Tab Deletion",
        section: ".delete-tab",
        init: (tabName) => {
            document.getElementById("tabToDeleteName").textContent = tabName;
            tabPendingDeletion = tabName;
        }
    },
    "delete-all-data": {
        title: "Delete All Data",
        section: ".delete-all-data",
        init: () => document.getElementById("confirmDeleteAll").onclick = () => deleteAllData()
    },
    "new-survey": {
        title: "Create a New Survey",
        section: ".new-survey",
        init: () => document.getElementById("genXML").onclick = () => validateFormAndGenerateXML("survey")
    },
    "new-ihut": {
        title: "Create a New IHUT",
        section: ".new-ihut",
        init: () => document.getElementById("genIHUTXML").onclick = () => validateFormAndGenerateXML("ihut")
    },
    "new-mouseover": {
        title: "Mouseover",
        section: ".new-mouseover",
        init: () => document.getElementById("genMO").onclick = () => generateMO()
    },
    "new-popup": {
        title: "Pop-up",
        section: ".new-popup",
        init: () => document.getElementById("genPopup").onclick = () => generatePopup()
    },
    "random-order-tracker": {
        title: "Random Order Tracker",
        section: ".random-order-tracker",
        init: () => document.getElementById("genRandomOrder").onclick = () => generateRandomOrderTracker()
    },
    "dupe-check": {
        title: "URL Variable Dupe check",
        section: ".dupe-check",
        init: () => document.getElementById("genDupeCheck").onclick = () => generateDupeCheck()
    },

    "new-style": {
        title: "Insert a Survey Style",
        section: ".new-style",
        init: () => document.getElementById("genNewStyle").onclick = () => genNewStyle()
    },
    "pipe-in-number": {
        title: "Pipe Number question in table",
        section: ".pipe-in-number",
        init: () => document.getElementById("genPipeNumber").onclick = () => genPipeNumber()
    },
    "disable-continue": {
        title: "Disable Continue Button",
        section: ".disable-continue",
        init: () => document.getElementById("genDisableContinue").onclick = () => genDisableContinue()
    },
};

function openModal(purpose, tabName = "") {
    const modalEl = document.getElementById("surveyModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    const title = document.getElementById("modalTitle");

    document.querySelectorAll(".modal-section").forEach(section => {
        section.style.display = "none";
    });

    const config = modalDefinitions[purpose];
    if (!config) {
        console.warn(`Unknown modal purpose: ${purpose}`);
        return;
    }

    title.textContent = config.title;
    document.querySelector(config.section).style.display = "block";

    if (config.init)
        config.init(tabName);

    let focusInput = config.focus ? document.querySelector(config.focus) : null;

    modalEl.removeEventListener("shown.bs.modal", modalEl._focusListener);
    modalEl._focusListener = () => {
        if (focusInput) {
            focusInput.focus();
            focusInput.select();
        }
    };
    modalEl.addEventListener("shown.bs.modal", modalEl._focusListener);

    modal.show();
}
/*
// OLD VERSION
function openModal(purpose, tabName = "") {
const modalEl = document.getElementById("surveyModal");
const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
const title = document.getElementById("modalTitle");

document.querySelectorAll(".modal-section").forEach(section => {
section.style.display = "none";
});

let focusInput = null;

if (purpose === "tab") {
title.textContent = "Create a New Tab";
document.querySelector(".new-tab").style.display = "block";
document.getElementById("tabError").style.display = "none";
focusInput = document.getElementById("tab_name");
} else if (purpose === "new-survey") {
title.textContent = "Create a New Survey";
document.querySelector(".new-survey").style.display = "block";
document.getElementById("genXML").onclick = () => validateFormAndGenerateXML("survey");
} else if (purpose === "delete-tab") {
title.textContent = "Confirm Tab Deletion";
document.querySelector(".delete-tab").style.display = "block";
document.getElementById("tabToDeleteName").textContent = tabName;
tabPendingDeletion = tabName;
} else if (purpose === "new-ihut") {
title.textContent = "Create a New IHUT";
document.querySelector(".new-ihut").style.display = "block";
document.getElementById("genIHUTXML").onclick = () => validateFormAndGenerateXML("ihut");
} else if (purpose === "new-mouseover") {
title.textContent = "Mouseover";
document.querySelector(".new-mouseover").style.display = "block";
document.getElementById("genMO").onclick = () => generateMO();
} else if (purpose === "new-popup") {
title.textContent = "Pop-up";
document.querySelector(".new-popup").style.display = "block";
document.getElementById("genPopup").onclick = () => generatePopup();
} else if (purpose === "random-order-tracker") {
title.textContent = "Pop-up";
document.querySelector(".random-order-tracker").style.display = "block";
document.getElementById("genRandomOrder").onclick = () => generateRandomOrderTracker();
}

// Clean up previous listeners to avoid duplicates
modalEl.removeEventListener("shown.bs.modal", modalEl._focusListener);

modalEl._focusListener = () => {
if (focusInput) {
focusInput.focus();
focusInput.select();
}
};

modalEl.addEventListener("shown.bs.modal", modalEl._focusListener);
modal.show();
}
 */

function deleteAllData() {
    localStorage.clear();
    location.reload(); // Optional: refresh to reset editor state
}

function validateFormAndGenerateXML(mode) {
    const formId = mode === 'ihut' ? '#ihutSurveyForm' : '#surveyForm';
    const inputs = document.querySelectorAll(`${formId} input, ${formId} select`);
    let allFilled = true;

    inputs.forEach(input => {
        const inputId = input.id;
        const value = input.value.trim();

        // IHUT-specific conditional skip
        if (mode === 'ihut' &&
            (inputId === "ihut_QBAPI" || inputId === "ihut_eventID")) {

            const setupType = document.getElementById("ihut_setup_type").value;
            const isQualBoardAPI = setupType === "QualBoard - status API" || setupType === "QualBoard - user creation API";

            if (!isQualBoardAPI && !value) {
                input.classList.remove("is-invalid"); // Not required
                return;
            }
        }

        if (!value) {
            allFilled = false;
            input.classList.add("is-invalid");
        } else {
            input.classList.remove("is-invalid");
        }
    });

    if (!allFilled) {
        alert("Please fill in all required fields.");
        return;
    }

    if (mode === 'survey')
        generateXML();
    else if (mode === 'ihut')
        generateIHUTXML();

}

function generateXML() {
    const surveyNumber = document.getElementById("survey_number").value;
    const clientName = document.getElementById("client_name").value;
    const surveyName = document.getElementById("survey_name").value;
    const secretSampleCode = document.getElementById("secret_sample_code").value;
    const s2s = document.getElementById("s2s").value;
    const stl_wf = document.getElementById("stl_wf").value;
    const portal = document.getElementById("portal").value;
    const useu = document.getElementById("useu").value;
    const surveyLanguage = document.getElementById("survey_language").value;

    let langCode = "";
    if (useu === "US" || surveyLanguage === "Base English") {
        langCode = "english";
        setSurveyLanguage('english');
    } else if (useu === "EU" && surveyLanguage === "Base German") {
        langCode = "german";
        setSurveyLanguage('german');

    } else if (useu === "EU" && surveyLanguage === "Base French") {
        langCode = "french";
        setSurveyLanguage('french');

    }
    console.log(langCode)
    let portalLinks = "";
    let logos = "";

    if (portal === "Eli Lilly") {
        portalLinks = LILLY[0];
        logos = LILLY[1]
    }
    if (portal === "Schlesinger") {
        portalLinks = SAGO[0];
        logos = SAGO[1];
    }

    let s2sText = s2s === "No" ? "" : `${S2S_TEXT}`;

    let stlwftext = stl_wf === "No" ? "" : `${STL_WF_TEXT}`;

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<survey 
  alt="${surveyNumber} - ${clientName} - ${surveyName}"
  autosave="1"
  autosaveKey="identifier,code,CRID"
  browserDupes=""
  builderCompatible="1"
  compat="153"
  delphi="1"
  watermark:fontSize="16"
  displayOnError="all"
  extraVariables="record,decLang,list,userAgent,flashDetected,api,dupe"
  featurephoneNotAllowedMessage="${SURVEY_SETUP[langCode].featurephoneNotAllowedMessage}"
  fir="on"
  html:showNumber="0"
  mobile="compat"
  mobileDevices="smartphone,tablet,desktop"
  name="Survey"
  setup="term,decLang,quota,time"
  ss:disableBackButton="1"
  ss:hideProgressBar="0"
  ss:listDisplay="1"
  lang="${langCode}"
  ${portalLinks}
  state="testing">
  
<res label="sys_surveyCompleted">&amp;nbsp;</res>
<res label="privacy">${SURVEY_SETUP[langCode].privacyText}</res>
<res label="helpText">${SURVEY_SETUP[langCode].helpText}</res>
<res label="dialogClose">${SURVEY_SETUP[langCode].dialogClose}</res>

<samplesources default="1">
${SURVEY_SETUP[langCode].testRedirects}

  <samplesource list="2">
    <title>SAGO Live</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="vendorid"/>
    <var name="RID" unique="1"/>
    <var name="CRID" unique="1"/>
    <var name="Matching_Unique_ID"/>
    <var name="VRID"/>
    <exit cond="terminated" url="https://surveys.sample-cube.com/ending/?RS=3&amp;RID=\${RID}"/>
    <exit cond="qualified" url="https://surveys.sample-cube.com/ending/?RS=1&amp;RID=\${RID}&amp;secret=${secretSampleCode}"/>
    <exit cond="overquota" url="https://surveys.sample-cube.com/ending/?RS=2&amp;RID=\${RID}"/>
  </samplesource>
</samplesources>

<radio 
  label="vvendorid">
  <title>vendorid</title>
  <virtual>
#### ADD NEW VENDOR IDS AS NEW ROWS IN THIS QUESTION WITH THE RELEVANT VALUE 
bucketize(vendorid)
  </virtual>

  <row label="none">No vendorid Variable</row>
  <row label="1234">FocusGroup Consumer US</row>
  <row label="1235">FocusGroup Healthcare US</row>
  <row label="other">Other</row>
</radio>

${SAGO_CSS}

${UI_DIALOG_CLOSE}
${GROUP_SHUFFLE}

${logos}
${SURVEY_SETUP[langCode].privacyPolicy(surveyNumber)}
<style cond="list not in ['0','1'] or (list in ['2'] and vendorid not in ['1234','1235'])" name="survey.logo"/>
<style cond="list not in ['0','1'] or (list in ['2'] and vendorid not in ['1234','1235'])" name="survey.respview.footer.support"/>
${COPY_PROTECTION}
${PRETEST_LABELS_DISPLAY}

<style cond="list!='0'" name="button.goback"/>

<suspend/>

<html label="list1_live" cond="list == '1' and gv.survey.root.state.live" final="1" where="survey">You are missing information in the URL. Please verify the URL with the original invite.</html>

<note>First survey screen: Consent page and ResearchDefender</note>

<label label="template_point_1" />

${CONSENT_QUESTION}
${RESDEF}

<note>Second screen: Rest of survey</note>

<label label="template_point_2" />
<note>/
/ ********************************************************************* /
/ ********************************************************************* /
/ ******************* INSERT REST OF SURVEY HERE ********************** /
/ ********************************************************************* /
/ ********************************************************************* /
/</note>



${REVIEW_QUESTION}
${s2sText}
${stlwftext}
</survey>`;
    editor = getActiveEditor();
    if (editor) {
        editor.setValue(xmlContent);
        setTimeout(() => {
            editor.focus();
            setCursorAfterLine(517);
        }, 100);
    } else {
        console.error("CodeMirror editor not initialized!");
    }

    let modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal) {
        modal.hide();
    }

}

function generateIHUTXML() {
    const get = (id) => document.getElementById(id).value;

    const xmlData = {
        hutNumber: get("ihut_survey_number"),
        clientName: get("ihut_client_name"),
        projectName: get("ihut_survey_name"),
        surveyType: get("ihut_survey_type"),
        setupType: get("ihut_setup_type"),
        qbApiKey: get("ihut_QBAPI"),
        eventId: get("ihut_eventID"),
        redirects: get("ihut_redirects"),
        recodeCheckbox: get("ihut_chckbox_recode"),
        verity: get("ihut_verity"),
        contactQuestion: get("ihut_contact_question")
    };
    console.log(xmlData);
    let OTS = xmlData.setupType == "QualMobile (OTS)" ? true : false;
    console.log(OTS);
    let extraVariables = '';

    if (xmlData.surveyType === "Questionnaire/Diary") {
        extraVariables = `  extraVariables="record,decLang,list,userAgent,flashDetected"`
    } else {
        extraVariables = `  extraVariables="record,decLang,list,userAgent,flashDetected,api,dupe"`
    }

    let qbres = xmlData.setupType !== "QualBoard - user creation API" ? "" : `${QUALBOARD_USER_CREATION_API_RES}`;

    let redirects = ``;

    let redirecrts_contd = ``;

    if (xmlData.surveyType === "CLT") {
        redirects = `
  <samplesource list="2">
    <title>Sago Live</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="vendorid"/>
    <var name="code" unique="1"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for taking our survey. Your efforts are greatly appreciated! 
    Please raise your hand and let your Server know you have answered all the questions so they may initial your index card to bring to the front desk to check out.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
    } else if (xmlData.redirects === "SAMS/Complex Surveys(CS)") {
        redirects = `
  <samplesource list="2">
    <title>SAMS / Complex Survey (CS)</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="ESERID" unique="1"/>
    <var name="samsid" required="1"/>
    <exit cond="terminated" url="https://survey3.schlesingergroup.com/survey/forms/redirect.aspx?STATUS=T&amp;ESERID=\${ESERID}"/>
    <exit cond="qualified" url="https://survey3.schlesingergroup.com/survey/forms/redirect.aspx?STATUS=S&amp;ESERID=\${ESERID}" timeout="10">On the next screen, you will be asked to schedule for an appointment. This is NOT a scheduled date and time you need to be available but only a PLACEHOLDER, so our system includes you as qualified for the study.  Additionally, please note, we will NOT reach out via phone to confirm you but will send you confirmation details via email only and No Phone Call.</exit>
    <exit cond="overquota" url="https://survey3.schlesingergroup.com/survey/forms/redirect.aspx?STATUS=Q&amp;ESERID=\${ESERID}"/>
  </samplesource>`;
    } else if (xmlData.redirects === "Esearch") {
        redirects = `
  <samplesource list="2">
    <title>Esearch</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="code" unique="1"/>
    <exit cond="terminated" url="http://www.esearch.com/survey/message.epl?surveyID=SG021023-POD&amp;response=2&amp;userID=\${code}"/>
    <exit cond="qualified" url=http://www.esearch.com/survey/message.epl?surveyID=SG021023-POD&amp;response=2&amp;userID=\${code}"/>
    <exit cond="overquota" url="http://www.esearch.com/survey/message.epl?surveyID=SG021023-POD&amp;response=1&amp;userID=\${code}"/>
  </samplesource>`;
    } else if (OTS) {
        redirects = `
  <samplesource list="2">
    <title>Default End Page Text OTS</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="cf1" required="1"/>
    <var name="ParticipantQuestionID" unique="1"/>
    <var name="participantID" required="1"/>
    <var name="assignmentID" required="1"/>
    <exit cond="terminated">OOPS! Something went wrong. Please send us an email at <a href="mailto:ihuthelp@sago.com?Subject=${xmlData.hutNumber}" target="_blank">ihuthelp@sago.com</a> and include a screenshot of the error message you received. </exit>
    <exit cond="qualified">Thank you for your participation and for sharing your opinions with us! Your efforts are greatly appreciated.<br/><br/><div class="closing-screen">To ensure your responses are saved, please click the white "X" in the top right-hand corner of your screen. Once clicked, you will return to the QualMobile app to complete the assignment.</div></exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
    } else {
        redirects = `
  <samplesource list="2">
    <title>Default End Page Text</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="code"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for your participation and sharing your opinions with us! Your efforts are greatly appreciated. You may close your browser window now.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
    }

    if (xmlData.setupType === "QualBoard - status API") {
        redirecrts_contd = `
  <samplesource list="3">
    <title>QualBoard</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="Rn" required="1"/>
    <var name="userId" required="1"/>
    <var name="eventId" required="1"/>
    <var name="questionId" required="1"/>
    <var name="sesskey" unique="1"/>
    <var name="surveyNumber"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified" url="https://qualboard.com/participate/#/projects/[$externalParameters.projectId$]/group-discussions/\${eventId}/"/>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
    } else if (xmlData.setupType === "QualBoard - user creation API") {
        redirecrts_contd = `
  <samplesource list="3">
    <title>QualBoard</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="Rn" required="1"/>
    <var name="userId" required="1"/>
    <var name="eventId" required="1"/>
    <var name="questionId" required="1"/>
    <var name="sesskey" unique="1"/>
    <var name="surveyNumber"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for your participation and sharing your opinions with us! Your efforts are greatly appreciated. You may close your browser window now.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>`;
    }

    let ihutCSS = ``;

    if (xmlData.surveyType !== "Screener" && OTS) {
        ihutCSS = IHUT_OTS_CSS;
    }

    let consentQ = '';
    if (xmlData.surveyType !== "CLT") {
        consentQ = CONSENT_QUESTION
            if (xmlData.surveyType !== "Screener")
                suspend = '<suspend/>'
    }

    let cltNote = ``;
    if (xmlData.surveyType === "CLT") {
        cltNote = CLTNOTE;
    }
    let ots_api = ``;
    let restOfSurvey_1 = ``;
    let restOfSurvey_2 = ``;
    let restOfSurvey_3 = ``;
    let QualBoardAPI = ``;

    if (xmlData.surveyType !== "CLT") {
        if (xmlData.setupType === 'QualBoard - status API') {
            QualBoardAPI = `<block label="bQualBoard">
  <logic label="QualBoard" api:method="POST" api:url="https://api.qualboard.com/api/events/\${eventId}/questions/\${questionId}/external-redirect-callback?userId=\${userId}&amp;X-External-Redirect=${xmlData.qbApiKey}" uses="api.1"/>
  <text 
   label="QualBoard_LIVE_RESPONSE"
   size="40"
   sst="0"
   where="execute,survey,report">
    <title>Hidden: QualBoard API Live response if any.</title>
    <exec>
tq = thisQuestion

# Initialize
tq.val = None

response = QualBoard.r

print response.encode('utf-8-sig')
    </exec>

  </text>

  <suspend/>
</block>`;
        }

        if (xmlData.setupType === 'QualBoard - user creation API') {
            restOfSurvey_1 = CONTACT_QUESTION_IHUT;
            restOfSurvey_1 += `<textarea
  label="QUALBOARD_DATA"
  where="execute,survey,report">
  <title>Hidden: Qual Board API DATA</title>
  <exec>
tq = thisQuestion

# Initialize
tq.rHead.val = None
tq.rData.val = None

p.aHead = {'contentType': 'application/x-www-form-urlencoded; charset=UTF-8'}

p.aData = {
'Email'           : '%s' % contact.r9.unsafe_val,
'FirstName'       : '%s' % contact.r1.unsafe_val,
'LastName'         : '%s' % contact.r2.unsafe_val,
'DisplayName'       : '%s' % contact.r1.unsafe_val,
'ApiKey'            : '${xmlData.qbApiKey}',
'SetTempPassword'   : 'True',
'ResponseFormat'    : '0',
'LanguageCode'      : 'en',
'EventId'           : '${xmlData.eventId}',
'GroupTags'         : '',
}

p.logicURL = "Email=%(Email)s&amp;FirstName=%(FirstName)s&amp;LastName=%(LastName)s&amp;DisplayName=%(DisplayName)s&amp;ApiKey=%(ApiKey)s&amp;SetTempPassword=%(SetTempPassword)s&amp;ResponseFormat=%(ResponseFormat)s&amp;LanguageCode=%(LanguageCode)s&amp;EventId=%(EventId)s&amp;GroupTags=%(GroupTags)s" % p.aData

print p.logicURL

tq.rHead.val = str(p.aHead).replace("'",'*').replace('*','"')
tq.rData.val = str(p.aData).replace("'",'*').replace('*','"')
  </exec>

  <row label="rHead">aHead</row>
  <row label="rData">aData</row>
</textarea>

<suspend/>

<logic label="QualBoard" api:data="QUALBOARD_DATA.rData.unsafe_val" api:headers="{'contentType': 'application/x-www-form-urlencoded;charset=UTF-8', 'Authorization': '${xmlData.qbApiKey}'}" api:method="GET" api:params="{'withCredentials': 'true', 'dataType':  'html'}" api:url="https://api.qualboard.com/api/v4/users/import?\${p.logicURL}" uses="api.1"/>
<text 
  label="QUALBOARD_RESPONSE"
  size="40"
  sst="0"
  where="execute,survey,report">
  <title>Hidden: API response.</title>
  <exec>
tq = thisQuestion

# Initialize
for each_row in tq.rows:
	each_row.val = None  

response = QualBoard.r
print response


for key, item in response.items():
	print key, item

for each_row in tq.rows:
	if response[each_row.label]:
		each_row.val = response[each_row.label]

print QualBoard.status
  </exec>

  <row label="isNewUser">isNewUser</row>
  <row label="password">password</row>
  <row label="userId">userId</row>
  <row label="error">error</row>
</text>

<suspend/>

<block label="respondent_email" cond="QUALBOARD_RESPONSE.isNewUser.val == 'True'">
  <pipe label="pass_pipe" capture="">
    <case label="r1" cond="QUALBOARD_RESPONSE.password.val not in ['', None]">\${QUALBOARD_RESPONSE.password.val}</case>
    <case label="r2" cond="1">None</case></pipe>
  <logic label="email" email:company="Qualtrics" email:content="\${res.qual_email}" email:recipient="\${contact.r9.unsafe_val}" email:sender="support@qualboard.com" email:subject="Welcome to QualBoard" uses="email.1"/>
</block>
`;
        }

        if (xmlData.surveyType === "Questionnaire/Diary" && OTS) {
            ots_api = OTS_API
        }

        if (xmlData.surveyType === "Screener" && OTS) {
            restOfSurvey_2 = CONTACT_QUESTION_IHUT;
            restOfSurvey_2 += OTS_SCREENER_PART_1;

            if (xmlData.verity === "Yes") {
                restOfSurvey_2 += VERITY_API;
            }

            restOfSurvey_2 += OTS_SCREENER_PART_2(xmlData.hutNumber);
        }

        if (xmlData.verity === "Yes" && xmlData.setupType !== "QualBoard - user creation API" && xmlData.contactQuestion === "Yes") {
            restOfSurvey_3 = CONTACT_QUESTION_IHUT;
            if (!restOfSurvey_2.includes(VERITY_API)) {
                restOfSurvey_3 += VERITY_API;
            }

        }
    }

    const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<survey 
  alt="${xmlData.hutNumber} - ${xmlData.clientName} - ${xmlData.projectName}"
  autosave="1"
  autosaveKey="code,sesskey,ESERID,ParticipantQuestionID"
  browserDupes=""
  builderCompatible="1"
  compat="153"
  delphi="1"
  watermark:fontSize="16"
  displayOnError="all"
${extraVariables}
  featurephoneNotAllowedMessage="The device you are using is not allowed to take this survey."
  fir="on"
  html:showNumber="0"
  mobile="compat"
  mobileDevices="smartphone,tablet,desktop"
  name="Survey"
  setup="term,decLang,quota,time"
  ss:disableBackButton="1"
  ss:hideProgressBar="0"
  ss:listDisplay="1"
  ss:includeJS="https://surveys.sago.com/survey/selfserve/1819/jtsfiles/jts_static_108.js"
  ss:includeCSS="https://surveys.sago.com/survey/selfserve/1819/jtsfiles/jts_static_104.css"
  state="testing">

<res label="privacy">Privacy Policy</res>
<res label="helpText">Help</res>
<res label="dialogClose">Close</res>
${qbres}
<samplesources default="1">
  <samplesource list="1">
    <title>Sago Test</title>
    <invalid>You are missing information in the URL. Please verify the URL with the original invite.</invalid>
    <completed>It seems you have already entered this survey.</completed>
    <var name="code"/>
    <exit cond="terminated">Thank you for your participation! Unfortunately, you haven't qualified this time but there will be another opportunity for you soon! You may close your browser window now.</exit>
    <exit cond="qualified">Thank you for your participation and sharing your opinions with us! Your efforts are greatly appreciated. You may close your browser window now.</exit>
    <exit cond="overquota">Thank you for your willingness to participate. You did not qualify for this study. More members responded than expected and we have reached our quotas. We hope that you will consider participating in future research. You may close your browser window now.</exit>
  </samplesource>
${redirects}
${redirecrts_contd}
</samplesources>

${IHUT_CSS}

${ihutCSS}

${UI_DIALOG_CLOSE}

${GROUP_SHUFFLE}

${CHECKBOX_RECODE}

${IHUT_LOGO}

<style name="survey.respview.footer.support"><![CDATA[
<a href="https://www.focusgroup.com/Page/PrivacyPolicy" target="_blank">\${res.privacy}</a> - <a href="mailto:help@focusgroup.com?Subject=${xmlData.hutNumber}" target="_blank">\${res.helpText}</a>
]]></style>

${COPY_PROTECTION}

${PRETEST_LABELS_DISPLAY}

<style cond="list!='0'" name="button.goback"/>

<suspend/>

<html label="list1_live" cond="list == '1' and gv.survey.root.state.live" final="1" where="survey">You are missing information in the URL. Please verify the URL with the original invite.</html>

<note>First survey screen: Intro message</note>

${consentQ}

<label label="template_point_2" />
<note>/
/ ********************************************************************* /
/ ********************************************************************* /
/ ******************* INSERT REST OF SURVEY HERE ********************** /
/ ********************************************************************* /
/ ********************************************************************* /
/</note>




${cltNote}

${restOfSurvey_1}

${ots_api}

${restOfSurvey_2}

${restOfSurvey_3}

${QualBoardAPI}
</survey>`.trim();
    editor = getActiveEditor();
    editor.setValue(xml);
    let modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal) {
        modal.hide();
    }
}

function generateMO() {
    const get = (id) => document.getElementById(id).value.trim();

    const textImage = get("moTextImage") === "Yes";
    const protectPopupImage = get("moImageProtect") === "Yes";
    const text = get("moName");

    const descImage = get("moContentImage") === "Yes";
    const descImageProtected = get("moContentImageProtect") === "Yes";
    const desc = get("moContent");

    const surveyPath = "${gv.survey.path}"; // Template literal placeholder

    let textHTML = "";
    let descHTML = "";

    // Build mouseover label
    if (!textImage) {
        textHTML = text;
    } else {
        textHTML = protectPopupImage
             ? `[protected ${text} placement=top]`
             : `<img src="/survey/${surveyPath}/${text}" />`;
    }

    // Build mouseover content
    if (!descImage) {
        descHTML = desc;
    } else {
        descHTML = descImageProtected
             ? `[protected ${desc} placement=top]`
             : `<img src="/survey/${surveyPath}/${desc}" />`;
    }

    const output =
`<span class="self-tooltip">${textHTML}</span><span class="tooltip-content">${descHTML}</span>`;

    const editor = getActiveEditor();
    editor.replaceSelection(output);

    const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal)
        modal.hide();
}

function generatePopup() {
    const get = (id) => document.getElementById(id).value.trim();

    const textImage = get("popupTextImage") === "Yes";
    const protectPopupImage = get("popupImageProtect") === "Yes";
    const text = get("popupTextName");

    const descImage = get("popupContentImage") === "Yes";
    const descImageProtected = get("popupContentProtect") === "Yes";
    const desc = get("popupContent");

    const surveyPath = "${gv.survey.path}"; // placeholder for server-side resolution

    const width = get("popupWidth") || "600";
    const height = get("popupHeight") || "400";
    const title = get("popupTitle") || "";
    const popupCall = `Survey.uidialog.make($(this).next('.popup-content'), {width: Math.min(${width}, $(window).width()), height: Math.min(${height}, $(window).height()), title: '${title}'} );`;

    let anchor = "";

    // Build clickable anchor element
    if (!textImage) {
        anchor = `<span class="self-popup" onclick="${popupCall}">${text}</span>`;
    } else if (protectPopupImage) {
        anchor = `<span class="self-popup" onclick="${popupCall}">[protected ${text} placement=top]</span>`;
    } else {
        anchor = `<span class="self-popup" onclick="${popupCall}"><img src="/survey/${surveyPath}/${text}" /></span>`;
    }

    // Build pop-up content element
    let content = "";

    if (!descImage) {
        content = `<div class="popup-content">${desc}</div>`;
    } else if (descImageProtected) {
        content = `<div class="popup-content">[protected ${desc} placement=top]</div>`;
    } else {
        content = `<div class="popup-content"><img src="/survey/${surveyPath}/${desc}" /></div>`;
    }

    const output = `${anchor}${content}`;

    const editor = getActiveEditor();
    editor.replaceSelection(output);

    const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal)
        modal.hide();
}

function generateRandomOrderTracker() {
    const get = (id) => document.getElementById(id).value.trim();

    const loop_block = get("loop_block");
    const loop_block_label = get("loop_block_label");
    const editor = getActiveEditor();
    let output = ``;
    if (loop_block === "Loop") {
        output = `
<number label="h${loop_block_label}_order_" size="2">
  <title>Virtual: ${loop_block_label} Order</title>
  <virtual>assignRandomOrder("${loop_block_label}_expanded", "children")</virtual>
  <row label="${loop_block_label}_1_expanded">Concept 1</row>
  <row label="${loop_block_label}_2_expanded">Concept 2</row>
  <row label="${loop_block_label}_3_expanded">Concept 3</row>
</number>`;

    } else if (loop_block === "Block") {
        output = `
<number label="h${loop_block_label}_order" size="2">
  <title>Virtual: ${loop_block_label} Order</title>
  <virtual>assignRandomOrder("${loop_block_label}", "children")</virtual>
  <row label="r1">Concept 1</row>
  <row label="r2">Concept 2</row>
  <row label="r3">Concept 3</row>
</number>
<note>Change row labels to the labels of block's children, then delete this note</note>`;

    }
    editor.replaceSelection(output);
    const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal)
        modal.hide();
}
function genNewStyle() {
    const selected = document.getElementById("styleDropdown").value;
    const match = getSurveyStyles().find(s => s.label === selected);
    if (match) {
        getActiveEditor().replaceSelection(match.value + "\n");

        const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
        if (modal)
            modal.hide();
    }
};

function generateDupeCheck() {
    const urlVar = document.getElementById("dupeVarName").value;
    const xmlContent = dupeCheckScript(urlVar);
    getActiveEditor().replaceSelection(xmlContent + "\n");

    const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal)
        modal.hide();

};

function genPipeNumber() {
    const qLabel = document.getElementById("pipeNumberLabel").value;
    const qMultiCol = document.getElementById("pipeNumberMultiCol").value === "Yes" ? true : false;
    const questionTopLegendItem = `
<style name="question.top-legend-item" arg:colText="Replace with res tag" mode="before" cond="col.index == 0"><![CDATA[
\\@if ec.simpleList
    <div id="\${this.label}_\${col.label}" class="legend col-legend col-legend-top col-legend-basic \${levels} \${this.grouping.cols && (col.group || col.index!=0) && ec.haveLeftLegend && ec.haveRightLegend ? "col-legend-space" : "border-collapse"} \${col.styles.ss.colClassNames} \${col.group ? col.group.styles.ss.groupClassNames : ""} \${colError}">
        \${colText}
    </div>
\\@else
\\@if this.styles.ss.colWidth
    <\${tag} scope="col" id="\${this.label}_\${col.label}" class="cell nonempty legend col-legend col-legend-top col-legend-basic \${levels} \${this.grouping.cols ? "desktop" : "mobile"} \${this.grouping.cols && (col.group || col.index!=0) && ec.haveLeftLegend && ec.haveRightLegend ? "col-legend-space" : "border-collapse"} \${col.styles.ss.colClassNames} \${col.group ? col.group.styles.ss.groupClassNames : ""} \${colError}" style="width:\${this.styles.ss.colWidth}; min-width:\${this.styles.ss.colWidth}">
        \${colText}
    </\${tag}>
\\@else
    <\${tag} scope="col" id="\${this.label}_\${col.label}" class="cell nonempty legend col-legend col-legend-top col-legend-basic \${levels} \${this.grouping.cols ? "desktop" : "mobile"} \${this.grouping.cols && (col.group || col.index!=0) && ec.haveLeftLegend && ec.haveRightLegend ? "col-legend-space" : "border-collapse"} \${col.styles.ss.colClassNames} \${col.group ? col.group.styles.ss.groupClassNames : ""} \${colError}">
        \${colText}
    </\${tag}>
\\@endif
\\@endif
]]></style>`;

    const elementInner = qMultiCol
         ? `\${${qLabel}.rows[row.index][0].ival}`
         : `\${${qLabel}.rows[row.index].ival}`;

    const questionElement = `
<style name="question.element" mode="before" cond="col.index == 0"><![CDATA[
\\@if ec.simpleList
<div class="element \${rowStyle} \${levels} \${extraClasses} \${col.group ? col.group.styles.ss.groupClassNames : (row.group ? row.group.styles.ss.groupClassNames : "")} \${col.styles.ss.colClassNames} \${row.styles.ss.rowClassNames} \${isClickable ? "clickableCell" : ""}"\${extra}>
     ${elementInner}
</div>
\\@else
<\${tag} \${headers} class="cell nonempty element \${levels} \${this.grouping.cols ? "desktop" : "mobile"} border-collapse \${extraClasses} \${col.group ? col.group.styles.ss.groupClassNames : (row.group ? row.group.styles.ss.groupClassNames : "")} \${col.styles.ss.colClassNames} \${row.styles.ss.rowClassNames} \${isClickable ? "clickableCell" : ""}"\${extra}>
     ${elementInner}
</\${tag}>
\\@endif
]]></style>`;

    const xmlContent = questionTopLegendItem + "\n\n" + questionElement;
    getActiveEditor().replaceSelection(xmlContent + "\n");

    const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal)
        modal.hide();

}

function genDisableContinue() {
    const qLabels = document.getElementById("disableLabels").value;
    const duration = document.getElementById("disableDuration").value;

    const xmlContent = `
    <style name="buttons" mode="after" with="${qLabels}" wrap="ready" arg:timeout="${duration}"><![CDATA[
$ ("#btn_continue,#btn_finish").prop("disabled", true);
setTimeout(function() {
	$ ("#btn_continue,#btn_finish").prop("disabled", false);
}, $(timeout)*1000);
]]></style>`;
    getActiveEditor().replaceSelection(xmlContent + "\n");

    const modal = bootstrap.Modal.getInstance(document.getElementById("surveyModal"));
    if (modal)
        modal.hide();

}
