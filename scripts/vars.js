const LILLY = [`ss:includeCSS="https://survey.decipherinc.com/survey/selfserve/53c/jtsfiles/jts_static_104.css"
  ss:includeJS="https://survey.decipherinc.com/survey/selfserve/53c/jtsfiles/jts_static_108.js"`, `<style cond="list in ['0','1'] or (list in ['2'] and vendorid in ['1234','1235'])" name='survey.logo'> <![CDATA[
    <div class="logo logo-left">
        <img src="/survey/selfserve/53c/logo_6f97a8cc1003fe3a2de3a9761701e069.png" class="logo-image" alt="logo" />
    </div>
    <!-- /.logo -->
]]></style>
`];

const SAGO = [`ss:includeJS="https://surveys.sago.com/survey/selfserve/1819/jtsfiles/jts_static_108.js"
  ss:includeCSS="https://surveys.sago.com/survey/selfserve/1819/jtsfiles/jts_static_104.css"`, `<style cond="list in ['0','1'] or (list in ['2'] and vendorid in ['1234','1235'])" name='survey.logo'> <![CDATA[
    <div class="logo logo-left">
        <img src="/survey/selfserve/1819/logo_6f97a8cc1003fe3a2de3a9761701e069.png" class="logo-image" alt="logo" />
    </div>
    <!-- /.logo -->
]]></style>
`]

const IHUT_LOGO = `
<style name='survey.logo'> <![CDATA[
    <div class="logo logo-left">
        <img src="/survey/selfserve/1819/logo_6f97a8cc1003fe3a2de3a9761701e069.png" class="logo-image" alt="logo" />
    </div>
    <!-- /.logo -->
]]></style>`;

const GROUP_SHUFFLE = `
<exec when="init">
try:
	def j_group_rows( grouped_rows ):
		question = thisQuestion
		current_order = [row.index for row in question.rows.order]
		grouped_rows = [question.attr(row).index for row in grouped_rows]
		grouped_order = [rowIndex for rowIndex in current_order if rowIndex in grouped_rows]
		first_item_index = current_order.index(grouped_order[0])
		non_grouped_order = [rowIndex for rowIndex in current_order if rowIndex not in grouped_order]
		question.rows.order = non_grouped_order[:first_item_index] + grouped_order + non_grouped_order[first_item_index:]

	def j_group_rows_with_order( grouped_rows ):
		question = thisQuestion
		current_order = [row.index for row in question.rows.order]
		grouped_rows = [question.attr(row).index for row in grouped_rows]
		first_item_index = current_order.index(grouped_rows[0])
		non_grouped_order = [rowIndex for rowIndex in current_order if rowIndex not in grouped_rows]
		question.rows.order = non_grouped_order[:first_item_index] + grouped_rows + non_grouped_order[first_item_index:]
		
	def j_shuffle_by( source_question ):
		current_question = thisQuestion
		current_order = [row.label for row in current_question.rows]
		current_question.rows.order = [current_order.index(row.label) for row in source_question.rows.order if row.label in current_order]
except:
	pass
</exec>`;

const CHECKBOX_RECODE = `
<exec when="init">
def chkbox_recode(tq):
	mq = eval(tq.label.replace("h",""))
	textList = [eRow.label.replace("r","") for eRow in mq.rows if eRow]
	tq.val = ",".join(textList)
</exec>`;

const SAGO_CSS = `
<style mode="after" name="respview.client.css"><![CDATA[
<style type="text/css">
.autosave-restart {
	display: none;
}

.answers-table {
	background-color: white; //must match foregound-color
}

input[type="number"][disabled],
input[type="text"][disabled],
select[disabled],
textarea[disabled] {
	background-color: #efefef !important;
	cursor: default !important;
}

.pseudo-col-legend {
	background-color: #ededed;
	padding: 0.4em 0.5em;
	text-align: center;
}

.noRows.noCols .answers {
	min-width: 1px;
}

.noRows.noCols .grid {
	width: auto;
}

.flexGrid .element {
	min-width: 80px !important;
}

.flexGrid .row-legend {
	min-width: 80px;
	padding-right: 1.4em;
}

/* Custom pop-ups and tooltips */
.self-tooltip {
	border-bottom-color: #5b7f2b;
}

.self-popup {
	color: #5b7f2b;
}

/* adds the bullet points/numbers in listed items in pop-up windows */
.popup-content li {
    list-style-type: inherit;
    list-style-position: inherit;
    margin-left: 20px;
    line-height: normal;   
}

\\@if list in ['0','1'] or (list in ['2'] and vendorid in ['1234','1235'])
	.logo{
		padding-top: 20px;
		padding-left: 20px;
		margin-bottom: 50px;
	}
\\@endif

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type=number] {
	-moz-appearance: textfield;
}


/*** clarity of images ***/
img {
	transform: translateZ(0);
	image-rendering: -webkit-optimize-contrast;
}
.tbd {
	font-weight: bold;
	color: red;
	background-color: yellow;
}

.explanation {
	margin: 0 auto 20px;
	max-width: 960px;
	width: 90%;
	font-size: 1.4em;
	line-height: 1.25em;
 	border: 1px solid #81B73D;
	-webkit-box-shadow: 3px 3px 5px 0px rgba(89,96,77,1);
	-moz-box-shadow: 3px 3px 5px 0px rgba(89,96,77,1);
	box-shadow: 3px 3px 5px 0px rgba(89,96,77,1);
	padding: 5px;
}

.exit-message-text {
	font-size: 1.5rem;
}

.survey-page.non-touch {
	overflow: scroll !important;
	overflow-y: scroll !important;
}

.batman {
	display: none;
}

/* ========================= */
/* INSERT NEW CSS BELOW THIS */



</style>
]]></style>

<themevars>
  <themevar name="background-color">#FFF</themevar>
  <themevar name="foreground-color">#FFF</themevar>
  <themevar name="contemporary-foreground-shadow-color">#FFF</themevar>
  <themevar name="text-color">rgb(47, 70, 80)</themevar>
  <themevar name="color-1">#efefef</themevar>
  <themevar name="color-2">#ffffff</themevar>
  <themevar name="color-3">#454545</themevar>
  <themevar name="color-4">#fdfffd</themevar>
  <themevar name="color-5">rgb(107,193,116)</themevar>
  <themevar name="color-6">#d8d8d8</themevar>
  <themevar name="progress-fill-color">@color-4</themevar>
  <themevar name="table-cell-hover-color">#f1f7e8</themevar>
  <themevar name="survey-info-bg-color">@color-5</themevar>
  <themevar name="survey-error-bg-color">#e50000</themevar>
  <themevar name="link-color">@color-5</themevar>
  <themevar name="link-hover-color">@link-color</themevar>
  <themevar name="button-text-color">@color-3</themevar>
  <themevar name="button-text-hover-color">@color-3</themevar>
  <themevar name="button-text-selected-color">@color-3</themevar>
  <themevar name="primary-button-bg-color">@color-6</themevar>
  <themevar name="primary-button-bg-color-hover">spin(@color-5, -20)</themevar>
  <themevar name="primary-button-border-color">#000000</themevar>
  <themevar name="primary-button-border-color-hover">@color-5</themevar>
  <themevar name="primary-button-border-radius">4px</themevar>
  <themevar name="secondary-button-bg-color">@color-6</themevar>
  <themevar name="secondary-button-bg-color-hover">spin(@color-5, -20)</themevar>
  <themevar name="secondary-button-border-color">#000000</themevar>
  <themevar name="secondary-button-border-color-hover">@color-5</themevar>
  <themevar name="secondary-button-border-radius">4px</themevar>
  <themevar name="dq-button-border-color">@primary-button-border-color</themevar>
  <themevar name="dq-button-border-color-selected">@primary-button-border-color</themevar>
  <themevar name="dq-button-bg-color">@color-2</themevar>
  <themevar name="dq-button-bg-color-hover">spin(@color-5, -20)</themevar>
  <themevar name="dq-button-bg-selected">@primary-button-border-color</themevar>
  <themevar name="fir-inner-hover">spin(@color-5, -20)</themevar>
  <themevar name="fir-inner-selected">@color-5</themevar>
  <themevar name="primary-font-family">Arial, sans-serif</themevar>
  <themevar name="secondary-font-family">Arial, sans-serif</themevar>
  <themevar name="desktop-font-size">0.750em</themevar>
  <themevar name="large-text">1.5rem</themevar>
  <themevar name="normal-text">1.4rem</themevar>
  <themevar name="small-text">1.2rem</themevar></themevars>
<note>LESS variables KB article:
https://forstasurveys.zendesk.com/hc/en-us/articles/4409469885339-The-Less-Styles-System</note>`;

const IHUT_OTS_CSS = `
<style mode="after" name="respview.client.css"><![CDATA[
<style type="text/css">
.closing-screen {
	text-align: center;
	vertical-align: middle;
	margin: 0 auto;
	color: red;
	font-size: 1.4rem;
}
</style>
]]></style>`;

const UI_DIALOG_CLOSE = `
<style name="global.page.head" wrap="ready"> <![CDATA[
/* Make the pop-up "Close" button translateable */
setTimeout(function() {
	Survey.uidialog.assets.btn_close.text = "\${res.dialogClose.replace('"','\\\\\"')}"
}, 50);
]]></style>
`;

