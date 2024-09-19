// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: 'mrspecial932@gmail.com', // Replace with your email
    pass: 'yeek splq qava autz'    // Replace with your email password or app-specific password
  }
});

// Function to send email
const sendEmail = async (recipient, hash) => {
  try {
    const info = await transporter.sendMail({
      from: '"Certificate System" <your-email@gmail.com>', // Sender address
      to: recipient, // Recipient address
      subject: 'Your Certificate Hash', // Subject line
      text: `Hello,

Here is the hash of your certificate: ${hash}

Thank you!`, // Plain text body
      html: `<p>Hello,</p>
             <p>Here is the hash of your certificate: <strong>${hash}</strong></p>
             <p>Thank you!</p>` // HTML body
    });

    console.log('Message sent: %s', info.messageId);
    return 'Email sent successfully!';
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};

// POST endpoint to send email
app.post('/send-email', async (req, res) => {
  const { email, hash } = req.body;

  if (!email || !hash) {
    return res.status(400).send('Email and hash are required.');
  }

  try {
    const result = await sendEmail(email, hash);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Failed to send email.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
