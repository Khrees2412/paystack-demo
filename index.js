const express = require("express");
const app = express();
require("dotenv").config();
const fetch = require("node-fetch");

const baseURL = "https://api.paystack.co";
const exampleRef = "ejzk5zimdyzbsi3";
let userAuthCode;

const PORT = process.env.PORT || 5006;

app.post("/charge-user", async (req, res) => {
  try {
    const params = JSON.stringify({
      email: "customer@email.com",
      amount: "10000",
      bank: {
        code: "057",
        account_number: "0000000000",
      },
      birthday: "1995-12-23",
    });

    const fetchData = await fetch(`${baseURL}/charge`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: params,
    });
    const response = await fetchData.json();
    res.json(response);
  } catch (err) {
    console.error(err);
  }
});
let transactionState = false;

app.get("/verify-charge", async (req, res) => {
  try {
    const fetchData = await fetch(
      `${baseURL}/transaction/verify/${exampleRef}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = await fetchData.json();
    res.json(response);
    if (response.data.status) {
      transactionState = true;
      const { authourization_code } = response.data.authourization; // empty since the charge has not been completed
      userAuthCode = authourization_code;
      const { email } = response.data.customer;
      res.json({
        auth_code: authourization_code,
        email,
      });
    }
  } catch (err) {
    console.error(err);
  }
});

app.post("/recurring-charge", async (req, res) => {
  const params = JSON.stringify({
    authorization_code: userAuthCode || "",
    email: "mail@mail.com",
    amount: 300000,
  });
  try {
    const fetchData = await fetch(
      `${baseURL}/transaction/charge_authorization`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: params,
      }
    );
    const response = await fetchData.json();
    res.json(response);
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
