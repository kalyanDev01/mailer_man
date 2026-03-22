const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
app.post('/sendemail', (req, res) => {
  console.log('Message received from frontend:', req.body.msg);
  const creds = mongoose.model("creds", {}, "bulkmail");

  creds.find().then((data) => {
    if (data) {
      console.log(data[0].toJSON());
      let creds = data[0].toJSON();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: creds.user,
          pass: creds.password
        },
      });
      new Promise(async (resolve, reject) => {
        try {
          for (let i = 0; i < req.body.emailList.length; i++) {
            var emailList = req.body.emailList;
            await transporter.sendMail({
              from: creds.user,
              to: emailList[i],
              subject: "Mailer Man ✔ ",
              text: req.body.msg
            });
            console.log('Email sent to:', emailList[i]);
          }
          // res.send(true);
          resolve("Success");
        }
        catch (error) {
          // res.send(false);
          reject("Failed");
        }
      }).then((message) => {
        // console.log(message);
        res.send(true);
      }).catch((error) => {
        console.error(error);
        res.send(false);
      });
    } else {
      console.log("No credentials found in database.");
      res.send(false);

    }
  }).catch((err) => {
    console.error("Error fetching credentials from database:", err);
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port', process.env.PORT || 5000);
});







