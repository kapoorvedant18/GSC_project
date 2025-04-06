document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.querySelector(".modal-login-btn");
    const errorMessage = document.getElementById("error-message");

    loginBtn.addEventListener("click", function () {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        let foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

            // 👇 Redirect based on user type
            if (foundUser.userType === "lawyer") {
                window.location.href = "lawyer_interface.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            errorMessage.textContent = "❌ Invalid email or password. Please try again.";
            errorMessage.style.display = "block";
        }
    });

    function forgotPassword() {
        const email = prompt("Enter your registered email:");
        if (!email) return;

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === email);

        if (!user) {
            alert("❌ No account found with this email!");
            return;
        }

        const dob = prompt("Enter your Date of Birth (YYYY-MM-DD):");
        if (dob === user.dob) {
            const newPassword = prompt("Enter your new password (min 8 characters):");
            if (!newPassword || newPassword.length < 8) {
                alert("❌ Password must be at least 8 characters!");
                return;
            }

            user.password = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
            alert("✅ Password reset successful! Please login with your new password.");
        } else {
            alert("❌ Incorrect Date of Birth! Password reset failed.");
        }
    }

    document.querySelector(".forgot-password").addEventListener("click", function (event) {
        event.preventDefault();
        forgotPassword();
    });

    function logout() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }
});