const COPY_PROTECTION = `
<style label="copyProtection" mode="after" name="buttons"><![CDATA[
<script>
var exclusion_list = [
	/* Manual exclusion */
	".exclude-cp",
	/* Scripts and style tags */
	"script,style",
	/* Regular answers */
	".answers",
	/* Survey navigation buttons */
	".survey-buttons",
	/* Visisble input elements inside question tags */
	".question input,.question textarea,.question select",
	/* Hidden input elements */
	"input[type=hidden]",
	/* Audio player (audio):  */
	".sq-audio-container",
	/* Button Select (atm1d): */
	".sq-atm1d-widget",
	/* Card Sort (cardsort): */ 
	".sq-cardsort",
	/* Card Rating (cardrating): */
	".sq-cardrating-widget",
	/* Image Map (imgmap): */
	".sq-imgmap-widget",
	/* Media Evaluator (bcme): */
	".sq-bcme-container",
	/* Page Timer (timertest): */
	".sq-timertestContainer",
	/* Page Turner (pageturner): */
	".sq-pageturnerContainer",
	/* Quester (quester): */
	".sq-questerContainer",
	/* Rank Sort (ranksort): */
	".sq-ranksort-warning,.sq-ranksort-container,.sq-ranksort-dropdowns-container",
	/* Shopping Cart (shoppingcart): */
	".sq-shoppingcart-block",
	/* Text Highlighter (hottext): */
	".sq-hottext-container",
	/* Legacy Video Playter (bsvideo): */
	".dq-bcvideo-player",
	/* Video Player (videoplayer): */
	".dq-videoplayer-player",
	/* Video Player (YouTube/Vimeo) (videoembed): */
	".sq-videoembedContainer",
	/* Video Testimonial (videocapture): */
	"ziggeorecorder",
	/* Fallback - exclude jQ UI draggable elements */
	".ui-draggable,.ui-draggable-disabled",
	/* exclude QA codes for questions */	
	".qaTab,.qaInfo",
];

\\@if False
/* Add a jQuery method to remove Decipher UI elements from a jQuery selection */
\\@endif
\\@if gv.survey.root.state.testing and gv.isUser() and gv.request.user.hasToggle("qa-codes")
	// nothing should happen
\\@else
	$.fn.extend({
		exclude_ui: function() {
			var result = this;
			$.each( exclusion_list, function(index, exclusion_selector) {
				var exclusion = $ (exclusion_selector);
				exclusion = exclusion.find("*").addBack();
				
				/* Do not exclude row, column and cell legends within .answers */
				if (exclusion_selector == ".answers") {
					exclusion = exclusion.not(".col-legend,.row-legend,.cell-text");
				}
				
				result = result.not(exclusion);
			});
	
			/* Remove the UI element containers themselves  */
	        result = result.not("form,.question");
	
			return result;
		}
	});
	
	var $cp_elements = $ (".survey-body").find("*").exclude_ui();
	$cp_elements.addClass("no-select").attr("unselectable","on");
	$ (".survey-body").data("cp-elements", $cp_elements);
	
	$ (".survey-body").on("cut copy selectstart dragstart contextmenu", ".no-select", false);
	
	/*
	$ (".survey-body").on("cut copy selectstart dragstart contextmenu", "*", function(event) {
		if ( $ (event.target).is($ (".survey-body").data("cp-elements")) ) {
			return false;
		}
	});
	*/
	
	$ ("body").on("cut copy selectstart dragstart contextmenu", ".ui-dialog,.ui-dialog *", false);
\\@endif
</script>
<style>
body > .ui-dialog,
body > .ui-tooltip,
.no-select {
	user-select: none;
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;	
}

</style>
]]></style>`;

const PRETEST_LABELS_DISPLAY = `
<style cond="list=='0'" arg:html_lbls="0" arg:qn_lbls="1" mode="after" name="respview.client.js"><![CDATA[
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
]]></style>`;

const CONSENT_QUESTION = `
<pipe label="pConsentQuestionText" capture="">
  <case label="c1" cond="(allQuestions['CO'].DE if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'DE')) else decLang == 'german' if decLang else gv.survey.root.lang == 'german')" translateable="0">Vielen Dank, dass Sie sich bereit erkl&amp;#228;rt haben, an dieser Online-Umfrage teilzunehmen. Bitte verwenden Sie immer die Schaltfl&amp;#228;che unten auf dem Bildschirm, um durch die Umfrage zu navigieren. <br /><br />Diese Umfrage dient ausschlie&amp;#223;lich Marktforschungszwecken.  Aufgrund Ihrer Teilnahme werden Sie weder Werbeangebote erhalten noch zu K&amp;#228;ufen animiert werden. Ihre individuellen Antworten werden vertraulich und anonym behandelt und nur in zusammengefasster Form gemeldet. Ihre Meinung ist uns sehr wichtig. Wir sind stolz darauf, unseren Kunden Informationen von h&amp;#246;chster Qualit&amp;#228;t zu liefern. Bitte lesen Sie jede Frage gr&amp;#252;ndlich durch und geben Sie durchdachte und ehrliche Antworten.<br /><br />Vielen Dank f&amp;#252;r Ihre Teilnahme! - Ihre Meinung z&amp;#228;hlt! Klicken Sie unten auf &amp;#132;Weiter&amp;#148;, nachdem Sie zugestimmt haben.</case>
  <case label="c2" cond="(allQuestions['CO'].FR if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'FR')) else decLang == 'french' if decLang else gv.survey.root.lang == 'french')" translateable="0">Nous vous remercions d&amp;#039;avoir accept&amp;eacute; de participer &amp;agrave; cette enqu&amp;ecirc;te en ligne. Utilisez le bouton situ&amp;eacute; en bas de l&amp;#039;&amp;eacute;cran pour naviguer dans la plateforme. L&amp;#039;ensemble des r&amp;eacute;ponses de tous les participants seront anonymis&amp;eacute;es et agr&amp;eacute;g&amp;eacute;es et seront utilis&amp;eacute;es uniquement pour r&amp;eacute;pondre aux objectifs de l&amp;#039;&amp;eacute;tude de march&amp;eacute; &amp;agrave; laquelle vous participez. Nous ne ferons ni vente ni promotion suite &amp;agrave; votre participation. Afin de fournir des informations de la plus haute qualit&amp;eacute; &amp;agrave; nos clients, nous comptons sur vous pour lire attentivement chaque question et fournir des r&amp;eacute;ponses r&amp;eacute;fl&amp;eacute;chies et honn&amp;ecirc;tes. Votre opinion compte ! Pour continuer, vous devez donner votre consentement ci-dessous puis cliquer sur le bouton "Continuer".</case>
  <case label="c3" cond="(allQuestions['CO'].ES if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'ES')) else decLang == 'spanish' if decLang else gv.survey.root.lang == 'spanish')" translateable="0">Gracias por aceptar participar en esta encuesta online. Por favor, utilice siempre el bot&amp;#243;n situado en la parte inferior de la pantalla para navegar a trav&amp;eacute;s de la encuesta. <br /><br />Esta encuesta es solo para fines de investigaci&amp;#243;n de mercado. No habr&amp;#225; ventas directas ni promociones como resultado de su participaci&amp;#243;n. Sus respuestas individuales se mantendr&amp;#225;n confidenciales y an&amp;#243;nimas, y se informar&amp;#225;n solo de manera agregada. Su opini&amp;#243;n es muy importante para nosotros. Nos enorgullece proporcionar la informaci&amp;#243;n de m&amp;#225;s alta calidad a nuestros clientes. Aseg&amp;#250;rese de leer cada pregunta detenidamente y proporcionar respuestas reflexivas y honestas.<br /><br /> &amp;#161;Gracias por su participaci&amp;#243;n! &amp;#161;Su opini&amp;#243;n cuenta! Haga clic en "Continuar" despu&amp;eacute;s de dar su consentimiento a continuaci&amp;#243;n.</case>
  <case label="cn" cond="1"><span class="hidden">DO NOT TRANSLATE FOR FR, DE and ES</span>Thank you for agreeing to participate in this online survey. Please always use the button located at the bottom of the screen to navigate through the survey.<br /><br />This survey is for market research purposes only. There will be no direct sales or promotions as a result of your participation. Your individual responses will be kept confidential and anonymous and reported only in the aggregate. Your opinion is very important to us. We pride ourselves in providing the highest quality information to our clients. Please make sure to read each question thoroughly and provide thoughtful and honest responses.<br />&amp;nbsp;<br />Thank you for your participation! Your opinion counts! Click "Continue" after you consent below.</case></pipe>
<pipe label="pConsentCommentText" capture="">
  <case label="c1" cond="(allQuestions['CO'].DE if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'DE')) else decLang == 'german' if decLang else gv.survey.root.lang == 'german')" translateable="0">Sie m&amp;#252;ssen das Kontrollk&amp;#228;stchen unten aktivieren, bevor Sie mit der Umfrage fortfahren.</case>
  <case label="c2" cond="(allQuestions['CO'].FR if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'FR')) else decLang == 'french' if decLang else gv.survey.root.lang == 'french')" translateable="0">Vous devez s&amp;eacute;lectionner la case ci-dessous avant de continuer avec l&amp;#039;enqu&amp;ecirc;te.</case>
  <case label="c3" cond="(allQuestions['CO'].ES if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'ES')) else decLang == 'spanish' if decLang else gv.survey.root.lang == 'spanish')" translateable="0">Debe seleccionar la casilla de verificaci&amp;#243;n a continuaci&amp;#243;n antes de proceder con la encuesta.</case>
  <case label="cn" cond="1"><span class="hidden">DO NOT TRANSLATE FOR FR, DE and ES</span>You must select the checkbox below before proceeding with the survey.</case></pipe>
<pipe label="pConsentCheckboxText" capture="">
  <case label="c1" cond="(allQuestions['CO'].DE if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'DE')) else decLang == 'german' if decLang else gv.survey.root.lang == 'german')" translateable="0">Aktivieren Sie dieses Kontrollk&amp;#228;stchen, um zu best&amp;#228;tigen, dass Sie sowohl die Datenschutzrichtlinie als auch die Geheimhaltungsvereinbarung zu dieser Marktforschungsstudie gelesen und verstanden haben (<a href="https://sago.com/de/legal/participant-consent/" target="_blank" rel="noopener" title="Sago Consent">https://sago.com/de/legal/participant-consent/</a>). Ich stimme freiwillig zu, an dieser Studie teilzunehmen und erm&amp;#228;chtige Sago und die aufgef&amp;#252;hrten Empf&amp;#228;nger, meine personenbezogenen Daten f&amp;#252;r Marktforschungszwecke zu verwenden, einschlie&amp;#223;lich der Verarbeitung besonderer Kategorien personenbezogener Daten, der &amp;#252;bermittlung personenbezogener Daten au&amp;#223;erhalb des Staates meines Wohnsitzes sowie der Beobachtung und Aufzeichnung der Interviews live oder per Streaming.</case>
  <case label="c2" cond="(allQuestions['CO'].FR if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'FR')) else decLang == 'french' if decLang else gv.survey.root.lang == 'french')" translateable="0">Cochez cette case pour confirmer que vous avez lu et compris la notice d&amp;#039;information et l&amp;#039;accord de non-divulgation concernant cette &amp;eacute;tude de march&amp;eacute; (<a href="https://sago.com/fr/legal/europe-participant-consent/" target="_blank" rel="noopener" title="Sago Consent">https://sago.com/fr/legal/europe-participant-consent/</a>). J&amp;#039;accepte volontairement de participer &amp;agrave; cette &amp;eacute;tude et j&amp;#039;autorise Sago et les destinataires list&amp;eacute;s &amp;agrave; utiliser mes informations personnelles &amp;agrave; des fins d&amp;#039;&amp;eacute;tude de march&amp;eacute;, y compris le traitement de donn&amp;eacute;es sensibles, le transfert d&amp;#039;informations personnelles en dehors de l&amp;#039;UE, l&amp;#039;observation et l&amp;#039;enregistrement des interviews en direct ou en diff&amp;eacute;r&amp;eacute;.</case>
  <case label="c3" cond="(allQuestions['CO'].ES if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'ES')) else decLang == 'spanish' if decLang else gv.survey.root.lang == 'spanish')" translateable="0">Marca esta casilla para confirmar que has le?do y comprendido tanto el aviso de privacidad como el acuerdo de confidencialidad relativos a este estudio de investigaci&amp;#243;n de mercado (<a href="https://sago.com/es/legal/participant-consent/" target="_blank" rel="noopener" title="Consentimiento de Sago">https://sago.com/es/legal/participant-consent/</a>). Acepto voluntariamente participar en este estudio de mercado y autorizo a Sago y a los destinatarios enumerados a utilizar mis informaciones personales con fines de investigaci&amp;#243;n de mercado, incluido el tratamiento de datos sensibles, la transferencia de informaciones personales fuera de la UE, la observaci&amp;#243;n y la grabaci&amp;#243;n de entrevistas en directo o grabadas.</case>
  <case label="cn" cond="1"><span class="hidden">DO NOT TRANSLATE FOR FR, DE and ES</span>Check this box to confirm you have read and understood both the privacy notice and the non-disclosure agreement about this market research study (<a href="https://sago.com/en/legal/participant-consent/" target="_blank" rel="noopener" title="Sago Consent">https://sago.com/en/legal/participant-consent/</a>). I voluntarily agree to take part in this study and authorize Sago and the recipients listed to use my personal information for market research purposes, including the processing of special categories of personal information, the transfer of personal information outside the State of my residence, the observation and the recording of the interviews in live or streaming.</case></pipe>
<pipe label="pConsentCheckboxErrorText" capture="">
  <case label="c1" cond="(allQuestions['CO'].DE if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'DE')) else decLang == 'german' if decLang else gv.survey.root.lang == 'german')" translateable="0">Sie m&amp;uuml;ssen best&amp;auml;tigen, dass Sie die obigen Informationen gelesen und verstanden haben, bevor Sie fortfahren.</case>
  <case label="c2" cond="(allQuestions['CO'].FR if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'FR')) else decLang == 'french' if decLang else gv.survey.root.lang == 'french')" translateable="0">Vous devez confirmer que vous avez lu et compris les informations ci-dessus avant de continuer.</case>
  <case label="c3" cond="(allQuestions['CO'].ES if ('CO' in allQuestions.keys() and hasattr(allQuestions['CO'], 'ES')) else decLang == 'spanish' if decLang else gv.survey.root.lang == 'spanish')" translateable="0">Debe confirmar que ley&amp;oacute; y comprendi&amp;oacute; la informaci&amp;oacute;n anterior antes de continuar.</case>
  <case label="cn" cond="1"><span class="hidden">DO NOT TRANSLATE FOR FR, DE and ES</span>You must confirm that you read and understood the above information before proceeding.</case></pipe>

<checkbox 
  label="Intro_Consent"
  atleast="1"
  translateable="0">
  <title>[pipe: pConsentQuestionText]</title>
  <comment>[pipe: pConsentCommentText]</comment>
  <alt>Thank you for agreeing to participate in this online survey. Please always use the button located at the bottom of the screen to navigate through the survey.<br />&amp;nbsp;<br />This survey is for market research purposes only. There will be no direct sales or promotions as a result of your participation. Your individual responses will be kept confidential and anonymous and reported only in the aggregate. Your opinion is very important to us. We pride ourselves in providing the highest quality information to our clients. Please make sure to read each question thoroughly and provide thoughtful and honest responses.<br />&amp;nbsp;<br />Thank you for your participation! Your opinion counts! Click "Continue" after you consent below.</alt>
  <res label="sys_check-error-atLeast-sing-row">\${pipe.pConsentCheckboxErrorText}</res>
  <row label="r1" alt="Check this box to confirm you have read and understood both the privacy notice and the non-disclosure agreement about this market research study https://sago.com/en/legal/participant-consent/). I voluntarily agree to take part in this study and authorize Sago and the recipients listed to use my personal information for market research purposes, including the processing of special categories of personal information, the transfer of personal information outside the State of my residence, the observation and the recording of the interviews in live or streaming."><span style="font-size: 12pt;">[pipe: pConsentCheckboxText]</span></row>
</checkbox>`;

