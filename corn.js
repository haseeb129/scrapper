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

let task;

const startCronJob = () => {
  console.log("Cron job started, running every 5 seconds.");

  task = cron.schedule("*/30 * * * * *", async () => {
    const conditionMet = await checkAppointments();

    if (conditionMet) {
      await sentEmail();
      //   await sendWhatsAppMessage("Jaldi Kar");
      console.log("Condition met. Pausing the cron job.");
      task.stop(); // Stop the cron job

      // Set a timeout to restart the cron job after 40 seconds
      setTimeout(() => {
        console.log("Restarting the cron job after 40 seconds.");
        startCronJob(); // Restart the cron job
      }, 60 * 1000); // 40 seconds in milliseconds
    }
  });

  task.start();
};

startCronJob();

const checkAppointments = async () => {
  let isTextAvailable = false;

  const browser = await puppeteer.launch({ headless: false }); // Set headless to true if you don't want to see the browser window
  const page = await browser.newPage();

  try {
    await page.goto("https://wefit.world/login/", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

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
    isTextAvailable = await page.evaluate(() => {
      return document.body.innerText.includes(
        "Appointments are not available at this time."
      );
    });
  } catch (error) {
    console.error("Error during the process:", error);
  } finally {
    await browser.close();
  }
  return isTextAvailable;
};

const sentEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services like Outlook, Yahoo, etc.
    auth: {
      user: process.env.GMAIL_USERNAME, // Your email
      pass: process.env.GMAIL_PASSWORD,
    },
  });

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

// const checkCondition = async () => {
//   // Logic to check if the condition is true
//   const conditionMet = Math.random() > 0.8; // For demo, replace with real condition
//   console.log("Checking condition:", conditionMet);

//   return conditionMet;
// };
