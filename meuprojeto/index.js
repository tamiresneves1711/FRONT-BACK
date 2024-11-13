// Importante o módulo express
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.static('public'))

// Array de piadas
const frases = [
    "Eu vou aprender!",
    "Eu vou ser persistente!",
    "Eu amo JavaScript!",
    "Eu amo programar!",
    "Semana maravilhosa!",
    "Sucesso e Paz!"

];

// Middleware para registrar requisições
app.use((req, res, next) => {
    console.log(`requisição recebida: ${req.method} ${req.url}`);
    next();
});

// contador de acessos ao endpoint /joke
let frasesAccessCount = 0;

// Rota para gerar uma piada aleatória
app.get('/frases', (req, res) => {
    frasesAccessCount++;
    const randomIndex = Math.floor(Math.random() * frases.length);
    const randomfrases = frases[randomIndex];
    res.send({
        frases: randomfrases,
        acesses: `Esta rota foi acessada ${frasesAccessCount} vezes!`
    });
});

// Iniciando o servidor 
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/VivaoHoje', (req,res)=>{
    res.send('VivaoHoje')
});


// Rota (create) para adicionar uma nova frase
app.post('/add', (req, res) =>{
    const { novaFrase } = req.body;
    if (novaFrase){
        frases.push(novaFrase);
        res.send({ mensagem: "frase adicionada com sucesso!", frases});      
    }else {
        res.status(400).send({ erro: "Por favor, forneça uma frase para adicionar. "})
    }
});


app.delete('/delete/:index', (req, res)=>{
    const {index} = req.params;

    if(index >=0 && index< frases.length){
        const deletedFrases = frases.splice(index, 1);
        res.send({ mensagem: "Frase deletada com sucesso!", frase: deletedFrases[0], frases});
    }else {
        res.status(404).send({ erro: "Frase não encontrada"});
    }
});


app.get('/TodasAsFrases', (req, res)=>{
    res.send({ frases});
});


// Rota (Update) para atualizar uma frase existente
app.put('/update/:index', (req, res) =>{
    const { index } = req.params;
    const { novaFrase } = req.body;

    if(index >=0 && index < frases.length){
        if (novaFrase){
            frases[index] = novaFrase; // Atualiza a frase
            res.send({ mensagem: "Frase atualizada com sucesso!", frases: novaFrase, frases});
        }else {
            res.status(400).send({ erro: "Por favor, uma nova frase para atualizar."});
        }
    }else {
       res.status(404).send({ erro: "frase não encontrada"});
    }
});

