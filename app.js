var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOveride = require('method-override')
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api')
const adminRouter = require('./routes/admin')
const session = require("express-session");
const flash = require("connect-flash");
var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// method overide
app.use(methodOveride("_method"))
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);
// connect flash
app.use(flash());
app.use(express.static(path.join(__dirname, 'public/images')));
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter)
app.use('/api', apiRouter )
  
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

  module.exports = app;
