document.getElementById('executeBtn').addEventListener('click', handleButtonClick);

    async function handleButtonClick() {
      const responseDiv = document.getElementById('response');
      responseDiv.innerHTML = 'Carregando...';
      responseDiv.classList.add('loading');

      try {
        const agentResponse = await executeAgentCommand();
        console.log(agentResponse.response.messages[agentResponse.response.messages.length-1].kwargs.content);
        responseDiv.innerHTML = `Resposta: ${agentResponse.response.messages[agentResponse.response.messages.length-1].kwargs.content}`;
        responseDiv.classList.remove('loading');
      } catch (error) {
        responseDiv.innerHTML = `Erro: ${error.message}`;
        responseDiv.classList.add('error');
        responseDiv.classList.remove('loading');
      }
    }

    async function executeAgentCommand() {
      const response = await fetch('http://localhost:3000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelName: 'gpt-4',
          expression: "what's (3 + 5) x 12?",
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao executar o comando');
      }

      return await response.json();
    }