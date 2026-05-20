/***************************************************
 * Objetivo: Arquivo responsável pela criação da API do projetos de Estados e Cidades
 * Data: 13/05/2026
 * Autor: Brayan
 * Versão: 1.0 (adaptado para API)
 * 
 * Instalação do EXPRESS - npm install express --save
 *  Dependencia responsavel pela utilização do protocolo HTTP  para 
 *  Criar uma API
 * 
 * Instalação do CORS - npm install cors --save
 *  Dependencia responsavel pela configuração a serem realizadas 
 *  para permissao de acesso a API
 * 
 * 
 ***************************************************/

//Import da dependencia para criar API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

//Import das controllers do projeto
const controllerFilme               = require('./controller/filme/controller_filme.js')
const controllerPersonagens         = require('./controller/personagens/controller_personagens.js')
const controllerGenero              = require('./controller/generos/controller_generos.js')
const controllerSexo                = require('./controller/sexo/controller_sexo.js')
const controllerNacionalidade       = require('./controller/nacionalidade/controller_nacionalidades.js')
const controllerAtividade           = require('./controller/atividade/controller_atividade.js')
const controllerClassificacao       = require('./controller/classificacao/controller_classificacao.js')
const controllerPessoa              = require('./controller/pessoa/controller_pessoa.js')
//Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()

// Inicializa uma nova aplicação Express
const app = express()

// Define as configurações do CORS (Cross-Origin Resource Sharing)
const corsOption = {
    // Permite que requisições venham de qualquer origem (o '*' é um coringa)
    origin: '*',
    
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // são os valores verbos que são liberados
    
    // Define quais cabeçalhos o cliente pode enviar na requisição
    allowedHeaders: ['content-type', 'Authorization'], 
}

// CORREÇÃO: cors deve ser aplicado ANTES das rotas
app.use(cors(corsOption));


//#########################################
//              FILME
//#########################################

app.post('/v1/senai/locadora/filme', bodyParserJSON , async function (req, res){

    let dados = req.body

    let contentType = req.headers['content-type']

    let result = await controllerFilme.inseirNovoFilme(dados, contentType)

    res.status(result.status_code).json(result)

})

app.get('/v1/senai/locadora/filme', async function (req, res){

    let result = await controllerFilme.listarFilme()

    res.status(result.status_code)
    res.json(result)

})

app.get('/v1/senai/locadora/filme/:id', async function (req, res){

    let id = req.params.id
    
    let result = await controllerFilme.buscarFilme(id)
  
    res.status(result.status_code)
    res.json(result)

})

app.put('/v1/senai/locadora/filme/:id', bodyParserJSON, async function (req, res){

    let contentType = req.headers['content-type']
    let id = req.params.id
    let dados = req.body

    let result = await controllerFilme.atualizarFilme(dados, id, contentType)

    res.status(result.status_code)
    res.json(result)
})

app.delete('/v1/senai/locadora/filme/:id', async function (req, res){

    let id = req.params.id

    let result = await controllerFilme.excluirFilme(id)

    res.status(result.status_code)
    res.json(result)
})


//#########################################
//              PERSONAGEM
//#########################################

app.post('/v1/senai/personagem', bodyParserJSON , async function (req, res){

    let dados = req.body

    let contentType = req.headers['content-type']

    let result = await controllerPersonagens.inseirNovoPersonagem(dados, contentType)

    res.status(result.status_code).json(result)

})

app.get('/v1/senai/personagem', async function (req, res){

    let result = await controllerPersonagens.listarPersonagens()

    res.status(result.status_code)
    res.json(result)

})

app.get('/v1/senai/personagem/:id', async function (req, res){

    let id = req.params.id
    
    let result = await controllerPersonagens.buscarPersonagens(id)
  
    res.status(result.status_code)
    res.json(result)

})

app.put('/v1/senai/personagem/:id', bodyParserJSON, async function (req, res){

    let contentType = req.headers['content-type']
    let id = req.params.id
    let dados = req.body

    let result = await controllerPersonagens.atualizarPersonagens(dados, id, contentType)

    res.status(result.status_code)
    res.json(result)
})

app.delete('/v1/senai/personagem/:id', async function (req, res){

    let id = req.params.id

    let result = await controllerPersonagens.excluirPersonagens(id)

    res.status(result.status_code)
    res.json(result)
})


