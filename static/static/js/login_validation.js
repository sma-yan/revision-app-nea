document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("password-error");

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

    function validateLoginForm() {
        return validatePassword();
    }

    passwordInput.addEventListener("input", validatePassword);
});
