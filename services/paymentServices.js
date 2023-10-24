const axios = require("axios");


class PaymentService {
 
  async createSubscription(email, valor) {
    console.log(valor, email);
    const url = "https://api.mercadopago.com/preapproval";
  
    const body = {
      reason: "Subscripcion Si Mesero",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: valor,
        currency_id: "ARS"
      },
      back_url: "https://api.mercadopago.com",
      notification_url: "https://ngrok.com/r/gslb/webhook",
      payer_email: email
    };

    const subscription = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return subscription.data;
  }
}

module.exports = PaymentService;