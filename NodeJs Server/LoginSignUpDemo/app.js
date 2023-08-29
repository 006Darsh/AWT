const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const User = require("./Model/User");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());
app.use(
  session({
    key: "user id",
    secret: "This is secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_id) {
    res.redirect("/dasboard");
  } else {
    next();
  }
};

// routes
app.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});
app
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + "/public/Login.html");
  })
  .post((req, res) => {
    var username = req.body.username,
      password = req.body.password;
    try {
      var user = User.findOne({ username: username }).exec();
      if (!user) {
        res.redirect("/login");
      }
      user.comparePassword(password, (error, match) => {
        if (!match) {
          res.redirect("/login");
        }
        console.log(1);
      });
      res.session.use = user;
      console.log(1);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  });
app
  .route("/signup")
  .get(sessionChecker, (req, res) => {
    res.sendFile(__dirname + "/public/Signup.html");
  })
  .post(async (req, res) => {
    try {
      const user = new User({
        username: req.body.username, // Assuming this is a string
        email: req.body.email, // Make sure email is provided
        password: req.body.password,
      });

      const doc = await user.save();
      req.session.use = doc;
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.redirect("/signup");
    }
  });

app.get("/dashboard", (req, res) => {
  if (req.session.user && req.cookies.user_id) {
    res.sendFile(__dirname + "/public/dashboard.html");
  } else {
    res.redirect("/login");
  }
});

app.listen(port, hostname, () => {
  console.log(`Login Demo Server running at http://${hostname}:${port}/`);
});
