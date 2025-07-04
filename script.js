// Function to add a new item input row
function addItem() {
    const itemList = document.getElementById('item-list');
    const newItem = document.createElement('div');
    newItem.className = 'item-entry flex items-center gap-3';
    newItem.innerHTML = `
        <input type="text" class="item-input" placeholder="Item name">
        <input type="number" step="0.01" class="item-input w-24" placeholder="Price">
        <button onclick="removeItem(this)" class="btn-danger p-2 text-sm">x</button>
    `;
    itemList.appendChild(newItem);
    updateTotalAndPreview(); // Update total when new item is added
}

// Function to remove an item input row
function removeItem(button) {
    button.parentElement.remove();
    updateTotalAndPreview(); // Update total when item is removed
}

// Function to calculate and display the total amount
function calculateTotal() {
    let total = 0;
    const itemEntries = document.getElementsByClassName('item-entry');
    Array.from(itemEntries).forEach(entry => {
        const priceInput = entry.querySelector('input[type="number"]');
        const price = parseFloat(priceInput.value);
        if (!isNaN(price) && price > 0) {
            total += price;
        }
    });
    return total;
}

// Function to update the total amount display and the receipt preview
function updateTotalAndPreview() {
    const total = calculateTotal();
    document.getElementById('total-amount').textContent = total.toFixed(2);
    // Also update the preview in case the modal is open or for future use
    updateReceiptPreview(total);
}

// Function to generate the receipt preview content
function updateReceiptPreview(total) {
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const items = Array.from(document.getElementsByClassName('item-entry')).map(entry => {
        const name = entry.querySelector('input[type="text"]').value;
        const price = entry.querySelector('input[type="number"]').value;
        return name && price ? `- ${name}: P${parseFloat(price).toFixed(2)}` : null;
    }).filter(item => item);

    const date = new Date().toLocaleDateString('en-GB'); // Format as DD/MM/YYYY

    let previewText = `Timeless Threads\n\n`;
    previewText += `Purchase Amount: P${total.toFixed(2)}\n`;
    previewText += `Items:\n${items.length ? items.join('\n') : '- None'}\n\n`;
    previewText += `Date: ${date}\n`;
    previewText += `Thank you for shopping with us!`;

    return previewText;
}

// Function to validate inputs before generating receipt or sending
function validateInputs() {
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const sendText = document.getElementById('send-text').checked;
    const sendEmail = document.getElementById('send-email').checked;
    const total = calculateTotal();
    const items = Array.from(document.getElementsByClassName('item-entry')).map(entry => ({
        name: entry.querySelector('input[type="text"]').value,
        price: parseFloat(entry.querySelector('input[type="number"]').value)
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
    if (total <= 0) {
        return "Please enter a valid purchase amount (total must be greater than 0).";
    }
    if (!items.some(item => item.name && item.price > 0)) {
        return "Please add at least one valid item with a name and price greater than 0.";
    }
    return null; // No errors
}

// Function to show the confirmation modal with receipt preview
function generateReceiptPreview() {
    const status = document.getElementById('status');
    const error = validateInputs();
    if (error) {
        status.textContent = error;
        status.className = 'status text-center text-sm mt-4 text-red-600'; // Red for errors
        return;
    }

    status.textContent = ''; // Clear previous status
    status.className = 'status text-center text-sm mt-4 text-gray-600'; // Reset color

    const total = calculateTotal();
    const previewText = updateReceiptPreview(total);
    document.getElementById('modal-preview').textContent = previewText;
    document.getElementById('confirmation-modal').classList.remove('hidden');
}

// Function to close the confirmation modal
function closeModal() {
    document.getElementById('confirmation-modal').classList.add('hidden');
}

// Function to simulate sending the receipt (backend not implemented)
function sendReceipt() {
    const status = document.getElementById('status');
    status.textContent = "Sending receipt... (Backend not implemented)";
    status.className = 'status text-center text-sm mt-4 text-blue-600'; // Blue for sending
    closeModal(); // Close modal after initiating send
    // TODO: Add actual backend API calls for SMS/email here
}

// Function to clear all form fields
function clearForm() {
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('send-text').checked = false;
    document.getElementById('send-email').checked = false;
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = `
        <div class="item-entry flex items-center gap-3">
            <input type="text" class="item-input" placeholder="Item name">
            <input type="number" step="0.01" class="item-input w-24" placeholder="Price">
            <button onclick="removeItem(this)" class="btn-danger p-2 text-sm">x</button>
        </div>
    `;
    document.getElementById('status').textContent = '';
    document.getElementById('status').className = 'status text-center text-sm mt-4 text-gray-600'; // Reset color
    updateTotalAndPreview(); // Recalculate total after clearing
}

// Function to simulate returning to POS (backend not implemented)
function backToPOS() {
    const status = document.getElementById('status');
    status.textContent = 'Returning to POS... (Redirect not implemented)';
    status.className = 'status text-center text-sm mt-4 text-gray-600';
    // TODO: Add actual redirection logic here
}

// Event listeners for input changes to update total and preview
document.addEventListener('input', (event) => {
    // Check if the input is within an item entry or is the amount field
    if (event.target.closest('.item-entry') || event.target.id === 'amount') {
        updateTotalAndPreview();
    }
});

// Initial update when the page loads
document.addEventListener('DOMContentLoaded', updateTotalAndPreview);
