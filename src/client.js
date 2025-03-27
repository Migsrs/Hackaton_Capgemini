document.getElementById('executeBtn').addEventListener('click', handleButtonClick);

async function handleButtonClick() {
  const resumes = document.getElementById('resumes');
  const files = resumes.files;

  const description = document.getElementById('description');

  if (files.length === 0) {
    alert('Por favor, carregue pelo menos um currículo.');
    return;
  }

  if (description.files.length === 0) {
    alert('Por favor, carregue o descritivo da vaga.');
    return;
  }

  const desc = description.files[0];



  async function readPDF(files) {
    let combinedText = '';
    try {
      // Processando os arquivos PDFs
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
  
        if (file.type === 'application/pdf') {
          const fileText = await processPDF(file);
          combinedText += `\n\n--- Início do arquivo: ${file.name} ---\n` + fileText;
        } else {
          console.log('Arquivo não é PDF:', file.name);
        }
      }
      return combinedText;
  } catch (error) {
    console.error('Erro ao processar os arquivos:', error);
    responseDiv.innerHTML = `Erro: ${error.message}`;
    responseDiv.classList.add('error');
    responseDiv.classList.remove('loading');
  }
}

  const ul = document.getElementById("sequencia");
  ul.innerHTML = "<div id=\"response\"></div>"
  ul.classList.remove("hidden");


  const responseDiv = document.getElementById('response');
  responseDiv.innerHTML = 'Carregando...';
  responseDiv.classList.add('loading');

  

  const combinedResumes = await readPDF(files);  // Variável para armazenar o texto combinado de todos os PDFs
  const descriptionText = await readPDF(desc)


  

  try {

    // Enviar o texto combinado para o servidor

    const firstPrompt = `Prompt: Classifique os currículos a seguir com base na descrição da vaga fornecida no contexto. Liste os 5 melhores candidatos em ordem de classificação e explique em 30 palavras ao menos quais pontos foram analisados para fazer essa classificação.  
    Em seguida, envie um e-mail personalizado **apenas** para os 5 melhores candidatos, seguindo o seguinte formato:

    \"Prezado(a) {Nome}.

    Gostaríamos de convidá-lo(a) para participar de um processo seletivo em nossa empresa com base no seu impressionante currículo. Sua experiência e habilidades são exatamente o que estamos procurando para nossa equipe.

    Favor entrar em contato conosco para mais detalhes.

    Atenciosamente,
    Equipe de Recrutamento.\"

    Substitua {Nome} pelo nome do candidato conforme informado.

    **Não** utilize nenhuma ferramenta que não está disponível para o agente.
    
    Candidatos: ${combinedResumes}.`;

    const response = await sendTextToServer(firstPrompt, descriptionText);
    for(let i = 1; i < response.response.messages.length; i++) {
      const item = response.response.messages[i];
      const li = document.createElement("li");
      li.textContent = item.kwargs.content;

      // Aplicando classes do Tailwind
      li.className = "p-4 bg-gray-50 border-l-4 border-blue-500 shadow-sm rounded-lg text-gray-700";

      // Alternando cores para diferenciar os itens
      if (i % 2 === 0) {
        li.classList.add("bg-gray-100");
      }

      ul.appendChild(li);
    };

    ul.scrollTop = ul.scrollHeight;

    responseDiv.classList.add('hidden');
  } catch (error) {
    console.error('Erro ao processar os arquivos:', error);
    responseDiv.innerHTML = `Erro: ${error.message}`;
    responseDiv.classList.add('error');
    responseDiv.classList.remove('loading');
  }
}

async function processPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const typedArray = new Uint8Array(e.target.result);
      pdfjsLib.getDocument(typedArray).promise
        .then((pdf) => {
          let pagePromises = [];
          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            pagePromises.push(
              pdf.getPage(pageNumber).then(function (page) {
                return page.getTextContent().then(function (textContent) {
                  return textContent.items.map((item) => item.str).join(' ');
                });
              })
            );
          }

          // Após todas as páginas serem processadas, resolve o texto do arquivo
          Promise.all(pagePromises).then(function (pagesText) {
            resolve(pagesText.join(' '));
          });
        })
        .catch(reject);
    };
    reader.readAsArrayBuffer(file);
  });
}

async function sendTextToServer(expression, context) {
  const response = await fetch('http://localhost:3000/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      expression: `${expression}`,
      context: context 
    }),  // Envia o texto concatenado
  });

  if (!response.ok) {
    throw new Error('Erro ao enviar o texto');
  }

  return await response.json();
}
