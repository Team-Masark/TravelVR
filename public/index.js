var serverURL = 'http://ec2-52-66-13-156.ap-south-1.compute.amazonaws.com:8080';

var searchModuleInstance = searchModule();

window.locationRecognizer = new webkitSpeechRecognition();
window.locationRecognizer.continuous = true;
window.locationRecognizer.interimResults = false;
window.locationRecognizer.lang = 'en-IN';
searchModuleInstance.screenvisibility(true, false, false);

$('#microphone')[0].addEventListener('stateadded', function(evt) {
  if (evt.target.is('hovered')) {
    searchModuleInstance.speechToPlace().then(function(res) {
      searchModuleInstance.renderSceneForResults(res);
      initGriddomClick();
    });
  }
});

$('#microphone')[0].addEventListener('stateremoved', function(evt) {
  if (!evt.target.is('hovered') && window.locationRecognizer) {
    window.locationRecognizer.stop();
  }
});

$('#back-button').click(function() {
  console.log('#back', window.selectedScreen);
  if (window.selectedScreen === 'second') {
    searchModuleInstance.screenvisibility(true, false, false);
  } else if (window.selectedScreen === 'third') {
    searchModuleInstance.screenvisibility(false, true, false);
  }
});

function latlongclicked(latlong) {
  $.post(serverURL + '/stitchtest', {
    lat: latlong.split(',')[0],
    long: latlong.split(',')[1]
  }).done(function(res) {
    console.log(res);
    var img = document.createElement('img');
    img.src = serverURL + res;
    img.height = 500;
    img.width = 500;
    searchModuleInstance.screenvisibility(false, false, true);
    $('#sky').attr('src', serverURL + res);

  }).fail(function(err) {
    console.log(err);
  });
}

function initGriddomClick() {
  $('.image-grid').click(function() {
    var latlong = $(this).attr('latLng');
    latlongclicked(latlong);
  });
}
