document.addEventListener("DOMContentLoaded", function () {
    const stateSelect = document.getElementById("state");
    const citySelect = document.getElementById("city");
    const lawyerTypeSelect = document.getElementById("lawyerType");
    const lawyerContainer = document.querySelector(".lawyer-profiles");
    const settingsDropdown = document.getElementById("settingsDropdown");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const profileBtn = document.getElementById("profileBtn");

    let lawyersData = [
        { name: "Amit Sharma", city: "Delhi", casesWon: 45, specialty: "Criminal", description: "Expert in criminal law.", image: "lawyer1.jpg" },
        { name: "Priya Verma", city: "Mumbai", casesWon: 30, specialty: "Corporate", description: "Specialist in corporate cases.", image: "lawyer2.jpg" },
        { name: "Rajesh Gupta", city: "Bangalore", casesWon: 40, specialty: "Family", description: "Experienced in family law.", image: "lawyer3.jpg" },
        { name: "Neha Singh", city: "Delhi", casesWon: 35, specialty: "Civil", description: "Handles civil disputes with expertise.", image: "lawyer4.jpg" },
    ];

    const cityOptions = {
        Maharashtra: ["Mumbai", "Pune", "Nagpur"],
        Delhi: ["Delhi"],
        Karnataka: ["Bangalore", "Mysore"]
    };

    function updateCities() {
        citySelect.innerHTML = '<option>Select City</option>';
        if (cityOptions[stateSelect.value]) {
            cityOptions[stateSelect.value].forEach(city => {
                const option = document.createElement("option");
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
        filterLawyers();
    }

    function loadLawyers() {
        let storedLawyers = JSON.parse(localStorage.getItem("lawyers")) || [];
        let allLawyers = [...lawyersData, ...storedLawyers];
        displayLawyers(allLawyers);
    }

    function displayLawyers(lawyers) {
        lawyerContainer.innerHTML = "";
        if (lawyers.length === 0) {
            lawyerContainer.innerHTML = `<p style="color:white; font-size:18px;">Sorry, no lawyers found.</p>`;
            return;
        }

        lawyers.forEach(lawyer => {
            const lawyerCard = document.createElement("div");
            lawyerCard.classList.add("lawyer-card");
            lawyerCard.innerHTML = `
                <img src="${lawyer.image}" alt="${lawyer.name}">
                <h3>${lawyer.name}</h3>
                <p><strong>City:</strong> ${lawyer.city}</p>
                <p><strong>Cases Won:</strong> ${lawyer.casesWon}</p>
                <p><strong>Specialty:</strong> ${lawyer.specialty}</p>
                <p><strong>Description:</strong> ${lawyer.description}</p>
            `;

            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (loggedInUser && loggedInUser.userType === "customer") {
                const chatBtn = document.createElement("button");
                chatBtn.textContent = "Chat";
                chatBtn.onclick = function (e) {
                    e.stopPropagation();
                    openChatForCard(lawyer.name, lawyerCard);
                };
                lawyerCard.appendChild(chatBtn);
            }

            if (loggedInUser && loggedInUser.userType === "admin") {
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("delete-lawyer-btn");
                deleteBtn.onclick = function (e) {
                    e.stopPropagation();
                    deleteLawyer(lawyer.name);
                };
                lawyerCard.appendChild(deleteBtn);
            }

            lawyerContainer.appendChild(lawyerCard);
        });
    }

    function filterLawyers() {
        let storedLawyers = JSON.parse(localStorage.getItem("lawyers")) || [];
        let allLawyers = [...lawyersData, ...storedLawyers];

        let filteredLawyers = allLawyers;

        if (stateSelect.value !== "Select State") {
            const cities = cityOptions[stateSelect.value];
            filteredLawyers = filteredLawyers.filter(lawyer => cities.includes(lawyer.city));
        }
        if (citySelect.value !== "Select City") {
            filteredLawyers = filteredLawyers.filter(lawyer => lawyer.city === citySelect.value);
        }
        if (lawyerTypeSelect.value !== "Select Lawyer Type") {
            filteredLawyers = filteredLawyers.filter(lawyer => lawyer.specialty === lawyerTypeSelect.value);
        }

        displayLawyers(filteredLawyers);
    }

    function deleteLawyer(name) {
        let storedLawyers = JSON.parse(localStorage.getItem("lawyers")) || [];
        storedLawyers = storedLawyers.filter(lawyer => lawyer.name !== name);
        localStorage.setItem("lawyers", JSON.stringify(storedLawyers));
        loadLawyers();
    }

    function checkLoginStatus() {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user) {
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
            if (user.userType === "admin") {
                document.getElementById("adminPanel").style.display = "block";
            } else {
                document.getElementById("adminPanel").style.display = "none";
            }
        } else {
            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";
            document.getElementById("adminPanel").style.display = "none";
        }
    }

    function toggleDropdown() {
        settingsDropdown.classList.toggle("show");
    }

    function goToProfile() {
        window.location.href = "profile.html";
    }

    function logout() {
        localStorage.removeItem("loggedInUser");
        alert("You have logged out successfully!");
        window.location.href = "index.html";
    }

    function openChatForCard(lawyerName, cardElement) {
        let existingChat = cardElement.querySelector(".inline-chat");
        if (existingChat) {
            existingChat.remove();
            return;
        }

        const chatBox = document.createElement("div");
        chatBox.classList.add("inline-chat");
        chatBox.style.border = "1px solid #ccc";
        chatBox.style.padding = "10px";
        chatBox.style.marginTop = "10px";
        chatBox.style.backgroundColor = "#fff";
        chatBox.innerHTML = `
            <h4>Chat with ${lawyerName}</h4>
            <div class="chat-messages" style="max-height:150px; overflow-y:auto; margin-bottom:10px;"></div>
            <input type="text" class="chat-input" placeholder="Type a message...">
            <button class="send-btn">Send</button>
            <button class="close-chat-btn">Close</button>
        `;
        cardElement.appendChild(chatBox);

        loadMessagesForChat(lawyerName, chatBox);

        chatBox.querySelector(".send-btn").addEventListener("click", function () {
            const input = chatBox.querySelector(".chat-input");
            let message = input.value.trim();
            if (message === "") return;
            let messages = JSON.parse(localStorage.getItem(`chat_${lawyerName}`)) || [];
            messages.push(message);
            localStorage.setItem(`chat_${lawyerName}`, JSON.stringify(messages));
            input.value = "";
            loadMessagesForChat(lawyerName, chatBox);
        });

        chatBox.querySelector(".close-chat-btn").addEventListener("click", function () {
            chatBox.remove();
        });
    }

    function loadMessagesForChat(lawyerName, chatBox) {
        const msgContainer = chatBox.querySelector(".chat-messages");
        msgContainer.innerHTML = "";
        let messages = JSON.parse(localStorage.getItem(`chat_${lawyerName}`)) || [];
        messages.forEach(msg => {
            const p = document.createElement("p");
            p.textContent = msg;
            msgContainer.appendChild(p);
        });
    }

    if (stateSelect) stateSelect.addEventListener("change", updateCities);
    if (citySelect) citySelect.addEventListener("change", filterLawyers);
    if (lawyerTypeSelect) lawyerTypeSelect.addEventListener("change", filterLawyers);
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
    if (document.querySelector(".settings-btn")) {
        document.querySelector(".settings-btn").addEventListener("click", toggleDropdown);
    }
    if (profileBtn) {
        profileBtn.addEventListener("click", function (e) {
            e.preventDefault();
            goToProfile();
        });
    }

    checkLoginStatus();
    loadLawyers();
});
