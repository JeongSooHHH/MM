const jwt = require("jsonwebtoken");
const { asyncErrorHandler, throwCustomError } = require("./error");

const validateToken = asyncErrorHandler(async (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) throwCustomError("NEED_ACCESS_TOKEN", 400);

  const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  if (!decoded) throwCustomError("USER_DOES_NOT_EXIST", 404);

  req.userId = decoded.id;
  next();
});

module.exports = {
  validateToken,
};
