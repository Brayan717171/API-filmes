/**************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de Dados MYSQL na tabela
 *              Classificacao
 * Data: 20/05/2026
 * Autor: Brayan
 * Versão: 1.0
 **************************************************************************************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knexFile')

const knexConex = knex(knexConfig.development)


const incertClassificacao = async function(classificacao){
    try {
        let sql = `
        insert into tbl_classificacao (
            nome,
            sigla,
            descricao
            )
        values (
            '${classificacao.nome}',
            '${classificacao.sigla}',
            '${classificacao.descricao}'
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


const updateClassificacao = async function(classificacao){
    try {
        let sql = `
            update tbl_classificacao set
            nome =       '${classificacao.nome}',
            sigla =      '${classificacao.sigla}',
            descricao =  '${classificacao.descricao}'
            where id =    ${classificacao.id};
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


const selectAllClassificacao = async function(){
    try {
        let sql = `select * from tbl_classificacao order by id desc`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}


const selectByIdClassificacao = async function(id){
    try {
        let sql = `select * from tbl_classificacao where id=${id}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }
}


const deleteClassificacao = async function(id){
    try {
        let sql = `
            DELETE FROM tbl_classificacao
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
    incertClassificacao,
    updateClassificacao,
    selectAllClassificacao,
    selectByIdClassificacao,
    deleteClassificacao
}
