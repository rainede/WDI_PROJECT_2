const App = App || {};
const apiUrl = 'http://localhost:3000/api';

App.init = function() {
  this.apiUrl = apiUrl;
  this.$main  = $('main');
  this.$modal = $('.modal-content');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('.journeysNew').on('click', this.journeysNew.bind(this));
  //$('.usersIndex').on('click', this.usersIndex.bind(this));
  this.$modal.on('submit', 'form.auth', this.handleForm);
  this.$modal.on('submit', 'form.journeyForm', this.buildJourney);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
  $('.modal').modal('hide');
  this.journeysNew();
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('.loggedOut').show();
  this.login();
};

App.register = function(e){
  console.log('register');
  if (e) e.preventDefault();
  this.$modal.html(`
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
    <input class="btn btn-primary" type="submit" value="Register">
    </form>
    `);
    $('.modal').modal('show');
  };

  App.login = function(e) {
    if (e)  e.preventDefault();
    this.$modal.html(`
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
    this.removeToken();
    this.loggedOutState();
  };

App.journeysNew= function(e) {
  if (e) e.preventDefault();
  const url = `${this.apiUrl}/journeys/new`;
  App.ajaxRequest(url, 'get', null,() => {
    App.$modal.html(`
          <form class="journeyForm">
            <b>Goal: </b>
            <select id="target">
              <option value="DEFAULT" selected="selected">Quickest</option>
              <option value="WALK">10,000 steps</option>
              <option value="EXERCISE">Moderate Exercise</option>
              <option value="SCENE">Scenery</option>
            </select>
            <b>Mode of Travel: </b>
            <select id="mode">
              <option value="DRIVING">Driving</option>
              <option value="WALKING">Walking</option>
              <option value="BICYCLING">Bicycling</option>
              <option value="TRANSIT" selected="selected">Public Transport</option>
            </select>
            <b>Arrival Time: </b>
            <input type="time" name="due">
            <b>Start: </b>
            <input type="text" id="start">
            <b>End: </b>
            <input type="text" id="end">
            <input type="submit" id="submit" value="Search">
          </form>
          `);
          return $('.modal').modal('show');
        });
};

App.journeysIndex = function(e) {
if (e) e.preventDefault();
const url = `${this.apiUrl}/journeys`;

return this.ajaxRequest(url, 'get', null, data => {
this.$main.html(`
<div class="card-deck-wrapper">
<div class="card-deck">
</div>
</div>
`);
const $container = this.$main.find('.card-deck');
$.each(data.journeys, (i, journey) => {
$container.append(`
<div class="card col-md-4">
<img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
<div class="card-block">
<h4 class="card-title">${journey.username}</h4>
<p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
</div>
</div>`);
});
});
};
//start maps
const google = google;

App.addInfoWindowForModel = function(camera, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();

    this.infoWindow = new google.maps.InfoWindow({
      content: `<img src="http://www.tfl.gov.uk/tfl/livetravelnews/trafficcams/cctv/${ camera.file }"><p>${ camera.location }</p>`
    });

    this.infoWindow.open(this.map, marker);
    this.map.setCenter(marker.getPosition());
    this.map.setZoom(15);
  });
};

App.createMarkerForModel = function(camera) {
  const latlng = new google.maps.LatLng(camera.lat, camera.lng);
  const marker = new google.maps.Marker({
    position: latlng,
    map: this.map
    //  icon: '/images/marker.png',
    //animation: google.maps.Animation.DROP
  });

  this.addInfoWindowForModel(camera, marker);
};

App.loopThroughCameras = function(data) {
  $.each(data.cameras, (index, camera) => {
    setTimeout(() => {
      App.createMarkerForModel(camera);
    }, index * 50);
  });
};

App.getCameras = function() {
$.get('http://localhost:3000/cameras').done(this.loopThroughCameras);
};

function initMap(mode, start, end) {
var map = new google.maps.Map(document.getElementById('map-canvas'), {
zoom: 12,
center: 'london, UK'
});

var transitLayer = new google.maps.TransitLayer();
transitLayer.setMap(map);
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer({
draggable: true,
map: map,
panel: document.getElementById('right-panel')
});

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
console.log(response, status);
if (status === 'OK') {
  display.setDirections(response);
} else {
  alert('Could not display directions due to: ' + status);
}
});
}

function computeTotalDistance(result) {
var total = 0;
var myroute = result.routes[0];
// console.log(myroute.legs.length);
for (var i = 0; i < myroute.legs.length; i++) {
// console.log(myroute.legs[i]);
var leg = myroute.legs[i];
for (var j = leg.steps.length -1; j >= 0; j--) {
  if (leg.steps[j].travel_mode === 'TRANSIT'){
    console.log(leg.steps[j]);
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
// document.getElementById('total').innerHTML = total + ' km';
}
App.mapSetup = function(canvas) {
const mapOptions = {
zoom: 12,
center: new google.maps.LatLng(51.506178,-0.088369),
mapTypeId: google.maps.MapTypeId.ROADMAP
};

this.map = new google.maps.Map(canvas, mapOptions);
this.getCameras();
};

//end map

//Admin flag on user
App.usersIndex = function(e) {
if (e) e.preventDefault();
const url = `${this.apiUrl}/users`;

return this.ajaxRequest(url, 'get', null, data => {
this.$main.html(`
  <div class="card-deck-wrapper">
  <div class="card-deck">
  </div>
  </div>
  `);
  const $container = this.$main.find('.card-deck');
  $.each(data.users, (i, user) => {
    $container.append(`
      <div class="card col-md-4">
      <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
      <div class="card-block">
      <h4 class="card-title">${user.username}</h4>
      <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
      </div>`);
    });
  });
};

App.handleForm = function(e){
  e.preventDefault();

  const url    = `${App.apiUrl}${$(this).attr('action')}`;
  const method = $(this).attr('method');
  const data   = $(this).serialize();

  return App.ajaxRequest(url, method, data, data => {
    if (data.token) App.setToken(data.token);
    App.loggedInState();
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

App.buildJourney = function(e){
  e.preventDefault();
  $('.modal').modal('hide');

  const mode  = $('#mode').val();
  const start = $('#start').val();
  const end   = $('#end').val();

  console.log(mode, start, end);

  initMap(mode, start, end);
};

function addressAutoComplete(start, end){
  const options = {
      componentRestrictions: {country: 'uk'}
  };
  autocomplete = new google.maps.places.Autocomplete(start, options);
  autocomplete = new google.maps.places.Autocomplete(end, options);
    // After the user selects the address
  // google.maps.event.addListener(autocomplete, 'place_changed', function() {
  //       planSub.focus();
  //       var place = autocomplete.getPlace();
  //       planAddress.value = place.name;
  //       planCity.value = place.address_components[2].long_name;
  //       planCounty.value = place.address_components[3].long_name;
  //       planZip.value = place.address_components[6].long_name;
  //   });
}

$(App.init.bind(App));
