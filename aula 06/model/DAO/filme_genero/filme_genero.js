/**************************************************************************************************************************************************************************
 *
 * 
 * 
 * Data: 22/ 05/ 2026
 * Autor: Brayan
 * Verão: 1.0
 **************************************************************************************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knexFile')
const knexConex = knex(knexConfig.development)


// Função para inserir dados na tabela intermediária filme_genero
const incertFilme_genero = async function(filmeGenero){
    try {
        let sql = `
        INSERT INTO tbl_filme_genero (id_filme, id_genero)
        VALUES (
            '${filmeGenero.id_filme}',
            '${filmeGenero.id_genero}'
        );`

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

// Função para retornar todos os dados da tabela intermediária
const selectAllFilme_genero = async function(){
    try {
        let sql = `SELECT * FROM tbl_filme_genero ORDER BY id DESC`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

// Função para retornar os dados filtrando pelo id da tabela intermediária
const selectByIdFilme_genero = async function(id){
    try {
        let sql = `SELECT * FROM tbl_filme_genero WHERE id = ${id}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

// Função para retornar todos os gêneros de um determinado filme (filtrando por id_filme)
const selectByIdFilme = async function(idFilme){
    try {
        let sql = `SELECT tbl_genero.*
                    FROM tbl_filme
                        INNER JOIN tbl_filme_genero
                            ON tbl_filme.id = tbl_filme_genero.id_filme
                        INNER JOIN tbl_genero
                            ON tbl_genero.id = tbl_filme_genero.id_genero
                    WHERE tbl_filme.id = ${idFilme}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

// Função para retornar todos os filmes de um determinado gênero (filtrando por id_genero)
const selectByIdGenero = async function(idGenero){
    try {
        let sql = `SELECT tbl_filme.*
                    FROM tbl_filme
                        INNER JOIN tbl_filme_genero
                            ON tbl_filme.id = tbl_filme_genero.id_filme
                        INNER JOIN tbl_genero
                            ON tbl_genero.id = tbl_filme_genero.id_genero
                    WHERE tbl_genero.id = ${idGenero}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

// Função para excluir o registro pelo id
const deleteFilme_genero = async function(id){
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

//Função para excluir os generos filtrando pelo id do filme
//Essa função será utilizada no Update do filme, pois precisa apagar todos os generos
//relacionados com o filme para inserir as novas relações
const deleteByIdFilme = async function(idFilme){
    try {
        let sql = `DELETE FROM tbl_filme_genero WHERE id_filme = ${idFilme}`
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
    selectByIdFilme,
    selectByIdGenero,
    deleteByIdFilme
}