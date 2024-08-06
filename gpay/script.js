document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const uidParam = urlParams.get('uid');
    const uidInput = document.getElementById('uid');

    if (uidParam) {
        uidInput.value = uidParam;
        uidInput.disabled = true;
    }

    onGooglePayLoaded();
});

function onGooglePayLoaded() {
    const paymentsClient = new google.payments.api.PaymentsClient({environment: 'PRODUCTION'});
    const button = paymentsClient.createButton({onClick: onGooglePayButtonClicked});
    document.getElementById('google-pay-button-container').appendChild(button);
}

function onGooglePayButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    const paymentsClient = new google.payments.api.PaymentsClient({environment: 'PRODUCTION'});

    paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
        processPayment(paymentData);
    }).catch(function(err) {
        console.error('Google Pay Error:', err);
    });
}

function getGooglePaymentDataRequest() {
    return {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    'gateway': 'phonepe',
                    'gatewayMerchantId': '877725928481595208'
                }
            }
        }],
        merchantInfo: {
            merchantId: '877725928481595208',
            merchantName: 'Elite Code Club'
        },
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: '99.9',
            currencyCode: 'INR',
            countryCode: 'IN'
        }
    };
}

async function processPayment(paymentData) {
    const uid = document.getElementById('uid').value;

    try {
        const response = await fetch(`https://pws-0h89.onrender.com/paid?uid=${uid}`);
        if (response.ok) {
            const data = await response.text();
            console.log('Server response:', data);
        } else {
            alert('Failed to send payment result to server');
        }
    } catch (error) {
        console.error('Processing Payment Error:', error);
    }
}
