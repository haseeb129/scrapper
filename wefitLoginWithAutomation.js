// const puppeteer = require("puppeteer");
// const nodemailer = require("nodemailer");
// const twilio = require("twilio");
// require("dotenv").config();
// // Replace with your actual username and password
// const username = process.env.WE_FIT_USERNAME;
// const password = process.env.WE_FIT_PASSWORD;
// const client = new twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// (async () => {
//   // Launch the browser
//   const browser = await puppeteer.launch({ headless: false }); // Set headless to true if you don't want to see the browser window
//   const page = await browser.newPage();

//   try {
//     // Step 1: Go to the login page
//     await page.goto("https://wefit.world/login/", {
//       waitUntil: "networkidle0",
//       timeout: 60000,
//     });

//     // Step 2: Enter username and password
//     await page.type("#username-3042", username); // Username input selector
//     await page.type("#user_password-3042", password); // Password input selector

//     // Step 3: Click the login button
//     await Promise.all([
//       page.click("#um-submit-btn"), // Login button selector
//       page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 }), // Wait for navigation after login
//     ]);

//     // Step 4: Navigate to the Book Appointment page
//     await page.goto("https://wefit.world/book-appointment/", {
//       waitUntil: "networkidle0",
//       timeout: 60000,
//     });

//     await page.waitForTimeout(2000);
//     // Wait for the category dropdown to be available
//     await page.waitForSelector('div[data-type="category"] select');

//     // Step 5: Select options in the first dropdown (category)
//     await page.select('div[data-type="category"] select', "3"); // Select 'Tkxel New Garden Town Campus'

//     // Step 6: Select options in the second dropdown (service)
//     await page.waitForSelector('div[data-type="service"] select'); // Ensure the service dropdown is available
//     await page.select('div[data-type="service"] select', "Sports Massage"); // Select the option

//     // Step 7: Select options in the third dropdown (staff)
//     await page.waitForSelector('div[data-type="staff"] select'); // Ensure the staff dropdown is available
//     await page.select('div[data-type="staff"] select', "Asif Waris"); // Select the option

//     // Step 8: Click the Next button
//     await page.click("button.next-button-selector"); // Update with the actual selector for the Next button

//     // Optional: Wait for navigation after clicking Next if it navigates to another page
//     await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 60000 });

//     console.log("Successfully selected options and clicked Next.");
//   } catch (error) {
//     console.error("Error during the process:", error);
//   } finally {
//     // Close the browser if needed (optional)
//     // await browser.close();
//   }
// })();
