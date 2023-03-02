const naverService = require("../services/naverService");

const naverLogin = async (req, res) => {
  const { code } = req.query;
  const token = await naverService.naverLogin(code);
  return res.status(200).json({ token });
};

module.exports = { naverLogin };
