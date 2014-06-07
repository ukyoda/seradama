var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var OAuth = require('oauth').OAuth
var session = require('express-session');
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy

var router = express.Router();

//ゲーム管理変数
var gameInfoData = {
    fieldNo: 1 //現在のステージNo ※APIは"stage[No].json"を読み込む
};

//APIルート読み込み
var api = require('./routes/api')(gameInfoData);

var app = express();

//ゲーム管理変数をappに記憶させる(wwwからアクセスできるように)
app.gameInfo = gameInfoData;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/field.json', api.field);


app.use(cookieParser('gravity'));
app.use(session({secret: "gravity"}));
app.use(passport.initialize());
app.use(passport.session());

//passportLibのセッション管理用関数（らしい）
passport.serializeUser(function(user, done){
  done(null, user);
});
 
passport.deserializeUser(function(obj, done){
  done(null, obj);
});

//ここからTwitter認証の記述
var TWITTER_CONSUMER_KEY = "consumer_Keyだよ";
var TWITTER_CONSUMER_SECRET = "Secretキーだよ";
// TwitterStrategyオブジェクト内に必要な情報を詰める。
passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    passport.session.accessToken = token;
    passport.session.profile = profile;
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// app.get('/account/twitter', twitterEnsureAuthenticated, routes.account);
// function twitterEnsureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login/twitter');
// };

// app.get('/login/twitter', routes.login_facebook);

// app.get('/', function(req, res){
//     // console.log(req.session.passport.user.username);
//     // console.log(req.session.passport.user._json.profile_image_url);
//     // game 処理
//     /* GET home page. */
//     router.get('/', function(req, res) {
//       res.render('index', { title: 'Express' });
//     });
// });

//Twitter Authのroute
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){}
);

//Twitter Authの完了時のRoute
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
  function(req, res) {
    res.redirect('/');
  }
);

// とりあえずログアウトも
app.get('/logout/twitter', function(req, res){
  req.logout();
  res.redirect('/');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