const RESDEF = `
<block label="ResearchDefender_Search" cond="gv.request.variables.get('api') != '0'">
  <logic label="ResearchDefender" researchdefender_search:participant_id="\${uuid}" researchdefender_search:private_key="607b1eca-a3e5-4808-ad3e-565fbf6e0ba5" researchdefender_search:publishable_key="9ed35863-39a4-41b0-a30e-0de31b4e672b" researchdefender_search:survey_id="\${gv.survey.path.split('/', 1)[1].replace('/','')}" uses="researchdefender_search.2">
    <title>Research Defender SEARCH Integration</title></logic>
  <suspend/>

  <exec cond="ResearchDefender_results.respondent_ud.val not in ['',None]">
try:
	# If Threat Potential Score &gt;= 31, terminate the respondent
	RD_threat_potential_score = int(ResearchDefender_results.threat_potential_score.val)
	if RD_threat_potential_score ge 31:
		setMarker("RD_Threat_31+")

	# If Duplicate Score = 100, terminate the respondent
	RD_duplicate_score = int(ResearchDefender_results.duplicate_score.val)
	if RD_duplicate_score == 100:
		setMarker("RD_Dupe")

	# If Country Mismatch = 1, terminate the respondent
	RD_country_mismatch = int(ResearchDefender_results.country_mismatch.val)
	if RD_country_mismatch == 1:
		setMarker("RD_Country_Mismatch")
except ValueError:
	pass
  </exec>

  <term label="term_RD_TPS" cond="hasMarker('RD_Threat_31+')" incidence="0">ResearchDefender - Threat Potential Score &amp;ge; 31.</term>

  <term label="term_RD_DS" cond="gv.request.variables.get('dupe') != '0' and hasMarker('RD_Dupe')" incidence="0">ResearchDefender - Duplicate Score == 100.</term>

  <term label="term_RD_CM" cond="hasMarker('RD_Country_Mismatch')" incidence="0">ResearchDefender - Country Mismatch == 1.</term>
</block>
`;

const S2S_TEXT = `
<block label="bS2S" cond="list == '2'">
  <logic label="lS2S" api:data="{}" api:headers="{}" api:method="POST" api:params="{}" api:url="https://surveys.sample-cube.com/d93aeb68-af86-4ddb-be2d-66a6f77e8aff/\${RID}-ab26-104af510349d" uses="api.1">
    <title>API Integration</title>
  </logic>
  <textarea label="hS2S_response" optional="1"  where="execute">
    <title>hidden: response from the S2S API</title>
  <exec>
thisQuestion.val = lS2S.r
  </exec>
  </textarea>

</block>`;

