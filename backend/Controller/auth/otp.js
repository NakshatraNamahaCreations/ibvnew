const otpModel = require("../../Model/auth/otp");
const userModel = require("../../Model/auth/vendorProfile");
const { default: axios } = require("axios");

class Otp {
  async sendotp(req, res) {
    let { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.json({ error: "No Number" });
    } else {
      try {
        let newnumber = await otpModel.findOne({ phoneNumber: phoneNumber });
        if (newnumber) {
          // const key = "Ae97f7ad9d6c2647071d78b6e94a3c87e";
          const key = "25575e4c288a679ff041862820351267c9c64d34a6850565";
          const sid = "EXOSMS";
          token = "c872a58c9a3ac23b352988d702098b095b13d98e48f6acea";
          const to = phoneNumber;
          const body = `Hi, Your OTP for Phone Number verification is ${otp} Regards, Team infinityMart.`;
          axios
            .get(
              "https://api-alerts.kaleyra.com/v4/?api_key=" +
                key +
                "&method=sms&message=" +
                body +
                "&to=" +
                to +
                "&sender=EXOSMS"
            )
            .then(async (data) => {
              console.log(`statusCode: ${data.status}`);
              console.log(data);
              return res.json({ otp: newnumber.otp });
            })
            .catch((error) => {
              console.error(error);
              return res.status(500).json({ error: error });
            });
          //
        } else {
          var otp = (Math.floor(Math.random() * 1000000) + 1000000)
            .toString()
            .substring(1);
          console.log(otp);
          let newotp = new otpModel({
            phoneNumber,
            otp,
          });
          let save;
          const key = "25575e4c288a679ff041862820351267c9c64d34a6850565";
          const sid = "EXOSMS";
          const to = phoneNumber;
          const body = `Hi, Your OTP for phoneNumber verification is ${otp} Regards, Team infinityMart`;
          axios
            .get(
              "https://api-alerts.kaleyra.com/v4/?api_key=" +
                key +
                "&method=sms&message=" +
                body +
                "&to=" +
                to +
                "&sender=EXOSMS"
            )
            .then(async (data) => {
              console.log(`statusCode: ${data.status}`);
              console.log(data);
              save = await newotp.save();
              if (save) {
                return res.json({ success: "otp sent successfully", otp });
              }
            })
            .catch((error) => {
              console.error(error);
              return res.status(500).json({ error: error });
            });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async verifyotp(req, res) {
    const { otp, phoneNumber } = req.body;

    console.log(otp, phoneNumber);
    if (!otp) {
      return res.json({ error: "enter otp" });
    } else {
      try {
        let verify = await otpModel.findOne({
          otp: otp,
          phoneNumber: phoneNumber,
        });
        if (verify) {
          let user = await userModel.findOneAndUpdate(
            {
              phoneNumber: phoneNumber,
            },
            { status: "online" }
          );
          console.log(user);
          return res.json({ success: "otp verified", user: user });
        } else {
          return res.status(500).json({ error: "enter vaild otp" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const authotpController = new Otp();
module.exports = authotpController;
