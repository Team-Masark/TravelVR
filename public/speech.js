var speeching = false;
var searchModule = function() {

    var expediaAPIkey = 'K2Ib5A0ODGSQ9eEqnmw5zyspMIlB4XT8',
        searchURL = 'http://terminal2.expedia.com:80/x/activities/search';

    function renderSceneForResults(data) {

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

            data[i].title = data[i].title.split(/\s+/).slice(0, 3).join(" ");
            var rotate = 90 - (Math.atan(y / x) * 180) / Math.PI;
            if (i < 3 || i > 7) {
                rotate = rotate - 180;
            }

            $("#second-screen-content").append(
                "<a-entity>" +
                "<a-entity text='text: " + data[i].title + "'" +
                "material='color: #E4D354'" +
                "position='" + ((x) + " -2.5 " + (y + 0.9)) + "'" +
                "rotation= '0 " + (rotate) + " 0'" +
                "scale='0.4, 0.4, 0.4'>" +
                "</a-entity>" +
                "<a-curvedimage latLng=" + data[i].latLng + " class='image-grid' src='/webproxy?url=" + encodeURIComponent('http:' + data[i].imageUrl) + "'" +
                "height='3.0'" +
                "radius='8'" +
                "theta-length='-30'" +
                "theta-start='" + (-theta) + "'" +
                "rotation='0 100 0'" +
                "scale='0.8 0.8 0.8'>" +
                "</a-curvedimage>" +
                "</a-entity>"
            );
            console.log('imageUrl', data[i].imageUrl);

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
            $.get(searchURL + '?location=' + queryParams + '&&apikey=' + expediaAPIkey)
                .done(function(res) {
                    console.log(res);
                    var activitiesData = res.activities ? res.activities : {};
                    resolve(activitiesData);
                    $('#second-screen-content').html('');
                })
                .fail(function(err) {
                    reject(err);
                    console.log('failed to get place');
                });
        });
    }


    function speechToPlace() {
        return new Promise(function(resolve, reject) {
            // var recognition = new webkitSpeechRecognition();
            // window.locationRecognizer = recognition;
            // window.locationRecognizer.continuous = true;
            // window.locationRecognizer.interimResults = false;
            // window.locationRecognizer.lang = 'en-IN';
            window.locationRecognizer.onerror = function() {
                speeching = false;
            };
            window.locationRecognizer.onresult = function(evt) {
                speeching = false;
                getPlaceDetails(evt).then(function(d) {
                    resolve(d);
                }, function(err) {
                    reject(err);
                });
            };
            window.locationRecognizer.onend = window.locationRecognizer.stop;
            // if(speeching === false){
            try {
                window.locationRecognizer.start();
            } catch (err) {
                console.log(err);
            }
            // speeching = true;
            // }
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
