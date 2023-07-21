const express = require("express");
const bodyParser = require("body-parser");

const hostname = "127.0.0.1";
const port = 3000;
// New app using express module
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/html/task2.html");
});

app.post("/display", function (req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var id = req.body.id;
  var email = req.body.email;
  var phone = req.body.phone;
  var date = req.body.date;
  var phone = req.body.phone;
  var gender = req.body.gender;
  var state = req.body.state;
  var range = req.body.range;
  var time = req.body.time;
  var hobbie = req.body.hobbie;
  var ele_subject = req.body.ele_subject;
  var ele_sub_code = req.body.ele_sub_code;
  var Elective_subject = ele_sub_code + " " + ele_subject;

  var FullName = fname + " " + lname;
  var collegeinfo = {
    "Full Name: ": FullName,
    "Birth Date: ": date,
    "Gender: ": gender,
    "Id: ": id,
    "Email: ": email,
    "Phone No: ": phone,
    "CGPA: ": range,
    "Elective Subject: ": Elective_subject,
    "Home State: ": state,
    "Current Time: ": time,
    "Hobbies: ": hobbie,
  };
  var responseString = "";
  for (const keys in collegeinfo) {
    responseString += `<b>${keys}</b>${collegeinfo[keys]}<br\>`;
  }
  res.send(responseString);
  //   res.send(
  //     `Full Name: ${FullName}<br/>Email: ${email}<br\>Phone No: ${phone}<br/>Elective Subject: ${Elective_subject}`
  //   );
});

app.listen(3000, function () {
  console.log(`server is running on http://${hostname}:${port}/`);
});
