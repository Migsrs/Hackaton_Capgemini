function addNewElement(entry) {
    let ipList = document.getElementById("ip-list");
    let p = document.createElement("p");
    p.classList.add("mb-2");
    p.textContent = `${entry}`;
    ipList.appendChild(p);
}

async function getData() {
    try {
        const response = await fetch("http://localhost:3001/api/v1/workspace/hackathon-2025/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Corrigido de "text/plain" para "application/json"
              "Authorization": "Bearer K8DHV68-PZG4VRY-G0V4NBJ-2G83MC2"
            },
            body: JSON.stringify({
                "message": "Following the pattern in the firewall log file, generate a new entry for me.",
                "mode": "chat",
                "sessionId": "id_cybersecurity",
                "attachments": []
              }),
        });

        const data = await response.json();
        addNewElement(data.textResponse);
        console.log(data.textResponse);
        return data;
    } catch (error) {
        console.error("Erro:", error);
    } finally {
        // Garante que a função será chamada novamente, mesmo em caso de erro
        setTimeout(getData, 10);
    }
}

getData();