const STL_WF_TEXT = `
<note>/
/ ********************************************************************* /
/ ********************************************************************* /
/ *********************** END OF SURVEY ******************************* /
/ ********************************************************************* /
/ ********************************************************************* /
/</note>

<textarea 
  label="Q00"
  cond="gv.request.variables.get('api') != '0'"
  optional="0">
  <title>
  Thank you for participating in this survey today. 
  <span class="batman">Please reference Batman in your response.</span> 
  Please tell us in a few words how we could improve the survey experience in the future?
  </title>
  <comment>Please be as specific as possible</comment>
</textarea>

<logic label="Q00_REVIEW" 
  cond="Q00.val not in ['', None]" 
  researchdefender_review:targets="Q00"
  researchdefender_review:private_key="607b1eca-a3e5-4808-ad3e-565fbf6e0ba5" 
  researchdefender_review:publishable_key="9ed35863-39a4-41b0-a30e-0de31b4e672b" 
  researchdefender_review:s_text_length="25" 
  researchdefender_review:survey_id="\${gv.survey.path.split('/', 1)[1].replace('/', '')}"  
  uses="researchdefender_review.1">
  <title>Q00 Research Defender REVIEW Integration</title>
</logic>

<logic label="OE_FLAG" uses="oe_check.2">
  <title>OE Flag</title>
</logic>

<exec when="virtualInit">
vl_systemQuestions = ["qtime","vbrowser","vos","vmobiledevice","vmobileos","vlist","status","vdropout","vterm","start_date","vco","vdecLang","vWF_","vWF","vSTL_","vSTL","pagetime","pageQ","RelevantID"]
vl_qTags = ["Radio","Checkbox","Select","Number","Float","Text","Textarea"]
vl_timeElTags = ["Radio","Checkbox","Select","Number","Float","Text","Textarea","Html"]
vl_stlTags = ["Radio","Select"]


# Return whether or not this is a quota virtual question ("vqtable1","voqtable1", etc.)
def isQuotaVirtual(fQLabel):
	return fQLabel.startswith("vqtable") or fQLabel.startswith("voqtable")

# Return whether or not this is an append.xml question ("vrxq1", etc.)
# UNUSED - Use isVirtual instead
def isAppendVirtual(fQLabel):
	return fQLabel.startswith("vrx") or fQLabel.startswith("vrq")

# Return whether question is virtual
def isVirtual(fQLabel):
	fQObj = allQuestions[fQLabel]
	if hasattr(fQObj,"o"):
		if hasattr(fQObj.o, "virtual"):
			return fQObj.o.virtual
		return False
	else:
		# Return True if question doesn't even have and "o" attribute
		# This should not be a question we're interested in if so
		return True

# Consolidate valid question conditions
def isValidQ(fQLabel):
	notSystemQ = fQLabel not in vl_systemQuestions
	notQuotaQ = not isQuotaVirtual(fQLabel)
	notVirtualQ = not isVirtual(fQLabel)
	return notSystemQ and notQuotaQ and notVirtualQ

# Consolidate attempting to get question tag name
def safeGetName(fQLabel):
	fQObj = allQuestions[fQLabel]
	if hasattr(fQObj,"o") and hasattr(fQObj.o,"getName"):
		return fQObj.o.getName()
	else:
		return None

# Return whether or not this is a question object of any kind, but not a system variable
def isQuestion(fQLabel):
	fQObj = allQuestions[fQLabel]
	return isValidQ(fQLabel) and safeGetName(fQLabel) in vl_qTags


# Return whether or not this is an object to track time on (question and html lbjects)
def isTimeEl(fQLabel):
	fQObj = allQuestions[fQLabel]
	return isValidQ(fQLabel) and safeGetName(fQLabel) in vl_timeElTags


# Return whether or not this is a possibly straightlining object (radio or select)
def isSTL(fQLabel):
	fQObj = allQuestions[fQLabel]
	return isValidQ(fQLabel) and safeGetName(fQLabel) in vl_stlTags

filterList = ["4r5e","50 yard cunt punt","5h1t","5hit","a_s_s","a2m","a55","a55hole","adult","aeolus","ahole","anal","anal impaler","anal leakage","analprobe","anilingus","anus","ar5e","areola","areole","arian","arrse","arse","arsehole","aryan","ass","ass fuck","ass hole","assbang","assbanged","assbangs","asses","assfuck","assfucker","ass-fucker","assfukka","assh0le","asshat","assho1e","asshole","assholes","assmaster","assmucus","assmunch","asswhole","asswipe","asswipes","autoerotic","azazel","azz","b!tch","b00bs","b17ch","b1tch","babe","babes","ballbag","ballsack","bang","bang (one's) box","bangbros","banger","bareback","barf","bastard","bastards","bawdy","beaner","beardedclam","beastial","beastiality","beatch","beaver","beef curtain","beeyotch","bellend","beotch","bestial","bestiality","bi+ch","biatch","big tits","bigtits","bimbo","bimbos","birdlock","bitch","bitch tit","bitched","bitcher","bitchers","bitches","bitchin","bitching","bitchy","bloody","blow","blow job","blow me","blow mud","blowjob","blowjobs","blue waffle","blumpkin","bod","bodily","boink","boiolas","bollock","bollocks","bollok","bone","boned","boner","boners","bong","boob","boobies","boobs","booby","booger","bookie","booobs","boooobs","booooobs","booooooobs","bootee","bootie","booty","booze","boozer","boozy","bosom","bosomy","bowel","bowels","breast","breasts","buceta","bugger","bukkake","bull shit","bullshit","bullshits","bullshitted","bullturds","bum","bung","bunny fucker","bust a load","busty","butt","butt fuck","butt fuck","buttfuck","buttfucker","butthole","buttmuch","buttplug","c.0.c.k","c.o.c.k.","c.u.n.t","c0ck","c-0-c-k","c0cksucker","caca","cahone","cameltoe","carpet muncher","carpetmuncher","cawk","chinc","chincs","chink","choade","chode","chodes","chota bags","cipa","cl1t","climax","clit","clit licker","clitoris","clitorus","clits","clitty","clitty litter","clusterfuck","cnut","cocain","cocaine","cock","c-o-c-k","cock pocket","cock snot","cock sucker","cockblock","cockface","cockhead","cockholster","cockknocker","cockmunch","cockmuncher","cocks","cocksmoker","cocksuck","cocksucked","cocksucker","cock-sucker","cocksucking","cocksucks","cocksuka","cocksukka","coital","cok","cokmuncher","coksucka","commie","condom","coon","coons","cop some wood","corksucker","cornhole","corp whore","cox","crabs","crack","cracker","crackwhore","crap","crappy","cum","cum chugger","cum dumpster","cum freak","cum guzzler","cumdump","cummer","cummin","cumming","cums","cumshot","cumshots","cumslut","cumstain","cunilingus","cunillingus","cunnilingus","cunny","cunt","c-u-n-t","cunt hair","cuntbag","cuntface","cunthunter","cuntlick","cuntlick","cuntlicker","cuntlicker","cuntlicking","cunts","cuntsicle","cunt-struck","cut rope","cyalis","cyberfuc","cyberfuck","cyberfucked","cyberfucker","cyberfuckers","cyberfucking","d0ng","d0uch3","d0uche","d1ck","d1ld0","d1ldo","dago","dagos","dammit","damn","damned","damnit","dawgie-style","dick","dick hole","dick shy","dickbag","dickdipper","dickface","dickflipper","dickhead","dickheads","dickish","dick-ish","dickripper","dicksipper","dickweed","dickwhipper","dickzipper","diddle","dike","dildo","dildos","diligaf","dillweed","dimwit","dingle","dink","dinks","dipship","dirsa","dirty Sanchez","dlck","dog-fucker","doggie style","doggiestyle","doggie-style","doggin","dogging","doggy-style","dong","donkeyribber","doofus","doosh","dopey","douch3","douche","douchebag","douchebags","douchey","drunk","duche","dumass","dumbass","dumbasses","dummy","dyke","dykes","eat a dick","eat hair pie","ejaculate","ejaculated","ejaculates","ejaculating","ejaculatings","ejaculation","ejakulate","enlargement","erect","erection","erotic","essohbee","extacy","extasy","f u c k","f u c k e r","f.u.c.k","f_u_c_k","f4nny","facial","fack","fag","fagg","fagged","fagging","faggit","faggitt","faggot","faggs","fagot","fagots","fags","faig","faigt","fanny","fannybandit","fannyflaps","fannyfucker","fanyy","fart","fartknocker","fat","fatass","fcuk","fcuker","fcuking","feck","fecker","felch","felcher","felching","fellate","fellatio","feltch","feltcher","fingerfuck","fingerfucked","fingerfucker","fingerfuckers","fingerfucking","fingerfucks","fist fuck","fisted","fistfuck","fistfucked","fistfucker","fistfuckers","fistfucking","fistfuckings","fistfucks","fisting","fisty","flange","flog the log","floozy","foad","fondle","foobar","fook","fooker","foreskin","freex","frigg","frigga","fubar","fuck","f-u-c-k","fuck hole","fuck puppet","fuck trophy","fuck yo mama","fuck","fucka","fuckass","fuck-ass","fuck-bitch","fucked","fucker","fuckers","fuckface","fuckhead","fuckheads","fuckin","fucking","fuckings","fuckingshitmotherfucker","fuckme","fuckmeat","fucknugget","fucknut","fuckoff","fucks","fucktard","fuck-tard","fucktoy","fuckup","fuckwad","fuckwhit","fuckwit","fudge packer","fudgepacker","fuk","fuker","fukker","fukkin","fuks","fukwhit","fukwit","fux","fux0r","fvck","fxck","gae","gai","gangbang","gangbang","gang-bang","gangbanged","gangbangs","ganja","gassy ass","gay","gaylord","gays","gaysex","gey","gfy","ghay","ghey","gigolo","glans","goatse","god damn","godamn","godamnit","goddam","god-dam","goddammit","goddamn","goddamned","god-damned","goldenshower","gonad","gonads","gook","gooks","gringo","gspot","g-spot","gtfo","guido","h0m0","h0mo","ham flap","handjob","hard on","hardcoresex","he11","hebe","heeb","hell","heroin","herp","herpes","herpy","heshe","hitler","hiv","hoar","hoare","hobag","hoer","hom0","homey","homo","homoerotic","homoey","honky","hooch","hookah","hooker","hoor","hootch","hooter","hooters","hore","horniest","horny","hotsex","how to kill","how to murder","hump","humped","humping","hussy","hymen","inbred","incest","injun","j3rk0ff","jackass","jackhole","jackoff","jack-off","jap","japs","jerk","jerk0ff","jerked","jerkoff","jerk-off","jism","jiz","jiz","jizm","jizm","jizz","jizzed","junkie","junky","kawk","kike","kikes","kill","kinky","kinky Jesus","kkk","klan","knob end","knobead","knobed","knobend","knobhead","knobjocky","knobjokey","kock","kondum","kondums","kooch","kooches","kootch","kraut","kum","kummer","kumming","kums","kunilingus","kwif","kyke","l3i+ch","l3itch","labia","lech","LEN","leper","lesbians","lesbo","lesbos","lez","lezbian","lezbians","lezbo","lezbos","lezzie","lezzies","lezzy","lmao","lmfao","loin","loins","lube","lust","lusting","lusty","m0f0","m0fo","m45terbate","ma5terb8","ma5terbate","mafugly","mams","masochist","massa","masterb8","masterbat3","masterbate","master-bate","masterbating","masterbation","masterbations","masturbate","masturbating","masturbation","maxi","menses","menstruate","menstruation","meth","m-fucking","mof0","mofo","mo-fo","molest","moolie","moron","mothafuck","mothafucka","mothafuckas","mothafuckaz","mothafucked","mothafucker","mothafuckers","mothafuckin","mothafucking","mothafuckings","mothafucks","mother fucker","mother fucker","motherfuck","motherfucka","motherfucked","motherfucker","motherfuckers","motherfuckin","motherfucking","motherfuckings","motherfuckka","motherfucks","mtherfucker","mthrfucker","mthrfucking","muff","muff puff","muffdiver","murder","mutha","muthafecker","muthafuckaz","muthafucker","muthafuckker","muther","mutherfucker","mutherfucking","muthrfucking","n1gga","n1gger","nad","nads","naked","napalm","nappy","nazi","nazism","need the dick","negro","nigg3r","nigg4h","nigga","niggah","niggas","niggaz","nigger","niggers","niggers","niggle","niglet","nimrod","ninny","nipple","nob","nob jokey","nobhead","nobjocky","nobjokey","nooky","numbnuts","nut butter","nutsack","nympho","omg","opiate","opium","oral","orally","organ","orgasim","orgasims","orgasm","orgasmic","orgasms","orgies","orgy","ovary","ovum","ovums","p.u.s.s.y.","p0rn","paddy","paki","pantie","panties","panty","pastie","pasty","pcp","pecker","pedo","pedophile","pedophilia","pedophiliac","pee","peepee","penetrate","penetration","penial","penile","penis","penisfucker","perversion","peyote","phalli","phallic","phonesex","phuck","phuk","phuked","phuking","phukked","phukking","phuks","phuq","pigfucker","pillowbiter","pimp","pimpis","pinko","piss","pissed","pisser","pissers","pisses","pissflaps","pissin","pissing","pissoff","piss-off","pissoff","pms","polack","pollock","poon","poontang","poop","porn","porno","pornography","pornos","pot","potty","prick","pricks","prig","pron","prostitute","prude","pube","pubic","pubis","punkass","punky","puss","pusse","pussi","pussies","pussy","pussy fart","pussy palace","pussypounder","pussys","puto","queaf","queaf","queef","queer","queero","queers","quicky","quim","rape","raped","raper","rapist","raunch","rectal","rectum","rectus","reefer","reetard","reich","retard","retarded","revue","rimjaw","rimjob","rimming","ritard","rtard","r-tard","rum","rump","rumprammer","ruski","s hit","s.h.i.t.","s.o.b.","s_h_i_t","s0b","sadism","sadist","sandbar","sausage queen","scag","scantily","schizo","schlong","screw","screwed","screwing","scroat","scrog","scrot","scrote","scrotum","scrud","scum","seaman","seamen","seduce","semen","sex","sexual","sh!+","sh!t","sh1t","s-h-1-t","shag","shagger","shaggin","shagging","shamedame","shemale","shi+","shit","s-h-i-t","shit fucker","shitdick","shite","shiteater","shited","shitey","shitface","shitfuck","shitfull","shithead","shithole","shithouse","shiting","shitings","shits","shitt","shitted","shitter","shitters","shitting","shittings","shitty","shitty","shiz","sissy","skag","skank","slave","sleaze","sleazy","slope","slut","slut bucket","slutdumper","slutkiss","sluts","smegma","smut","smutty","snatch","sniper","snuff","s-o-b","sodom","son-of-a-bitch","souse","soused","spac","sperm","spic","spick","spik","spiks","spooge","spunk","stfu","stiffy","stoned","strip","stupid","suck","sucked","sucking","sumofabiatch","t1t","t1tt1e5","t1tties","tampon","tard","tawdry","teabagging","teat","teets","teez","terd","teste","testee","testes","testical","testicle","testis","thrust","thug","tinkle","tit","tit wank","titfuck","titi","tits","titt","tittie5","tittiefucker","titties","titty","tittyfuck","tittyfucker","tittywank","titwank","toke","toots","tosser","tramp","transsexual","trashy","tubgirl","turd","tush","tw4t","twat","twathead","twats","twatty","twunt","twunter","ugly","undies","unwed","urinal","urine","uterus","uzi","v14gra","v1gra","vag","vagina","valium","viagra","virgin","vixen","vodka","vomit","voyeur","vulgar","vulva","w00se","wad","wang","wank","wanker","wanky","wazoo","wedgie","weed","weenie","weewee","weiner","weirdo","wench","wetback","wh0re","wh0reface","whitey","whiz","whoar","whoralicious","whore","whorealicious","whored","whoreface","whorehopper","whorehouse","whores","whoring","wigger","willies","willy","womb","woody","wop","wtf","xrated","x-rated","xxx","yeasty","yobbo","zoophile"]
filterSet = set(filterList)

def fullfilter(fStr):
	wordList = [word.strip("':,!-()[]{}.?\";").lower() for word in fStr.split()]
	wordSet = set(wordList)
	matchSet = wordSet &amp; filterSet
	singleCharSet = set([fStr]) if len(fStr) == 1 else set([])
	matchSet = matchSet | singleCharSet
	if len(matchSet) gt 0:
		return matchSet
	else:
		return set([])
		
def partfilter(fStr):
	shortList = [eword for eword in filterList if eword in fStr.lower()]
	partialMatchList = []
	for eachWord in shortList:
		hitList = re.findall("[^':,!-()\[]{}.?\";\s]*"+eachWord+"[^':,!-()\[]{}.?\";\s]*",fStr.lower())
		[partialMatchList.append(ehit) for ehit in hitList if ehit not in partialMatchList]
	return set(partialMatchList)


def wfilter(qObj,debug=False):
	hasRows = qObj.rows[0].label != ""
	hasCols = qObj.cols[0].label != ""
	qFullMatchSet = set([])
	qPartMatchSet = set([])
	valList = []
	if hasRows and hasCols:
		for eachRow in qObj.rows:
			for eachCol in eachRow:
				if isinstance(eachCol.val, basestring):
					valList.append((eachCol.val,eachRow,eachCol))
	
	if hasRows:
		for eachRow in qObj.rows:
			if eachRow.o.open == 1 and isinstance(eachRow.open, basestring):
				valList.append((eachRow.open,eachRow,None))
			if not hasCols and isinstance(eachRow.val, basestring):
				valList.append((eachRow.val,eachRow,None))
	if hasCols:
		for eachCol in qObj.cols:
			if eachCol.o.open == 1 and isinstance(eachCol.open, basestring):
				valList.append((eachCol.open,None,eachCol))
			if not hasRows and isinstance(eachCol.val, basestring):
				valList.append((eachCol.val,None,eachCol))
	if not (hasRows or hasCols) and isinstance(qObj.val, basestring):
		valList.append((qObj.val,None,None))
	
	for eachTuple in valList:
		eVal, vRow, vCol = eachTuple
		qFullMatchSet = qFullMatchSet | fullfilter(eVal)
		#qPartMatchSet = qPartMatchSet | partfilter(eVal)
	#return (qFullMatchSet, qPartMatchSet)
	return (qFullMatchSet, )
</exec>

<text 
  label="vWF_"
  optional="0"
  size="40">
  <title>Virtual: word filter</title>
  <virtual>
import time
start = time.time()
qList = [ekey for ekey in allQuestions.keys() if isQuestion(ekey)]

fullMatchSet = set([])
#partMatchSet = set([])

fullFlaggedQuestions = []
#partFlaggedQuestions = []

for eachQ in qList:
	qMatches = wfilter(allQuestions[eachQ])
	if len(qMatches[0]) gt 0:
		allQuestions[this.label].flag.val = "1"
		fullFlaggedQuestions.append(eachQ)
	#if len(qMatches[1]) gt 0:
	#	allQuestions[this.label].partFlag.val = "1"
	#	partFlaggedQuestions.append(eachQ)
	
	
	fullMatchSet = fullMatchSet | qMatches[0]
	#partMatchSet = partMatchSet | qMatches[1]


#partMatchSet = partMatchSet - fullMatchSet

allQuestions[this.label].qLabels.val = ",".join(fullFlaggedQuestions)
allQuestions[this.label].words.val = ",".join( [eitem for eitem in fullMatchSet] )
#allQuestions[this.label].partQLabels.val = ",".join(partFlaggedQuestions)
#allQuestions[this.label].partWords.val = ",".join( [eitem for eitem in partMatchSet] )
allQuestions[this.label].execTime.val = str((time.time() - start)*1000)
  </virtual>

  <row label="flag" where="notdp,none">Full Match Flag</row>
  <row label="qLabels">Full Match Questions</row>
  <row label="words">Full Match Words</row>
  <row label="partFlag" where="notdp,none">Partial Match Flag</row>
  <row label="partQLabels" where="notdp,none">Partial Match Questions</row>
  <row label="partWords" where="notdp,none">Partial Match Words</row>
  <row label="execTime">Match time</row>
</text>

<text 
  label="vWF"
  optional="0"
  size="40">
  <title>Full Match</title>
  <virtual>
vWF.val = vWF_.flag.val
  </virtual>

</text>

<text 
  label="vSTL_"
  optional="0"
  size="40">
  <title>Virtual: STL</title>
  <virtual>
import time
sTime = time.time()
qList = [ekey for ekey in allQuestions.keys() if isSTL(ekey)]

thisQ = allQuestions[this.label]

stlMatches = [] # Create a list to store matches

for eachQLabel in qList:
	# Get question object, type, and grouping
	eachQ = allQuestions[eachQLabel]
	eachTag = eachQ.o.getName().lower()
	qGrouping = eachQ.o.grouping

	# Get the number of columns in each dimension
	# An implicit column or row always exists - the minimum value of len(Q.rows/cols) is 1
	numRows = len(eachQ.rows)
	numCols = len(eachQ.cols)


	# A radio question must be larger than 3x3 to be checked for straightliners
	if eachTag == "radio":
		if qGrouping.rows and (numRows lt 4 or numCols lt 3):
			continue
		elif qGrouping.cols and (numCols lt 4 or numRows lt 3):
			continue
			
	# A select question may not have both multiple rows and multiple columns to be checked for straightliners
	# A select question must have at least 4 rows or at least 4 columns to be checked for straightliners
	elif eachTag == "select":
		if numRows gt 1 and numCols gt 1:
			continue
		elif numCols le 1 and numRows lt 4:
			continue
		elif numRows le 1 and numCols lt 4:
			continue

	
	# Get the list of the value holding objects from the question (depending on grouping for radio and number of rows/columns for select)		
	if eachTag == "radio":
		qGrouping = eachQ.o.grouping
		cellList = eachQ.rows if qGrouping.rows else eachQ.cols
	elif eachTag == "select":
		cellList = eachQ.rows if numRows gt 1 else eachQ.cols
	else:
		continue

	# Turn the list of values (for displayed rows/columns) into a set
	# For straightliners, that set will contain only one item - the same answer they gave everywhere
	
	qValList = [eCell.ival for eCell in cellList if eCell.any]
	
	if len(set(qValList)) == 1 and len(qValList) gt 1:
		thisQ.flag.val = "1"
		stlMatches.append(eachQ.label)



thisQ.qLabels.val = ",".join(stlMatches)				# Record straightliner matches in qLabels row
thisQ.execTime.val = str((time.time() - sTime)*1000)	# Record execution time for debugging purposes
  </virtual>

  <row label="flag" where="none,notdp">Straightlining</row>
  <row label="qLabels">Straightlining question labels</row>
  <row label="execTime">Execution time</row>
</text>

<text 
  label="vSTL"
  optional="0"
  size="40">
  <title>STL</title>
  <virtual>
data.val = vSTL_.flag.val
  </virtual>
</text>`;

