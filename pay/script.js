document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const uidParam = urlParams.get('uid');
    const uidInput = document.getElementById('uid');

    if (uidParam) {
        uidInput.value = uidParam;
        uidInput.disabled = true;
    }

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '3'
                    },
                    description: 'HTML Editor PRO - Payment'
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                const uid = uidInput.value;
                handleSuccess(uid);
            });
        },
        onCancel: function(data) {
            alert('Payment was canceled');
        }
    }).render('#paypal-button-container');
});

async function handleSuccess(uid) {
    try {
        const response = await fetch(`https://pws-0h89.onrender.com/paid?uid=${uid}`);
        if (response.ok) {
            const data = await response.text();
            console.log('Server response:', data);
            window.location.href = '/success'; 
        } else {
            alert('Failed to send payment result to server');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