//#########################################
//              GENERO
//#########################################

app.post('/v1/senai/genero', bodyParserJSON , async function (req, res){

    let dados = req.body

    let contentType = req.headers['content-type']

    let result = await controllerGenero.inseirNovoGenero(dados, contentType)

    res.status(result.status_code).json(result)

})

app.get('/v1/senai/genero', async function (req, res){

    let result = await controllerGenero.listarGeneros()

    res.status(result.status_code)
    res.json(result)

})

app.get('/v1/senai/genero/:id', async function (req, res){

    let id = req.params.id
    
    let result = await controllerGenero.buscarGeneros(id)
  
    res.status(result.status_code)
    res.json(result)

})

app.put('/v1/senai/genero/:id', bodyParserJSON, async function (req, res){

    let contentType = req.headers['content-type']
    let id = req.params.id
    let dados = req.body

    let result = await controllerGenero.atualizarGeneros(dados, id, contentType)

    res.status(result.status_code)
    res.json(result)
})

app.delete('/v1/senai/genero/:id', async function (req, res){

    let id = req.params.id

    let result = await controllerGenero.excluirGeneros(id)

    res.status(result.status_code)
    res.json(result)
})


// //#########################################
// //              NACIONALIDADE
// //#########################################

app.post('/v1/senai/nacionalidade', bodyParserJSON , async function (req, res){

    let dados = req.body

    let contentType = req.headers['content-type']

    let result = await controllerNacionalidade.inseirNovaNacionalidade(dados, contentType)

    res.status(result.status_code).json(result)

})

app.get('/v1/senai/nacionalidade', async function (req, res){

    let result = await controllerNacionalidade.listarNacionalidades()

    res.status(result.status_code)
    res.json(result)

})

app.get('/v1/senai/nacionalidade/:id', async function (req, res){

    let id = req.params.id
    
    let result = await controllerNacionalidade.buscarNacionalidades(id)
  
    res.status(result.status_code)
    res.json(result)

})

app.put('/v1/senai/nacionalidade/:id', bodyParserJSON, async function (req, res){

    let contentType = req.headers['content-type']
    let id = req.params.id
    let dados = req.body

    let result = await controllerNacionalidade.atualizarNacionalidades(dados, id, contentType)

    res.status(result.status_code)
    res.json(result)
})

app.delete('/v1/senai/nacionalidade/:id', async function (req, res){

    let id = req.params.id

    let result = await controllerNacionalidade.excluirNacionalidades(id)

    res.status(result.status_code)
    res.json(result)
})

// //#########################################
// //              SEXO
// //#########################################

app.post('/v1/senai/sexo', bodyParserJSON , async function (req, res){

    

    let dados = req.body

    let contentType = req.headers['content-type']

    let result = await controllerSexo.inseirNovoSexo(dados,contentType)

    res.status(result.status_code).json(result)

})


app.get('/v1/senai/sexo', async function (req, res){

    let result = await controllerSexo.listarSexo()

    res.status(result.status_code)
    res.json(result)
 

})

app.get('/v1/senai/sexo/:id', async function (req, res){
    let id = req.params.id
    
    let result = await controllerSexo.buscarSexo(id)

    res.status(result.status_code)
    res.json(result)
    

})


app.put('/v1/senai/sexo/:id', bodyParserJSON, async function (req, res){
    //Recebe o contenty type da requisição
    let contentType = req.headers['content-type']
    //Recebe o ID do registro a ser atualizado
    let id = req.params.id
    //Recebe os dados enviados no corpo da requisição
    let dados = req.body

    //Chama a função de atualizar na controller e encaminha os dados, id e content type
    //obedecendo a ordem de crição na função da controller
    let result = await controllerSexo.atualizarSexo(dados, id, contentType)

    res.status(result.status_code)
    res.json(result)
})

app.delete('/v1/senai/sexo/:id', async function (req, res){

    //Recebe o ID do registro a ser deletado
    let id = req.params.id


    //Chama a função de atualizar na controller e encaminha os dados, id e content type
    //obedecendo a ordem de crição na função da controller
    let result = await controllerSexo.excluirSexo(id)

    res.status(result.status_code)
    res.json(result)
})


//#########################################
//              ATIVIDADE
//#########################################


