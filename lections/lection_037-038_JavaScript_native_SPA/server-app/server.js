const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 9001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.headers);

  res.setHeader("Access-Control-Allow-Origin", "*"); //('key', 'value')
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT"); //('key', 'value')
  res.setHeader("Access-Control-Allow-Headers", "Content-type");
  res.setHeader("Access-Control-Max-Age", "60");
  res.setHeader("Access-Control-Expose-Headers", "Barrer");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

let IS_AUTH = false;

app.get("/", function (req, res) {
  if (IS_AUTH) {
    res.status(200).json({ user: "Valera", message: "Ok" });
    return;
  }
  res.status(401).json({ message: "User is not defined" });
});
app.post("/sign-in", (req, res) => {
  if (req.body.login && req.body.password) {
    IS_AUTH = true;
    res.status(200).json({ user: "Valera", message: "Ok" });
    return;
  }

  res.status(401).json({ message: "User is not defined" });
});

app.get("/logout", (req, res) => {
  IS_AUTH = false;
  res.status(401).json({ user: "Valera", message: "Ok" });
});

function lowercaseKeys(obj) {
  if (!isObject(obj)) {
    throw new Error(
      `You must provide an object to "lowercaseKeys". Received "${typeof obj}"`,
    );
  }

  return Object.entries(obj).reduce((carry, [key, value]) => {
    carry[key.toLowerCase()] = value;

    return carry;
  }, {});
}
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

app.get("/search", (req, res) => {
  if (IS_AUTH) {
    const queryParameters = req.query;

    axios
      .get(process.env.API_URL, {
        params: {
          apikey: process.env.API_KEY,
          ...queryParameters,
        },
      })
      .then((response) => {
        const movieData = lowercaseKeys(response.data);
        res.status(200).json(movieData);
      })
      .catch((error) => {
        console.error("API Error:", error);
        res.status(500).json({
          message: "An error occurred while fetching data from the API",
        });
      });
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});

app.listen(port, () => {
  console.log("Started server");
});
