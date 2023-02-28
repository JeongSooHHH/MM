const express = require("express");
// const { MongoClient } = require("mongodb");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const moment = require("moment");

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
  const collection = database.collection("documents");

  client.connect(async (err) => {
    // <- 데이터 단독 삽입 구문 통째로 날려도 괜찮음.
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const db = client.db("mathMedic");
    const collection = db.collection("documents");

    const documents = {
      _id: "1",
      id: "000001",
      code: "V1022H3EBS01E0025",
      provider: "admin",

      date: {
        create: "2023.02.14 00:00",
        update: "2023.02.14 12:00",
      },

      problem:
        "실수 $a$의 세제곱근 중 실수인 것을 $4$, $81$의 네제곱근 중 실수인 것을 $b$라 할 때, $a+b$의 최댓값을 구하시오.", // 문제 text

      solution:
        "실수 $a$의 세제곱근 중 실수인 것이 $4$이므로 방정식 $x^{3}=a$의 근 중에서 $4$이다. therefore$ $a=64$", // 해설 text
      // 파싱한 문제 (latex or xml)
      search_problem:
        "실수 a의 세제곱근 중 실수인 것을 4, 81의 네제곱근 중 실수인 것을 b라 할 때, a+b의 최댓값을 구하시오.", // 검색Ver 문제 text
      // 파싱한 해설 (latex or xml)
      search_solution:
        "실수 a의 세제곱근 중 실수인 것이 4이므로 방정식 x^{3}=a의 근 중에서 44이다. therefore a=64", // 검색Ver 해설 text
      answer: "67",
      score: "",

      subject: {
        depth_1: {
          depth_1_id: "03",
          depth_1_name: "수학1",
        },
        depth_2: {
          depth_2_id: "01",
          depth_2_name: "지수와로그",
        },
        depth_3: {
          depth_3_id: "02",
          depth_3_name: "거듭제곱근",
        },
      },

      count: {
        read: "10",
        comments: "10",
        problem_tags_count: "2",
      },

      comment: [
        ["admin", "2023.02.14 00:00", "내용"],
        ["admin", "2023.02.14 00:00", "내용"],
      ],
    };

    // const result = await collection.insertOne(documents); // 주석제거시 insert가능
    // console.log(result);
  });

  // Create a document // 53번줄에 주석을 제공하면 36번줄부터 시작된 글이 다 저장
  app.post("/documents", (req, res) => {
    const document = req.body; // postman에서 어떻게 넣을지 지정해줘야함.
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
  app.get("/documents/all", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error getting documents");
        return;
      }
      res.send(documents);
    });
  });

  // Get a single document by _ID
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

  app.get("/documents/search/:query", (req, res) => {
    const query = req.params.query;

    // Construct the MongoDB query based on the search query
    const searchQuery = {
      $or: [
        // { problem: { $regex: query, $options: "i" } },
        // { solution: { $regex: query, $options: "i" } },
        // { search_problem: { $regex: query, $options: "i" } },
        // { search_solution: { $regex: query, $options: "i" } },
        // { code: { $regex: query, $options: "i" } },
        { provider: { $regex: query, $options: "i" } },
      ],
    };

    // Find the documents that match the search query
    collection.find(searchQuery).toArray((err, documents) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error getting documents");
        return;
      }
      res.send(documents);
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
        res.sendStatus(204, "Deleted Well");
      }
    );
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
