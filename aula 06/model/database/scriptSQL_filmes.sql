-- ============================================================
--  projeto: api-filmes
--  script corrigido e organizado do banco de dados
--  ordem: criação do banco -> tabelas sem dependência ->
--         tabelas com fk -> tabela intermediária -> dados (seed)
-- ============================================================

-- ------------------------------------------------------------
-- 1. criação e seleção do banco de dados
-- ------------------------------------------------------------
create database if not exists db_filmes_20261_a;
use db_filmes_20261_a;

-- ------------------------------------------------------------
-- 2. tabelas sem dependência (podem ser criadas em qualquer ordem)
-- ------------------------------------------------------------

create table tbl_sexo (
    id    int         not null auto_increment primary key,
    sigla varchar(3)  not null,
    nome  varchar(15) not null
);

create table tbl_nacionalidade (
    id   int         not null auto_increment primary key,
    nome varchar(50) not null
);

create table tbl_atividade (
    id   int         not null auto_increment primary key,
    nome varchar(45) not null
);

create table tbl_classificacao (
    id        int          not null auto_increment primary key,
    nome      varchar(50)  not null,
    sigla     varchar(5)   not null,
    descricao varchar(200) not null
);

create table tbl_genero (
    id   int         not null auto_increment primary key,
    nome varchar(50) not null
);

create table tbl_personagem (
    id   int         not null auto_increment primary key,
    nome varchar(80) not null
);

-- ------------------------------------------------------------
-- 3. tabelas com fk simples (1:n)
-- ------------------------------------------------------------

-- pessoa depende de sexo
create table tbl_pessoa (
    id              int         not null auto_increment primary key,
    nome            varchar(50) not null,
    data_nascimento date        not null,
    idade           int(2)      not null,
    id_sexo         int         not null,
    constraint fk_sexo_pessoa
        foreign key (id_sexo)
        references tbl_sexo (id)
);

-- filme depende de classificação
create table tbl_filme (
    id                int           not null auto_increment primary key,
    nome              varchar(80)   not null,
    data_lancamento   date          not null,
    duracao           time          not null,
    sinopse           text          not null,
    avaliacao         decimal(3,2)  default null,
    valor             decimal(5,2)  not null default 0,
    capa              varchar(255),
    id_classificacao  int           not null,
    constraint fk_classificacao_filme
        foreign key (id_classificacao)
        references tbl_classificacao (id)
);

-- ------------------------------------------------------------
-- 4. tabela intermediária (relacionamento n:n filme <-> gênero)
-- ------------------------------------------------------------
create table tbl_filme_genero (
    id        int not null auto_increment primary key,
    id_filme  int not null,
    id_genero int not null,
    constraint fk_filme_filmegenero
        foreign key (id_filme)
        references tbl_filme (id),
    constraint fk_genero_filmegenero
        foreign key (id_genero)
        references tbl_genero (id)
);

-- ============================================================
-- 5. inserts (dados de exemplo / seed)
--    respeitando a ordem: classificação e gênero antes de filme,
--    filme antes de filme_genero.
-- ============================================================

-- sexo
insert into tbl_sexo (sigla, nome) values
    ('m', 'masculino'),
    ('f', 'feminino');

-- classificação indicativa
insert into tbl_classificacao (nome, sigla, descricao) values
    ('livre',        'l',   'recomendado para todos os públicos'),
    ('dez anos',     '10',  'não recomendado para menores de 10 anos'),
    ('doze anos',    '12',  'não recomendado para menores de 12 anos'),
    ('quatorze anos','14',  'não recomendado para menores de 14 anos');

-- gênero
insert into tbl_genero (nome) values
    ('ação'),
    ('aventura'),
    ('comédia'),
    ('drama'),
    ('animação'),
    ('fantasia'),
    ('ficção científica');

-- filme (id_classificacao precisa existir em tbl_classificacao)
insert into tbl_filme (
    nome,
    data_lancamento,
    duracao,
    sinopse,
    avaliacao,
    valor,
    capa,
    id_classificacao
) values (
    'super mario galaxy: o filme',
    '2026-04-02',
    '01:39:00',
    'uma nova aventura leva mario a enfrentar um inédito e ameaçador super vilão. em super mario galaxy: o filme, o bigodudo encanador italiano e seus aliados embarcam numa aventura galáctica repleta de ação e momentos emocionantes depois de salvar o reino dos cogumelos.',
    3.0,
    50.70,
    'https://br.web.img3.acsta.net/c_310_420/img/5b/ea/5bea1aeac3323aeaaf82449a34fafbbf.jpg',
    1
);

-- relação filme <-> gênero (tabela intermediária)
-- ex.: o filme de id 1 pertence aos gêneros aventura (2) e comédia (3)
insert into tbl_filme_genero (id_filme, id_genero) values
    (1, 2),
    (1, 3);

-- ============================================================
-- 6. consultas de referência (apenas leitura, não fazem parte
--    da criação do banco — rode-as separadamente quando precisar)
-- ============================================================

-- 6.1 filmes com classificação (inner join: só filmes com classificação)
-- select tbl_filme.nome,
--        tbl_filme.data_lancamento,
--        tbl_filme.sinopse,
--        tbl_classificacao.sigla
-- from tbl_filme
--     inner join tbl_classificacao
--         on tbl_classificacao.id = tbl_filme.id_classificacao;

-- 6.2 todas as classificações, mesmo sem filme (left join a partir de classificação)
-- select tbl_filme.nome,
--        tbl_filme.data_lancamento,
--        tbl_filme.sinopse,
--        tbl_classificacao.sigla
-- from tbl_classificacao
--     left join tbl_filme
--         on tbl_classificacao.id = tbl_filme.id_classificacao;

-- 6.3 todos os filmes, mesmo sem classificação (right join)
-- select tbl_filme.nome,
--        tbl_filme.data_lancamento,
--        tbl_filme.sinopse,
--        tbl_classificacao.sigla
-- from tbl_classificacao
--     right join tbl_filme
--         on tbl_classificacao.id = tbl_filme.id_classificacao;

-- 6.4 consulta completa: filme + classificação + gênero
-- select
--     tbl_filme.nome         as nome_filme,
--     tbl_filme.sinopse,
--     tbl_filme.duracao,
--     tbl_classificacao.nome as nome_classificacao,
--     tbl_classificacao.sigla,
--     tbl_genero.nome        as nome_genero
-- from tbl_filme
--     inner join tbl_classificacao
--         on tbl_classificacao.id = tbl_filme.id_classificacao
--     left join tbl_filme_genero
--         on tbl_filme.id = tbl_filme_genero.id_filme
--     left join tbl_genero
--         on tbl_genero.id = tbl_filme_genero.id_genero
-- order by tbl_filme.nome asc;

-- 6.5 filmes que ainda não têm gênero cadastrado (anti join)
-- select
--     tbl_filme.nome as nome_filme,
--     tbl_genero.nome as nome_genero
-- from tbl_filme
--     left join tbl_filme_genero
--         on tbl_filme.id = tbl_filme_genero.id_filme
--     left join tbl_genero
--         on tbl_genero.id = tbl_filme_genero.id_genero
-- where tbl_filme_genero.id_filme is null
-- order by tbl_genero.nome;