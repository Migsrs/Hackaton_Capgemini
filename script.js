// Apenas exemplo de uso - O conteúdo dinâmico real virá de outra plataforma conforme especificado

document.addEventListener('DOMContentLoaded', () => {
    const dataSections = document.querySelectorAll('.scroll-area');
  
    dataSections.forEach(section => {
      const clone = section.cloneNode(true);
      section.parentElement.appendChild(clone);
    });
  
    // Em páginas futuras, você pode integrar fetch aqui para atualizar dados
    // Exemplo fictício:
    // fetch('https://api.seuservidor.com/dados')
    //   .then(res => res.json())
    //   .then(data => {
    //     // Atualizar DOM
    //   });
  });
  