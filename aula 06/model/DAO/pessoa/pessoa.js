/**************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de Dados MYSQL na tabela
 *              Pessoa
 * Data: 20/05/2026
 * Autor: Brayan
 * Versão: 1.0
 **************************************************************************************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knexFile')

const knexConex = knex(knexConfig.development)


const incertPessoa = async function(pessoa){
    try {
        let sql = `
        insert into tbl_pessoa (
            nome,
            data_nascimento,
            idade,
            id_sexo
            )
        values (
            '${pessoa.nome}',
            '${pessoa.data_nascimento}',
             ${pessoa.idade},
             ${pessoa.id_sexo}
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


const updatePessoa = async function(pessoa){
    try {
        let sql = `
            update tbl_pessoa set
            nome =              '${pessoa.nome}',
            data_nascimento =   '${pessoa.data_nascimento}',
            idade =              ${pessoa.idade},
            id_sexo =            ${pessoa.id_sexo}
            where id =           ${pessoa.id};
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


const selectAllPessoa = async function(){
    try {
       let sql = `
            select id, 
            nome, 
            date_format(data_nascimento, '%d/%m/%Y') as data_nascimento, 
            idade, 
            id_sexo from tbl_pessoa order by id desc`

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


const selectByIdPessoa = async function(id){
    try {
        let sql = `
            select id, 
            nome, 
            date_format(data_nascimento, '%d/%m/%Y') as data_nascimento, 
            idade, 
            id_sexo from tbl_pessoa where id=${id}`

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


const deletePessoa = async function(id){
    try {
        let sql = `
            DELETE FROM tbl_pessoa
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
    incertPessoa,
    updatePessoa,
    selectAllPessoa,
    selectByIdPessoa,
    deletePessoa
}