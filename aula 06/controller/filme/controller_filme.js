/***************************************************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *       manipulação para o CRUD de filmes
 * Data: 17/04/2026
 * Autor: Brayan
 * Versão: 1.0
 ***************************************************************************************************************************************************************************************************************************/

// Import do arquivo de padronização de mensagens JSON (status codes, mensagens de erro e sucesso)
const config_message = require('../modulo/configMessagens.js')

// Import do arquivo DAO responsável por executar as queries no banco de dados MySQL
const filmeDAO = require('../../model/DAO/filme/filme.js')

// Import do controller de classificação indicativa (ex: livre, +10, +14...)
const controller_classificacao = require('../classificacao/controller_classificacao.js')

// Import do controller da tabela intermediária filme_genero (relacionamento N:N entre filme e gênero)
const controller_filme_genero = require('./controller_filme_genero.js')


/**
 * Função responsável por inserir um novo filme no banco de dados.
 * Também insere os gêneros do filme na tabela intermediária filme_genero.
 * 
 * filme       - Objeto com os dados do filme enviados no body da requisição
 * contentType - Tipo de conteúdo da requisição (deve ser 'application/json')
 */
const inseirNovoFilme = async function (filme, contentType) {
    
    // Cria uma cópia do objeto de mensagens para não alterar o original
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        // Verifica se o Content-Type da requisição é application/json
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Valida os dados do filme antes de inserir
            let validar = await validarDados(filme)

            // Se validar retornar algo (erro), devolve o erro imediatamente
            if (validar){
                return validar
            } else {

                // Insere o filme no banco e recebe o ID gerado
                let result = await filmeDAO.incertFilme(filme)

                if (result) {
                    // Salva o ID gerado no objeto filme
                    filme.id = result

                    // Percorre cada gênero enviado no body e insere na tabela intermediária
                    for(let genero of filme.generos){
                        let filmeGenero = {
                            "id_filme": filme.id,  // ID do filme recém-inserido
                            "id_genero": genero.id // ID do gênero enviado no body
                        }

                        // Chama o controller intermediário para inserir o relacionamento
                        let resultInsertGenero = await controller_filme_genero.inserirFilmeGenero(filmeGenero)

                        // Se falhar ao inserir algum gênero, retorna aviso (201 com alerta)
                        if(!resultInsertGenero.status){
                            return messageJson.SUCCES_CREATED_ITEM_WARNIG
                        }
                    }

                    // Monta a resposta de sucesso com os dados do filme inserido
                    messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_CREATED_ITEM.status
                    messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_CREATED_ITEM.status_code
                    messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_CREATED_ITEM.message
                    messageJson.DEFAULT_MESSAGE.response    = filme
                } else {
                    return messageJson.ERROR_INTERNAL_SERVER_MODEL // Erro ao inserir no banco (500)
                }

                return messageJson.DEFAULT_MESSAGE // 201

            }

        } else {
            return messageJson.ERROR_CONTENT_TYPE // Content-Type inválido (415)
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // Erro inesperado na controller (500)
    }
}


/**
 * Função responsável por atualizar os dados de um filme existente.
 * Também atualiza os gêneros: deleta os antigos e insere os novos.
 * 
 * Objeto com os novos dados do filme
 * ID do filme a ser atualizado (vem pela URL)
 * contentType - Tipo de conteúdo da requisição
 */
