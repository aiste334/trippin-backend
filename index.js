const Destination = require("./schemas/destination")

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")

const PORT = 3009
const URI = "mongodb://127.0.0.1:27017/trippin"

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get("/destinations", async (req, res) => {
  const destinations = await Destination.find({}).lean()

  res.status(200).send(JSON.stringify(destinations))
})

app.post("/destinations", async (req, res) => {
  try {
    const destination = await Destination.create(req.body)
    res.status(201).send(JSON.stringify(destination))
  } catch (err) {
    console.log(err)
    res.status(500).send("Failed to create destination")
  }
})

app.put("/destinations/:id", async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).send(JSON.stringify(destination))
  } catch (err) {
    res.status(500).send("Failed to update destination")
  }
})

app.delete("/destinations/:id", async (req, res) => {
  try {
    await Destination.deleteById(req.params.id)
    res.status(204).send("Deleted successfully")
  } catch (err) {
    res.status(500).send("Failed to delete destination")
  }
})

app.listen(PORT, () => {
  mongoose.set("strictQuery", true)
  mongoose.connect(URI)

  console.log(`Listening on port ${PORT}`)
})
