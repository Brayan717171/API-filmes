/***************************************************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *       manipulação para o CRUD de nacionalidades
 * Data: 13/05/2026
 * Autor: Brayan
 * Versão: 1.0
 ***************************************************************************************************************************************************************************************************************************/

// Import do arquivo de padronização de mensagens JSON (status codes, mensagens de erro e sucesso)
const config_message = require('../modulo/configMessagens.js')

// Import do arquivo DAO (Data Access Object) responsável por executar as queries no banco de dados MySQL
const nacionalidadesDAO = require('../../model/DAO/nacionalidade/nacionalidades.js')


const inseirNovaNacionalidade = async function (nacionalidade, contentType) {
    
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(nacionalidade)

            if (validar){
                return validar
            } else {

                let result = await nacionalidadesDAO.incertNacionalidades(nacionalidade)

                if (result) {
                    nacionalidade.id = result
                    messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_CREATED_ITEM.status
                    messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_CREATED_ITEM.status_code
                    messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_CREATED_ITEM.message
                    messageJson.DEFAULT_MESSAGE.response    = nacionalidade
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

const atualizarNacionalidades = async function(nacionalidade, id , contentType) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarID = await buscarNacionalidades(id)

            if(resultBuscarID.status){
                let validar = await validarDados(nacionalidade)

                if(!validar){
                    nacionalidade.id = id

                    let result = await nacionalidadesDAO.updateNacionalidades(nacionalidade)

                    if(result){
                        messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_UPDATED_ITEM.status
                        messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_UPDATED_ITEM.status_code
                        messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_UPDATED_ITEM.message
                        messageJson.DEFAULT_MESSAGE.response    = nacionalidade

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


const listarNacionalidades = async function() {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await nacionalidadesDAO.selectAllNacionalidades()
        
        if(result){
            if(result.length > 0){  
                messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                messageJson.DEFAULT_MESSAGE.response.count  = result.length
                messageJson.DEFAULT_MESSAGE.response.nacionalidades = result

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


const buscarNacionalidades = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST //400
        } else {
            let result = await nacionalidadesDAO.selectByIdNacionalidades(id)

            if(result){
                if(result.length > 0){
                    messageJson.DEFAULT_MESSAGE.status                  = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code             = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.nacionalidade  = result

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


const excluirNacionalidades = async function(id) { 
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarNacionalidades(id)
        
        if(resultBuscarID.status){
            let result = await nacionalidadesDAO.deleteNacionalidades(id)

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
 
   
const validarDados = async function(nacionalidade) {

    let messageJson = JSON.parse(JSON.stringify(config_message))
    
    if (!nacionalidade) {
        return messageJson.ERROR_BAD_REQUEST
    }

    if (nacionalidade.nome == undefined || nacionalidade.nome == '' || nacionalidade.nome == null || nacionalidade.nome.length > 50) {
        messageJson.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400
    } else {
        return false
    }

}


module.exports = {
    inseirNovaNacionalidade,
    atualizarNacionalidades,
    listarNacionalidades,
    buscarNacionalidades,
    excluirNacionalidades
}
