document.addEventListener("DOMContentLoaded", function () {
    const lawyerForm = document.getElementById("lawyerForm");
    const imageInput = document.getElementById("image");
    const previewImg = document.getElementById("preview");

    let selectedImage = "default.jpg"; // Default image

    // Image Preview Function
    imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImg.src = e.target.result;
                selectedImage = e.target.result; // Store image in localStorage
            };
            reader.readAsDataURL(file);
        }
    });

    lawyerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const city = document.getElementById("city").value.trim();
        const casesWon = document.getElementById("casesWon").value.trim();
        const specialty = document.getElementById("specialty").value;
        const description = document.getElementById("description").value.trim();

        if (!name || !city || !casesWon || !specialty || !description) {
            alert("Please fill out all fields.");
            return;
        }

        const newLawyer = {
            name,
            city,
            casesWon: parseInt(casesWon),
            specialty,
            description,  // Now correctly storing the description
            image: selectedImage
        };

        // Get existing lawyers from localStorage
        let storedLawyers = JSON.parse(localStorage.getItem("lawyers")) || [];
        storedLawyers.push(newLawyer);
        localStorage.setItem("lawyers", JSON.stringify(storedLawyers));

        alert("Lawyer added successfully!");
        window.location.href = "index.html"; // Redirect back to homepage
    });
});
