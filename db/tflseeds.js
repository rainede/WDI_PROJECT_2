
updateFromURL('https://api.tfl.gov.uk/Line/Mode/tube/Route?serviceTypes=Regular');
updateFromURL('https://api.tfl.gov.uk/Line/Mode/tube/Route?serviceTypes=Night');

const APP =  APP || {};

App.getJSON('./tflall.json')();
App.getJSON = function(url) {

  //const url = `${this.apiUrl}/users`;

  //  const url    = `${App.apiUrl}${$(this).attr('action')}`;
  //  const method = $(this).attr('method');
  //  const data   = $(this).serialize();

  $.ajax({
  //   url: 'https://api.doughnuts.ga/doughnuts/1',
    method: 'get', // GET by default
    dataType: 'json' // Intelligent Guess by default (xml, json, script, or html)
  }).done(function(data){
    console.log(data);
  }).fail(data) => {
      console.log(data);
    });
  }
