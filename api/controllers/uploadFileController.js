const uploadFileService = require("../services/uploadFileService");
const { asyncErrorHandler } = require("../utils/error");

const uploadFileGoogle = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const filesObjs = req.files;
  const uploads = filesObjs.map(async (filesObj) => {
    await uploadFileService.uploadFileGoogle(filesObj, userId);
  });
  await Promise.all(uploads);
  return res
    .status(201)
    .json({ message: `${filesObjs.length}개 파일 업로드 성공!` });
});

const duplicateCheck = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const { fileName } = req.query;
  const duplicate = await uploadFileService.duplicateCheck(userId, fileName);
  const result = duplicate
    ? res.status(200).json({ message: `${fileName}은 중복된 파일입니다.` })
    : res.status(200).json({ message: `중복된 파일이 없습니다.` });
  return result;
});

const checkUploadList = asyncErrorHandler(async (req, res) => {
  const userId = req.userId;
  const uploadList = await uploadFileService.checkUploadList(userId);
  return res.status(200).json({ data: uploadList });
});

module.exports = { uploadFileGoogle, duplicateCheck, checkUploadList };
