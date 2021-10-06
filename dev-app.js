// THIS IS FOR DEV TESTING ONLY

const express = require("express");
const axios = require("axios").default;
const dotenv = require("dotenv").config();
const app = express();
const port = 2000;

const AUTHORIZE_REQUEST =
  process.env.API_BASE_URL +
  "/authorize?" +
  "scope=openid+phone+email&" +
  "response_type=code&" +
  "redirect_uri=https%3A%2F%2Fdi-auth-stub-relying-party-build.london.cloudapps.digital%2Foidc%2Fauthorization-code%2Fcallback&" +
  "state=sEazICy8jKFFlt-NLSw5yqYRA2r4q5BZGcAf9sYeWRg&" +
  "nonce=gyRdMfQGsQS9BvhU-lBwENOZ0UU&" +
  "client_id=" +
  process.env.TEST_CLIENT_ID +
  "&cookie_consent=accept";

app.get("/", (req, res) => {
  axios
    .get(AUTHORIZE_REQUEST, {
      validateStatus: (status) => {
        return status >= 200 && status <= 304;
      },
      maxRedirects: 0,
    })
    .then(function (response) {
      const cookies = response.headers["set-cookie"][0].split(";");
      let cookeValue;
      cookies.forEach((item) => {
        const name = item.split("=")[0].toLowerCase().trim();
        if (name.indexOf("gs") !== -1) {
          cookeValue = item.split("=")[1];
        }
      });
      res.cookie("gs", cookeValue);
      console.log("Session is:" + cookeValue);
      res.redirect("http://localhost:3000/");
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.listen(port, () => {
  console.log("TEST APP TO REDIRECT FOR NEW SESSION : DEV ONLY");
  console.log(`RUNNING ON http://localhost:${port}`);
});
