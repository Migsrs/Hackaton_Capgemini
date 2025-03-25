function addNewElement(entry) {
    let ipList = document.getElementById("ip-list");
    let p = document.createElement("p");
    p.classList.add("mb-2");
    p.textContent = `${entry}`;
    ipList.appendChild(p);
    ipList.scrollTop = ipList.scrollHeight
}

function addNewAlert(entry) {
    let ipList = document.getElementById("analysis");
    let p = document.createElement("p");
    p.classList.add("mb-2");
    p.textContent = `${entry}`;
    ipList.appendChild(p);
    ipList.scrollTop = ipList.scrollHeight
}

function generateMessage() {
    x = Math.random() * 100;
    let message = "";
    if(Math.abs(x) < 1) {
        message = "Based on the pattern presented in the firewall log file provided to you, generate a new entry that deviates in some way the pattern presented in the log file. The answer shoul contain only the entry, without any other content.";
    } else {
        message = "Based on the pattern presented in the firewall log file provided to you, generate a new entry that follows the patter. The entry can not deviates from the pattern presented in the log file in any way. Be aware the IP addresses use specific number ports.";
    }
    return message;
}

async function getData() {
    try {
        const message = generateMessage();
        const response = await fetch("http://localhost:3001/api/v1/workspace/hackathon-2025/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer K8DHV68-PZG4VRY-G0V4NBJ-2G83MC2"
            },
            body: JSON.stringify({
                "message": message,
                "mode": "chat",
                "sessionId": "id_cybersecurity",
                "attachments": []
              }),
        });

        const data = await response.json();
        addNewElement(data.textResponse);
        analyze(data.textResponse)
        console.log(data.textResponse);
        return data;
    } catch (error) {
        console.error("Erro:", error);
    } finally {
        setTimeout(getData, 10);
    }
}

getData();


async function analyze(text) {
    try {
        const response = await fetch("http://localhost:3001/api/v1/workspace/cybersecurity_analyze/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer K8DHV68-PZG4VRY-G0V4NBJ-2G83MC2"
            },
            body: JSON.stringify({
                "message": `Following the pattern in the firewall log file, analyze the following entry and tell if it deviates from the pattern: ${text}.`,
                "mode": "chat",
                "sessionId": "id_cybersecurity",
                "attachments": []
              }),
        });

        const data = await response.json();
        if(data.textResponse.startsWith("ALERT")) {
            addNewAlert(`${text} - ${data.textResponse}`)
        }
        console.log(data.textResponse);
        return data;
    } catch (error) {
        console.error("Erro:", error);
    }
}