import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

interface User {
  userId: string;
  username: string;
  uid: string;
}

interface Profile {
  userUid: string;
  birthdate: string;
  address: string;
}

let pendingRequests: { username: string, address: string, message: string }[] = [];

async function fetchUserData(): Promise<{ users: User[], profiles: Profile[] }> {
  const userResponse = await fetch('https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json');
  const profileResponse = await fetch('https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json');
  const users = await userResponse.json();
  const profiles = await profileResponse.json();
  return { users, profiles };
}

app.post('/submit', async (req: Request, res: Response) => {
  const { userId, message } = req.body;
  const { users, profiles } = await fetchUserData();
 
  const user = users.find(u => u.uid === userId);
  if (!user) {
    return res.status(400).send('User not found');
  }

  const profile = profiles.find(p => p.userUid === user.uid);
  if (!profile) {
    return res.status(400).send('Profile not found');
  }
  console.log(profile)
  const age = calculateAge(new Date(profile.birthdate));

  if (age >= 10) {
    return res.status(400).send('User is older than 10 years');
  }

  console.log(user.username)
  console.log(profile.address)
  console.log(message)
  pendingRequests.push({ username: user.username, address: profile.address, message });
  res.send('Request received');
});

function calculateAge(dob: Date): number {
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
      user: 'merle68@ethereal.email',
      pass: 'y8AZYp6rx2VeS8xvTp'
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
