-- Active: 1678454861132@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        nickname TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

SELECT * FROM users;

DROP TABLE users;

INSERT INTO
    users (id, nickname, email, password)
VALUES ("u001", "lucis12", "lucianasantos@email.com","luci1234"), 
       ("u002","dudab32","eduardab@email.com","dudu12349"), 
       ("u003", "rafaab", "rafael2@email.com","re1206172"), 
       ("u004", "sarinha1998", "sarinhah@email.com","sara19987"), 
       ("u005", "tays981", "tayssae2@email.com", "tay5123@6"), 
       ("u006", "lipe13423", "felipe@email.com","felipe5#10");

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        comments INTEGER NOT NULL, -- number of comments
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id)
    );

SELECT * FROM posts;

DROP TABLE posts;

INSERT INTO
    posts (
        id,
        creator_id,
        content,
        comments
    )
VALUES (
        "p001",
        "u001",
        "Porque a maioria dos desenvolvedores usam Linux? ou as empresas de tecnologia usam Linux ?",
        2
    ), (
        "p002",
        "u002",
        "Qual super poder você gostaria de ter?",
        0
    ), (
        "p003",
        "u003",
        "Se você pudesser ter qualquer tipo de pet, qual você escolheria?",
        0
    ), (
        "p004",
        "u004",
        "Se você tivesse que comer apenas uma coisa para o resto de sua vida, o que você escolheria?",
        0
    );

CREATE TABLE
    likes_dislikes_posts(
        post_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        -- 1 = like or 0 = dislike
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

SELECT * FROM likes_dislikes_posts;

DROP TABLE likes_dislikes_posts;

INSERT INTO
    likes_dislikes_posts (post_id, user_id, like)
VALUES ("p001", "u001", 0), ("p002", "u002", 0), ("p003", "u003", 0), ("p004", "u004", 0);

CREATE TABLE
    comments (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        post_id TEXT NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (creator_id) REFERENCES users(id)
    );

SELECT * FROM comments;

DROP TABLE comments;

INSERT INTO
    comments (
        id,
        creator_id,
        post_id,
        content
    )
VALUES (
        "c001",
        "u005",
        "p001",
        "Não posso falar por todos, mas usar Linux ajudou meu pc a ter uma performance melhor (e evitou que eu precisasse comprar um novo)"
    ), (
        "c002",
        "u006",
        "p001",
        "Não é a maioria, já vi umas enquetes, inclusive nesse sub se não me engano, onde Windows ganhava na qntd de usuários. Linux é rápido, tem várias opções pra diferentes gostos."
    );

CREATE TABLE
    likes_dislikes_comments (
        comment_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        -- 1 = like or 0 = dislike
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (comment_id) REFERENCES comments(id)
    );

SELECT * FROM likes_dislikes_comments;

DROP TABLE likes_dislikes_comments;

INSERT INTO
    likes_dislikes_comments (user_id, comment_id, like)
VALUES ("u005", "c001", 0), ("u006", "c002", 0);

ALTER TABLE posts RENAME COLUMN count_comments TO comments;