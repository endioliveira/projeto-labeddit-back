<h1 align="center"> Projeto LabEddit </h1>

# Índice 

* [Introdução](#introdução)
* [Conteúdos abordados no projeto](#conteúdos-abordados-no-projeto)
* [Endpoints](#endpoints)
* [Dependências](#dependências)
* [Rodando o projeto](#rodando-o-projeto)
* [Tecnologias utilizadas](#tecnologias-utilizadas)
* [Link da Documentação](#link-da-documentação)
* [Banco de Dados](#banco-de-dados)

# Introdução 
O projeto LabEddit é uma rede social com o objetivo de promover a conexão e interação entre pessoas. Quem se cadastrar no aplicativo poderá criar e curtir publicações.

# Conteúdos abordados no projeto

- NodeJS
- Typescript
- Express
- SQL e SQLite
- Knex
- Programação Orientada a Objetos
- Arquitetura em camadas
- Geração de UUID
- Geração de hashes
- Autenticação e autorização
- Roteamento
- Postman
- Deploy com o Render

# Endpoints

- [x]  Signup
- [x]  Login
- [x]  Get Posts
- [x]  Create Post
- [x]  Create Comment
- [x]  Get Comments
- [x]  Delete Post
- [x]  Like or Dislike Post
- [x]  Like or Dislike Comment

### :dart: SIGNUP - Endpoint público para fazer um cadastro. Esse endpoint devolve um token jwt.

```
// request POST /users/signup
// body JSON
{
  "nickname": "livia12",
  "email": "liviaoli@email.com",
  "password": "livia12343"
}
// response
// status 201 CREATED

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6I"
}
```

### :dart: LOGIN - Endpoint público utilizado para fazer login. Ele também devolve um token jwt.

```
// request POST /users/login
// body JSON
{
  "email": "liviaoli@email.com",
  "password": "livia12343"
}

// response
// status 200 OK
{
  "token": "eyJhbGciOiJIXVCJ9.eyJpZCI6ImYyZjhjYWE4LTgzMTMb"
}
```

### :dart: GET POSTS - Esse endpoint é protegido, precisa de um token jwt para acessá-lo.
```
// request GET /posts
// headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjZTQ2YmQ1LTQ5Y"

// response
// status 200 OK
[
    {
        "id": "p001",
        "content": "Porque a maioria dos desenvolvedores usam Linux? ou as empresas de tecnologia usam Linux ?",
        "likes": 0,
        "comments": 2,
        "createdAt": "2023-03-17 17:37:32",
        "creator": {
            "id": "u001",
            "nickname": "lucis12"
        }
    },
    {
        "id": "p002",
        "content": "Qual super poder você gostaria de ter?",
        "likes": 0,
        "comments": 0,
        "createdAt": "2023-03-17 17:37:32",
        "creator": {
            "id": "u002",
            "nickname": "dudab32"
        }
    }
 ]
```

### :dart: GET COMMENTS - Esse endpoint é protegido, precisa de um token jwt para acessá-lo.
```
// request GET /posts/:id
// headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjZTQ2YmQ1LTQ5Y"

// response
// status 200 OK
{
    "id": "p001",
    "creator_id": "u001",
    "content": "Porque a maioria dos desenvolvedores usam Linux? ou as empresas de tecnologia usam Linux ?",
    "likes": 0,
    "comments": 2,
    "created_at": "2023-03-17 17:37:32",
    "nickname": "lucis12",
    "post_comments": [
        {
            "id": "c001",
            "post_id": "p001",
            "creator_id": "u005",
            "content": "Não posso falar por todos, mas usar Linux ajudou meu pc a ter uma performance melhor (e evitou que eu precisasse comprar um novo)",
            "likes": 0,
            "created_at": "2023-03-17 17:37:48",
            "nickname": "tays981"
        },
        {
            "id": "c002",
            "post_id": "p001",
            "creator_id": "u006",
            "content": "Não é a maioria, já vi umas enquetes, inclusive nesse sub se não me engano, onde Windows ganhava na qntd de usuários. Linux é rápido, tem várias opções pra diferentes gostos.",
            "likes": 0,
            "created_at": "2023-03-17 17:37:48",
            "nickname": "lipe13423"
        }
    ]
}
```

### :dart: CREATE POST - Endpoint protegido, precisa de um token jwt para poder acessá-lo.

```
// request POST /posts
// headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA3Nzc4Z"
// body JSON
 {
        "content": "O que vocês preferem, Marvel ou DC?"
    }

// response
// status 201 CREATED
```

### :dart: CREATE COMMENT - Endpoint protegido, precisa de um token jwt para poder acessá-lo.

```
// request POST /posts/:id/createComment
// headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA3Nzc4Z"
// body JSON
    {
        "content": "Eu iria escolher ter uma calopsita!"
    }

// response
// status 201 CREATED
```

### :dart: LIKE OR DISLIKE POST - Endpoint protegido, requer um token jwt para poder acessá-lo. 

Quem criou o post não pode dar like ou dislike no mesmo.

Caso dê um like em um post que já tenha dado like, o like é desfeito.
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.

Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.


Primeira funcionalidade - Like
```
// request PUT /posts/:id/like
// headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyZjhjYWE4LTgzMTMtNDMzNy04ZD"
// body JSON
{
    "like": true
}

// response
// status 200 OK
```

Segunda funcionalidade - Dislike
```
// request PUT /posts/:id/like
// headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyZjhjYWE4LTgzMTMtNDMzNy04ZD"
// body JSON
{
    "like": false
}

// response
// status 200 OK
```

### :dart: LIKE OR DISLIKE COMMENT - Endpoint protegido, requer um token jwt para poder acessá-lo. 

Primeira funcionalidade - Like
```
// request PUT /posts/:id/comment/like
// headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyZjhjYWE4LTgzMTMtNDMzNy04ZD"
// body JSON
{
    "commentId": "c002",
    "like": true
}

// response
// status 200 OK
```

Segunda funcionalidade - Dislike
```
// request PUT /posts/:id/comment/like
// headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyZjhjYWE4LTgzMTMtNDMzNy04ZD"
// body JSON
{
    "commentId": "c002",
    "like": false
}

// response
// status 200 OK
```

# Dependências

### :large_blue_circle: SCRIPTS
```
"scripts": {
    "start": "node ./build/index.js",
    "build": "tsc",
    "dev": "ts-node-dev ./src/index.ts"
  }
```

### :large_blue_circle: Dependencies
```
"dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "knex": "^2.4.2",
    "sqlite3": "^5.1.4",
    "uuid": "^9.0.0"
  }
```

### :large_blue_circle: devDependencies 
```
"devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.16",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/knex": "^0.16.1",
    "@types/node": "^18.11.18",
    "@types/uuid": "^9.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^4.9.5"
  }
```

# Rodando o projeto 

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), o [Node.js](https://nodejs.org/en/) e o [Postman](https://www.postman.com). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

```
# Clone este repositório
$ git clone <https://github.com/endioliveira/projeto-labeddit-back>

# Acesse a pasta do projeto no terminal
$ cd projeto-labeddit-back

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor iniciará na porta:3003> 
```

# Tecnologias Utilizadas 

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=express,nodejs,postman,sqlite,ts" />
  </a>
</p>

# Link da Documentação

https://documenter.getpostman.com/view/20168491/2s93JzKzaw

# Banco de dados

![Labeddit (1)](https://user-images.githubusercontent.com/100172961/226062447-40b1f9b6-9dac-402b-9809-3b3881bcc6ce.png)

https://dbdiagram.io/d/6414e647296d97641d88dec0
