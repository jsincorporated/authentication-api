require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
app.use(express.json());
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var auth = require("./middleware/auth");

// importing user context
const User = require("./model/user");

function listen(port) {
  app.listen(port, () => {
      console.log(`Server running on port ${port}`);
  });
}


app.post("/welcome", auth, async (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// View Info
app.get("/myinfo", auth, async (req, res) => {
  // get email from jwt token
  const email = req.user.email;

  // find the user by email
  const userInfo = await User.findOne({email: email}, '-_id -__v -password');

  // return user's information
  res.status(200).json(userInfo);
});

app.patch("/update", auth, async (req, res) => {
  //get user ID from jwt token
  const email = req.user.email;

  try {
    // Find the user by ID
    const user = await User.findOne({email: email});
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update only the specified user details with the new values from the request body
    if (req.body.first_name) {
      user.first_name = req.body.first_name;
    }
    if (req.body.last_name) {
      user.last_name = req.body.last_name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.role) {
      user.role = req.body.role;
    }
    if (req.body.designation) {
      user.designation = req.body.designation;
    }
    if (req.body.company) {
      user.company = req.body.company;
    }
    if (req.body.password) {
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = encryptedPassword;
    }

    // Save the updated user details to the database
    await user.save();

    // Return the updated user details
    res.send("Successfully updated details");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

})

// Register
app.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password, user_role, designation, company } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name && user_role && designation && company)) {
      res.status(400).send("All inputs(first_name, last_name, email, password, user_role, designation, company) are required to register");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      user_role: user_role,
      designation: designation,
      company: company,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    await(user.token = token);

    // return json web token
    res.status(201).json(token);
  } catch (err) {
    console.log(err);
  }
});

// Login
app.post("/login", async (req, res) => {

  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All inputs(email and password) are required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // return json web token after logging in
      res.status(200).json(token);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete('/delete', auth, async (req, res) => {
  // Get the user ID from the JWT token
  const email = req.user.email;

  try {
    // Find the user by ID and delete them
    await User.findOneAndDelete({email: email});

    // Return a success message to the client
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
})

module.exports = app;