// secret: "hush hush"
//
module.exports = {
  port: process.env.PORT || 3000,
  db: 'mongodb://localhost/WDI_PROJECT_2',
  secret: process.env.SECRET || 'gosh this is so secret... shhh...',
  apiUrl: 'http://localhost:3000/api'
};
