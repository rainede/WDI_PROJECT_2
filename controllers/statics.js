const path = require('path');

module.exports ={
  home: staticsHome
};

function staticsHome(req, res){
  return res.sendFile(path.join(__dirname, '../index.html'));
}
