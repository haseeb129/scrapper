const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (req, res) => {
  let isTextAvailable = false;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true, // Change to true for serverless environments
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://wefit.world/login/", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await page.type("#username-3042", process.env.WE_FIT_USERNAME);
    await page.type("#user_password-3042", process.env.WE_FIT_PASSWORD);

    await Promise.all([
      page.click("#um-submit-btn"),
      page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 }),
    ]);

    await page.goto("https://wefit.world/book-appointment/", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    isTextAvailable = await page.evaluate(() => {
      return document.body.innerText.includes(
        "Appointments are not available at this time."
      );
    });

    if (!isTextAvailable) {
      await sendEmail(); // Only send email if appointments are available
      //   await sendWhatsAppMessage()
    }
  } catch (error) {
    console.error("Error during the process:", error);
    res.status(500).json({ error: "Failed to check appointments." });
    return;
  } finally {
    await browser.close();
  }

  res.status(200).json({
    available: !isTextAvailable ? "Email sent successfully" : "Nothing Veela",
  });
};

const sendEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: process.env.GMAIL_USERNAME, // send to yourself
    subject: "Appointment Available",
    text: "Appointments are available at https://wefit.world/book-appointment/",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

const sendWhatsAppMessage = async () => {
  try {
    const response = await client.messages.create({
      body: "JALDI KAR", // Your message
      from: "whatsapp:+14155238886", // Twilio sandbox WhatsApp number
      to: `whatsapp:${process.env.MINE_PHONE_NUMBER}`, // Your phone number (WhatsApp format)
    });
    console.log("WhatsApp message sent successfully:", response.sid);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
};
