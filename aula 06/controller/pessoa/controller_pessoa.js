/***************************************************************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento e 
 *       manipulação para o CRUD de pessoa
 * Data: 20/05/2026
 * Autor: Brayan
 * Versão: 1.0
 ***************************************************************************************************************************************************************************************************************************/

const config_message = require('../modulo/configMessagens.js')
const pessoaDAO = require('../../model/DAO/pessoa/pessoa.js')
const controller_sexo = require('../sexo/controller_sexo.js')


const inseirNovaPessoa = async function (pessoa, contentType) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(pessoa)

            if (validar){
                return validar
            } else {

                let result = await pessoaDAO.incertPessoa(pessoa)

                if (result) {
                    pessoa.id = result
                    messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_CREATED_ITEM.status
                    messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_CREATED_ITEM.status_code
                    messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_CREATED_ITEM.message
                    messageJson.DEFAULT_MESSAGE.response    = pessoa
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


const atualizarPessoa = async function(pessoa, id, contentType) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let resultBuscarID = await buscarPessoa(id)

            if(resultBuscarID.status){
                let validar = await validarDados(pessoa)

                if(!validar){
                    pessoa.id = id

                    let result = await pessoaDAO.updatePessoa(pessoa)

                    if(result){
                        messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_UPDATED_ITEM.status
                        messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_UPDATED_ITEM.status_code
                        messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_UPDATED_ITEM.message
                        messageJson.DEFAULT_MESSAGE.response    = pessoa

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


const listarPessoa = async function() {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let result = await pessoaDAO.selectAllPessoa()

        if(result){
            if(result.length > 0){

                // Percorre o ARRAY de pessoas para identificar os dados de sexo
                for(let pessoa of result){
                    // Busca na controller de sexo
                    let result_sexo = await controller_sexo.buscarSexo(pessoa.id_sexo)
                    // Se o sexo foi encontrado
                    if(result_sexo.status){
                        // Cria atributo sexo na pessoa e adiciona dados referente ao sexo
                        pessoa.sexo = result_sexo.response.sexo
                        // Apaga o atributo id_sexo
                        delete pessoa.id_sexo
                    }
                }

                messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                messageJson.DEFAULT_MESSAGE.response.count  = result.length
                messageJson.DEFAULT_MESSAGE.response.pessoas = result

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


const buscarPessoa = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID INVÁLIDO]'
            return messageJson.ERROR_BAD_REQUEST //400
        } else {
            let result = await pessoaDAO.selectByIdPessoa(id)

            if(result){
                if(result.length > 0){

                    // Percorre o ARRAY de pessoas para identificar os dados de sexo
                    for(let pessoa of result){
                        // Busca na controller de sexo
                        let result_sexo = await controller_sexo.buscarSexo(pessoa.id_sexo)
                        // Se o sexo foi encontrado
                        if(result_sexo.status){
                            // Cria atributo sexo na pessoa e adiciona dados referente ao sexo
                            pessoa.sexo = result_sexo.response.sexo
                            // Apaga o atributo id_sexo
                            delete pessoa.id_sexo
                        }
                    }

                    messageJson.DEFAULT_MESSAGE.status          = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code     = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.pessoa = result

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


const excluirPessoa = async function(id) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        let resultBuscarID = await buscarPessoa(id)

        if(resultBuscarID.status){
            let result = await pessoaDAO.deletePessoa(id)

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


const validarDados = async function(pessoa) {

    let messageJson = JSON.parse(JSON.stringify(config_message))

    if (!pessoa) {
        return messageJson.ERROR_BAD_REQUEST
    }

    if (pessoa.nome == undefined || pessoa.nome == '' || pessoa.nome == null || pessoa.nome.length > 50) {
        messageJson.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    } else if (pessoa.data_nascimento == undefined || pessoa.data_nascimento == '' || pessoa.data_nascimento == null || pessoa.data_nascimento.length != 10) {
        messageJson.ERROR_BAD_REQUEST.field = '[DATA_NASCIMENTO] INVÁLIDA'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    } else if (pessoa.idade == undefined || pessoa.idade == '' || pessoa.idade == null || isNaN(pessoa.idade) || pessoa.idade <= 0 || pessoa.idade > 99) {
        messageJson.ERROR_BAD_REQUEST.field = '[IDADE] INVÁLIDA'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    } else if (pessoa.id_sexo == undefined || pessoa.id_sexo == '' || pessoa.id_sexo == null || isNaN(pessoa.id_sexo) || pessoa.id_sexo <= 0) {
        messageJson.ERROR_BAD_REQUEST.field = '[ID_SEXO] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    } else {
        return false
    }
}


module.exports = {
    inseirNovaPessoa,
    atualizarPessoa,
    listarPessoa,
    buscarPessoa,
    excluirPessoa
}