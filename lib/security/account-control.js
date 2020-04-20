let { CONNECTION_URL, OPTIONS, DATABASE } = require("../../config/mongodb.config");
let MongoClient = require("mongodb").MongoClient;
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let initialize, authenticate, authorize;

passport.serializeUser((email, done) => {
  return done(null, email);
});

passport.deserializeUser((email, done) => {
  // MongoDBからユーザー情報を取得しなおす
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    let db = client.db(DATABASE);
    db.collection("users").findOne({
      email
    }).then((user) => {
      return done(null, user);
    }).catch((error) => {
      return done(error);
    }).then(() => {
      client.close();
    });
  });
});

passport.use("local-strategy",
  new LocalStrategy({
    usernameField: "username",  // フォームのname値
    passwordField: "password",  // フォームのname値
    passReqToCallback: true
  }, (req, username, password, done) => {
    process.nextTick(function () {
      MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
        let db = client.db(DATABASE);
        db.collection("users").findOne({
          email: username,
          password: password
        }).then((user) => {
          if (user) {
            req.session.regenerate((error) => {
              if (error) {
                return done(error);
              } else {
                return done(null, user.email);
              }
            });
          } else {
            return done(null, false, req.flash("message", "ユーザー名 または パスワードが間違っています。"));
          }
        }).catch((error) => {
          return done(error);
        }).then(() => {
          client.close();
        });
      });
    });
  })
);


initialize = () => {
  return [
    passport.initialize(),
    passport.session()
  ];
};

authenticate = () => {
  return passport.authenticate("local-strategy", {
    successRedirect: "/account",
    failureRedirect: "/account/login",
  });
};

module.exports = {
  initialize,
  authenticate,
  authorize
};