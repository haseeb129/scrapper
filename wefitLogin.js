const cron = require("node-cron");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();

const username = process.env.WE_FIT_USERNAME;
const password = process.env.WE_FIT_PASSWORD;
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.GMAIL_USERNAME, // Your email
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendWhatsAppMessage = async (message) => {
  try {
    const response = await client.messages.create({
      body: message, // Your message
      from: "whatsapp:+14155238886", // Twilio sandbox WhatsApp number
      to: `whatsapp:${process.env.MINE_PHONE_NUMBER}`, // Your phone number (WhatsApp format)
    });
    console.log("WhatsApp message sent successfully:", response.sid);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};

const checkAppointments = async () => {
  // Launch the browser

  const browser = await puppeteer.launch({ headless: false }); // Set headless to true if you don't want to see the browser window
  const page = await browser.newPage();

  try {
    // Step 1: Go to the login page
    await page.goto("https://wefit.world/login/", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Step 2: Enter username and password
    await page.type("#username-3042", username); // Username input selector
    await page.type("#user_password-3042", password); // Password input selector

    // Step 3: Click the login button
    await Promise.all([
      page.click("#um-submit-btn"), // Login button selector
      page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 }), // Wait for navigation after login
    ]);

    // Step 4: Navigate to the Book Appointment page
    await page.goto("https://wefit.world/book-appointment/", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Check if the text "Appointments are not available at this time." is on the page
    const isTextAvailable = await page.evaluate(() => {
      return document.body.innerText.includes(
        "Appointments are not available at this time."
      );
    });

    if (isTextAvailable) {
      console.log("Appointments are available. Sending email notification...");

      await sentEmail();
      //   await sendWhatsAppMessage("AAAGYA MAZA");
    } else {
      console.log("Appointments are not available at this time.");
      //   await sentEmail();
      //   await sendWhatsAppMessage();
    }
  } catch (error) {
    console.error("Error during the process:", error);
  } finally {
    await browser.close();
  }
};

sentEmail = async () => {
  const mailOptions = {
    from: "haseeb129ciit@gmail.com", // Your email
    to: "haseeb129ciit@gmail.com", // Recipient's email
    subject: "Appointment Availability Notification",
    text: "Appointments are available. Please check the booking site. https://wefit.world/book-appointment/",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Email sent successfully:", info.response);
  });
};

const appointmentJob = cron.schedule("*/20 * * * * *", checkAppointments, {
  scheduled: true,
});

appointmentJob.start();
