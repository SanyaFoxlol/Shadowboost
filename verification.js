document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.code-input');
    const verifyButton = document.getElementById('verify-button');
    const resendLink = document.getElementById('resend-link');
    const errorMessage = document.getElementById('error-message');

    // Обработка ввода только цифр и автофокус
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/, ''); // Удаляет все символы, кроме цифр
            if (input.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    // Проверка кода и кнопка "Verify"
    verifyButton.addEventListener('click', () => {
        const code = Array.from(inputs).map(input => input.value).join('');
        if (code.length === 6) {
            verifyButton.classList.add('loading');
            setTimeout(() => {
                errorMessage.textContent = "Verification code submitted!";
                errorMessage.classList.add('success');
                setTimeout(() => {
                    window.location.href = 'next-page.html';
                }, 2000);
            }, 2000);
        } else {
            errorMessage.textContent = "Please enter a valid 6-digit code.";
            errorMessage.classList.remove('success');
        }
    });

    // Ссылка для повторной отправки
    resendLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Verification code resent to your email.');
    });
});