const atualizarFilme = async function(filme, id, contentType) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            // Verifica se o filme com o ID informado existe no banco
            let resultBuscarID = await buscarFilme(id)

            if(resultBuscarID.status){

                // Valida os dados enviados no body
                let validar = await validarDados(filme)

                if(!validar){
                    // Adiciona o ID ao objeto filme para usar no UPDATE
                    filme.id = id

                    // Atualiza os dados principais do filme no banco
                    let result = await filmeDAO.updateFilme(filme)

                    if(result){

                        // 1. Deleta todos os gêneros antigos vinculados ao filme
                        await controller_filme_genero.deletarGenerosPorFilme(id)

                        // 2. Insere os novos gêneros enviados no body
                        for(let genero of filme.generos){
                            let filmeGenero = {
                                "id_filme": id,
                                "id_genero": genero.id
                            }
                            await controller_filme_genero.inserirFilmeGenero(filmeGenero)
                        }

                        // Monta a resposta de sucesso
                        messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_UPDATED_ITEM.status
                        messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_UPDATED_ITEM.status_code
                        messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_UPDATED_ITEM.message
                        messageJson.DEFAULT_MESSAGE.response    = filme

                        return messageJson.DEFAULT_MESSAGE // 200
                    } else {
                        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // Erro ao atualizar no banco (500)
                    }
                } else {
                    return validar // Dados inválidos (400)
                }
            } else {
                return resultBuscarID // Filme não encontrado (400, 404 ou 500)
            }

        } else {
            return messageJson.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


/**
 * Função responsável por listar todos os filmes do banco.
 * Para cada filme, busca também a classificação e os gêneros relacionados.
 */
const listarFilme = async function() {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        // Busca todos os filmes no banco
        let result = await filmeDAO.selectAllFilme()

        if(result){
            if(result.length > 0){

                // Para cada filme, enriquece o objeto com classificação e gêneros
                for(let filme of result){

                    // Busca a classificação indicativa do filme pelo id_classificacao
                    let result_classificacao = await controller_classificacao.buscarClassificacao(filme.id_classificacao)
                    if(result_classificacao.status){
                        // Substitui o id pela classificação completa e remove o campo id
                        filme.classificacao = result_classificacao.response.classificacao
                        delete filme.id_classificacao
                    }

                    // Busca todos os gêneros vinculados ao filme pelo id do filme
                    let resultGenero = await controller_filme_genero.buscarGenerosPorFilme(filme.id)
                    if(resultGenero.status){
                        // Adiciona os gêneros ao objeto filme
                        filme.generos = resultGenero.response.generos
                    }
                }

                // Monta a resposta com a lista de filmes
                messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                messageJson.DEFAULT_MESSAGE.response.count  = result.length // Total de filmes
                messageJson.DEFAULT_MESSAGE.response.filme  = result        // Array de filmes

                return messageJson.DEFAULT_MESSAGE // 200

            } else {
                return messageJson.ERROR_NOT_FOUND // Nenhum filme encontrado (404)
            }
        } else {
            return messageJson.ERROR_INTERNAL_SERVER_MODEL // Erro na query (500)
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


/**
 * Função responsável por buscar um filme específico pelo ID.
 * Também busca a classificação e os gêneros do filme.
 * 
 * - ID do filme a ser buscado (vem pela URL)
 */
const buscarFilme = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        // Valida se o ID é um número válido
        if(id == undefined || id == '' || id == null || isNaN(id)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST // 400
        } else {
            // Busca o filme pelo ID no banco
            let result = await filmeDAO.selectByIdFilme(id)

            if(result){
                if(result.length > 0){

                    // Enriquece o filme com classificação e gêneros
                    for(let filme of result){

                        // Busca a classificação pelo id_classificacao do filme
                        let result_classificacao = await controller_classificacao.buscarClassificacao(filme.id_classificacao)
                        if(result_classificacao.status){
                            filme.classificacao = result_classificacao.response.classificacao
                            delete filme.id_classificacao
                        }

                        // Busca os gêneros vinculados ao filme
                        let result_generos = await controller_filme_genero.buscarGenerosPorFilme(filme.id)
                        if(result_generos.status){
                            filme.generos = result_generos.response.generos
                        }
                    }

                    // Monta a resposta com o filme encontrado
                    messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.filme  = result

                    return messageJson.DEFAULT_MESSAGE // 200
                } else {
                    return messageJson.ERROR_NOT_FOUND // Filme não encontrado (404)
                }
            } else {
                return messageJson.ERROR_INTERNAL_SERVER_MODEL // Erro na query (500)
            }
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


/**
 * Função responsável por excluir um filme pelo ID.
 * Verifica se o filme existe antes de tentar excluir.
 * 
 * id - ID do filme a ser excluído (vem pela URL)
 */
const excluirFilme = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        // Verifica se o filme com o ID informado existe
        let resultBuscarID = await buscarFilme(id)

        if(resultBuscarID.status){
            // Se existe, faz a exclusão no banco
            let result = await filmeDAO.deleteFilme(id)

            if(result){
                return messageJson.SUCCES_DELETE_ITEM // 200
            } else {
                return messageJson.ERROR_INTERNAL_SERVER_MODEL // Erro ao excluir (500)
            }
        } else {
            return resultBuscarID // Filme não encontrado (404)
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


/**
 * Função responsável por validar os dados do filme antes de inserir ou atualizar.
 * Retorna false se os dados forem válidos, ou um objeto de erro se inválidos.
 * 
 * filme - Objeto com os dados do filme a serem validados
 */
const validarDados = async function(filme) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    // Verifica se o objeto filme foi enviado
    if (!filme) {
        return messageJson.ERROR_BAD_REQUEST
    }

    // Nome: obrigatório e máximo 80 caracteres
    if (filme.nome == undefined || filme.nome == '' || filme.nome == null || filme.nome.length > 80) {
        messageJson.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST

    // Data de lançamento: obrigatória e deve ter exatamente 10 caracteres (formato: YYYY-MM-DD)
    } else if (filme.data_lancamento == undefined || filme.data_lancamento == '' || filme.data_lancamento == null || filme.data_lancamento.length != 10) {
        messageJson.ERROR_BAD_REQUEST.field = '[data_lancamento] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST

    // Duração: obrigatória e mínimo 5 caracteres (formato: HH:MM)
    } else if (filme.duracao == undefined || filme.duracao == '' || filme.duracao == null || filme.duracao.length < 5) {
        messageJson.ERROR_BAD_REQUEST.field = '[duração] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST

    // Sinopse: obrigatória
    } else if (filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null) {
        messageJson.ERROR_BAD_REQUEST.field = '[sinopse] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST

    // Avaliação: deve ser um número e máximo 3 caracteres (ex: 9.5)
    } else if (isNaN(filme.avaliacao) || filme.avaliacao.toString().length > 3) {
        messageJson.ERROR_BAD_REQUEST.field = '[avaliacao] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST

    // Valor: deve ser número e a parte inteira não pode ter mais de 3 dígitos (ex: 999.99)
    } else if (filme.valor == undefined || filme.valor == '' || filme.valor == null || filme.valor.toString().split('.')[0].length > 3 || isNaN(filme.valor)) {
        messageJson.ERROR_BAD_REQUEST.field = '[valor] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST

    // Capa: obrigatória e máximo 255 caracteres (URL da imagem)
    } else if (!filme.capa || filme.capa.length > 255) {
        messageJson.ERROR_BAD_REQUEST.field = '[capa] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST

    // ID da classificação: obrigatório e deve ser número positivo
    } else if (filme.id_classificacao == undefined || filme.id_classificacao == '' || filme.id_classificacao == null || isNaN(filme.id_classificacao || filme.id_classificacao <= 0)) {
        messageJson.ERROR_BAD_REQUEST.field = '[id_classificacao] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST

    // Todos os dados são válidos
    } else {
        return false
    }
}


module.exports = {
    inseirNovoFilme,
    atualizarFilme,
    listarFilme,
    buscarFilme,
    excluirFilme
}