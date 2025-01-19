// DOM Elements
const form = document.getElementById('reset-password-form');
const emailInput = document.getElementById('email');
const submitButton = document.getElementById('submit-button');

// Helper: Show Error Message
function showError(message) {
    alert(message);  // Use simple alert for the error message (or can create a custom error div)
    emailInput.classList.add('error');
}

// Helper: Clear Error Message
function clearError() {
    emailInput.classList.remove('error');
}

// Create and Append Spinner
function showSpinner() {
    const spinner = document.createElement('span');
    spinner.classList.add('loading-spinner');
    submitButton.appendChild(spinner);
}

// Remove Spinner
function removeSpinner() {
    const spinner = submitButton.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Form Submission Handler
form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    // Validate email input
    if (!emailInput.checkValidity()) {
        showError(emailInput.validationMessage);
        return;
    }

    // Simulate Loading State
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    showSpinner();

    // Simulate Server Response (mocking with setTimeout)
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        removeSpinner();
        emailInput.value = '';  // Clear the input field after submission

        // Redirect to Verification page
        window.location.href = "verification.html";  // Replace with the actual URL of your verification page
    }, 2000);  // Simulated delay (2 seconds)
});
