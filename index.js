const express = require("express")
const dotenv = require("dotenv")
const { MongoClient } = require("mongodb")
const bodyParser = require("body-parser")
const app = express()
const port = 3009

const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri)

async function getDestinations(client) {
  const database = client.db("trippin")
  const destinations = database.collection("destinations")

  const result = await destinations.find({}).toArray()

  return JSON.stringify(result)
}

async function createDestination(body) {
  try {
    const database = client.db("trippin")
    const destinations = database.collection("destinations")

    return await destinations.insertOne(body)
  } catch (err) {
    console.log(err)
    throw new Error("Failed to create database")
  }
}

app.use(bodyParser.json())

app.get("/destinations", async (req, res) => {
  const destinations = await getDestinations(client)

  res.status(200).send(destinations)
})

app.post("/destination", async (req, res) => {
  try {
    const result = await createDestination(req.body)

    res.status(201).send(result)
  } catch (err) {
    res.status(500).send("Failed to create destination")
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
