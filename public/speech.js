window.speeching = false;
window.searchModule = function() {
window.serverURL = '';

  var googleApiKey = 'AIzaSyCS8-rNnFS6BGRk9hQkyg2152X6NuJxpiw',
    searchURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

  function renderSceneForResults(data) {
    if (data && data.length === 0) {
      alert('Oops! No data available. Please try again.');
      return;
    }
    $('#first-screen').attr('visible', false);
    $('#second-screen').attr('visible', true);
    $('#third-screen').attr('visible', false);

    if (!data) {
      $('#first-screen').attr('visible', true);
      $('#second-screen').attr('visible', false);
      $('#third-screen').attr('visible', false);
      return;
    }

    if ((data instanceof Array) !== true) {
      data = [data];
    }

    data.sort(function(a, b) {
      return b.rating - a.rating;
    });

    var entitySet = [];
    for (var i = 0; i < 10; i++) {
      var x = 0;
      var y = 0;
      var theta = i * 36;
      x = 8 * Math.cos(theta * Math.PI / 180);
      y = 8 * Math.sin(theta * Math.PI / 180);

      var rotate = 90 - (Math.atan(y / x) * 180) / Math.PI;
      if (i < 3 || i > 7) {
        rotate = rotate - 180;
      }

      data[i].latLng = data[i].geometry.location.lat + ',' + data[i].geometry.location.lng;
      data[i].imageUrl = data[i].photos && window.serverURL +
        '/webproxy?url=' +
        encodeURIComponent('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + data[i].photos[0].photo_reference + '&key=' + googleApiKey);
      $("#second-screen-content").append(
        "<a-entity>" +
        "<a-entity text='text: " + data[i].name + "'" +
        "material='color: #E4D354'" +
        "position='" + ((x) + " -2.5 " + (y + 0.9)) + "'" +
        "rotation= '0 " + (rotate) + " 0'" +
        "scale='0.4, 0.4, 0.4'>" +
        "</a-entity>" +
        "<a-curvedimage latLng=" + data[i].latLng + " class='image-grid' src='" + data[i].imageUrl + "'" +
        "height='3.0'" +
        "radius='8'" +
        "theta-length='-30'" +
        "theta-start='" + (-theta) + "'" +
        "rotation='0 100 0'" +
        "scale='0.8 0.8 0.8'>" +
        "</a-curvedimage>" +
        "</a-entity>"
      );

    };
    screenvisibility(false, true, false);
  }


  function getPlaceDetails(event) {
    var convertedText = event.results[0][0].transcript;
    console.log('said', convertedText);
    $('#search-text').attr('text', 'text:You asked for ' + convertedText + ' ;size:0.2;');
    if (convertedText.indexOf('india') > -1 || convertedText.indexOf('India') > -1) {
      console.log('Street images are not yet available in India');
      return new Promise(function(resolve, reject) {
        reject();
      });
    }
    var queryParams = encodeURIComponent(convertedText);
    return new Promise(function(resolve, reject) {

      $.ajax({
        url: window.serverURL + '/webproxy?url=' + encodeURIComponent(searchURL + '?query=' + queryParams + ' points of interest' + '&language=en&key=' + googleApiKey),
        dataType: 'json',
        crossDomain: true,
        type: 'GET',
        success: function(res) {
          var activitiesData = res.results ? res.results : [];
          resolve(activitiesData);
          $('#second-screen-content').html('');
        },
        error: function(err) {
          reject(err);
          console.log('failed to get place');
        }
      });
    });
  }


  function speechToPlace() {
    return new Promise(function(resolve, reject) {
      var recognition = new webkitSpeechRecognition();
      window.locationRecognizer = recognition;
      window.locationRecognizer.continuous = true;
      window.locationRecognizer.interimResults = false;
      window.locationRecognizer.lang = 'en-IN';
      window.locationRecognizer.onerror = function() {
        window.speeching = false;
      };
      window.locationRecognizer.onresult = function(evt) {
        window.speeching = false;
        console.log(evt);
        getPlaceDetails(evt).then(function(d) {
          resolve(d);
        }, function(err) {
          reject(err);
        });
      };
      window.locationRecognizer.onend = window.locationRecognizer.stop;
      if (window.speeching) {
        window.locationRecognizer.stop();
      }
        try {
          window.locationRecognizer.start();
        } catch (err) {
          console.log(err);
        }
        // window.speeching = true;
    });
  }

  function screenvisibility(firstScreen, secondScreen, thirdScreen) {
    $('#second-screen').attr('visible', secondScreen);
    $('#third-screen').attr('visible', thirdScreen);
    $('#first-screen').attr('visible', firstScreen);
    if (thirdScreen) {
      window.selectedScreen = 'third';
      $('#back-button').attr('visible', true);
    } else if (secondScreen) {
      window.selectedScreen = 'second';
      $('#back-button').attr('visible', true);
      $("#sky").attr('src', './assets/black.jpg');
    } else {
      window.selectedScreen = 'first';
      $('#back-button').attr('visible', false);
      $("#sky").attr('src', './assets/firstScreen.jpg');
    }
  }


  return {
    speechToPlace: speechToPlace,
    renderSceneForResults: renderSceneForResults,
    screenvisibility: screenvisibility
  };
};
