function initPayPalButton(currency) {
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: currency === 'INR' ? '500' : '6',
            currency_code: currency
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        const uid = document.getElementById('uid').value;
        sendRequestToBackend(uid);
      });
    },
    onError: function(err) {
      alert("An error occurred during payment. Please try again.");
    }
  }).render('#paypal-button-container');
}

function sendRequestToBackend(uid) {
  fetch(`https://htmleditorpro.render.com/uid=${uid}`)
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
}

function checkUserCountry() {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const userIP = data.ip;
      fetch(`https://ipapi.co/${userIP}/json/`)
        .then(response => response.json())
        .then(data => {
          const userCountry = data.country;
          const currency = userCountry === 'IN' ? 'INR' : 'USD';
          initPayPalButton(currency);
        })
        .catch(error => {
          console.error('Error:', error);
          initPayPalButton('USD');
        });
    })
    .catch(error => {
      console.error('Error:', error);
      initPayPalButton('USD');
    });
}

checkUserCountry();