//QUESTION COMMENTS
const comments = {
	english: {
		radio: `Select one`,
		radio2d: `Select one in each row`,
		checkbox: `Select all that apply`,
		number: `Please enter a whole number`,
		float: `Please enter a number`,
		autosumPercent: `Please enter a whole number. Your answers should total 100%`,
		text: `Please be as specific as possible`,
		slidernumber: `Drag each slider to a point on the scale`
	},
	german: {
		radio: `Bitte w&amp;#228;hlen Sie nur eine Antwort aus.`,
		radio2d: `Bitte w&amp;#228;hlen Sie in jeder Zeile eine Antwort aus.`,
		checkbox: `Bitte w&amp;#228;hlen Sie alle passenden Antworten aus.`,
		number: `Bitte geben Sie eine ganze Zahl an.`,
		float: `Bitte geben Sie eine Zahl an.`,
		autosumPercent: `Bitte geben Sie ganze Zahlen an. Die Summe muss 100% betragen.`,
		text: `Bitte seien Sie so konkret wie m&amp;#246;glich.`,
		slidernumber: `Drag each slider to a point on the scale`
	},
	french: {
		radio: `Veuillez s&amp;eacute;lectionner l&amp;#039;une de ces r&amp;eacute;ponses`,
		radio2d: `Veuillez s&amp;eacute;lectionner l&amp;rsquo;une de ces r&amp;eacute;ponses pour chaque ligne`,
		checkbox: `Plusieurs r&amp;eacute;ponses possibles`,
		number: `Veuillez entrer un nombre entier`,
		float: `Veuillez entrer un nombre`,
		autosumPercent: `Veuillez entrer un nombre entier. Le total de vos r&amp;eacute;ponses doit &amp;ecirc;tre de 100%.`,
		text: `Veuillez &amp;ecirc;tre le plus pr&amp;eacute;cis possible`,
		slidernumber: `Drag each slider to a point on the scale`
	}
};

