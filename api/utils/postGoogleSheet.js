const { google } = require("googleapis");

const credentials = require("../../key.json");
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const spreadsheetId = process.env.GOOGLE_API_SHEET_ID;
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes,
});
const sheets = google.sheets({ version: "v4", auth });
const range = "시트1";
const valueInputOption = "raw"; // raw : string, user_entered : sheet ui parse

const uploadFileGoogle = async (originalName, mimetype, date, size, userId) => {
  const values = [[userId, originalName, mimetype, date, size]];
  const resource = { values };
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption,
    resource,
    insertDataOption: "INSERT_ROWS",
  });

  return response;
};

module.exports = { uploadFileGoogle };
