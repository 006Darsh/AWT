const PersonalInfo = require("../Models/PersonalInfo");

exports.createPersonalInfo = async (req, res) => {
    const { name, age, email } = req.body;
    const newInfo = new PersonalInfo({ name, age, email });
    await newInfo.save();
    return res.status(200).send({
      success: true,
      Your_info: newInfo,
      message: "Your Information Added Successfully",
    });
}