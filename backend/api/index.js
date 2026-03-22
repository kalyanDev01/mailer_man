const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
    isConnected = true;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

app.post('/sendemail', async (req, res) => {
  try {
    console.log('Message received from frontend:', req.body.msg);
    
    await connectDB();
    
    const creds = mongoose.model("creds", {}, "bulkmail");
    const data = await creds.find().exec();

    if (!data || data.length === 0) {
      console.log("No credentials found in database.");
      return res.status(400).send(false);
    }

    const credsData = data[0].toJSON();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: credsData.user,
        pass: credsData.password
      },
    });

    for (let i = 0; i < req.body.emailList.length; i++) {
      const email = req.body.emailList[i];
      try {
        await transporter.sendMail({
          from: credsData.user,
          to: email,
          subject: "Mailer Man ✔",
          text: req.body.msg
        });
        console.log('Email sent to:', email);
      } catch (err) {
        console.error('Failed to send email to:', email, err);
      }
    }

    res.send(true);
  } catch (error) {
    console.error("Error:", error);
    res.send(false);
  }
});

module.exports = app;
