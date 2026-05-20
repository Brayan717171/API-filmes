#cria database do projeto de filmes
create database db_filmes_20261_a;

#ativa ao o uso database de filmes
use  db_filmes_20261_a;
#cria a tabela de filme
create table tbl_filme (
	id int not null primary key auto_increment,
    nome varchar(80) not null,
    data_lancamento date not null,
    duracao time not null,
    sinopse text not null,
    avaliacao decimal(3,2) default null,
    valor decimal(5,2) not null default 0,
    capa varchar(255)
);

show tables;

#Inseir dados
insert into tbl_filme (
	nome,
    data_lancamento,
    duracao, 
    sinopse, 
    avaliacao, 
    valor, 
    capa
    )
values (
	'Super Mario galaxy: o Filme',
	'2026-04-02',
	'01:39:00',
	'Uma nova aventura leva Mario a enfrentar um inédito e ameaçador super vilão. Em Super Mario Galaxy:
	O Filme, o bigodudo encanador italiano e seus aliados embarcam numa aventura galáctica repleta de ação
	e momentos emocionantes depois de salvar o Reino dos Cogumelos.',
	'3', 
	'50.70',
	'https://br.web.img3.acsta.net/c_310_420/img/5b/ea/5bea1aeac3323aeaaf82449a34fafbbf.jpg'
    );
						#2 Regras sobre values:
			#colocar na mesma ordem dos atributos. Para evitar erros seguir a ordem da criação da tbl
			#todos os values deve ser colado entre ''(simples) menos do tipo INT

#Seleciona todas as colunas da tbl_filme, trás todos os dados da tabela
select * from tbl_filme;

-- delete pelo (id 0 deleta todos os dados da tabela)
DELETE FROM tbl_filme WHERE id > 0;

-- delete pelo id do que você quer remover 
DELETE FROM tbl_filme 
WHERE id = 11;

-- Atualiza o ID do registro desejado
-- WHERE id = 4        → identifica o registro atual (The Circus)
-- SET id = 2          → define o novo ID que será atribuído
--  O novo ID (2) não pode estar em uso por outro registro, senão dará erro de chave duplicada
UPDATE tbl_filme SET id = 3 WHERE id = 5;



desc tbl_classificacao;

update tbl_filme set
	nome = "Filme 03",
	data_lancamento =  "2016-06-10", 
	duracao = "01:34:00",
	sinopse = "testando update de banco de dados. ",
	avaliacao ="2",
	valor = "100.50",
	capa = "wadwwawdd"
where id = 12;

show tables;
CREATE TABLE tbl_nacionalidade (
    id int not null primary key auto_increment,
    nome VARCHAR(50) 
);



CREATE TABLE tbl_atividade (
    id int not null primary key auto_increment,
    nome VARCHAR(45)  
);


CREATE TABLE tbl_pessoa (
    id              INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(50)  NOT NULL,
    data_nascimento DATE         NOT NULL,
    idade           INT(2)       NOT NULL,
    id_sexo     	INT          NOT NULL,
    constraint FK_SEXO_PESSOA #Nome do relacionamento
    foreign key (id_sexo) #Quem sera fk na tabela
    references tbl_sexo(id) #de ode vem a FK
);

create table tbl_sexo (
	id int not null primary key auto_increment,
    sigla varchar(3) not null,
    nome varchar(15) not null
);

desc tbl_pessoa;

desc tbl_filme;

desc tbl_sexo;


select date_format(current_date(), '%d/%m/%Y') as data_formatada;

