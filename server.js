const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let pendingRequests = [];

async function fetchUserData() {
  const userResponse = await fetch('https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json');
  const profileResponse = await fetch('https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json');
  const users = await userResponse.json();
  const profiles = await profileResponse.json();
  return { users, profiles };
}

app.post('/submit', async (req, res) => {
  const { userId, message } = req.body;
  const { users, profiles } = await fetchUserData();
  
  const user = users.find(u => u.userId === userId);
  if (!user) {
    return res.status(400).send('User not found');
  }
  
  const profile = profiles.find(p => p.userUid === user.uid);
  const age = calculateAge(new Date(profile.dob));
  
  if (age >= 10) {
    return res.status(400).send('User is older than 10 years');
  }

  pendingRequests.push({ username: user.username, address: profile.address, message });
  res.send('Request received');
});

function calculateAge(dob) {
  const diff = Date.now() - dob.getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return age;
}

setInterval(async () => {
  if (pendingRequests.length === 0) return;

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'your_ethereal_user',
      pass: 'your_ethereal_password'
    }
  });

  const mailOptions = {
    from: 'do_not_reply@northpole.com',
    to: 'santa@northpole.com',
    subject: 'Pending Requests',
    text: JSON.stringify(pendingRequests, null, 2)
  };

  await transporter.sendMail(mailOptions);
  pendingRequests = [];
}, 15000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});