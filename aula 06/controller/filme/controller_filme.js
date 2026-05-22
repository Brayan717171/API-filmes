/***************************************************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *       manipulação para o CRUD de filmes
 * Data: 17/04/2026
 * Autor: Brayan
 * Versão: 1.0
 ***************************************************************************************************************************************************************************************************************************/

// Import do arquivo de padronização de mensagens JSON (status codes, mensagens de erro e sucesso)
const config_message = require('../modulo/configMessagens.js')

// Import do arquivo DAO (Data Access Object) responsável por executar as queries no banco de dados MySQL
const filmeDAO = require('../../model/DAO/filme/filme.js')

// Import do controller de classificação
const controller_classificacao = require('../classificacao/controller_classificacao.js')

// Import do controller intermediário filme_genero
const controller_filme_genero = require('./controller_filme_genero.js')


const inseirNovoFilme = async function (filme, contentType) {
    
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(filme)

            if (validar){
                return validar
            } else {

                let result = await filmeDAO.incertFilme(filme)

                if (result) {
                    filme.id = result

                    //  'let genero' e 'filme.generos' (plural)
                    for(let genero of filme.generos){
                        let filmeGenero = {
                            "id_filme": filme.id,
                            "id_genero": genero.id
                        }

                        //passando filmeGenero e contentType como parâmetros
                        let resultInsertGenero = await controller_filme_genero.inserirFilmeGenero(filmeGenero, 'application/json')
                        if(!resultInsertGenero.status){
                            messageJson.SUCCES_CREATED_ITEM_WARNIG //201 com alerta de dados não inseridos
                        }
                    }

                    messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_CREATED_ITEM.status
                    messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_CREATED_ITEM.status_code
                    messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_CREATED_ITEM.message
                    messageJson.DEFAULT_MESSAGE.response    = filme
                } else {
                    return messageJson.ERROR_INTERNAL_SERVER_MODEL // HTTP 500
                }

                return messageJson.DEFAULT_MESSAGE
            }

        } else {
            return messageJson.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


const atualizarFilme = async function(filme, id, contentType) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarID = await buscarFilme(id)

            if(resultBuscarID.status){
                let validar = await validarDados(filme)

                if(!validar){
                    filme.id = id

                    let result = await filmeDAO.updateFilme(filme)

                    if(result){
                        messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_UPDATED_ITEM.status
                        messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_UPDATED_ITEM.status_code
                        messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_UPDATED_ITEM.message
                        messageJson.DEFAULT_MESSAGE.response    = filme

                        return messageJson.DEFAULT_MESSAGE
                    } else {
                        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
                    }
                } else {
                    console.log(validar)
                    return validar // 400
                }
            } else {
                return resultBuscarID // 400 ou 404 ou 500
            }

        } else {
            return messageJson.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const listarFilme = async function() {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await filmeDAO.selectAllFilme()

        if(result){
            if(result.length > 0){

                for(let filme of result){
                    // Busca classificação
                    let result_classificacao = await controller_classificacao.buscarClassificacao(filme.id_classificacao)
                    if(result_classificacao.status){
                        filme.classificacao = result_classificacao.response.classificacao
                        delete filme.id_classificacao
                    }

                    // Busca os gêneros do filme
                    let resultGenero = await controller_filme_genero.buscarGenerosPorFilme(filme.id)
                    if(resultGenero.status){
                        filme.generos = resultGenero.response.filme_genero
                    }
                }

                messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                messageJson.DEFAULT_MESSAGE.response.count  = result.length
                messageJson.DEFAULT_MESSAGE.response.filme  = result

                return messageJson.DEFAULT_MESSAGE

            } else {
                return messageJson.ERROR_NOT_FOUND
            }
        } else {
            return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


const buscarFilme = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(id == undefined || id == '' || id == null || isNaN(id)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST // 400
        } else {
            let result = await filmeDAO.selectByIdFilme(id)

            if(result){
                if(result.length > 0){

                    for(let filme of result){
                        // Busca classificação
                        let result_classificacao = await controller_classificacao.buscarClassificacao(filme.id_classificacao)
                        if(result_classificacao.status){
                            filme.classificacao = result_classificacao.response.classificacao
                            delete filme.id_classificacao
                        }

                        // Busca os gêneros do filme
                        let result_generos = await controller_filme_genero.buscarGenerosPorFilme(filme.id)
                        if(result_generos.status){
                            filme.generos = result_generos.response.generos
                        }
                    }

                    messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.filme  = result

                    return messageJson.DEFAULT_MESSAGE // 200
                } else {
                    return messageJson.ERROR_NOT_FOUND // 404
                }
            } else {
                return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


const excluirFilme = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarFilme(id)

        if(resultBuscarID.status){
            let result = await filmeDAO.deleteFilme(id)

            if(result){
                return messageJson.SUCCES_DELETE_ITEM // 200
            } else {
                return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        } else {
            return resultBuscarID // 404
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


const validarDados = async function(filme) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    if (!filme) {
        return messageJson.ERROR_BAD_REQUEST
    }

    if (filme.nome == undefined || filme.nome == '' || filme.nome == null || filme.nome.length > 80) {
        messageJson.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400

    } else if (filme.data_lancamento == undefined || filme.data_lancamento == '' || filme.data_lancamento == null || filme.data_lancamento.length != 10) {
        messageJson.ERROR_BAD_REQUEST.field = '[data_lancamento] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400

    } else if (filme.duracao == undefined || filme.duracao == '' || filme.duracao == null || filme.duracao.length < 5) {
        messageJson.ERROR_BAD_REQUEST.field = '[duração] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400

    } else if (filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null) {
        messageJson.ERROR_BAD_REQUEST.field = '[sinopse] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400

    } else if (isNaN(filme.avaliacao) || filme.avaliacao.toString().length > 3) {
        messageJson.ERROR_BAD_REQUEST.field = '[avaliacao] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400

    } else if (filme.valor == undefined || filme.valor == '' || filme.valor == null || filme.valor.toString().split('.')[0].length > 3 || isNaN(filme.valor)) {
        messageJson.ERROR_BAD_REQUEST.field = '[valor] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400

    } else if (!filme.capa || filme.capa.length > 255) {
        messageJson.ERROR_BAD_REQUEST.field = '[capa] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400

    } else if (filme.id_classificacao == undefined || filme.id_classificacao == '' || filme.id_classificacao == null || isNaN(filme.id_classificacao || filme.id_classificacao <= 0)) {
        messageJson.ERROR_BAD_REQUEST.field = '[id_classificacao] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400

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