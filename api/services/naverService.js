const axios = require("axios");
const userDao = require("../models/userDao");

const naverLogin = async (code) => {
  const tokenRequestConfig = {
    method: "POST",
    url: "https://nid.naver.com/oauth2.0/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "authorization_code",
      client_id: process.env.NAVER_CLIENT_ID,
      client_secret: process.env.NAVER_CLIENT_SECRET,
      code: code,
      state: "RANDOM_STATE_STRING",
    },
  };

  try {
    const { data: tokenData } = await axios(tokenRequestConfig);

    const userRequestConfig = {
      method: "GET",
      url: "https://openapi.naver.com/v1/nid/me",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    };

    const { data: userData } = await axios(userRequestConfig);

    const findUserData = await userDao.findUserData(userData.email);
    if (findUserData.length == 0) {
      await userDao.postUserNaverData(userData);
    }

    const token = jwt.sign(
      {
        id: userData.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

module.exports = { naverLogin };
