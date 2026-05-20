/***************************************************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *       manipulação para o CRUD de classificacao
 * Data: 20/05/2026
 * Autor: Brayan
 * Versão: 1.0
 ***************************************************************************************************************************************************************************************************************************/

const config_message = require('../modulo/configMessagens.js')
const classificacaoDAO = require('../../model/DAO/classificacao/classificacao.js')


const inseirNovaClassificacao = async function (classificacao, contentType) {
    
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(classificacao)

            if (validar){
                return validar
            } else {

                let result = await classificacaoDAO.incertClassificacao(classificacao)

                if (result) {
                    classificacao.id = result
                    messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_CREATED_ITEM.status
                    messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_CREATED_ITEM.status_code
                    messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_CREATED_ITEM.message
                    messageJson.DEFAULT_MESSAGE.response    = classificacao
                } else {
                    return messageJson.ERROR_INTERNAL_SERVER_MODEL // HTTP 500
                }

                return messageJson.DEFAULT_MESSAGE
            }

        } else {
            return messageJson.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}


const atualizarClassificacao = async function(classificacao, id , contentType) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarID = await buscarClassificacao(id)

            if(resultBuscarID.status){
                let validar = await validarDados(classificacao)

                if(!validar){
                    classificacao.id = id

                    let result = await classificacaoDAO.updateClassificacao(classificacao)

                    if(result){
                        messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_UPDATED_ITEM.status
                        messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_UPDATED_ITEM.status_code
                        messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_UPDATED_ITEM.message
                        messageJson.DEFAULT_MESSAGE.response    = classificacao

                        return messageJson.DEFAULT_MESSAGE

                    } else {
                        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER //500
                    }
                } else {
                    return validar //400
                }
            } else {
                return resultBuscarID //400 ou 404 ou 500
            }

        } else {
            return messageJson.ERROR_CONTENT_TYPE //415
        }
        
    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const listarClassificacao = async function() {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await classificacaoDAO.selectAllClassificacao()
        
        if(result){
            if(result.length > 0){  
                messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                messageJson.DEFAULT_MESSAGE.response.count  = result.length
                messageJson.DEFAULT_MESSAGE.response.classificacoes = result

                return messageJson.DEFAULT_MESSAGE
                
            } else {
                return messageJson.ERROR_NOT_FOUND
            }
        } else {
            return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}


const buscarClassificacao = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST //400
        } else {
            let result = await classificacaoDAO.selectByIdClassificacao(id)

            if(result){
                if(result.length > 0){
                    messageJson.DEFAULT_MESSAGE.status              = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code         = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.classificacao = result

                    return messageJson.DEFAULT_MESSAGE //200
                } else {
                    return messageJson.ERROR_NOT_FOUND //404
                }
            } else {
                return messageJson.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        }
        
    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}


const excluirClassificacao = async function(id) { 
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarClassificacao(id)
        
        if(resultBuscarID.status){
            let result = await classificacaoDAO.deleteClassificacao(id)

            if(result){
                return messageJson.SUCCES_DELETE_ITEM  //200
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


const validarDados = async function(classificacao) {

    let messageJson = JSON.parse(JSON.stringify(config_message))
    
    if (!classificacao) {
        return messageJson.ERROR_BAD_REQUEST
    }

    if (classificacao.nome == undefined || classificacao.nome == '' || classificacao.nome == null || classificacao.nome.length > 50) {
        messageJson.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400
    }

    if (classificacao.sigla == undefined || classificacao.sigla == '' || classificacao.sigla == null || classificacao.sigla.length > 5) {
        messageJson.ERROR_BAD_REQUEST.field = '[SIGLA] INVÁLIDA'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400
    }

    if (classificacao.descricao == undefined || classificacao.descricao == '' || classificacao.descricao == null || classificacao.descricao.length > 200) {
        messageJson.ERROR_BAD_REQUEST.field = '[DESCRICAO] INVÁLIDA'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400
    }

    return false
}


module.exports = {
    inseirNovaClassificacao,
    atualizarClassificacao,
    listarClassificacao,
    buscarClassificacao,
    excluirClassificacao
}
