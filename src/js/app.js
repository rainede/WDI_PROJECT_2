const App = App || {};
const apiUrl = 'http://localhost:3000/api';

$(App.init.bind(App));

App.init = function() {
  this.apiUrl = apiUrl;
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('.journeysNew').on('click', this.journeysNew.bind(this));
  //$('.usersIndex').on('click', this.usersIndex.bind(this));
  this.$main.on('submit', 'form', this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
  this.journeysNew();
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('.loggedOut').show();
  this.register();
};

App.register = function(e){
  if (e) e.preventDefault();
  this.$main.html(`
  <!-- <h2>Register</h2> -->
    <form method="post" action="/register">
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
};

App.login = function(e) {
  e.preventDefault();
  this.$main.html(`
  <!--  <h2>Login</h2> -->
    <form method="post" action="/login">
      <div class="form-group">
        <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input class="btn btn-primary" type="submit" value="Login">
    </form>
  `);
};

App.logout = function(e){
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};


App.journeysNew= function(e) {
  if (e) e.preventDefault();

  this.$main.html(`

        <div id="map"></div>
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCS6aR9Ini0ffsm6TmMnX3u3GWRVTadsbI" charset="utf-8"></script>

    `);
//  });
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
const google = google;
//start maps
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
    map: this.map,
    icon: '/images/marker.png',
    animation: google.maps.Animation.DROP
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

App.mapSetup = function() {
  const canvas = document.getElementById('map-canvas');

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
