function showAboutUs() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('aboutUs').classList.remove('hidden');
  }

  function processForm() {
    

    // Simula o envio para análise e exibe a tela de resultado
    document.getElementById('dataInput').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('analysisResult').textContent = `Análise realizada para Notas Médias: ${grades}, Tempo: ${time}h/semana, Data Limite: ${deadline}, Matéria: ${subject}. Aguarde recomendação.`;
  }

  function processForm() {
    let isValid = true;

    // Pega os elementos do formulário
    const averageGrades = document.getElementById("averageGrades");
    const studyTime = document.getElementById("studyTime");
    const deadline = document.getElementById("deadline");

    // Remove erros anteriores
    document.querySelectorAll(".error-message").forEach(el => el.remove());

    // Função para exibir erro
    function showError(input, message) {
        input.classList.add("border-red-500"); // Adiciona borda vermelha
        input.classList.remove("border-gray-300");
        const error = document.createElement("p");
        error.classList.add("text-red-500", "text-sm", "error-message");
        error.innerText = message;
        input.parentNode.appendChild(error);
        isValid = false;
    }

    
    document.getElementById("dataInput").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("analysisResult").innerText = "Análise concluída com sucesso!";
}
