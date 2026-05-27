/***************************************************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *       manipulação para o CRUD de filme_genero (tabela intermediária)
 * Data: 22/05/2026
 * Autor: Brayan
 * Versão: 1.0
 ***************************************************************************************************************************************************************************************************************************/

const config_message = require('../modulo/configMessagens.js')
const filmeGeneroDAO = require('../../model/DAO/filme_genero/filme_genero.js')


// Função para inserir um novo registro na tabela intermediária
const inserirFilmeGenero = async function(filmeGenero) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let validar = await validarDados(filmeGenero)

        if(validar){
            return validar // 400
        } else {
            let result = await filmeGeneroDAO.incertFilme_genero(filmeGenero)

            if(result){
                filmeGenero.id = result
                messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_CREATED_ITEM.status
                messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_CREATED_ITEM.status_code
                messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_CREATED_ITEM.message
                messageJson.DEFAULT_MESSAGE.response    = filmeGenero

                return messageJson.DEFAULT_MESSAGE // 201
            } else {
                return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


// Função para atualizar um registro existente na tabela intermediária
const atualizarFilmeGenero = async function(filmeGenero, id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarFilmeGeneroPorId(id)

        if(resultBuscarID.status){
            let validar = await validarDados(filmeGenero)

            if(!validar){
                filmeGenero.id = id

                let result = await filmeGeneroDAO.updateFilme_genero(filmeGenero)

                if(result){
                    messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_UPDATED_ITEM.status
                    messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_UPDATED_ITEM.status_code
                    messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_UPDATED_ITEM.message
                    messageJson.DEFAULT_MESSAGE.response    = filmeGenero

                    return messageJson.DEFAULT_MESSAGE // 200
                } else {
                    return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            } else {
                return validar // 400
            }
        } else {
            return resultBuscarID // 400, 404 ou 500
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


// Função para listar todos os registros da tabela intermediária
const listarFilmeGenero = async function() {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await filmeGeneroDAO.selectAllFilme_genero()

        if(result){
            if(result.length > 0){
                messageJson.DEFAULT_MESSAGE.status                  = messageJson.SUCCES_RESPONSE.status
                messageJson.DEFAULT_MESSAGE.status_code             = messageJson.SUCCES_RESPONSE.status_code
                messageJson.DEFAULT_MESSAGE.response.count          = result.length
                messageJson.DEFAULT_MESSAGE.response.filme_genero   = result

                return messageJson.DEFAULT_MESSAGE // 200
            } else {
                return messageJson.ERROR_NOT_FOUND // 404
            }
        } else {
            return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


// Função para buscar um registro pelo ID da tabela intermediária
const buscarFilmeGeneroPorId = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST // 400
        } else {
            let result = await filmeGeneroDAO.selectByIdFilme_genero(id)

            if(result){
                if(result.length > 0){
                    messageJson.DEFAULT_MESSAGE.status                  = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code             = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.filme_genero   = result

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


// Função para buscar todos os filmes de um determinado gênero
const buscarFilmesPorGenero = async function(idGenero) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        if(idGenero == undefined || idGenero == '' || idGenero == null || isNaN(idGenero)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID_GENERO INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST // 400
        } else {
            let result = await filmeGeneroDAO.selectByIdGenero(idGenero)

            if(result){
                if(result.length > 0){
                    messageJson.DEFAULT_MESSAGE.status              = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code         = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.count      = result.length
                    messageJson.DEFAULT_MESSAGE.response.filmes     = result

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


// Função para buscar todos os gêneros de um determinado filme
const buscarGenerosPorFilme = async function(idFilme) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        if(idFilme == undefined || idFilme == '' || idFilme == null || isNaN(idFilme)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID_FILME INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST // 400
        } else {
            let result = await filmeGeneroDAO.selectByIdFilme(idFilme)

            if(result){
                if(result.length > 0){
                    messageJson.DEFAULT_MESSAGE.status              = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code         = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.count      = result.length
                    messageJson.DEFAULT_MESSAGE.response.generos    = result

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


// Função para deletar todos os gêneros de um filme 
const deletarGenerosPorFilme = async function(idFilme) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await filmeGeneroDAO.deleteByIdFilme(idFilme)

        if(result){
            return messageJson.SUCCES_DELETE_ITEM // 200
        } else {
            return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


// Função para excluir um registro pelo ID
const excluirFilmeGenero = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarFilmeGeneroPorId(id)

        if(resultBuscarID.status){
            let result = await filmeGeneroDAO.deleteFilme_genero(id)

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


// Função para validar os dados recebidos no body da requisição
const validarDados = async function(filmeGenero) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    if(!filmeGenero){
        return messageJson.ERROR_BAD_REQUEST // 400
    }

    if(filmeGenero.id_filme == undefined || filmeGenero.id_filme == '' || filmeGenero.id_filme == null || isNaN(filmeGenero.id_filme)){
        messageJson.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400
    }

    if(filmeGenero.id_genero == undefined || filmeGenero.id_genero == '' || filmeGenero.id_genero == null || isNaN(filmeGenero.id_genero)){
        messageJson.ERROR_BAD_REQUEST.field = '[ID_GENERO] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST // 400
    }

    return false
}


module.exports = {
    inserirFilmeGenero,
    atualizarFilmeGenero,
    listarFilmeGenero,
    buscarFilmeGeneroPorId,
    buscarFilmesPorGenero,
    buscarGenerosPorFilme,
    deletarGenerosPorFilme, 
    excluirFilmeGenero
}