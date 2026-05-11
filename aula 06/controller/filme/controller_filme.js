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


const inseirNovoFilme = async function (filme, contentType) {
    
        // Clona o objeto de mensagens para evitar mutação do objeto original importado
        // Isso garante que alterações feitas aqui não afetam outras chamadas da função
        let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        
        
        

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){


        let validar = await validarDados(filme)

        //Se a função validar rodar um JSON de eerro, iremos devolver ao APP o erro
        if (validar){
            return validar
        }else {


            // Todas as validações passaram — aciona o DAO para inserir no banco de dados
            let result = await filmeDAO.incertFilme(filme)


            if (result) {
                // Inserção bem-sucedida: monta resposta com HTTP 201 (Created)

                
                filme.id = result
                messageJson.DEFAULT_MESSAGE.status      = messageJson.SUCCES_CREATED_ITEM.status
                messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_CREATED_ITEM.status_code
                messageJson.DEFAULT_MESSAGE.message     = messageJson.SUCCES_CREATED_ITEM.message
                messageJson.DEFAULT_MESSAGE.response = filme
                
                
            } else {
                // Falha na inserção no banco: monta resposta com HTTP 500
                config_message.ERROR_INTERNAL_SERVER_MODEL // HTTP 500 - Internal Server Error
            }

            // Retorna o objeto de resposta padronizado para o app.js enviar ao cliente
            return messageJson.DEFAULT_MESSAGE
        }

        }else{
            return messageJson.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }
}

const atualizarFilme = async function(filme, id , contentType) {


     // Clona o objeto de mensagens para evitar mutação do objeto original importado
        // Isso garante que alterações feitas aqui não afetam outras chamadas da função
        let messageJson = JSON.parse(JSON.stringify(config_message))

    try {

        //Validação do contentType para receber apeas JSON
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Válidação com id incorreto
            let resultBuscarID = await buscarFilme(id)
            
            //Se a função buscar encontrar o filme o atributo status JSON será verdadeiro 
            //Isso significa que o filme existe na base,caso não retorne true, então 
            //o retorno da função poderá ser um 404 ou 500
            if(resultBuscarID.status){
                let validar = await validarDados(filme)

                //Válidação de campos obrigatórios para a atualização(body) 
                if(!validar){
                    //Adiciono o atributo id do filme no JSON para ser enviado para o DAO
                    filme.id = id

                    //Chama a  função do DAO para atualizar o ifilme(dados e o ID)
                    let result = await filmeDAO.updateFilme(filme)

                    if(result){
                        messageJson.DEFAULT_MESSAGE.status = messageJson.SUCCES_UPDATED_ITEM.status
                        messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_UPDATED_ITEM.status_code
                        messageJson.DEFAULT_MESSAGE.message = messageJson.SUCCES_UPDATED_ITEM.message
                        messageJson.DEFAULT_MESSAGE.response = filme

                        return messageJson.DEFAULT_MESSAGE


                    }else{
                        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER //500
                    }
                }else{
                    console.log(validar);
                    
                    return validar //400
                }
            }else{
            
                return resultBuscarID //400 ou 404 ou 500
                
            }

        }else{
           
            
            return messageJson.ERROR_CONTENT_TYPE //415
            
        }
        
    } catch (error) {
        
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const listarFilme = async function() {
   
    // Clona o objeto de mensagens para evitar mutação do objeto original importado
    // Isso garante que alterações feitas aqui não afetam outras chamadas da função
        let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        //Chama a funão do DAO para retornar a lista de  todos os filmes
        let result = await filmeDAO.selectAllFilme()
        
        
        if(result){
            if(result.length > 0){  
                messageJson.DEFAULT_MESSAGE.status = messageJson.SUCCES_RESPONSE.status
                messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_RESPONSE.status_code
                messageJson.DEFAULT_MESSAGE.response.count = result.length
                messageJson.DEFAULT_MESSAGE.response.filme = result

                return messageJson.DEFAULT_MESSAGE
                
            }else{
                return messageJson.ERROR_NOT_FOUND
            }
        }else{
            return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }

}


const buscarFilme = async function(id) {

    // Clona o objeto de mensagens para evitar mutação do objeto original importado
    // Isso garante que alterações feitas aqui não afetam outras chamadas da função
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        //Válidação para garantir que o id seja válidos
        if(id == undefined || id == '' || id == null ||  isNaN(id)){
            messageJson.ERROR_BAD_REQUEST.field = '[ID INVÁLIDO]'

            return messageJson.ERROR_BAD_REQUEST //400
        }else{
            let result = await filmeDAO.selectByIdFilme(id)

            if(result){
                if(result.length > 0){
                    messageJson.DEFAULT_MESSAGE.status = messageJson.SUCCES_RESPONSE.status
                    messageJson.DEFAULT_MESSAGE.status_code = messageJson.SUCCES_RESPONSE.status_code
                    messageJson.DEFAULT_MESSAGE.response.filme = result

                    return messageJson.DEFAULT_MESSAGE //200
                }else{
                    
                    
                    return messageJson.ERROR_NOT_FOUND //404
                }
            }else{
                return messageJson.ERROR_INTERNAL_SERVER_MODEL //500 (model)
            }
        }
            
        
    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER //500(controller)
    }

}


