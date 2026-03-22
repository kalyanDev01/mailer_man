const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
service: 'gmail',
  auth: {
    user: "krvsr99@gmail.com",
    pass: "ahwt ufmg wjso gorg",
  },
});



app.post('/sendemail', (req, res) => {
  console.log('Message received from frontend:', req.body.msg);
  for(let i=0;i<req.body.emailList.length;i++){
    var emailList = req.body.emailList;
      transporter.sendMail({
      from: "krvsr99@gmail.com",
      to: emailList[i],
      subject: "Mailer Man ✔ ",
      text:  req.body.msg
      
  },function(error, info){
      if(error){
          console.log(error);
          res.json({ status: 'Error sending email' });
      } else {
          console.log(info);
          res.json({ status: 'Success sending email' });
      }
    });  
  }
});

app.listen(5000,()=>{
    console.log('Server is running on port 5000');
});







