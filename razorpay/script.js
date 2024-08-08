document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const uidParam = urlParams.get('uid');
    const uidInput = document.getElementById('uid');

    if (uidParam) {
        uidInput.value = uidParam;
        uidInput.disabled = true;
    }
});

document.addEventListener('payment.success', async function(event) {
    const uid = document.getElementById('uid').value;
    const payment_id = event.detail.razorpay_payment_id;
    const serverUrl = 'https://pws-0h89.onrender.com'; 

    try {
        const response = await fetch(`${serverUrl}/paid?uid=${uid}&payment_id=${payment_id}`);
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
});