const excluirFilme = async function(id) { 
    let messageJson = JSON.parse(JSON.stringify(config_message))

    try {
        

        // Validação se o ID existe, erro 400 e 404
        let resultBuscarID = await buscarFilme(id)
        
        //Validação se o status é verdadeiro(se existe o filme)
        if(resultBuscarID.status){
            // Chama a função do DAO para deletar o filme apenas pelo ID
            let result = await filmeDAO.deleteFilme(id)

            if(result){
                // Retorno de sucesso
                return messageJson.SUCCES_DELETE_ITEM  //200
            } else {
                return messageJson.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        } else {
            return resultBuscarID // Retorna o 404 da busca caso o filme não exista
        }

    } catch (error) {
        return messageJson.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}
 
   
//Função para validar todos os dados de filme
const validarDados = async function(filme) {

    let messageJson = JSON.parse(JSON.stringify(config_message))
    
    // Validação primária: verifica se o body da requisição foi recebido
    // Ocorre quando o Content-Type não é application/json ou o body está vazio
    if (!filme) {
        return messageJson.ERROR_BAD_REQUEST
    }

    // Validação do campo NOME:
    // - Não pode ser vazio, nulo ou undefined
    // - Não pode ultrapassar 80 caracteres (limite da coluna no banco)
    if (filme.nome == undefined || filme.nome == '' || filme.nome == null ||  filme.nome.length > 80) {

        messageJson.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    // Validação do campo DATA_LANCAMENTO:
    // - Não pode ser vazio, nulo ou undefined
    // - Deve ter exatamente 10 caracteres (formato esperado: YYYY-MM-DD)
    } else if (filme.data_lancamento == undefined || filme.data_lancamento == '' || filme.data_lancamento == null ||  filme.data_lancamento.length != 10) {

        messageJson.ERROR_BAD_REQUEST.field = '[data_lancamento] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    // Validação do campo DURACAO:
    // - Não pode ser vazio, nulo ou undefined
    // - Deve ter no mínimo 5 caracteres (formato esperado: HH:MM)
    } else if (filme.duracao == undefined || filme.duracao == '' || filme.duracao == null ||  filme.duracao.length < 5) {

        messageJson.ERROR_BAD_REQUEST.field = '[duração] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    // Validação do campo SINOPSE:
    // - Não pode ser vazio, nulo ou undefined (sem limite de tamanho definido)
    } else if (filme.sinopse == undefined || filme.sinopse == '' || filme.sinopse == null || filme.sinopse == undefined) {

        messageJson.ERROR_BAD_REQUEST.field = '[sinopse] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    // Validação do campo AVALIACAO:
    // - Deve ser um valor numérico (ex: 8.5)
    // - toString() é necessário pois avaliacao pode chegar como number, não string
    // - Não pode ultrapassar 3 caracteres (ex: "10" ou "9.5")
    } else if (isNaN(filme.avaliacao) || filme.avaliacao.toString().length > 3) {

        messageJson.ERROR_BAD_REQUEST.field = '[avaliacao] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400    

    // Validação do campo VALOR:
    // - Não pode ser vazio, nulo ou undefined
    // - Deve ser um valor numérico (isNaN retorna true se NÃO for número)
    } else if (filme.valor == undefined || filme.valor == '' || filme.valor == null ||  filme.valor.toString().split('.')[0].length > 3|| isNaN(filme.valor)) {

        messageJson.ERROR_BAD_REQUEST.field = '[valor] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400

    // Validação do campo CAPA
    // - Não pode ser nulo/undefined (verificado com !filme.capa)
    // - URL ou nome do arquivo não pode ultrapassar 255 caracteres (limite da coluna no banco)
    } else if (!filme.capa || filme.capa.length > 255) {

        messageJson.ERROR_BAD_REQUEST.field = '[capa] INVÁLIDO'
        return messageJson.ERROR_BAD_REQUEST  // HTTP 400


    }else{
        return false

    }

}


// Exporta todas as funções do controller para serem utilizadas nas rotas do app.js
module.exports = {
    inseirNovoFilme,
    atualizarFilme,
    listarFilme,
    buscarFilme,
    excluirFilme
}