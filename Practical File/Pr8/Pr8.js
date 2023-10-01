const { getUsers } = require('./Pr8API.js'); 

async function fetchUserName() {
  const usernames = ["006Darsh", "Rishi2103", "VasuBhut"];

  try {
    const usersData = await getUsers(usernames);

    if (usersData.length > 0) {
      console.log("GitHub Users Data:", usersData);
    } else {
      console.log("No valid users found.");
    }
  } catch (error) {
    console.error("Error fetching GitHub users:", error);
  }
}

fetchUserName();
