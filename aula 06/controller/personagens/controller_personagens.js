/***************************************************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *       manipulação para o CRUD de personagens
 * Data: 13/05/2026
 * Autor: Brayan
 * Versão: 1.0
 ***************************************************************************************************************************************************************************************************************************/

// Import do arquivo de padronização de mensagens JSON (status codes, mensagens de erro e sucesso)
const config_message = require('../modulo/configMessagens.js')

// Import do arquivo DAO (Data Access Object) responsável por executar as queries no banco de dados MySQL
const personagensDAO = require('../../model/DAO/personagens/personagens.js')


const inseirNovoPersonagem = async function (personagem, contentType) {
    
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(personagem)

            if (validar){
                return validar
            } else {

                let result = await personagensDAO.incertPersonagens(personagem)

                if (result) {
                    personagem.id = result
                    messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_CREATED_ITEM.status
                    messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_CREATED_ITEM.status_code
                    messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_CREATED_ITEM.message
                    messageJson.DEFAULT_MESSAGE.response    = personagem
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

const atualizarPersonagens = async function(personagem, id , contentType) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarID = await buscarPersonagens(id)

            if(resultBuscarID.status){
                let validar = await validarDados(personagem)

                if(!validar){
                    personagem.id = id

                    // CORREÇÃO: era updateSexo, função correta é updatePersonagens
                    let result = await personagensDAO.updatePersonagens(personagem)

                    if(result){
                        messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_UPDATED_ITEM.status
                        messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_UPDATED_ITEM.status_code
                        messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_UPDATED_ITEM.message
                        messageJson.DEFAULT_MESSAGE.response    = personagem

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


const listarPersonagens = async function() {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        // CORREÇÃO: era selectAllSexo, função correta é selectAllPersonagens
        let result = await personagensDAO.selectAllPersonagens()
        
        if(result){
            if(result.length > 0){  
                messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                messageJson.DEFAULT_MESSAGE.response.count  = result.length
                messageJson.DEFAULT_MESSAGE.response.personagens = result

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


const buscarPersonagens = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST //400
        } else {
            // CORREÇÃO: era selectByIdSexo, função correta é selectByIdPersonagens
            let result = await personagensDAO.selectByIdPersonagens(id)

            if(result){
                if(result.length > 0){
                    messageJson.DEFAULT_MESSAGE.status              = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code         = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.personagem = result

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


const excluirPersonagens = async function(id) { 
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarPersonagens(id)
        
        if(resultBuscarID.status){
            // CORREÇÃO: era deleteSexo, função correta é deletePersonagens
            let result = await personagensDAO.deletePersonagens(id)

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
 
   
const validarDados = async function(personagem) {

    let messageJson = JSON.parse(JSON.stringify(config_message))
    
    if (!personagem) {
        return messageJson.ERROR_BAD_REQUEST
    }

    if (personagem.nome == undefined || personagem.nome == '' || personagem.nome == null || personagem.nome.length > 45) {
        messageJson.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400
    } else {
        return false
    }

}


module.exports = {
    inseirNovoPersonagem,
    atualizarPersonagens,
    listarPersonagens,
    buscarPersonagens,
    excluirPersonagens
}