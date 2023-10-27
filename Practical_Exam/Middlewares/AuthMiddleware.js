const jwt = require("jsonwebtoken");
const User = require("../Models/Users");
const jwt_sec = process.env.JWT_SEC;

module.exports = async (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Token not found !!!" });
  }

  try {
    const { type, email, _id } = jwt.verify(token, jwt_sec);

    try {
      const user = await User.find({ _id }, { _id: 1 });
      console.warn("user ", user);
      if (user) {
        req.user = user[0];
        req.userType = "user";
      }
    } catch (error) {
      console.log(1);
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized." });
    }

    next();
  } catch (error) {
    console.log(error);
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token. Not Authorized." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Server internal error" });
  }
};
