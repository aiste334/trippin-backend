import Destination from "./schemas/destination"

const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors") // Import the cors middleware

const PORT = 3009
const URI = "mongodb://127.0.0.1:27017"
const DB_NAME = "trippin"

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get("/", async (req, res) => {
  const destinations = await Destination.find({}).lean()

  res.status(200).send(JSON.stringify(destinations))
})

app.post("/destination", async (req, res) => {
  try {
    const result = await Destination.insertOne(body)

    if (result) {
      await Destination.save().then(() => res.status(201).send(result))
    }
  } catch (err) {
    res.status(500).send("Failed to create destination")
  }
})

app.delete("/destinations/:id", async (req, res) => {
  try {
    const id = req.params.id
    await Destination.deleteById(id)

    await Destination.save().then(() =>
      res.status(204).send("Deleted successfully")
    )
  } catch (err) {
    res.status(500).send("Failed to delete destination")
  }
})

app.listen(PORT, () => {
  connectToDb()
  console.log(`Listening on port ${PORT}`)
})

async function connectToDb() {
  mongoose.set("strictQuery", true)

  try {
    await mongoose.connect(URI, {
      dbName: DB_NAME,
    })

    console.log("MongoDB connected")
  } catch (error) {
    console.log("MongoDB error:", error)
  }
}
