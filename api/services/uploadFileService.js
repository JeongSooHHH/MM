const { google } = require("googleapis");
const credentials = require("../../key.json");
const postGoogleSheet = require("../utils/postGoogleSheet");
const scopes = ["https://www.googleapis.com/auth/drive"];
const uploadFileDao = require("../models/uploadFileDao");
const GOOGLE_API_FOLDER_ID = process.env.GOOGLE_API_FOLDER_ID;
const { PassThrough } = require("stream");
const moment = require("moment");

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes,
});

const drive = google.drive({
  version: "v3",
  auth,
});

const uploadFileGoogle = async (filesObj, userId) => {
  try {
    const bufferStream = new PassThrough();
    bufferStream.end(filesObj.buffer);
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    const size = (filesObj.size / 1048576).toFixed(2) + "MB";

    const originalName = new Buffer.from(
      filesObj.originalname,
      "latin1"
    ).toString("utf8");

    await uploadFileDao.uploadFileGoogle(
      userId,
      originalName,
      filesObj.mimetype,
      date,
      size
    );
    await postGoogleSheet.uploadFileGoogle(
      originalName,
      filesObj.mimetype,
      date,
      size,
      userId
    );
    const { data } = await drive.files.create({
      requestBody: {
        name: originalName,
        parents: [GOOGLE_API_FOLDER_ID],
      },
      media: {
        mimeType: filesObj.mimetype,
        body: bufferStream,
      },
      fields: "id,name",
    });

    return {
      data,
      originalName,
      id: data.id,
    };
  } catch (err) {
    console.error("Upload file error", err);
    throw err;
  }
};

const duplicateCheck = async (userId, fileName) => {
  return uploadFileDao.duplicateCheck(userId, fileName);
};

const checkUploadList = async (userId) => {
  return uploadFileDao.checkUploadList(userId);
};
module.exports = { uploadFileGoogle, duplicateCheck, checkUploadList };
