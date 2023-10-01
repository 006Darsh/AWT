const fetch = require("node-fetch");

async function fetchUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (!response.ok) {
    return null;
  }

  const userData = await response.json();
  return userData;
}

async function getUsers(names) {
  const promises = names.map((name) => fetchUserData(name));
  const userDataArray = await Promise.all(promises);
  return userDataArray.filter((data) => data !== null);
}

module.exports = { getUsers };
