/**************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de Dados MYSQL na tabela
 *              Filme
 * Data: 15/ 04/ 2026
 * Autor: Brayan
 * Verão: 1.0
 **************************************************************************************************************************************************************************/
//Import da biblioteca para gerenciar o banco de dados Mysql no node.js
const knex = require('knex')
//Import de arquivo de configuração para conexão com o BD Mysql
const knexConfig = require('../../database_config_knex/knexFile')


//Criar a conexão com o banco de dados Mysql
const knexConex = knex(knexConfig.development)


// Instalações:
// * 
// * npm install express --save
// * npm install cors --save
// * 
// * npm install knex --save : biblioteca p/ se conectar com o banco de dados, existem várias dependencias e ele é uma delas.
// * outras bibliotecas que se conectam com o BD: 
// * 
// * Sequelize (mais básico e antigo, prof recomendou evitar o uso)
// * Prisma (é bom, porém está instavével)
// * Knex
// * Tudo depende do BD que vc está utilizando.



// //Função para inserir dados na tabela de filme


const incertAtividade = async function(atividade){
    try {
        
    
        let sql = `
        insert into tbl_atividade (
            nome
            )
        values (
            '${atividade.nome}'
            );`

        //Executar o ScriptSql no banco de dados
        let result = await knexConex.raw(sql)
      
        

        if(result)
            return result[0].insertId
        else
            return false

    } catch (error) {
        return false
    }

    
}


//Função para atualizar um filme existente na tabela
const updateAtividade = async function(atividade){
    try {
        let sql = `
            update tbl_atividade set
            nome =            '${atividade.nome}'
            where id =         ${atividade.id};
        `
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

//Função para retornar todos os dados da tabela de filme
const selectAllAtividade = async function(){

    try {
        let sql = `select * from tbl_atividade order by id desc`

        //Executar o ScriptSql no banco de dados, para retornar os filmes
        let result = await knexConex.raw(sql)

        // Validação para verificar se o retorno no BD é uma array (Array.isArray)
        //Se o ScriptSQL 
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }

}



//Função para retornar os dados do filme filrando pelo id
const selectByIdAtividade = async function(id){

    try {
        let sql = `select * from tbl_atividade where id=${id}`

        //Executar o ScriptSql no banco de dados, para retornar os filmes
        let result = await knexConex.raw(sql)

        // Validação para verificar se o retorno no BD é uma array (Array.isArray)
        //Se o ScriptSQL 
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }

}


//Funcão para excluir o filme pelo id
const deleteAtividade = async function(id){

    try {
        let sql = `
            DELETE FROM tbl_atividade
            WHERE id = ${id};
        `
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        
        return false
    }

}

module.exports = {
    incertAtividade,
    updateAtividade,
    selectAllAtividade,
    selectByIdAtividade,
    deleteAtividade
}