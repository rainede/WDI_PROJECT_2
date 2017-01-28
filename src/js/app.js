const App = App || {};
const apiUrl = 'http://localhost:3000/api';

//
// <h6><% for (var i = 0; i < restaurant.rating; i++) { %>
//   <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
// <% } %></h6>
App.init = function() {
  this.apiUrl = apiUrl;
  this.$main  = $('main');
  this.$modal = $('.modal');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('.journeysNew').on('click', this.journeysNew.bind(this));
  this.$modal.on('submit', 'form.journeyForm', this.buildJourney);
  $('.modal-content').one('submit', '.auth', this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function(){
  console.log('loggedIn');
  $('.loggedIn').show();
  $('.loggedOut').hide();
  $('.modal').modal('hide');
  //$('body').css('background', 'none');
  //$('.centered').hide();
//  this.journeysNew();
  //this.logout();
};

App.loggedOutState = function(){
  console.log('loggedOut');
  $('.loggedIn').hide();
  $('.loggedOut').show();
  $('.modal').modal('hide');
  // $('body').css('background', "url('https://metrouk2.files.wordpress.com/2016/06/ad_209070450.jpg?quality=80&strip=all&strip=all'");
  // $('.centered').show();
  this.login();
};

App.register = function(e){
  console.log('register');
  if (e) e.preventDefault();
  $('.modal-content').html(`
    <h2>Register</h2>
    <form class="auth" method="post" action="/register">
    <div class="form-group">
    <input class="form-control" type="text" name="user[username]" placeholder="Username">
    </div>
    <div class="form-group">
    <input class="form-control" type="email" name="user[email]" placeholder="Email">
    </div>
    <div class="form-group">
    <input class="form-control" type="password" name="user[password]" placeholder="Password">
    </div>
    <div class="form-group">
    <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
    </div>
    <div class="form-group">
    <input class="form-control" type="location" name="user[location]" placeholder="What's your default location?">
    </div>
    <div class="form-group">
    <input class="form-control" type="checkbox" name="user[admin]" placeholder="Administrator">
    </div>
    <input class="btn btn-primary" type="submit" value="Register">
    </form>
    `);
    $('.modal').modal('show');
  };

  App.login = function(e) {
    console.log('login');
    if (e)  e.preventDefault();
    $('.modal-content').html(`
      <h2>Login</h2>
      <form class="auth" method="post" action="/login">
      <div class="form-group">
      <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input class="btn btn-primary" type="submit" value="Login">
      </form>
      `);
      $('.modal').modal('show');
    };

    App.logout = function(e){
      e.preventDefault();
    //  $('.modal-content').one('submit', '.auth', this.handleForm);
      this.removeToken();
      // $('.modal-backdrop').modal('hide');
      this.loggedOutState();
    };

    App.buildJourney= function(e)  {
      if (e) e.preventDefault();
        $('body').css('background', 'none');

      const mode  = $('#mode').val();
      const start = $('#start').val() + ', UK';
      const end   = $('#end').val() + ', UK';
      initMap2(start, mode, end);
      // $.ajax({
      //   url: 'https://api.tfl.gov.uk/Line/Mode/tube/Route?serviceTypes=Regular',
      //   method: 'get', // GET by default
      //   dataType: 'json' // Intelligent Guess by default (xml, json, script, or html)
      // }).done((data)=>{
      //   console.log(data);
      //   console.log(data.id);
      // });
    };

    function initMap2(start, mode, end) {
      let  infowindow='';
      document.getElementById('right-panel').innerHTML = '';
      // $('.modal-backdrop').modal('hide');
      $('.modal').modal('hide');
      const map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 12,
        center: new google.maps.LatLng( 51.508530, -0.076132)
      });

      const transitLayer = new google.maps.TransitLayer();
      transitLayer.setMap(map);
      const directionsService = new google.maps.DirectionsService;
      const directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
      });

      infowindow = new google.maps.InfoWindow();
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        console.log('yay');
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

      directionsDisplay.addListener('directions_changed', function() {
        computeTotalDistance(directionsDisplay.getDirections());
      });

      displayRoute(start, end, directionsService,
        directionsDisplay, mode);

    }

      function displayRoute(origin, destination, service, display, mode) {
        service.route({
          origin: origin,
          destination: destination,
          //waypoints: [{location: 'London Victoria, UK'}, {location: 'VAUXHALL, UK'}],
          travelMode: mode
          //  avoidTolls: true
        }, function(response, status) {

          if (status === 'OK') {
            display.setDirections(response);
          } else {
            alert('Could not display directions due to: ' + status);
          }
        });
      }

      // App.journeysIndex = function(e) {
      //   if (e) e.preventDefault();
      //   const url = `${this.apiUrl}/journeys`;
      //
      //   return this.ajaxRequest(url, 'get', null, data => {
      //     this.$main.html(`
      //       <div class="card-deck-wrapper">
      //       <div class="card-deck">
      //       </div>
      //       </div>
      //       `);
      //       const $container = this.$main.find('.card-deck');
      //       $.each(data.journeys, (i, journey) => {
      //         $container.append(`
      //           <div class="card col-md-4">
      //           <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
      //           <div class="card-block">
      //           <h4 class="card-title">${journey.username}</h4>
      //           <p class="card-text">${journey.description}</p>
      //           <p class="card-text"><small class="text-muted">${journey.timestamps.toDateString()}</small></p>
      //           </div>
      //           </div>`);
      //         });
      //       });
      //     };
          //start maps
          const google = google;

          // App.addInfoWindowForModel = function(camera, marker) {
          //   google.maps.event.addListener(marker, 'click', () => {
          //     if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
          //
          //     this.infoWindow = new google.maps.InfoWindow({
          //       content: `<img src="http://www.tfl.gov.uk/tfl/livetravelnews/trafficcams/cctv/${ camera.file }"><p>${ camera.location }</p>`
          //     });
          //
          //     this.infoWindow.open(this.map, marker);
          //     this.map.setCenter(marker.getPosition());
          //     this.map.setZoom(15);
          //   });
          // };
          //
          // App.createMarkerForModel = function(camera) {
          //   const latlng = new google.maps.LatLng(camera.lat, camera.lng);
          //   const marker = new google.maps.Marker({
          //     position: latlng,
          //     map: this.map
          //     //  icon: '/images/marker.png',
          //     //animation: google.maps.Animation.DROP
          //   });
          //
          //   this.addInfoWindowForModel(camera, marker);
          // };
          //
          // App.loopThroughCameras = function(data) {
          //   $.each(data.cameras, (index, camera) => {
          //     setTimeout(() => {
          //       App.createMarkerForModel(camera);
          //     }, index * 50);
          //   });
          // };

          // App.getCameras = function() {
          //   $.get('http://localhost:3000/cameras').done(this.loopThroughCameras);
          // };

          // function initMap(originInput,destinationInput,modeSelector) {
          //   var map = new google.maps.Map(document.getElementById('map-canvas'), {
          //     zoom: 12,
          //     center: {lat: 51.508530, lng: -0.076132}
          //     //  'london, UK'
          //   });
          //   new AutocompleteDirectionsHandler(map);
          // }
          // /**
          // * @constructor
          // */
          // function AutocompleteDirectionsHandler(map) {
          //   console.log('AutoComplete');
          //   this.map = map;
          //   // this.originPlaceId = null;
          //   // this.destinationPlaceId = null;
          //   // this.travelMode = 'WALKING';
          //   this.start = null;
          //   this.end = null;
          //   this.walking = 'WALKING';
          //   this.directionsService = new google.maps.DirectionsService;
          //   this.directionsDisplay = new google.maps.DirectionsRenderer;
          //   this.directionsDisplay.setMap(map);
          //
          //   var originAutocomplete = new google.maps.places.Autocomplete(
          //     originInput, {placeIdOnly: true});
          //     var destinationAutocomplete = new google.maps.places.Autocomplete(
          //       destinationInput, {placeIdOnly: true});
          //
          //       this.setupClickListener('changemode-walking', 'WALKING');
          //       this.setupClickListener('changemode-transit', 'TRANSIT');
          //       this.setupClickListener('changemode-driving', 'DRIVING');
          //
          //       this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
          //       this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
          //
          //       this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
          //       this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
          //       this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
          //     }
          //
          //     // Sets a listener on a radio button to change the filter type on Places
          //     // Autocomplete.
          //     AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
          //       var radioButton = document.getElementById(id);
          //       var me = this;
          //       radioButton.addEventListener('click', function() {
          //         me.travelMode = mode;
          //         me.route();
          //       });
          //     };
          //
          //     AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
          //       var me = this;
          //       autocomplete.bindTo('bounds', this.map);
          //       autocomplete.addListener('place_changed', function() {
          //         var place = autocomplete.getPlace();
          //         if (!place.place_id) {
          //           window.alert('Please select an option from the dropdown list.');
          //           return;
          //         }
          //         if (mode === 'ORIG') {
          //           me.originPlaceId = place.place_id;
          //         } else {
          //           me.destinationPlaceId = place.place_id;
          //         }
          //         me.route();
          //       });
          //
          //     };
          //
          //     AutocompleteDirectionsHandler.prototype.route = function() {
          //       if (!this.originPlaceId || !this.destinationPlaceId) {
          //         return;
          //       }
          //       var me = this;
          //
          //       this.directionsService.route({
          //         origin: {'placeId': this.originPlaceId},
          //         destination: {'placeId': this.destinationPlaceId},
          //         travelMode: this.travelMode
          //       }, function(response, status) {
          //         if (status === 'OK') {
          //           var directionsDisplay = new google.maps.DirectionsRenderer({
          //             draggable: true,
          //             map: map,
          //             panel: document.getElementById('right-panel')
          //           });
          //           me.directionsDisplay.setDirections(response);
          //         } else {
          //           window.alert('Directions request failed due to ' + status);
          //         }
          //       });
          //     };
          //

              function computeTotalDistance(result) {
                var total = 0;
                var myroute = result.routes[0];
                console.log('compute route',result);
                for (var i = 0; i < myroute.legs.length; i++) {
                  // console.log(myroute.legs[i]);
                  var leg = myroute.legs[i];
                  for (var j = leg.steps.length -1; j >= 0; j--) {
                    if (leg.steps[j].travel_mode === 'TRANSIT'){
                      console.log(leg.steps[j]);
                      for (var k = leg.steps.steps[length -1]; k >= 0; j--){
                        console.log(leg.steps[j].step[k]);
                      }
                      break;
                    }
                  }
                  total += myroute.legs[i].distance.value;
                  //*[@id="right-panel"]/div/div/div[3]/div[2]/table/tbody/tr[1]
                  // var div = document.getElementById(`[@id="right-panel"]/div/div/div[3]/div[2]/table/tbody/tr[${i}+1]`);
                  // console.log(div.innerHTML);
                  // div.innerHTML = div.innerHTML + 'Extra stuff';
                }
                total = total / 1000;
                document.getElementById('total').innerHTML = total + ' km';
              }

              // App.mapSetup = function(canvas) {
              //   const mapOptions = {
              //     zoom: 12,
              //     center: new google.maps.LatLng(51.506178,-0.088369),
              //     mapTypeId: google.maps.MapTypeId.ROADMAP
              //   };
              //
              //   this.map = new google.maps.Map(canvas, mapOptions);
              //   this.getCameras();
              // };

              //end map

              //Admin flag on user
              // App.usersIndex = function(e) {
              //   if (e) e.preventDefault();
              //   const url = `${this.apiUrl}/users`;
              //
              //   return this.ajaxRequest(url, 'get', null, data => {
              //     this.$main.html(`
              //       <div class="card-deck-wrapper">
              //       <div class="card-deck">
              //       </div>
              //       </div>
              //       `);
              //       const $container = this.$main.find('.card-deck');
              //       $.each(data.users, (i, user) => {
              //         $container.append(`
              //           <div class="card col-md-4">
              //           <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
              //           <div class="card-block">
              //           <h4 class="card-title">${user.username}</h4>
              //           <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
              //           <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
              //           </div>
              //           </div>`);
              //         });
              //       });
              //     };

                  App.handleForm = function(e){
                    e.preventDefault();
                    console.log('form');
                    const url    = `${App.apiUrl}${$(this).attr('action')}`;
                    const method = $(this).attr('method');
                    const data   = $(this).serialize();

                    return App.ajaxRequest(url, method, data, data => {
                      if (data.token) {
                        App.setToken(data.token);
                        App.loggedInState();
                      }
                    });
                  };

                  App.ajaxRequest = function(url, method, data, callback){
                    return $.ajax({
                      url,
                      method,
                      data,
                      beforeSend: this.setRequestHeader.bind(this)
                    })
                    .done(callback)
                    .fail(data => {
                      console.log(data);
                    });
                  };

                  App.setRequestHeader = function(xhr) {
                    return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
                  };

                  App.setToken = function(token){
                    return window.localStorage.setItem('token', token);
                  };

                  App.getToken = function(){
                    return window.localStorage.getItem('token');
                  };

                  App.removeToken = function(){
                    return window.localStorage.clear();
                  };

                  App.journeysNew = function(e){
                    if (e)  e.preventDefault();

                    console.log('journeysNew');

                    // const url = `${this.apiUrl}/journeys/new`;
                    // App.ajaxRequest(url, 'get', null,() => {
                    $('.modal-content').html(`
                        <form class="journeyForm">
                        <b>Mode of Travel: </b>
                        <select id="mode">
                        <option value="DRIVING">Driving</option>
                        <option value="WALKING">Walking</option>
                        <option value="BICYCLING">Bicycling</option>
                        <option value="TRANSIT" selected="selected">Public Transport</option>
                        </select>
                        <b>Start: </b>
                        <input type="text" id="start" placeholder="Leaving from" >
                        <b>End: </b>
                        <input type="text" id="end" placeholder="Going to" >
                        <input type="submit" id="submit" value="Search">
                        </form>
                        `);
                    $('.modal').modal('show');

                      // });
                    };

                    // function addressAutoComplete(start, end){
                    //   const options = {
                    //       componentRestrictions: {country: 'uk'}
                    //   };
                    //   autocomplete = new google.maps.places.Autocomplete(start, options);
                    //   autocomplete = new google.maps.places.Autocomplete(end, options);
                    //     // After the user selects the address
                    //   // google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    //   //       planSub.focus();
                    //   //       var place = autocomplete.getPlace();
                    //   //       planAddress.value = place.name;
                    //   //       planCity.value = place.address_components[2].long_name;
                    //   //       planCounty.value = place.address_components[3].long_name;
                    //   //       planZip.value = place.address_components[6].long_name;
                    //   //   });
                    // }



                    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                      infoWindow.setPosition(pos);
                      infoWindow.setContent(browserHasGeolocation ?
                                            'Error: The Geolocation service failed.' :
                                            'Error: Your browser doesn\'t support geolocation.');
                    }
                    function callback(results, status) {
                      if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (var i = 0; i < results.length; i++) {
                          createMarker(results[i]);
                        }
                      }
                    }

                    function createMarker(place) {
                      var placeLoc = place.geometry.location;
                      var marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location
                      });

                      google.maps.event.addListener(marker, 'click', function() {
                        infowindow.setContent(place.name);
                        infowindow.setContent(place.name);
                        infowindow.open(map, this);
                      });
                    }

$(App.init.bind(App));