app.post('/v1/senai/atividade', bodyParserJSON , async function (req, res){

    

    let dados = req.body

    let contentType = req.headers['content-type']

    let result = await controllerAtividade.inseirNovaAtividade(dados,contentType)

    res.status(result.status_code).json(result)

})


app.get('/v1/senai/atividade', async function (req, res){

    let result = await controllerAtividade.listarAtividade()

    res.status(result.status_code)
    res.json(result)
 

})

app.get('/v1/senai/atividade/:id', async function (req, res){
    let id = req.params.id
    
    let result = await controllerAtividade.buscarAtividade(id)

    res.status(result.status_code)
    res.json(result)
    

})


app.put('/v1/senai/atividade/:id', bodyParserJSON, async function (req, res){
    //Recebe o contenty type da requisição
    let contentType = req.headers['content-type']
    //Recebe o ID do registro a ser atualizado
    let id = req.params.id
    //Recebe os dados enviados no corpo da requisição
    let dados = req.body

    //Chama a função de atualizar na controller e encaminha os dados, id e content type
    //obedecendo a ordem de crição na função da controller
    let result = await controllerAtividade.atualizarAtividade(dados, id, contentType)

    res.status(result.status_code)
    res.json(result)
})

app.delete('/v1/senai/atividade/:id', async function (req, res){

    //Recebe o ID do registro a ser deletado
    let id = req.params.id


    //Chama a função de atualizar na controller e encaminha os dados, id e content type
    //obedecendo a ordem de crição na função da controller
    let result = await controllerAtividade.excluirAtividade(id)

    res.status(result.status_code)
    res.json(result)
})


 
//#########################################
//              CLASSIFICACAO
//#########################################
 
app.post('/v1/senai/classificacao', bodyParserJSON , async function (req, res){
 
    let dados = req.body
    let contentType = req.headers['content-type']
 
    let result = await controllerClassificacao.inseirNovaClassificacao(dados, contentType)
 
    res.status(result.status_code).json(result)
})
 
app.get('/v1/senai/classificacao', async function (req, res){
 
    let result = await controllerClassificacao.listarClassificacao()
 
    res.status(result.status_code)
    res.json(result)
})
 
app.get('/v1/senai/classificacao/:id', async function (req, res){
 
    let id = req.params.id
 
    let result = await controllerClassificacao.buscarClassificacao(id)
 
    res.status(result.status_code)
    res.json(result)
})
 
app.put('/v1/senai/classificacao/:id', bodyParserJSON, async function (req, res){
 
    let contentType = req.headers['content-type']
    let id = req.params.id
    let dados = req.body
 
    let result = await controllerClassificacao.atualizarClassificacao(dados, id, contentType)
 
    res.status(result.status_code)
    res.json(result)
})
 
app.delete('/v1/senai/classificacao/:id', async function (req, res){
 
    let id = req.params.id
 
    let result = await controllerClassificacao.excluirClassificacao(id)
 
    res.status(result.status_code)
    res.json(result)
})


//#########################################
//              PESSOA
//#########################################
 
app.post('/v1/senai/pessoa', bodyParserJSON , async function (req, res){
 
    let dados = req.body
    let contentType = req.headers['content-type']
 
    let result = await controllerPessoa.inseirNovaPessoa(dados, contentType)
 
    res.status(result.status_code).json(result)
})
 
app.get('/v1/senai/pessoa', async function (req, res){
 
    let result = await controllerPessoa.listarPessoa()
 
    res.status(result.status_code)
    res.json(result)
})
 
app.get('/v1/senai/pessoa/:id', async function (req, res){
 
    let id = req.params.id
 
    let result = await controllerPessoa.buscarPessoa(id)
 
    res.status(result.status_code)
    res.json(result)
})
 
app.put('/v1/senai/pessoa/:id', bodyParserJSON, async function (req, res){
 
    let contentType = req.headers['content-type']
    let id = req.params.id
    let dados = req.body
 
    let result = await controllerPessoa.atualizarPessoa(dados, id, contentType)
 
    res.status(result.status_code)
    res.json(result)
})
 
app.delete('/v1/senai/pessoa/:id', async function (req, res){
 
    let id = req.params.id
 
    let result = await controllerPessoa.excluirPessoa(id)
 
    res.status(result.status_code)
    res.json(result)
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, function(){
    console.log(`✅ API rodando na porta ${PORT} e aguardando novas requisições`);
});