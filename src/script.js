document.getElementById("processButton").addEventListener("click", async function () {
    const fileInput = document.getElementById("resumes");
    const files = Array.from(fileInput.files); // Pega todos os arquivos selecionados
    console.log(files);

    if (files.length === 0) {
        alert("Por favor, selecione pelo menos um arquivo PDF.");
        return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("files", file)); // Enviar múltiplos arquivos


    try {
        console.log("1");
        const response = await fetch("http://localhost:3000/upload-pdf", {
            method: "POST",
            body: formData,
        });
        console.log("2");
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        console.log("3");
        console.log(data);
        document.getElementById("responseContainer").innerText = `Resposta: ${data.text}`;
        console.log("4");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao enviar os PDFs.");
    }
});
