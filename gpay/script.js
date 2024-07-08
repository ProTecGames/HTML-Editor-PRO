document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const uidParam = urlParams.get('uid');
    const uidInput = document.getElementById('uid');

    if (uidParam) {
        uidInput.value = uidParam;
        uidInput.disabled = true;
    }

    const paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });

    const isReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
            type: 'UPI',
            parameters: {
                allowedAuthMethods: ['UPI'],
                allowedCardNetworks: ['UPI']
            }
        }]
    };

    paymentsClient.isReadyToPay(isReadyToPayRequest).then(function(response) {
        if (response.result) {
            const button = paymentsClient.createButton({ onClick: onGooglePayButtonClicked });
            document.getElementById('google-pay-button-container').appendChild(button);
        } else {
            console.error('Google Pay is not available.');
        }
    }).catch(function(err) {
        console.error('Error determining readiness to use Google Pay: ', err);
    });

    function onGooglePayButtonClicked() {
        const paymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [{
                type: 'UPI',
                parameters: {
                    allowedAuthMethods: ['UPI'],
                    allowedCardNetworks: ['UPI']
                }
            }],
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: '6.00',
                currencyCode: 'USD'
            },
            merchantInfo: {
                merchantName: 'Elite Code Club',
                merchantId: 'BCR2DN4TWXA6TZ36' 
            }
        };

        paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
            const uid = uidInput.value;
            handleSuccess(uid);
        }).catch(function(err) {
            console.error('Error processing Google Pay payment: ', err);
        });
    }

    async function handleSuccess(uid) {
        try {
            const response = await fetch(`https://pws-0h89.onrender.com/paid?uid=${uid}`);
            if (response.ok) {
                const data = await response.text();
                console.log('Server response:', data);
            } else {
                alert('Failed to send payment result to server');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
