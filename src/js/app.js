const config     = require('./config/config');
const App = App || {};

App.init = function(){
  this.apiUrl =`${config.db}`;
  this.$main = $('main');
  $('.register').on('click', this.register.bind(this));
}
