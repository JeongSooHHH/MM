const express = require("express");
// const { MongoClient } = require("mongodb");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const app = express();
const port = 3000;
const mongoUri =
  "mongodb+srv://space2577:ghkdwjdtn@csm.jifgqtn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(mongoUri);

app.use(express.json());

client.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Connected to MongoDB");

  const database = client.db("mathMedic");
  const collection = database.collection("reviews");

  // Create a document
  app.post("/documents", (req, res) => {
    const document = req.body;
    collection.insertOne(document, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating document");
        return;
      }
      res.send(result.ops[0]);
    });
  });

  // Get all documents
  app.get("/documents", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error getting documents");
        return;
      }
      res.send(documents);
    });
  });

  // Get a single document by ID
  app.get("/documents/:id", (req, res) => {
    const id = req.params.id;
    collection.findOne({ _id: new mongodb.ObjectID(id) }, (err, document) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error getting document");
        return;
      }
      if (!document) {
        res.status(404).send("Document not found");
        return;
      }
      res.send(document);
    });
  });

  // Update a document by ID
  app.put("/documents/:id", (req, res) => {
    const id = req.params.id;
    const update = req.body;
    collection.findOneAndUpdate(
      { _id: new mongodb.ObjectID(id) },
      { $set: update },
      { returnOriginal: false },
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error updating document");
          return;
        }
        if (!result.value) {
          res.status(404).send("Document not found");
          return;
        }
        res.send(result.value);
      }
    );
  });

  // Delete a document by ID
  app.delete("/documents/:id", (req, res) => {
    const id = req.params.id;
    collection.findOneAndDelete(
      { _id: new mongodb.ObjectID(id) },
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error deleting document");
          return;
        }
        if (!result.value) {
          res.status(404).send("Document not found");
          return;
        }
        res.sendStatus(204);
      }
    );
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
