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
santa.src = "i/santa.png";
// add some custom messaging
statusMessages = {
	"whitebalance" : "Finding your face",
	"detecting" : "Finding your face...",
	"hints" : "Hmmm...detecting your face is taking a while, you may need to refresh",
	"redetecting" : "Lost your of face, redetecting...",
	"lost" : "Lost your face :(",
	"found" : "Auto-Santa!"
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


//OAuth.io's logo in base64
var logo = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAKfSURBVHjabJNNSFRRGIafc+6d8Y6OM42aTmpNauRgUVBRVEwZCC6kdtGqRRBtWkWLKGgXtghaRIsK3ES0L4pKCPpZREX2oxnVlOn4V4026Tjj3HvPPS2asRp64OODw8v3cXjfTxinrlOGBHSxzgPjxW4Cqvj+j7icy8AVIAIcK5YPuAMc/9+2fxEioWz3sFoozCrloVzVrLKLtud6XQiRKKlKcrPYo8AbhEiq+Xxba2MN7dEwtqsQCExT8moszfRMNmFUWwN4uhKI/z1gHikCai6/fefaRlqiYW6+HGEunQU00cYaejbGeJacjgym0hEjGBhC66UvhIEWlbPHN6yqo7UhzLUbz9mxup65C4dInTtIxPLRd/sFW1vqaaoNoRw1DawAQhI4Awzi6fjahjD97ybAUfTuWc+Je6+5l5zmTOc6mMnydOQbm2N1sGh3AZNArwR6Pa0fRGqD5BYdvk7MEoo3sbG1npXVFsv8JtviTdAWZWjyB8pRUOkHuAqcNYEpDQOmFJ2O8iCbpyfegRSCk53rlszZFKtjYCiFqzyElAAPgQkTuGgIcfR7JkeouRYCfrw/Li1RcD38oQCW5UMvFKCqog/YYgJ9QAbHPTKbt5cnNrVy980op+uCzOVshBCYhmR4LM2+DTFG0vNgGu+BS8AjUYqyFiLp5QttBza38flnjudPPoDt/k5ulUX37g6k43JncAwjGOhH626A0oA1wEfl6UVs10q0NxK2fGQLLkJAqMLHeGaBF5++KllVYQjIF+13SkFKAi2GFN+wfMOP36ZiZqWfppogrqeZTM+jXYURtO4XN8cAp/wWvgA5YMoIWiOelPtHZ7JMZBYywm/uNSorQOvRona0/Bb+ZhcgBRQMQ14CUsAtoAoolIt/DQBMqAUSa5wR2gAAAABJRU5ErkJggg=="; 

//Convert base64 into blob
//cf http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}


OAuth.initialize("30q5ltAquXE7JCRtT7QSgI7QZ", {cache:true});

function postCanvasToURL() {
	  // var data = snap.toDataURL('image/png');
	  // var file = dataURItoBlob(data);

	  // var fd = new FormData();
	  // fd.append("media[]", file);
	  // fd.append("key", "30q5ltAquXE7JCRtT7QSgI7QZ");
	  // var xhr = new XMLHttpRequest();
	  // xhr.open("POST", "https://api.twitter.com/1.1/statuses/update.json?");
	  // xhr.send(fd);


	  OAuth.popup("twitter").then(function(result) {
	      var data = new FormData();
	      data.append('status', 'Blob to PNG');
	      data.append('media[]', b64toBlob(logo), 'logo.png');
	      
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
	ctx3.drawImage(canvasInput, 0, 0);
	ctx3.drawImage(canvasOverlay, 0, 0);
	postCanvasToURL();
})


