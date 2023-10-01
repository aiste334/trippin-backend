const Destination = require("./schemas/destination")
const User = require("./schemas/user")
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")
const auth = require("./auth.js")

const PORT = 3009
const URI = "mongodb://127.0.0.1:27017/trippin"

const app = express()
app.use(bodyParser.json())
app.use(cors())


//Destinations

app.get("/destinations", async (req, res) => {
  try {
    const destinations = await Destination.find({}).lean()
    res.status(200).json(destinations)
  } catch (err) {}
})

app.post("/destinations", async (req, res) => {
  try {
    const destination = await Destination.create(req.body)
    res.status(201).json(destination)
  } catch (err) {
    res.status(500).json({ message: "Failed to create destination" })
  }
})

app.put("/destinations/:id", async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!destination) res.status(404).json({ message: "Destination not found" })
    res.status(200).json(destination)
  } catch (err) {
    res.status(500).json({ message: "Failed to update destination" })
  }
})

app.delete("/destinations/:id", auth.checkLogin, async (req, res) => {
  try {
    await Destination.deleteOne({ _id: req.params.id })
    res.status(204).json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete destination" })
  }
})


app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username})
    res.status(200).json(user)
  } catch (err) {}
})

// Authentication controllers

//sign up
app.post("/register", async (req, res) => {
  const existingUser = await User.findOne({
    username: req.body.username
  })
  if(existingUser == null){
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create(req.body)
      console.log("eeee")
      res.status(201).json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: `Failed to create user: ${err}` })
    }
  } else {
    
  console.log("aaaa")
    res.status(400).send({ message: "Failed! Username is already in use!" });
  }
  
  console.log("dddd")
})

//login
app.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({username: req.body.username})
    if (user) {
      console.log("user found")
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        console.log("password is correct")
      //Create token
      const token = jwt.sign(
      { user_id: user._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
      );

      //Save user token
      user.token = token;
      console.log(token);
        res.status(201).json({ token });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(404).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ error});
  }
});

app.listen(PORT, () => {
  mongoose.set("strictQuery", true)
  mongoose.connect(URI)

  console.log(`Listening on port ${PORT}`)
})
