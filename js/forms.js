function showAboutUs() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('aboutUs').classList.remove('hidden');
  }

  function processForm() {
    // Processa os dados inseridos (esse processamento seria feito externamente)
    const grades = document.getElementById('averageGrades').value;
    const time = document.getElementById('studyTime').value;
    const deadline = document.getElementById('deadline').value;
    const subject = document.getElementById('subject').value;

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

    // Validação das Notas Médias
    if (averageGrades.value < 0 || averageGrades.value > 10 || averageGrades.value === "") {
        showError(averageGrades, "A nota deve estar entre 0 e 10.");
    } else {
        averageGrades.classList.remove("border-red-500");
        averageGrades.classList.add("border-gray-300");
    }

    // Validação do Tempo de Estudo (deve ser positivo)
    if (studyTime.value <= 0 || studyTime.value === "") {
        showError(studyTime, "O tempo de estudo deve ser maior que zero.");
    } else {
        studyTime.classList.remove("border-red-500");
        studyTime.classList.add("border-gray-300");
    }

    // Validação da Data Limite (não pode ser no passado)
    const today = new Date().toISOString().split("T")[0]; // Obtém a data de hoje no formato YYYY-MM-DD
    if (deadline.value < today || deadline.value === "") {
        showError(deadline, "A data limite deve ser no futuro.");
    } else {
        deadline.classList.remove("border-red-500");
        deadline.classList.add("border-gray-300");
    }

    // Validação do campo Matéria (não pode estar vazio)
    if (subject.value.trim() === "") {
        showError(subject, "O campo Matéria é obrigatório.");
    } else {
        subject.classList.remove("border-red-500");
        subject.classList.add("border-gray-300");
    }

    // Validação do Plano de Estudo (arquivo deve ser enviado)
    if (studyPlan.files.length === 0) {
        showError(studyPlan, "O envio do Plano de Estudo é obrigatório.");
    } else {
        studyPlan.classList.remove("border-red-500");
        studyPlan.classList.add("border-gray-300");
    }

    // Se todos os campos forem válidos, prossegue
    if (isValid) {
        document.getElementById("dataInput").classList.add("hidden");
        document.getElementById("result").classList.remove("hidden");
        document.getElementById("analysisResult").innerText = "Análise concluída com sucesso!";
    }
}
