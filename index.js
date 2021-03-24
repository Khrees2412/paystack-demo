const express = require("express");
const app = express();
require("dotenv").config()
const fetch = require("node-fetch");

const baseURL = "https://api.paystack.co/"

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
        const response = fetchData.json();
        res.json(response);
    } catch (error) {
        console.error(err)
    }
  
});
let transactionState = false;

app.get("/verify-charge", async (req, res) => {
    
  try {
    const fetchData = await fetch(
      `${baseURL}/transaction/verify/:reference`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: params,
      }
    );
    const response = fetchData.json();
    res.json(response);
    if(response.data.status){
        transactionState = true
        const {authourization_code} = response.data.authourization
        const {email} = response.data.customer
        res.json({
            auth_code : authourization_code,
            email
        })
    }

  } catch (error) {
    console.error(err);
  }
});

if(transactionState){
    const params = JSON.stringify({
  "authorization_code" : authorization_code,
  "email" : "mail@mail.com",
  "amount" : 300000
})
    app.post("/recurring-charge", (req,res) => {
        try {
    const fetchData = await fetch(`${baseURL}/transaction/charge_authorization`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: params,
      }
    );
    const response = fetchData.json();
    res.json(response);
        }
    catch (error) {
    console.error(err);
  }
})
}



app.listen(PORT, () => console.log(`Server started on ${PORT}`));