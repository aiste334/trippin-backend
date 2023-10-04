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
app.use(bodyParser.urlencoded({ extended: true })); 


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

app.get("/destinations/:id", async (req, res) => {
  try {
    const destinationId = req.params.id;
    console.log("Received request for destination ID:", destinationId);
    const destination = await Destination.findById(destinationId).lean();

    if (!destination) {
      res.status(404).send("Destination not found");
    } else {
      res.status(200).json(destination);
    }
  } catch (error) {
    console.error("Error fetching destination:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/destinations/:id", async (req, res) => {
    try {
        const destination = await Destination.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body }, 
            { new: true } 
        );
        res.status(200).send(JSON.stringify(destination));
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update destination");
    }
});


app.delete("/destinations/:id", async (req, res) => {
  try {
    await Destination.deleteOne({ _id: destinationId })
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
