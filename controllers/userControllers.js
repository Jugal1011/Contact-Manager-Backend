const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// @desc register a user
// @route POST /api/users/register
// @access public
const registerUser = async (req, res) => {
  // console.log(req.body)
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!!");
  }

  //hashed password
  const hashPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password", hashPassword);
  // create user in database
  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });
  console.log(`User created ${user}`);
  if (user) {
    res.status(200).json({ _id: user._id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  // res.json({ message: "Register the user" });
};

// @desc login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });
  //compare password with hashpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    //embedding the payload and create jwt access token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m"}
    );

    res.status(200).json({ accessToken });
  }
  else{
    res.status(401)
    throw new Error("email or password is not valid")
  }
  // res.json({ message: "Login user" });
});

// @desc currnet user info
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
