// set up video and canvas elements needed
var videoInput = document.getElementById('vid');
var canvasInput = document.getElementById('compare');
var canvasOverlay = document.getElementById('overlay')
var debugOverlay = document.getElementById('debug');
var overlayContext = canvasOverlay.getContext('2d');
canvasOverlay.style.position = "absolute";
canvasOverlay.style.top = '0px';
canvasOverlay.style.zIndex = '100001';
canvasOverlay.style.display = 'block';
debugOverlay.style.position = "absolute";
debugOverlay.style.top = '0px';
debugOverlay.style.zIndex = '100002';
debugOverlay.style.display = 'none';
var	santa = new Image();
santa.setAttribute('crossOrigin', 'anonymous');
santa.src = "//rawgit.com/devteaminc/elfie/master/i/santa.png";
// add some custom messaging
statusMessages = {
	"whitebalance" : "Finding your face",
	"detecting" : "Finding your face...",
	"hints" : "Hmmm...detecting your face is taking a while, you may need to refresh",
	"redetecting" : "Lost your of face, redetecting...",
	"lost" : "Lost your face :(",
	"found" : "Elfie!"
};
supportMessages = {
	"no getUserMedia" : "Unfortunately, <a href='http://dev.w3.org/2011/webrtc/editor/getusermedia.html'>getUserMedia</a> is not supported in your browser. Try <a href='http://www.opera.com/browser/'>downloading Opera 12</a> or <a href='http://caniuse.com/stream'>another browser that supports getUserMedia</a>. Now using fallback video for facedetection.",
	"no camera" : "No camera found. Using fallback video for facedetection."
};
document.addEventListener("headtrackrStatus", function(event) {
	if (event.status in supportMessages) {
		var messagep = document.getElementById('gUMMessage');
		messagep.innerHTML = supportMessages[event.status];
	} else if (event.status in statusMessages) {
		var messagep = document.getElementById('headtrackerMessage');
		messagep.innerHTML = statusMessages[event.status];
	}
}, true);
// the face tracking setup
var htracker = new headtrackr.Tracker({altVideo : {ogv : "./media/capture5.ogv", mp4 : "./media/capture5.mp4"}, calcAngles : true, ui : false, headPosition : false, debug : debugOverlay});
htracker.init(videoInput, canvasInput);
htracker.start();
// for each facetracking event received draw rectangle around tracked face on canvas
document.addEventListener("facetrackingEvent", function( event ) {
	// clear canvas
	overlayContext.clearRect(0,0,800,600);
	// once we have stable tracking, draw rectangle
	if (event.detection == "CS") {
		overlayContext.translate(event.x, event.y)
		overlayContext.rotate(event.angle-(Math.PI/2));
		overlayContext.drawImage(santa, (-(event.width/2 + 35)) >> 0, (-(event.height/2 + 30)) >> 0, event.width + 75, event.height + 30);
		overlayContext.rotate((Math.PI/2)-event.angle);
		overlayContext.translate(-event.x, -event.y);
	}
});
// turn off or on the canvas showing probability
function showProbabilityCanvas() {
	var debugCanvas = document.getElementById('debug');
	if (debugCanvas.style.display == 'none') {
		debugCanvas.style.display = 'block';
	} else {
		debugCanvas.style.display = 'none';
	}
}

OAuth.initialize("PLij0Qu_yjXkj-vfvHLVlI2fXTg");

function postCanvasToURL() {
	  var img = snap.toDataURL();
	  var file = dataURItoBlob(img);
	  var tweetText = $('#tweetText').text();

	  OAuth.popup("twitter").then(function(result) {
	      var data = new FormData();
	      data.append('status', tweetText);
	      // data.append('text', '#elfie http://devteaminc.co/');
	      data.append('media[]', file, 'elfie.png');
	      
	      return result.post('/1.1/statuses/update_with_media.json', {
	          data: data,
	          cache:false,
	          processData: false,
	          contentType: false
	      });
	  }).done(function(data){
	      var str = JSON.stringify(data, null, 2);
	      $('#result').html("Success\n" + str).show()
	  }).fail(function(e){
	      var errorTxt = JSON.stringify(e, null, 2)
	      $('#result').html("Error\n" + errorTxt).show()
	      console.log(e);
	  });
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

var snap = document.getElementById('flatten');
var ctx3 = snap.getContext('2d');

$('#snap').click(function(){

	if($('.clicked').length >= 0){
		$('.wrapper').removeClass('clicked');
		$('#tweet-wrapper').hide();
		$('#flatten').hide();
		$('.wrapper').addClass('clicked');
		setTimeout(function(){
			ctx3.drawImage(canvasInput, 0, 0);
			ctx3.drawImage(canvasOverlay, 0, 0);
			$('#flatten').show();
			$('#tweet-wrapper').show();
		},3000);
	} else {
		$('.wrapper').addClass('clicked');
		setTimeout(function(){
			ctx3.drawImage(canvasInput, 0, 0);
			ctx3.drawImage(canvasOverlay, 0, 0);
			$('#flatten').show();
			$('#tweet-wrapper').show();
		},3000);
	}
})

$('#tweet').click(function(){
	postCanvasToURL();
})

$('#refresh').click(function(){
	$('#tweet-wrapper').hide();
	$('#flatten').hide();
	$('.wrapper').removeClass('clicked');
})

if (window.location.protocol != "https:")
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
