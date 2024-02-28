function initPayPalButton() {
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: '10',
            currency_code: 'USD'
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        const uid = document.getElementById('uid').value;
        sendRequestToBackend(uid);
        redirectAfterPayment(uid);
      });
    },
    onError: function(err) {
      console.error("An error occurred during payment:", err);
      alert("An error occurred during payment. Please try again.");
    }
  }).render('#paypal-button-container');
}

function sendRequestToBackend(uid) {
  console.log("😁");
}

function redirectAfterPayment(uid) {
  window.location.href = `https://t.me/prakhardoneria`;
}

initPayPalButton();