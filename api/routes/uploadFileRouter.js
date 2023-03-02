const express = require("express");
const { upload } = require("../utils/upload");
const router = express.Router();
const { validateToken } = require("../utils/auth");
const uploadFileController = require("../controllers/uploadFileController");

router.post(
  "/dragndrop",
  validateToken,
  upload,
  uploadFileController.uploadFileGoogle
);
router.get("/checkname", validateToken, uploadFileController.duplicateCheck);
router.get("/checklist", validateToken, uploadFileController.checkUploadList);

module.exports = { router };
