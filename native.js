const express = require("express");
// const { MongoClient } = require("mongodb");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const cors = require("cors");
const moment = require("moment");

const app = express();
const port = 3000;

const mongoUri =
  "mongodb+srv://space2577:ghkdwjdtn@csm.jifgqtn.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(mongoUri);

app.use(express.json());
app.use(cors());

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
    // 1. 아래는 데이터 모형이다.
    // 2. 해당 데이터의 키 값을 기반으로 데이터가 들어간다.
    // 3. search 데이터를 통해서  검색을
    const documents = {
      _id: "stop", // 생성
      id: "000001",
      code: "V1022H3EBS01E0025",
      sub_code: "",
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

      // 전체검색은 없고 해당되는 기능별 검색.
      // 텍스트를 통해 찾는것 화이팅

      source: "기출문제", // 출처

      subject: {
        // 과목  subject1-> 수1, subject2 -> 수2
        type: "수1",
        units: [
          {
            id: "1-1",
            name: "지수",
          },
          {
            id: "1-2",
            name: "로그",
          },
          {
            id: "1-3",
            name: "지수함수",
          },
          {
            id: "1-4",
            name: "로그함수",
          },
        ],
        //  {        // 수1
        //   unit:{        //
        //     unit_1: "지수",
        //     unit_2: "로그",
        //     unit_3: "지수함수"
        //   },
        // },
      },
      answer: "주관식", // 답종류 : 객관식, 주관식,

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

    const result = await collection.insertOne(documents); // 주석제거시 insert가능
    console.log(result);
  });

  //-------------------------------------------------------------------------------------------

  // Create a document // 53번줄에 주석을 제공하면 36번줄부터 시작된 글이 다 저장
  /* app.post("/documents", (req, res) => {
    const document = req.body; // postman에서 어떻게 넣을지 지정해줘야함.
    collection.insertOne(document, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating document");
        return;
      }
      res.send(result.ops[0]);
    });
  });  */ // 현재 미사용 기능

  //-------------------------------------------------------------------------------------------

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

  //-------------------------------------------------------------------------------------------

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

  //-------------------------------------------------------------------------------------------

  app.get("/documents/search/:query", (req, res) => {
    // 단독데이터 호출(카테고리로 지정?)
    const query = req.params.query;
    console.log(query);
    console.log(req);
    const searchQuery = {
      $or: [
        // { problem: { $regex: query, $options: "i" } },
        // { solution: { $regex: query, $options: "i" } },
        { search_problem: { $regex: query, $options: "i" } },
        { search_solution: { $regex: query, $options: "i" } },
        // { code: { $regex: query, $options: "i" } },
        // { provider: { $regex: query, $options: "i" } },
      ],
      $and: [{}],
    };

    collection.find(searchQuery).toArray((err, documents) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error getting documents");
        return;
      }
      res.send(documents);
    });
  });

  //-------------------------------------------------------------------------------------------

  app.get("/questions", async (req, res) => {
    const source = req.query.source;
    const subject = req.query.subject;
    const unit = req.query.unit;
    const answer = req.query.answer;

    await client.connect();

    try {
      // Build the filter object based on the query parameters
      const filter = {};

      if (source) {
        filter.source = source;
      }

      if (subject) {
        filter.subject = subject;
      }

      if (unit) {
        filter.unit = unit;
      }

      if (answer) {
        filter.answer = answer;
      }

      const conditions = Object.keys(filter).map((key) => ({
        [key]: filter[key],
      }));
      const andFilter = { $and: conditions };

      const questions = await collection.find(andFilter).toArray();

      res.send(questions);
    } finally {
      await client.close();
    }
  });

  //-------------------------------------------------------------------------------------------

  // 검색은 조사를 질문을 어떻게 하는지(발문)에 대한 고민이 필요하고 띄어쓰기 등의 상황 또한 고려해서 인덱싱 기능을 잘 활용해야함.
  // 카테고리나 태그는 생각보다 덜 씀. 들어오는 데이터는 일단은 목데이터를 기반으로 생각하면됨.
  // app.get("/documents/tag/:query", (req, res) => { // and로 들어오는것을 분류해야함.
  //   const query = req.params.query;

  //   // Construct the MongoDB query based on the search query
  //   // 태그를 통해서 데이터를 호출한다
  //   // AND기반으로 데이터를 끌어가야함. 출처, 과목명, 단원, 정답종류  ||
  //   const searchQuery = {
  //     $and: ([
  //       { problem: { $regex: query, $options: "i" } },
  //       { solution: { $regex: query, $options: "i" } },
  //       { search_problem: { $regex: query, $options: "i" } },
  //       { search_solution: { $regex: query, $options: "i" } },
  //       { code: { $regex: query, $options: "i" } },
  //       { provider: { $regex: query, $options: "i" } },
  //     ]),
  //     $and:[
  //       { }
  //     ]
  //   };

  //   // Find the documents that match the search query
  //   collection.find(searchQuery).toArray((err, documents) => {
  //     if (err) {
  //       console.error(err);
  //       res.status(500).send("Error getting documents");
  //       return;
  //     }
  //     res.send(documents);
  //   });
  // });                                                      //

  //-------------------------------------------------------------------------------------------

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

  //-------------------------------------------------------------------------------------------

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

// 가능한한 모든 로직은 백에서 처리 후 프론트 전송

/* postman 호출 예시입니다. 
- 테스트 편의성을 위해 서버 실행시 자동으로 데이터 생성되도록 설정 해두었습니다. (_id값 주석해제를 통해 정지가능)

app.get("/documents/all", // 디비 내 모든 데이터 검색
http://127.0.0.1:3000/documents/all   

app.get("/documents/:id", // _id(고유값) 기반 검색 기능, 스키마 확정시 자동증가 시퀀스 추가 
http://127.0.0.1:3000/documents/64005816818a59a46331166e

app.get("/documents/search/:query",   << search problem/solution 기반 검색
http://127.0.0.1:3000/documents/search/some                 

app.get("/questions",
http://127.0.0.1:3000/questions?source=기출문제&&answer=객관식   <<필터, 쿼리 중첩 검색
    현재 데이터: (source, subject, unit, answer)  




app.put("/documents/:id",   // 데이터 수정 기능
http://127.0.0.1:3000/documents/64005816818a59a46331166e 
바디값을 통해서 수정 / 수정 방법론 미정

app.delete("/documents/:id"  //파일삭제, 자동증가 시퀀스 미반영 상태, 추가시 병합반영
http://127.0.0.1:3000/documents/64005816818a59a46331166e 
*/
