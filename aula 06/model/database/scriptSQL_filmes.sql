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
----------------------------------------------------------------------------------------------------------
-- Busca nome, data de lançamento, sinopse e sigla de classificação dos filmes
-- INNER JOIN: retorna APENAS filmes que possuem uma classificação cadastrada
-- Filmes sem classificação e classificações sem filmes são EXCLUÍDOS do resultado

SELECT tbl_filme.nome, 
       tbl_filme.data_lancamento, 
       tbl_filme.sinopse,
       tbl_classificacao.sigla 
FROM tbl_filme 
     INNER JOIN tbl_classificacao
        ON tbl_classificacao.id = tbl_filme.id_classificacao;
        -- Condição de junção: chave primária de classificacao = chave estrangeira em filme
----------------------------------------------------------------------------------------------------------
        
        
-- Busca os mesmos campos, mas com comportamento diferente
-- A tabela ESQUERDA agora é tbl_classificacao (posição invertida em relação à query 1)
-- LEFT JOIN: retorna TODAS as classificações, mesmo sem filmes associados
-- Para classificações sem filmes, as colunas de tbl_filme virão como NULL

SELECT tbl_filme.nome, 
       tbl_filme.data_lancamento, 
       tbl_filme.sinopse,
       tbl_classificacao.sigla 
FROM  tbl_classificacao              -- tabela esquerda (dominante)
      LEFT JOIN tbl_filme            -- tabela direita (pode ter NULLs)
        ON tbl_classificacao.id = tbl_filme.id_classificacao;

----------------------------------------------------------------------------------------------------------

-- RIGHT JOIN: tabela DIREITA é a dominante (tbl_filme)
-- Retorna TODOS os filmes, mesmo sem classificação cadastrada
-- Filmes sem classificação terão sigla como NULL

SELECT tbl_filme.nome, 
       tbl_filme.data_lancamento, 
       tbl_filme.sinopse,
       tbl_classificacao.sigla 
FROM tbl_classificacao                -- tabela esquerda (pode ter NULLs)
     RIGHT JOIN tbl_filme             -- tabela direita (dominante)
        ON tbl_classificacao.id = tbl_filme.id_classificacao;


select * from tbl_filme;
select * from tbl_genero;
select * from tbl_filme_genero;
select * from tbl_classificacao;

insert into tbl_filme_genero(id_filme, id_genero)
							values(23, 2),
								  (24, 1),
								  (25, 5),
                                  (26, 6),
                                  (27, 7);
                                  
-- ╔══════════════════════════════════════════════════════╗
-- ║         CONSULTA COMPLETA DE FILMES                  ║
-- ║  Retorna filmes com sua classificação etária e gênero║
-- ╚══════════════════════════════════════════════════════╝
SELECT 
    -- ── Dados do filme ──────────────────────────────────
    tbl_filme.nome        AS nome_filme,       -- apelido para evitar ambiguidade com outros "nome"
    tbl_filme.sinopse,                         -- resumo da história do filme
    tbl_filme.duracao,                         -- duração total do filme

    -- ── Dados da classificação etária ───────────────────
    tbl_classificacao.nome AS nome_classificacao, -- ex: "Livre", "Maiores de 18"
    tbl_classificacao.sigla,                      -- ex: "L", "12", "14", "16", "18"
    tbl_classificacao.descricao,                  -- motivo da classificação (violência, etc)

    -- ── Dados do gênero ─────────────────────────────────
    tbl_genero.nome AS nome_genero            -- ex: "Ação", "Comédia", "Terror"
                                              -- pode vir NULL se o filme não tiver gênero

FROM tbl_filme                                -- ponto de partida: tabela principal

    -- ── 1º JOIN: classificação etária ───────────────────
    -- relacionamento 1:N — um filme tem uma classificação
    -- como é INNER, filmes sem classificação ficam fora do resultado
    INNER JOIN tbl_classificacao
        ON tbl_classificacao.id = tbl_filme.id_classificacao

    -- ── 2º JOIN: tabela intermediária de gêneros ────────
    -- tbl_filme_genero existe pois um filme pode ter vários gêneros
    -- e um gênero pode pertencer a vários filmes (N:N)
    -- LEFT JOIN: mantém filmes que ainda não têm gênero associado
    LEFT JOIN tbl_filme_genero
        ON tbl_filme.id = tbl_filme_genero.id_filme

    -- ── 3º JOIN: gênero ─────────────────────────────────
    -- completa a travessia: tbl_filme → tbl_filme_genero → tbl_genero
    -- LEFT JOIN aqui é obrigatório para manter o efeito do LEFT JOIN anterior
    -- se fosse INNER JOIN, filmes sem gênero seriam excluídos mesmo assim
    LEFT JOIN tbl_genero
        ON tbl_genero.id = tbl_filme_genero.id_genero

-- ── Ordenação ───────────────────────────────────────────
-- ordena os filmes de A → Z pelo nome
ORDER BY tbl_filme.nome ASC;


select * from tbl_filme_genero;
select * from tbl_filme;
select * from tbl_genero;

SELECT 
    tbl_filme.nome AS nome_filme,
    tbl_genero.nome AS nome_genero
FROM tbl_filme
    -- LEFT JOIN para manter filmes SEM gênero no resultado
    LEFT JOIN tbl_filme_genero
        ON tbl_filme.id = tbl_filme_genero.id_filme
    LEFT JOIN tbl_genero
        ON tbl_genero.id = tbl_filme_genero.id_genero
-- WHERE deve vir antes do ORDER BY
WHERE tbl_filme_genero.id_filme IS NULL  -- filtra apenas os sem gênero
ORDER BY tbl_genero.nome;                -- agora o ORDER BY vem por último