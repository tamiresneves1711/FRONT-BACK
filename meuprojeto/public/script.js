// Função para obter uma frase aleatória 
async function getFrase() {
    const response = await fetch('/frases');
    const data = await response.json();
    document.getElementById('frase').innerText = data.frases;
    document.getElementById('access-count').innerText = data.acesses;
}

// função para obter todas as frases 
async function getallFrases() {
    const response = await fetch('/TodasAsFrases');
    const data = await response.json();

    const frasesList = document.getElementById('frases-list');
    frasesList.innerHTML = ''; // Limpar lista antes de renderizar novamente  

    data.frases.forEach((frase, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = `(${index + 1}) ${frase}`;
        frasesList.appendChild(listItem);
    });
    
}

// Função para adicionar uma nova frase
async function addFrase() {
    const novaFrase = document.getElementById('novaFraseInput').value;
    if (!novaFrase) {
        alert("Por Favor, insira uma frase.");
        return;
    }

    const response = await fetch('/add', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ novaFrase }) 
});

const data = await response.json();
document.getElementById('novaFraseInput').value = ''; // Limpar o campo
getallFrases();
    
}