//Dependencies
const express    = require('express');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const cors       = require('cors');
const mongoose   = require('mongoose');
const expressJWT = require('express-jwt');

const app        = express();
const config     = require('./config/config');
const webRouter  = require('./config/webRoutes');
const apiRouter  = require('./config/apiRoutes');
//const favicon     = require('serve-favicon');
const io = require('socket.io');


//Mongo DB connection
mongoose.connect(config.db);

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(`${__dirname}/public`));
//app.use(favicon(`${__dirname}/public/images/favicon.ico`));

app.use('/api', expressJWT({ secret: config.secret })
.unless({
  path: [
    { url: '/api/register', methods: ['POST'] },
    { url: '/api/login',    methods: ['POST'] }
    //temporary.. to get map working
    // { url: '/api/journeys/new',    methods: ['POST','GET'] }
  ]
}));

app.use(jwtErrorHandler);

function jwtErrorHandler(err, req, res, next){

  if (err.name !== 'UnauthorizedError') return next();

  return res.status(401).json({ message: 'Unauthorized request.' });
}

app.use('/api',apiRouter);
app.use('/', webRouter);

const server= app.listen(config.port, () => console.log(`Express started on port: ${config.port}`));

const ios = io.listen(server, console.log('Listening with socket.io'));
ios.sockets.on('connection', function (err,socket) {
  //if
  const message ='io sockets connection ';
  if(!err) {
    `${message} ${socket}`;
  }else{
    console.log(`${message} ${err}`);
  }
});