const defaultComments = JSON.parse(JSON.stringify(comments)); // deep clone at startup

const autosum_validate_rows = `
for eachRow in [x for x in this.rows if hasattr(x,"open")]:
	if len([1 for eachCol in this.cols if this.rows[eachRow.index][eachCol.index].val not in [0, "", None]]) &gt; 0 and eachRow.open in ["", None]:
		error(this.lget("extraInfo"), eachRow)
	elif len([1 for eachCol in this.cols if this.rows[eachRow.index][eachCol.index].val not in [0, "", None]]) == 0 and eachRow.open not in ["", None]:
		error(this.lget("extraSelect"), eachRow)
`;

const autosum_validate_cols = `
for eachCol in [x for x in this.cols if hasattr(x,"open")]:
	if len([1 for eachRow in this.rows if this.cols[eachCol.index][eachRow.index].val not in [0, "", None]]) &gt; 0 and eachCol.open in ["", None]:
		error(this.lget("extraInfo"), eachCol)
	elif len([1 for eachRow in this.rows if this.cols[eachCol.index][eachRow.index].val not in [0, "", None]]) == 0 and eachCol.open not in ["", None]:
		error(this.lget("extraSelect"), eachCol)
`;

const QUALBOARD_USER_CREATION_API_RES = `
<res label="qual_email">Here is your login information for QualBoard (the online platform you will be using for this study).
<br /><br />
Name: <b>\${contact.r1.unsafe_val}</b>
<br />
Email: <b>\${contact.r9.unsafe_val}</b>
<br />
Temporary password: <b>[pipe: pass_pipe]</b>
<br /><br />
Click <a href="https://qb4.qualboard.com" target="_blank">here to access QualBoard</a>. Please use the above credentials when logging in.</res>
`;

const CLTNOTE = `
<note>CREATE A LANDING PAGE SURVEY WITH AN OPEN LINK SAMPLE SOURCE AND A QUESTION ASKING FOR RESPONDENT ID THAT WILL REDIRECT TO THIS QUESTION
REFERENCE ONCE LANDING PAGE SURVEYS FOR CLT PROJECTS IF NEEDED</note>`;

const CONTACT_QUESTION_IHUT = `
<text 
  label="contact"
  mls="english"
  optional="0"
  size="25">
  <title><b>Thank you for your responses!</b>
<br /><br />
To ensure we have your correct mailing address to send you the product <b><u>if you are selected for this test</u></b>, please complete the following information. 
This information will <b>only</b> be used to send you products for this test.  Your telephone number is requested if we need to contact you regarding the product or the test. 
Again, it will not be used for any other purpose beyond this test.  After typing in the information requested, please review before clicking on the <b>Continue</b> button so that you can be sure the information is correct.
<br /><br />
<b style="color: red;"><u>NOTE: WE WILL NOT BE ABLE TO SHIP TO A PO BOX!</u></b>
  </title>
  <validate>
validStates = ["AL","AK","AS","AZ","AR","AA","AP","AE","CA","CO","CT","DE","DC",
"FM","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA",
"MI","MN","MS","MO","MP","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
"OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY"]
  
if this.r6.displayed and this.r6.val not in validStates:
	error(res["%s,stateErr"%this.label], this.r6)

searchStr = "[\\"~%$#@*(){}\\[\\]|\\\\\\\\&amp;+_=&lt;&gt;?/\`:;,]"
allowed_chars = flatten([range(65,91), range(97,123)])

for erow in this.rows:
	if erow.displayed and erow.label in ['r1','r2']:
		if re.search(searchStr, erow.unsafe_val) != None:
			error(res["%s,nameErr"%this.label], row=erow)
		
		for eSymbol in map(ord, erow.unsafe_val.replace(' ','')):
			if eSymbol not in allowed_chars:
				error(res["%s,characterError"%this.label], row=erow)
				
if this.r9.any and this.r8.any and (this.r9.val != this.r8.val):
	error(res["%s,email_err"%this.label],row=this.r8)
	error(res["%s,email_err"%this.label],row=this.r9)
  </validate>
  <res label="email_err">The provided emails do not match. Please review and correct if needed.</res>
  <res label="sys_lenAtMost">Your answer must be <b>at most $(max)</b> characters long, but I counted $(count)</res>
  <res label="stateErr">Please enter the state as a two letter abbreviation, in the "AA" format.</res>
  <res label="nameErr">Invalid character entered. The following characters are not allowed: \\"~%$#@*(){}[]|&amp;+_=&lt;&gt;?/\`:;,</res>
  <res label="characterError">Please write only standard ASCII symbols</res>
  <row label="r1" verify="len(1,20)">FIRST NAME:</row>
  <row label="r2" verify="len(1,20)">LAST NAME:</row>
  <row label="r3" verify="len(1,30)">ADDRESS:</row>
  <row label="r4" optional="1" verify="len(0,30)">ADDRESS 2 (optional):</row>
  <row label="r5" verify="len(1,19)">CITY:</row>
  <row label="r6">STATE:</row>
  <row label="r7" verify="zipcode">ZIP:</row>
  <row label="r8" verify="email">EMAIL:</row>
  <row label="r9" verify="email">CONFIRM EMAIL:</row>
  <row label="r10" verify="phoneUS">PHONE NUMBER:</row>
</text>

<suspend/>
`;

const OTS_API = `
<logic label="OTS_LIVE" api:headers="{'contentType': 'application/json', 'authkey':'Doj7FVeI9GceozZv2hqKOBXLcrXu75cHjHcuvVuDWte08jbRf'}" api:method="POST" api:url="https://otswsv2.overtheshoulder.com/OTSService.svc/Decipher/\${assignmentID}/\${participantID}" uses="api.1"/>
<text 
  label="OTS_LIVE_RESPONSE"
  size="40"
  sst="0"
  where="execute,survey,report">
  <title>Hidden: API Live response.</title>
  <exec>
tq = thisQuestion

# Initialize
tq.val = None

response = OTS_LIVE.r

print response.encode('utf-8-sig')
  </exec>

</text>

<suspend/>
`;

