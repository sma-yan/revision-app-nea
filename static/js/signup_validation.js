document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");

    function validatePassword() {
        const password = passwordInput.value;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!regex.test(password)) {
            passwordError.textContent = "Password must be at least 8 characters long, contain an uppercase letter, lowercase letter, a number, and a special character.";
            return false;
        } else {
            passwordError.textContent = "";
            return true;
        }
    }

    function checkPasswordMatch() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.textContent = "Passwords do not match.";
            return false;
        } else {
            confirmPasswordError.textContent = "";
            return true;
        }
    }

    function validateForm() {
        return validatePassword() && checkPasswordMatch();
    }

    passwordInput.addEventListener("input", validatePassword);
    confirmPasswordInput.addEventListener("input", checkPasswordMatch);
});
