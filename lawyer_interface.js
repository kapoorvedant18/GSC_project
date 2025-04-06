document.addEventListener("DOMContentLoaded", function () {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.userType !== "lawyer") {
        alert("Access Denied! Only logged-in lawyers can access this page.");
        window.location.href = "index.html";
        return;
    }

    // Pre-fill existing lawyer profile if it exists
    let lawyerProfiles = JSON.parse(localStorage.getItem("lawyerProfiles")) || [];
    const existingProfile = lawyerProfiles.find(profile => profile.email === loggedInUser.email);

    if (existingProfile) {
        document.getElementById("experienceLevel").value = existingProfile.experienceLevel || "";
        document.getElementById("workExperience").value = existingProfile.workExperience || "";
        document.getElementById("achievements").value = existingProfile.achievements || "";
        document.getElementById("description").value = existingProfile.description || "";
    }

    displayMessages();
});

function saveLawyerProfile() {
    const experienceLevel = document.getElementById("experienceLevel").value.trim();
    const workExperience = document.getElementById("workExperience").value.trim();
    const achievements = document.getElementById("achievements").value.trim();
    const description = document.getElementById("description").value.trim();
    const profilePhotoInput = document.getElementById("profilePhoto");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const email = loggedInUser.email;

    if (!experienceLevel || !workExperience || !achievements || !description) {
        alert("Please fill in all fields.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const photoData = profilePhotoInput.files[0] ? e.target.result : getExistingPhoto(email);
        const profile = {
            fullname: loggedInUser.fullname,
            email,
            state: loggedInUser.state || "Unknown",
            city: loggedInUser.city || "Unknown",
            lawyerType: loggedInUser.lawyerType || "General",
            experienceLevel,
            workExperience,
            achievements,
            description,
            photo: photoData
        };

        let profiles = JSON.parse(localStorage.getItem("lawyerProfiles")) || [];
        const existingIndex = profiles.findIndex(p => p.email === email);

        if (existingIndex !== -1) {
            profiles[existingIndex] = profile;
        } else {
            profiles.push(profile);
        }

        localStorage.setItem("lawyerProfiles", JSON.stringify(profiles));
        alert("✅ Profile saved/updated successfully!");
    };

    if (profilePhotoInput.files.length > 0) {
        reader.readAsDataURL(profilePhotoInput.files[0]);
    } else {
        reader.onload();
    }
}

function getExistingPhoto(email) {
    const profiles = JSON.parse(localStorage.getItem("lawyerProfiles")) || [];
    const profile = profiles.find(p => p.email === email);
    return profile ? profile.photo : "";
}

function displayMessages() {
    const messagesBox = document.getElementById("lawyerMessages");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const allMessages = JSON.parse(localStorage.getItem("lawyerMessages")) || {};

    const lawyerMsgs = allMessages[loggedInUser.email] || [];

    if (lawyerMsgs.length === 0) {
        messagesBox.innerHTML = "<p>No messages from customers yet.</p>";
        return;
    }

    messagesBox.innerHTML = lawyerMsgs.map(msg => `
        <div class="received"><strong>${msg.from}:</strong> ${msg.message}</div>
    `).join('');
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}