const OTS_SCREENER_PART_1 = `
<block label="OTS_SCREENER_QUESTIONS">
  <radio 
   label="OTS1">
    <title>
  This project will take place using a free mobile app called Qualmobile. 
  Once you download the Qualmobile app, we will send you questions and you will be able to respond right from the comfort of your smartphone. 
  <br /><br />
  Most people have a lot of fun in our studies. Is this something you would enjoy participating in?
  </title>
    <comment>Select one</comment>
    <row label="r1">Yes</row>
    <row label="r2">No</row>
  </radio>

  <suspend/>

  <term label="term_OTS1" cond="OTS1.r2">OTS1: Does not want to participate.</term>

  <radio 
   label="OTS2">
    <title>
  First, please take a look at the installed apps on your phone. 
  Do you currently have the QualMobile app on your phone. It will look like this:
  <br /><br />
  <div style="text-align: center;"><img src="/survey/selfserve/1819/g0db/230817/QualMobile.jpg" /></div>
  </title>
    <comment>Select one</comment>
    <row label="r1">Yes, I have the app on my phone now</row>
    <row label="r2">No, I do not have the app on my phone</row>
  </radio>

  <suspend/>

  <block label="OTS3_OTS8" cond="OTS2.r2">
    <radio 
    label="OTS3">
      <title>
  The next couple of questions are to check to make sure your smartphone will work with our app. 
  Please note: The Qualmobile app only works on smartphones, not tablets.
  <br /> 
  Please indicate the type of smartphone you have below.
  </title>
      <comment>Select one</comment>
      <row label="r1">Android</row>
      <row label="r2">Blackberry</row>
      <row label="r3">iPhone</row>
      <row label="r4">Windows Phone</row>

      <row label="r5">Google Phone</row>
      <row label="r6">Other</row>
      <row label="r7">No Smartphone</row>
    </radio>

    <suspend/>

    <term label="term_OTS3" cond="OTS3.any and not(OTS3.r1 or OTS3.r3)">OTS3: Does not have Android or iPhone device.</term>

    <radio 
    label="OTS4"
    cond="OTS3.r1">
      <title>
  Does your Android operate on Version 8.0 or higher? 
  (Go to "Settings" from your home screen, then hit "More", then select "About Device" if you are not sure.)
  </title>
      <comment>Select one</comment>
      <row label="r1">Yes</row>
      <row label="r2">No</row>
    </radio>

    <suspend/>

    <term label="term_OTS4" cond="OTS4.r2">OTS4: Android Version under 8.0.</term>

    <checkbox 
    label="OTS5"
    cond="OTS3.r1"
    atleast="1">
      <title>Do any of the following apply to your device?</title>
      <comment>Select all that apply</comment>
      <row label="r1">My device is "rooted" to run unofficial versions of Android</row>
      <row label="r2">My device is blocked from downloading certain apps by my employer</row>
      <row label="r3" exclusive="1" randomize="0">None of these apply to my device</row>
    </checkbox>

    <suspend/>

    <term label="term_OTS5" cond="OTS5.any and not OTS5.r3">OTS5: Has a rooted or blocked device.</term>

    <radio 
    label="OTS6"
    cond="OTS3.r3">
      <title>Does your iPhone operate iOS Version 8.0 or higher? (Check in your "Settings", then "General", then "About" if you are not sure.)</title>
      <comment>Select one</comment>
      <row label="r1">Yes</row>
      <row label="r2">No</row>
    </radio>

    <suspend/>

    <term label="term_OTS6" cond="OTS6.r2">OTS6: iOS Version under 8.0.</term>

    <checkbox 
    label="OTS7"
    cond="OTS3.r3"
    atleast="1">
      <title>Do any of the following apply to your device?</title>
      <comment>Select all that apply</comment>
      <row label="r1">My device is "jailbroken"</row>
      <row label="r2">My device is blocked from downloading certain apps by my employer</row>
      <row label="r3" exclusive="1" randomize="0">None of these apply to my device</row>
    </checkbox>

    <suspend/>

    <term label="term_OTS7" cond="OTS7.any and not OTS7.r3">OTS7: Has a "jailbroken" or blocked device.</term>

    <radio 
    label="OTS8">
      <title>
  We find devices with less than 100MB of storage do not work well with the Qualmobile app.
  <br /><br />
  Does your device have at least 100MB of free memory space?
  </title>
      <comment>Select one</comment>
      <row label="r1">Yes</row>
      <row label="r2">No</row>
    </radio>

    <suspend/>

    <term label="term_OTS8" cond="OTS8.r2">OTS8: Device does not have at least 100MB of free space.</term>
  </block>

  <checkbox 
   label="OTS9"
   cond="OTS2.r1"
   atleast="1">
    <title>First, we need you to delete it/uninstall the QualMobile app currently on your phone.</title>
    <row label="r1">Got it, deleting/uninstalling now</row>
  </checkbox>

  <suspend/>

  <radio 
   label="OTS10">
    <title>
  Now, you need to find and download the QualMobile app on your phone.
  <br /><br />
  Please go to the App Store or Google Play on your phone and search for QualMobile. It should look like this:
  <br /><br />
  <div style="text-align: center;"><img src="/survey/selfserve/1819/g0db/230817/QualMobile_Search.jpg" /></div>
  </title>
    <comment>Select one</comment>
    <row label="r1">Found it, downloading now</row>
    <row label="r2">I am unable to download the app right now but will do it later today</row>
    <row label="r3">I can't find it</row>
  </radio>

  <suspend/>

  <term label="term_OTS10" cond="OTS10.r3">OTS10: Cannot find QualMobile app.</term>

  <html label="OTS11" where="survey">Great! On the next page, you will see your Username and Password.  
<br /><br />
You will need this to log in so please take a screenshot or jot it down on a piece of paper, so you have it handy.</html>

  <suspend/>
`;

function OTS_SCREENER_PART_2(snumber){
	return `
 <block label="bOTS_API" cond="not gv.isSST()">
    <textarea 
    label="QualMobile_DATA"
    where="execute,survey,report">
      <title>Hidden: QualMobile API DATA</title>
      <exec>
tq = thisQuestion

# Initialize
tq.rHead.val = None
tq.rData.val = None

current_date = str(datetime.datetime.now().strftime('%m/%d/%Y'))

respondent_id = code or ESERID

p.aHead = {'contentType': 'application/x-www-form-urlencoded; charset=UTF-8'}

p.aData = {
'email'				: contact.r9.unsafe_val,
'current_date'		: current_date,
'first_name'		: contact.r1.unsafe_val,
'last_name'			: contact.r2.unsafe_val,
'response_id'		: respondent_id,
}

p.logicURL = "email=%(email)s&amp;current_date=%(current_date)s&amp;first_name=%(first_name)s&amp;last_name=%(last_name)s&amp;response_id=%(response_id)s" % p.aData

print p.logicURL

tq.rHead.val = str(p.aHead).replace("'",'*').replace('*','"')
tq.rData.val = str(p.aData).replace("'",'*').replace('*','"')
      </exec>

      <row label="rHead">aHead</row>
      <row label="rData">aData</row>
    </textarea>

    <suspend/>

    <note>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	ALWAYS ASK PM TO PROVIDE THE ProjectID FOR api:url - current ID here leads to a test survey and MUST BE REPLACED !!!!

			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</note>
    <logic label="QualMobile" api:data="QualMobile_DATA.rData.unsafe_val" api:headers="{'contentType': 'application/x-www-form-urlencoded;charset=UTF-8'}" api:method="POST" api:params="{'dataType':  'html'}" api:url="https://cms.overtheshoulder.com/Participants/AddParticipant.aspx?ProjectID=8831&amp;\${p.logicURL}" uses="api.1"/>
    <text 
    label="QualMobile_RESPONSE"
    size="40"
    where="execute,survey,report">
      <title>Hidden: QualMobile API response.</title>
      <exec>
tq = thisQuestion

response = QualMobile.r

print response
print QualMobile.status

import re
pattern = re.finditer(r"(\\w+)[=](?P&lt;Password&gt;\\w+)&amp;(\\w+)[=](?P&lt;Username&gt;\\w+)", response)

if pattern:
	for each_match in pattern:
		tq.password.val = each_match.group("Password")
		tq.username.val = each_match.group("Username")


if not tq.any:
	setMarker("OTS_Dupe")
      </exec>

      <row label="password">Password</row>
      <row label="username">Username</row>
    </text>

    <suspend/>

    <html label="OTS_DUPE" cond="hasMarker('OTS_Dupe')" final="1" where="survey">The email address you provided is already in use in this study. 
  <br /><br />
  If you already completed this survey before, you should have received a welcome email with your login credentials. 
  <br /><br />
  Please check your junk mail folder or contact us for assistance.</html>

    <suspend/>
  </block>

  <html label="OTS12" where="survey">Here is your Username and password.
<br />
PLEASE NOTE: this was emailed to you as well from <a href="mailto:ihuthelp@sago.com?Subject=${snumber}">ihuthelp@sago.com</a>
<br /><br />
Username: \${QualMobile_RESPONSE.username.unsafe_val}
<br />
Password: \${QualMobile_RESPONSE.password.unsafe_val}</html>

  <suspend/>

  <radio 
   label="OTS13">
    <title>
  Once logged in, you will receive the project's welcome message and your first assignment, "Welcome &amp; Tutorial".
  <br /><br />
  This assignment must be completed within 24 hours of receipt, or you may be canceled from the study. 
  </title>
    <comment>Select one</comment>
    <row label="r1">I understand and will complete the Welcome &amp; Tutorial Assignment within 24 hours</row>
    <row label="r2">I am unable to complete the Welcome &amp; Tutorial Assignment within 24 hours</row>
  </radio>

  <suspend/>

  <term label="term_OTS13" cond="OTS13.r2">OTS13: Unable to complete the Welcome &amp; Tutorial Assignment.</term>

  <html label="OTS14" where="survey">Great! You will submit your answers and complete tasks through the Qualmobile app for this study.
<br /><br />
Please rest assured, all information will only be used for the purposes of this study and will be treated in the strictest confidence. 
<br /><br />
Please note, we consider this a firm commitment on your part. 
We are under obligation to our client to schedule the required number of participants and we must replace you if you fail to meet deadlines throughout the study. 
<br /><br />
Don't forget, if you do not complete the Welcome &amp; Tutorial assignment within 24 hours of receipt, please understand we may need to cancel you from the project.</html>

  <suspend/>

  <html label="OTS15" where="survey">You can disregard the mention of a phone call to confirm your appointment, 
we consider the completion of the Welcome &amp; Tutorial assignment in the app your confirmation. 
You will not receive a phone call to confirm your participation.</html>

  <suspend/>

  <html label="OTS16" where="survey">On the next screen you will be asked to schedule yourself for this project.
<br />
THIS IS NOT AN ACTUAL APPOINTMENT.  
<br />
This is just a placeholder saying you AGREE to participate in the study.</html>

  <suspend/>
</block>
`;
}

