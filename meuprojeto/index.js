// Importante o módulo express
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.static('public'));

const mongoose = require('mongoose');

// conectar ao MongoDB
mongoose.connect('mongodb+srv://tamiresneves1711:QYHMTRPmpRL1IVpj@cluster0.kftbf.mongodb.net/', {
    useNewUrlParser: true, 
    useUniFiedTopology: true 
})
     .then(() => console.log("Conectado ao MongoDB"))
     .catch((err) => console.log("Erro ao conectar ao MongoDB", err));


// definindo o modelo de Frase
const fraseSchema = new mongoose.Schema({
    texto: {type: String, required: true} // o campo "texto" é obrigatório
});

const Frase = mongoose.model('Frase', fraseSchema); // Criando o modelo a partir do schema

// Array de piadas
/*
const frases = [
    "Eu vou aprender!",
    "Eu vou ser persistente!",
    "Eu amo JavaScript!",
    "Eu amo programar!",
    "Semana maravilhosa!",
    "Sucesso e Paz!"

];*/

// Middleware para registrar requisições
app.use((req, res, next) => {
    console.log(`requisição recebida: ${req.method} ${req.url}`);
    next();
});

// contador de acessos ao endpoint /joke
let frasesAccessCount = 0;

// Rota para gerar uma piada aleatória
 /* 
app.get('/frases', (req, res) => {
    frasesAccessCount++;
    const randomIndex = Math.floor(Math.random() * frases.length);
    const randomfrases = frases[randomIndex];
    res.send({
        frases: randomfrases,
        acesses: `Esta rota foi acessada ${frasesAccessCount} vezes!`
    });
});*/

// Rota para gerar uma piada aleatória
app.get('/frases', async(req, res) => {
    try { 
        frasesAccessCount++;
        const totalFrases = await Frase.countDocuments(); // Conta o total de frases no banco
        const randomIndex = Math.floor(Math.random() *totalFrases); // Gera um índice aleatório
        const randomFrase = await Frase.findOne().skip(randomIndex); // Pega a frase aleatória 
        res.send({
            frases: randomFrase.texto, // Retorna o texto da frase
            acesses: `Esta rota foi acessada ${frasesAccessCount} vezes!`

        });
    } catch (error) {
        res.status(500).send({ erro: "erro ao acessar o banco de dados"});
    }
});    
    
       



// Iniciando o servidor 
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/VivaoHoje', (req,res)=>{
    res.send('VivaoHoje')
});


// Rota (create) para adicionar uma nova frase 
/*
app.post('/add', (req, res) =>{
    const { novaFrase } = req.body;
    if (novaFrase){
        frases.push(novaFrase);
        res.send({ mensagem: "frase adicionada com sucesso!", frases});      
    }else {
        res.status(400).send({ erro: "Por favor, forneça uma frase para adicionar. "})
    }
}); */

// Rota (create) para adicionar uma nova frase
app.post('/add', async(req, res) => {
    const { novaFrase } = req.body;
    if (novaFrase) {
        const frase = new Frase({texto: novaFrase }) // Cria uma nova frase
        await frase.save(); // Salva a frase no banco de dados 
        res.send({ mensagem: "frase adicionada com sucesso!" });      
    }else {
        res.status(400).send({ erro: "Por favor, forneça uma frase para adicionar. "});
    }
});

/*
app.delete('/delete/:index', (req, res)=>{
    const {index} = req.params;

    if(index >=0 && index< frases.length){
        const deletedFrases = frases.splice(index, 1);
        res.send({ mensagem: "Frase deletada com sucesso!", frase: deletedFrases[0], frases});
    }else {
        res.status(404).send({ erro: "Frase não encontrada"});
    }
});*/

// Rota (Delete) para deletar uma frase
app.delete('/delete/:id', async (req, res)=> {
    const {id} = req.params;
    const deletedFrase = await Frase.findByIdAndDelete(id); // Deleta a frase pelo ID
    if(deletedFrase){
        res.send({ mensagem: "Frase deletada com sucesso!", frase: deletedFrases });
    }else {
        res.status(404).send({ erro: "Frase não encontrada"});
    }
});


/*
app.get('/TodasAsFrases', (req, res)=>{
    res.send({ frases});
});*/

// Rota (Get) para obter todas as frases
app.get('/TodasAsFrases', async (req, res)=> {
    try {
        const frases = await Frase.find(); // Obtém todas as frases
        res.send({ frases: frases.map(f => f.texto)}); // Retorna apenas os textos das frases
    } catch (error) {
        res.status(500).send({ erro: "erro ao acessar as frases."});
    }

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

