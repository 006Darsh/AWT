const { createPersonalInfo } = require("../Controllers/PersonalInfoController");

const PersonalInfoRoutes = (app) => {
  app.post("/add/personalinfo", createPersonalInfo);
};

module.exports = PersonalInfoRoutes;
