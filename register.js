function toggleAdminPassword() {
    const userType = document.getElementById("userType").value;
    const adminPassField = document.getElementById("adminPass");

    if (userType === "admin") {
        adminPassField.style.display = "block";
    } else {
        adminPassField.style.display = "none";
    }
}

function registerUser() {
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const userType = document.getElementById("userType").value;
    const adminPass = document.getElementById("adminPass").value;
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value.trim();

    if (!fullname || !email || !password || !dob || !address) {
        alert("All fields are required!");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    if (userType === "admin" && adminPass !== "admin") {
        alert("Incorrect admin password!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
        alert("This email is already registered. Please use a different email.");
        return;
    }

    const newUser = { fullname, email, password, userType, dob, address };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please login.");
    window.location.href = "login.html";
}
