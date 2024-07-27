import("./node_modules/hls.js/dist/hls.js")

function generateAudioClip(){
	let d = $ ("#datepicker").val();
	let t = $ ("#timepicker").val();
	
	let srcLink = "https://bnr.bg/files/uploads/13/BNR-news-" + d + "-" + t + ".mp3"

	let player = $ (".audio-player");    
    player.attr("src",srcLink);
    
	player.load(); //just start buffering (preload)
	player.play(); //start playing
}

function roundMinutes(date) {
    date.setHours(date.getHours() );
    date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
    return date;
}
function join(t, a, s) {
   function format(m) {
      let f = new Intl.DateTimeFormat('en', m);
      return f.format(t);
   }
   return a.map(format).join(s);
}

$ (document).ready(function(){
	$ (":text").attr("autocomplete","off");
	
	$ ("#datepicker").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "yy-mm-dd",
		yearRange: "2015:+0",
		minDate: new Date(2015,0,1),
		maxDate: 0,
		defaultDate: new Date(),
		setDate: new Date(),
		})
		.keydown(function(e) {
			return $.inArray(e.which, [8,9,46,116]) != -1; 
		}).keyup(function(e) {
			if(e.which == 8 || e.which == 46) {
				$.datepicker._clearDate(this);
			} 
			$ (this).blur();
		});
	$('#datepicker').datepicker( $.datepicker.regional[ "bg" ] );
	
	$('#timepicker').timepicker({
		'timeFormat': 'H-i',
		'scrollDefault': 'now',
		'step': 60,
	
	});
	
	let today = new Date();
	
	[1,2,3,4,5].forEach(function(value,index){
		previous_date = roundMinutes(new Date(today.getTime() - index*(1000*60*60)))
			
		let pymd = previous_date.toISOString().slice(0,10);

		let ph = previous_date.getHours() < 10 ? "0" + previous_date.getHours() :  previous_date.getHours();
		
		let p_date_string = pymd + "-"+ ph + "-00";
		
		$ (".previous-couple").append("<li><a href='#'>Емисията от днес (" + pymd + ") в "+ph+":00 часа</a></li>").find("li:last").addClass(p_date_string)
	});
	
	$ (".previous-couple li").on("click",function(){
		
		let srcLink = "https://bnr.bg/files/uploads/13/BNR-news-" + $ (this).attr("class") + ".mp3"
	
		let player = $ (".audio-player");    
		player.attr("src",srcLink);
		
		player.load(); //just start buffering (preload)
		player.play(); //start playing
	});

	var video = $ (".audio-player-live");
	var videoSrc = 'https://lb-hls.cdn.bg/2032/fls/Horizont.stream/playlist.m3u8';
	if (Hls.isSupported()) {
		var hls = new Hls();
		hls.loadSource(videoSrc);
		hls.attachMedia(video);
	}
	// HLS.js is not supported on platforms that do not have Media Source
	// Extensions (MSE) enabled.
	//
	// When the browser has built-in HLS support (check using `canPlayType`),
	// we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
	// element through the `src` property. This is using the built-in support
	// of the plain video element, without using HLS.js.
	else if (video.canPlayType('application/vnd.apple.mpegurl')) {
	  video.src = videoSrc;
	}
});