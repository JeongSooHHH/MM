const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017/mydb");
const database = client.db("mydb");
const users = database.collection("users");

const postUserNaverData = async (userData) => {
  return users.insertMany([
    {
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
    },
  ]);
};

const findUserData = async (email) => {
  return users.findOne({ email: email });
};

const findUserDataById = async (id) => {
  return users.findOne({ id: id });
};
const postUserData = async (id, hashPassword) => {
  return users.insertMany([
    {
      id: id,
      password: hashPassword,
    },
  ]);
};

module.exports = {
  postUserNaverData,
  findUserData,
  findUserDataById,
  postUserData,
};
