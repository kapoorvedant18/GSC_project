document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chatBox");
    const chatUser = document.getElementById("chatUser");
    const chatWith = localStorage.getItem("chatWith");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!chatWith || !loggedInUser) {
        alert("Invalid chat session.");
        window.location.href = "index.html";
        return;
    }

    chatUser.textContent = chatWith;

    function loadMessages() {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
        let messages = chatHistory[chatWith] || [];

        chatBox.innerHTML = "";
        messages.forEach(msg => {
            let msgDiv = document.createElement("div");
            msgDiv.className = msg.sender === loggedInUser.email ? "sent" : "received";
            msgDiv.textContent = msg.text;
            chatBox.appendChild(msgDiv);
        });
    }

    window.sendMessage = function () {
        let messageInput = document.getElementById("chatMessage");
        let messageText = messageInput.value.trim();

        if (!messageText) return;

        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
        if (!chatHistory[chatWith]) chatHistory[chatWith] = [];

        chatHistory[chatWith].push({ sender: loggedInUser.email, text: messageText });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        messageInput.value = "";
        loadMessages();
    };

    loadMessages();
});
