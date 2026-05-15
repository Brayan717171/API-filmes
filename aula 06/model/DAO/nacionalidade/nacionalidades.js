/**************************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no Banco de Dados MYSQL na tabela
 *              Nacionalidade
 * Data: 13/ 05/ 2026
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



// //Função para inserir dados na tabela de nacionalidade


const incertNacionalidades = async function(nacionalidades){
    try {
        
    
        let sql = `
        insert into tbl_nacionalidade (
            nome
            )
        values (
        '${nacionalidades.nome}'
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

// Função para atualizar uma nacionalidade existente na tabela
const updateNacionalidades = async function(nacionalidades) {  
    try {
        let sql = `
            UPDATE tbl_nacionalidade SET
                nome  = '${nacionalidades.nome}'
            WHERE id = ${nacionalidades.id};
        `                              
        let result = await knexConex.raw(sql)

        return result ? true : false

    } catch (error) {
        return false
    }
}

//Função para retornar todos os dados da tabela de nacionalidade
const selectAllNacionalidades = async function(){

    try {
        let sql = `select * from tbl_nacionalidade order by id desc`

        //Executar o ScriptSql no banco de dados, para retornar as nacionalidades
        let result = await knexConex.raw(sql)

        // Validação para verificar se o retorno no BD é uma array (Array.isArray)
        //Se o ScriptSQL 
        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        console.log(error);
        return false
    }

}



//Função para retornar os dados da nacionalidade filtrando pelo id
const selectByIdNacionalidades = async function(id){

    try {
        let sql = `select * from tbl_nacionalidade where id=${id}`

        //Executar o ScriptSql no banco de dados, para retornar as nacionalidades
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


//Funcão para excluir a nacionalidade pelo id
const deleteNacionalidades = async function(id){

    try {
        let sql = `
            DELETE FROM tbl_nacionalidade 
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
    incertNacionalidades,
    updateNacionalidades,
    selectAllNacionalidades,
    selectByIdNacionalidades,
    deleteNacionalidades,
}
