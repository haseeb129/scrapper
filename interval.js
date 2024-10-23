let counter = 0;
let interval;

// Function to check for appointments
function checkAppointments() {
  console.log("Checking for appointments...");

  // Simulate the condition for pausing the interval
  if (counter === 3 || counter === 6) {
    console.log("Appointments available! Pausing the interval.");
    counter++; // Increment the counter

    // Clear the current interval (pause)
    clearInterval(interval);

    // Schedule a restart after 40 seconds
    setTimeout(() => {
      console.log("Resuming job after 40 seconds.");
      startChecking(); // Restart the interval
    }, 40 * 1000); // 40 seconds in milliseconds
  } else {
    console.log("No appointments yet, checking again in 5 seconds.");
    counter++; // Increment the counter
  }
}

// Start checking appointments every 5 seconds
function startChecking() {
  interval = setInterval(checkAppointments, 5 * 1000); // 5 seconds interval
}

// Initial start
startChecking();
