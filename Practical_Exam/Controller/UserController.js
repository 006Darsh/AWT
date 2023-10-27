require("dotenv").config({ path: "../.env" });
const User = require("../Models/Users");
const genToken = require("../Services/jwtTokenService");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const userValidationSchema = Joi.object({
  user_name: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "User Name should be a string.",
    "string.empty": "User Name is required.",
    "string.min": "User Name should have at least {#limit} characters.",
    "string.max": "User Name should have at most {#limit} characters.",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format.",
      "string.empty": "Email is required.",
    }),

  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Invalid password format. It should be alphanumeric and 3-30 characters long.",
      "string.empty": "Password is required.",
    }),
});
exports.UserSignup = async (req, res) => {
  try {
    const { user_name, email, password, confirm_password } = req.body;
    // Check if user with the same user_name or email already exists
    const { error } = userValidationSchema.validate({
      user_name,
      email,
      password,
    });

    if (error) {
      return res.status(400).send({
        success: false,
        message: error.details[0].message,
      });
    }

    const exist = await User.findOne({
      $or: [{ user_name: user_name }, { email: email }],
    });
    if (exist) {
      return res.status(400).send({
        success: false,
        message: "User with this user_name or email already exists.",
      });
    }
    // Check if password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).send({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }
    // Encrypt the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Save the user data to the User schema
    const newUser = new User({
      user_name: user_name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    const payload = {
      _id: newUser._id,
      user_name: newUser.user_name,
      email: newUser.email,
      password: newUser.password,
      type: "user",
    };

    const authToken = genToken(payload);

    res.status(200).send({
      success: true,
      result: authToken,
      _id: newUser._id,
      user_name: newUser.user_name,
      email: newUser.email,
      type: "user",
    });
  } catch (error) {
    console.error("Error in UserSignup:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while registering the user.",
    });
  }
};

exports.UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      console.warn("inside");
      return res.status(400).send({
        success: false,
        message: "Email address is not registered",
      });
    }
    // Compare the password from the request with the encrypted password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(user);
    if (isPasswordMatch) {
      // Passwords match, generate token and send the response
      const payload = {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        type: "user",
      };

      const authToken = genToken(payload);

      return res.status(200).send({
        success: true,
        result: authToken,
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        type: "user",
      });
    } else {
      // Passwords do not match
      return res.status(401).send({
        success: false,
        message: "Not able to Login - Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Error in UserLogin:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while loging in the user.",
    });
  }
};
