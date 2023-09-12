const express = require("express")
const dotenv = require("dotenv")
const { MongoClient } = require("mongodb")
const app = express()
const port = 3009

const uri = "mongodb://127.0.0.1:27017"
const client = new MongoClient(uri)

async function getDestinations(client) {
  const database = client.db("trippin")
  const destinations = database.collection("destinations")

  return destinations.find()
}

async function createDestination(body) {
  try {
    const database = client.db("trippin")
    const destinations = database.collection("destinations")

    return await destinations.insertOne(body)
  } catch (err) {
    throw new Error("Failed to create database")
  }
}

async function connect() {
  try {
    await client.connect()
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

app.get("/", async (req, res) => {
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
  connect().catch(console.error)

  console.log(`Listening on port ${port}`)
})
