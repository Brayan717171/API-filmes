/**************************************************************************************************************************************************************************
 *
 * 
 * 
 * Data: 22/ 05/ 2026
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



// Função para inserir dados na tabela intermediária filme_genero
const incertFilme_genero = async function(filmeGenero){
    try {

       
        let sql = `
        INSERT INTO tbl_filme_genero (id_filme, id_genero)
        VALUES (
            '${filmeGenero.id_filme}',
            '${filmeGenero.id_genero}'
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

// Função para atualizar um registro existente na tabela intermediária
const updateFilme_genero = async function(filmeGenero) {  
    try {
    
        let sql = `
            UPDATE tbl_filme_genero SET
                id_filme  = '${filmeGenero.id_filme}',
                id_genero = '${filmeGenero.id_genero}'
            WHERE id = ${filmeGenero.id};
        `                              
        let result = await knexConex.raw(sql)

        return result ? true : false

    } catch (error) {
        return false
    }
}

//Função para retornar todos os dados da tabela intermediária
const selectAllFilme_genero  = async function(){

    try {
        let sql = `SELECT * FROM tbl_filme_genero ORDER BY id DESC`

        //Executar o ScriptSql no banco de dados
        let result = await knexConex.raw(sql)

        // Validação para verificar se o retorno no BD é uma array (Array.isArray)
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }

}

//Função para retornar os dados filtrando pelo id
const selectFilmesByIdGenero  = async function(idGenero){

   
    try {
        let sql = `SELECT tbl_filme.*
                    FROM tbl_filme
                        INNER JOIN tbl_filme_genero
                            ON tbl_filme.id = tbl_filme_genero.id_filme
                        INNER JOIN tbl_genero
                            ON tbl_genero.id = tbl_filme_genero.id_genero
                    WHERE tbl_genero.id = ${idGenero}`

        //Executar o ScriptSql no banco de dados
        let result = await knexConex.raw(sql)

        // Validação para verificar se o retorno no BD é uma array (Array.isArray)
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }

}

//Função para retornar os dados filtrando pelo id
const selectFilmesByIdFilme  = async function(idFilme){

   
    try {
        let sql = `SELECT tbl_genero.*
                    FROM tbl_filme
                        INNER JOIN tbl_filme_genero
                            ON tbl_filme.id = tbl_filme_genero.id_filme
                        INNER JOIN tbl_genero
                            ON tbl_genero.id = tbl_filme_genero.id_genero
                    WHERE tbl_genero.id = ${idFilme}`

        //Executar o ScriptSql no banco de dados
        let result = await knexConex.raw(sql)

        // Validação para verificar se o retorno no BD é uma array (Array.isArray)
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }

}


//Função para retornar os dados filtrando pelo id
const selectByIdFilme_genero  = async function(id){

   
    try {
        let sql = `SELECT * FROM tbl_filme_genero WHERE id = ${id}`

        //Executar o ScriptSql no banco de dados
        let result = await knexConex.raw(sql)

        // Validação para verificar se o retorno no BD é uma array (Array.isArray)
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }

}


//Função para excluir o registro pelo id
const deleteFilme_genero  = async function(id){

    try {
        
        let sql = `
            DELETE FROM tbl_filme_genero 
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
    incertFilme_genero,
    updateFilme_genero,
    selectAllFilme_genero,
    deleteFilme_genero,
    selectByIdFilme_genero,
    selectFilmesByIdGenero,
    selectFilmesByIdFilme
 }
 