const VERITY_API = `<textarea 
  label="Verity_DATA"
  where="execute,survey,report">
  <title>Hidden: Verity Request Data.</title>
  <exec>
p.aHead = {
 "X-UserName":"schlesinger",
 "X-Password":"Bv5c8JhZ",
 "Content-type":"application/json;charset=UTF-8",
}

p.aData = {
 'ClientId'			:'174',
 'FirstName'		:'%s' % contact.r1.unsafe_val,
 'LastName'			:'%s' % contact.r2.unsafe_val,
 'AddressLine1'		:'%s' % contact.r3.unsafe_val,
 'AddressLine2'		:'%s' % contact.r4.unsafe_val,
 'City'				:'%s' % contact.r5.unsafe_val,
 'State'			:'%s' % contact.r6.unsafe_val,
 'PostalCode'		:'%s' % contact.r7.unsafe_val,
 'CountryCode'		:'US',
 'DOB'				:'',
 'SSN4'				:'',
 'OutputCase'		:'C',
 'QueryVerityPlus'	:'N',
 'QueryChallenge'	:'N',
 'IPAddress'		:'',
 'VID'				:''
}

thisQuestion.rHead.val = str(p.aHead).replace("'",'*').replace('*','"')
thisQuestion.rData.val = str(p.aData).replace("'",'*').replace('*','"')
  </exec>

  <row label="rHead">aHead</row>
  <row label="rData">aData</row>
</textarea>

<suspend/>

<logic label="VerityAPI" api:data="Verity_DATA.rData.unsafe_val" api:headers="{&quot;X-UserName&quot;:&quot;schlesinger&quot;,&quot;X-Password&quot;:&quot;Bv5c8JhZ&quot;,&quot;Content-type&quot;:&quot;application/json;charset=UTF-8&quot;}" api:method="POST" api:url="https://verity.imperium.com/api/ValidateData" uses="api.1">
  <title>Verity API Integration</title></logic>
<suspend/>

<exec>
#### this prints the status (should be 200 or 201)
print VerityAPI.status
print ""

response = VerityAPI.r

import re

response = str(re.sub("u'", "'", str(response)))

print response
print ""

#### this puts the response into the two hidden variables
Verity_Response.val = response


#### Prints out the response into lines.
response_dic = VerityAPI.r
response_list = {}

for key, value in response_dic.items():
	if isinstance(value, dict):
		for k, v in value.items():
			print k + " : " + str(v)
			response_list[k] = str(v)
	else:
		print key +" : "+ str(value)
		response_list[key] = str(value)


for erow in Verity_response_lines.rows:
	if erow.text in response_list.keys():
		print response_list[erow.text]
		erow.val = response_list[erow.text]
</exec>

<textarea 
  label="Verity_Response"
  where="execute,survey,report">
  <title>Hidden: Verity Response</title>
</textarea>

<text 
  label="Verity_response_lines"
  size="40"
  ss:listDisplay="0"
  where="execute,survey,report">
  <title>Shows Verity Response line by line.</title>
  <group label="g1">AddressCorrection</group>
  <group label="g2">VID</group>
  <group label="g3">GeoCorrelationFlag</group>
  <group label="g4">MessageCodes</group>
  <group label="g5">Challenge</group>
  <group label="g6">SSN4ProcessError</group>
  <group label="g7">Score</group>
  <group label="g8">ProcessCode</group>
  <group label="g9">UDF1</group>
  <group label="g10">UDF3</group>
  <group label="g11">UDF2</group>
  <group label="g12">Enhanced</group>
  <group label="g13">ErrorMsg</group>
  <group label="g14">Corrections</group>
  <group label="g15">MatchResults</group>
  <row label="r1" groups="g1">Building</row>
  <row label="r2" groups="g1">City</row>
  <row label="r3" groups="g1">DPCheck</row>
  <row label="r4" groups="g1">RecordType</row>
  <row label="r5" groups="g1">CountryCode</row>
  <row label="r6" groups="g1">Secondary</row>
  <row label="r7" groups="g1">MatchLevel</row>
  <row label="r8" groups="g1">StateName</row>
  <row label="r9" groups="g1">Primary</row>
  <row label="r10" groups="g1">ZipCode</row>
  <row label="r11" groups="g1">County</row>
  <row label="r12" groups="g1">ErrorString</row>
  <row label="r13" groups="g1">State</row>
  <row label="r14" groups="g1">ProcessCodes</row>
  <row label="r15" groups="g1">AddKey</row>
  <row label="r16" groups="g1">ResultCode</row>
  <row label="r17" groups="g1">AddOn</row>
  <row label="r18" groups="g1">DP</row>
  <row label="r19" groups="g1">Street</row>
  <row label="r20" groups="g2">VID</row>
  <row label="r21" groups="g3">GeoCorrelationFlag</row>
  <row label="r22" groups="g4">MessageCodes</row>
  <row label="r23" groups="g5">AnswerChoices1</row>
  <row label="r24" groups="g5">AnswerChoices2</row>
  <row label="r25" groups="g5">AnswerChoices3</row>
  <row label="r26" groups="g5">QuestionText2</row>
  <row label="r27" groups="g5">QuestionText3</row>
  <row label="r28" groups="g5">QuestionText1</row>
  <row label="r29" groups="g5">ChallengeID</row>
  <row label="r30" groups="g5">UDF1</row>
  <row label="r31" groups="g5">UDF2</row>
  <row label="r32" groups="g6">SSN4ProcessError</row>
  <row label="r33" groups="g7">Score</row>
  <row label="r34" groups="g8">ProcessCode</row>
  <row label="r35" groups="g9">UDF1</row>
  <row label="r36" groups="g10">UDF3</row>
  <row label="r37" groups="g11">UDF2</row>
  <row label="r38" groups="g12">MailOrderBuyer</row>
  <row label="r39" groups="g12">HomeMarketValue</row>
  <row label="r40" groups="g12">MailOrderResponder</row>
  <row label="r41" groups="g12">AdultAgeRanges</row>
  <row label="r42" groups="g12">Vehicle1Year</row>
  <row label="r43" groups="g12">MaritalStatus</row>
  <row label="r44" groups="g12">Vehicle2Make</row>
  <row label="r45" groups="g12">Vehicle1Make</row>
  <row label="r46" groups="g12">HouseholdIncome</row>
  <row label="r47" groups="g12">HomeOwnerRenter</row>
  <row label="r48" groups="g12">PoliticalParty</row>
  <row label="r49" groups="g12">Gender</row>
  <row label="r50" groups="g12">Age</row>
  <row label="r51" groups="g12">Vehicle2Model</row>
  <row label="r52" groups="g12">Vehicle1Model</row>
  <row label="r53" groups="g12">BusinessOwner</row>
  <row label="r54" groups="g12">MailOrderDonor</row>
  <row label="r55" groups="g12">Vehicle2Year</row>
  <row label="r56" groups="g12">ChildrensAgeRanges</row>
  <row label="r57" groups="g12">SuppressionMailDMA</row>
  <row label="r58" groups="g12">LengthOfResidence</row>
  <row label="r59" groups="g12">WorkingWoman</row>
  <row label="r60" groups="g12">Education</row>
  <row label="r61" groups="g12">Children</row>
  <row label="r62" groups="g12">Ethnicity</row>
  <row label="r63" groups="g12">Occupation</row>
  <row label="r64" groups="g13">ErrorMsg</row>
  <row label="r65" groups="g14">DOB</row>
  <row label="r66" groups="g14">LastName</row>
  <row label="r67" groups="g14">FirstName</row>
  <row label="r68" groups="g14">Address</row>
  <row label="r69" groups="g15">SSN4</row>
  <row label="r70" groups="g15">FirstName</row>
  <row label="r71" groups="g15">DOB</row>
  <row label="r72" groups="g15">LastName</row>
  <row label="r73" groups="g15">Phone</row>
  <row label="r74" groups="g15">Address</row>
  <row label="r75" groups="g15">Email</row>
</text>

<suspend/>

<radio 
  label="PII_CONFIRM"
  cond="Verity_response_lines.r33.val in ['1', '2', '3']">
  <title>
  Please confirm this is your address:
  <br /><br />
  \${contact.r3.unsafe_val}
  </title>
  <comment>Select one</comment>
  <row label="r1">Address is correct</row>
  <row label="r2">Address is <b>NOT</b> correct</row>
</radio>

<suspend/>

<text 
  label="ADDRESS"
  cond="PII_CONFIRM.r2"
  optional="0"
  size="40">
  <title>Please provide your address:</title>
</text>

<suspend/>`;