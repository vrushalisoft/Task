
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const chalk = require('chalk');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
dotenv.config({ path: '.env' });
var multer = require('multer');
var config = require("./config");
const validator = require('express-joi-validation').createValidator({})
var errorHandler = require('errorhandler')


const passportInit = require('./config/passport');

//Router
var homeRouter = require('./routes/home.route');
var signUpRouter = require('./routes/signUp.route');
var loginRouter = require('./routes/login.route');
var logoutRouter = require('./routes/logout.route');


const https = require('https');
const app = express();

mongoose.connect(process.env.LOCAL_MONGODB_URI);
var dbConnection = mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
mongoose.connection.once('open', () => {
console.log("connection to db established");

});
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: true, 
  saveUninitialized: true 
}))


app.set('host', '0.0.0.0');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passportInit()
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,HEAD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

var fileStorage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './uploads');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname);  
  }
}); 

var upload = multer({storage: fileStorage});





// Login And Signup
app.use('/home', homeRouter, upload.single('file'));
app.use('/signUp', signUpRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);



/**
 * Error Handler
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}


/**
 * Start Express server.
 */

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;