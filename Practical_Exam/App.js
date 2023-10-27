require("./Database/Connection");
require("dotenv").config({ path: "../.env" });
const express = require("express");

const logger = require("morgan"); // for logging requests , status codes and more.....

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());

app.use(logger("dev"));

require("./Routes/UserRoutes")(app);
require("./Routes/LibraryRoutes")(app);

app.listen(PORT, () => {
  console.log(`Server listening on : http://localhost:${PORT}`);
});
