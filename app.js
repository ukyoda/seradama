var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxy = require('proxy-middleware');
var url = require('url');

var routes = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy
var TwitterSecret = require('./twitter_secret.json');

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

//proxy設定
app.use('/twiimg', proxy(url.parse('http://pbs.twimg.com/')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
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
var TWITTER_CONSUMER_KEY = TwitterSecret.consumer_key;
var TWITTER_CONSUMER_SECRET = TwitterSecret.consumer_secret;
// TwitterStrategyオブジェクト内に必要な情報を詰める。
passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "/auth/twitter/callback"
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

//トップ画面
app.get('/',
  function(req, res){
    res.render('top', {  });
  }
);

//ゲームページ
app.get('/gracoro',
  function(req, res){
    var imgURL = null;
    var userName = null;
    var userType = null;
    var gracoro = req.session.gracoro;

    //セッションがないと出力しない
    if(!gracoro || !gracoro.name || !gracoro.picture) {
      res.redirect('/');
    } else {
      //画像，名前セット
      imgURL = gracoro.picture;
      userName = gracoro.name;
      userType = gracoro.userType || "guest";
      // renderで値を引き継ぐ（これでええのか？）
      res.render('index', {
        title: 'Express',
        img: imgURL,
        user: userName,
        type: userType
      });
    }

  }
);

//認証なしログイン
app.get('/guest', function(req, res){
  //セッションに情報登録
  req.session.gracoro = {
    name: req.query.username,
    picture: "/images/favicon.ico",  //ゲスト用の画像
    userType: "guest"
  };
  res.redirect('/gracoro');
});

//Twitter Authのroute
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){}
);

//Twitter Authの完了時のRoute
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
  function(req, res) {
    var profile_image_url = req.session.passport.user._json.profile_image_url;
    var iconUrlParse = url.parse(profile_image_url);

    req.session.gracoro = {
      name: req.session.passport.user.username,
      picture: '/twiimg'+iconUrlParse.path,
      userType: "twitter"
    };
    res.redirect('/gracoro');
  }
);

// Twitter認証でキャンセルした場合
app.get('/login/twitter', function(req, res){
  res.redirect('/');
});

// とりあえずログアウトも
app.get('/logout/twitter', function(req, res){
  delete req.session.gracoro;
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
