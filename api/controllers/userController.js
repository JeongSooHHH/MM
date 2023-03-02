const userService = require("../services/userService");

const userSignUp = async (req, res) => {
  const { id, password } = req.body;
  await userService.userSignUp(id, password);
  return res.status(201).json({ message: "회원가입 완료" });
};

const userSignIn = async (req, res) => {
  const { id, password } = req.body;
  const token = await userService.userSignIn(id, password);
  return res.status(200).json({ token });
};

module.exports = { userSignUp, userSignIn };
