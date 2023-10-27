const { UserSignup, UserLogin } = require("../Controller/UserController");

const AuthRoutes = (app) => {
  app.post("/user/signup", UserSignup);
  app.post("/user/login", UserLogin);
};

module.exports = AuthRoutes;
