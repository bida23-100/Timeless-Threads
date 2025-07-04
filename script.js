function addItem() {
    const itemList = document.getElementById('item-list');
    const newItem = document.createElement('div');
    newItem.className = 'item-entry';
    newItem.innerHTML = `
        <input type="text" class="item-name" placeholder="Item name">
        <input type="number" class="item-price" step="0.01" placeholder="Price">
        <button onclick="removeItem(this)">x</button>
    `;
    itemList.appendChild(newItem);
    updatePreview();
}

function removeItem(button) {
    button.parentElement.remove();
    updatePreview();
}

function updatePreview() {
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const amount = document.getElementById('amount').value || '0.00';
    const items = Array.from(document.getElementsByClassName('item-entry')).map(entry => {
        const name = entry.querySelector('.item-name').value;
        const price = entry.querySelector('.item-price').value;
        return name && price ? `- ${name}: P${parseFloat(price).toFixed(2)}` : null;
    }).filter(item => item);
    const preview = document.getElementById('preview');
    preview.textContent = `Timeless Threads
Purchase Amount: P${parseFloat(amount).toFixed(2)}
Items:
${items.length ? items.join('\n') : '- None'}
Date: 04/07/2025
Thank you for shopping with us!`;
}

function validateInputs() {
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const amount = document.getElementById('amount').value;
    const sendText = document.getElementById('send-text').checked;
    const sendEmail = document.getElementById('send-email').checked;
    const items = Array.from(document.getElementsByClassName('item-entry')).map(entry => ({
        name: entry.querySelector('.item-name').value,
        price: entry.querySelector('.item-price').value
    }));

    if (!sendText && !sendEmail) {
        return "Please select at least one delivery method (Text or Email).";
    }
    if (sendText && !phone.match(/^\+267\d{8}$/)) {
        return "Please enter a valid Botswana phone number (e.g., +26771234567).";
    }
    if (sendEmail && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return "Please enter a valid email address.";
    }
    if (!amount || amount <= 0) {
        return "Please enter a valid purchase amount.";
    }
    if (!items.some(item => item.name && item.price > 0)) {
        return "Please add at least one valid item with name and price.";
    }
    return null;
}

function sendReceipt() {
    const status = document.getElementById('status');
    const error = validateInputs();
    if (error) {
        status.textContent = error;
        return;
    }
    status.textContent = "Sending receipt... (Backend not implemented)";
    // TODO: Add backend API calls for SMS/email
}

function clearForm() {
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('send-text').checked = false;
    document.getElementById('send-email').checked = false;
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = `
        <div class="item-entry">
            <input type="text" class="item-name" placeholder="Item name">
            <input type="number" class="item-price" step="0.01" placeholder="Price">
            <button onclick="removeItem(this)">x</button>
        </div>
    `;
    document.getElementById('status').textContent = '';
    updatePreview();
}

function backToPOS() {
    document.getElementById('status').textContent = 'Returning to POS...';
    // TODO: Redirect to POS system
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updatePreview);
});
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updatePreview);
});

updatePreview();