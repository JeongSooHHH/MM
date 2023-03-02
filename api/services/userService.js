const userDao = require("../models/userDao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { throwCustomError } = require("../utils/error");

const userSignUp = async (id, password) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return userDao.postUserData(id, hashPassword);
};

const userSignIn = async (id, password) => {
  const user = await userDao.findUserDataById(id);
  console.log(user);
  if (!user) {
    throwCustomError("일치하는 정보가 없습니다", 409);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throwCustomError("비밀번호가 다릅니다.", 409);
  }
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
};

module.exports = { userSignUp, userSignIn };
