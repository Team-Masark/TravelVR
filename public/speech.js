var searchModule = function() {

  var expediaAPIkey = 'K2Ib5A0ODGSQ9eEqnmw5zyspMIlB4XT8',
    searchURL = 'http://terminal2.expedia.com:80/x/activities/search';

  function renderSceneForResults(searchResults) {
    const data = searchResults.results;

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
      return b.recommendationScore - a.recommendationScore;
    });

    var entitySet = [];
    for (var i = 0; i < 10; i++) {
      var x = 0;
      var y = 0;
      var theta = i * 36;
      x = 8 * Math.cos(theta * Math.PI / 180);
      y = 8 * Math.sin(theta * Math.PI / 180);

      data[i].title = data[i].name//data[i].title.split(/\s+/).slice(0, 3).join(" ");
      data[i].latLng = data[i].geometry.location.lat + ',' + data[i].geometry.location.lng
      var rotate = 90 - (Math.atan(y / x) * 180) / Math.PI;
      if (i < 3 || i > 7) {
        rotate = rotate - 180;
      }

      $("#second-screen-content").append(
        "<a-entity>" +
        '<a-ring color="white" radius-inner="0.001" radius-outer="0.5" rotation="90 0 0" position="0 2 0"></a-ring>' +
        '<a-entity text="text: < Back ;size:0.2;" material="color: #66E1B4" position="-0.35 1.9 0" rotation="90 0 0" scale="0.7 0.7 1"></a-entity>' +
        "<a-entity text='text: " + data[i].title + "'" +
        "material='color: #E4D354'" +
        "position='" + ((x) + " -2.5 " + (y + 0.9)) + "'" +
        "rotation= '0 " + (rotate) + " 0'" +
        "scale='0.4, 0.4, 0.4'>" +
        "</a-entity>" +
        "<a-curvedimage latLng=" + data[i].latLng + " class='image-grid' src='" + data[i].icon + "' " +
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
    return fetch('https://maps.googleapis.com/maps/api/geocode/json?&address=' + queryParams)
    .then(res => res.json())
    .then(res => {
        console.log(res.results[0].geometry.location)
        const placeLocation = res.results[0].geometry.location;
        return fetch(`/places?key=AIzaSyBKMNsXHIvpHQsH3ED2xYa-GQPL2gSNSFA&keyword=${queryParams}&radius=500&location=${placeLocation.lat},${placeLocation.lng}`)
    })
    .then(res => res.json())
    // .then(r => console.log(r))
    .catch(err => console.error(err));
    // return new Promise(function(resolve, reject) {
    //   $.get(searchURL + '?location=' + queryParams + '&&apikey=' + expediaAPIkey)
    //     .done(function(res) {
    //       console.log(res);
    //       var activitiesData = res.activities ? res.activities : {};
    //       resolve(activitiesData);
    //       $('#second-screen-content').html('');
    //     })
    //     .fail(function(err) {
    //       reject(err);
    //       console.log('failed to get place');
    //     });
    // });
  }


  function speechToPlace() {
    return new Promise(function(resolve, reject) {
      // var recognition = new webkitSpeechRecognition();
      // window.locationRecognizer = recognition;
      // window.locationRecognizer.continuous = true;
      // window.locationRecognizer.interimResults = false;
      // window.locationRecognizer.lang = 'en-IN';
      window.locationRecognizer.onresult = function(evt) {
        getPlaceDetails(evt).then(function(d) {
          resolve(d);
        }, function(err) {
          reject(err);
        });
      };
      window.locationRecognizer.onend = window.locationRecognizer.stop;
      window.locationRecognizer.start();
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
