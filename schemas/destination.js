const mongoose = require("mongoose")

const DestinationSchema = new mongoose.Schema({
  country: String,
  title: {
    type: String,
    required: true,
  },
  link: String,
  arrivalDate: Date,
  departureDate: Date,
  image: String,
  description: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
})

module.exports = mongoose.model("destinations", DestinationSchema)
