const Destination = require("./schemas/destination")
const User = require("./schemas/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { SECRET = "secret" } = process.env;
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")

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

app.delete("/destinations/:id", async (req, res) => {
  try {
    await Destination.deleteOne({ _id: req.params.id })
    res.status(204).json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete destination" })
  }
})


//Authentication

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              req.userId = decoded.id;
              next();
            });
};

// Authentication controllers
//sign up
app.post("/user", async (req, res) => {
  const existingUser = await User.findOne({
    username: req.body.username
  })
  if(existingUser == null){
    try {
      //checkDuplicateUsername(req, res);
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create(req.body)
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ message: `Failed to create user: ${err}` })
    }
  } else {
    res.status(400).send({ message: "Failed! Username is already in use!" });
  }
})

//login
app.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({username: req.body.username})
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        const token = await jwt.sign({ username: user.username }, SECRET);
        res.json({ token });
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
