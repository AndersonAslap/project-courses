### MORE INFORMATION - SPECIFICATIONS

## Criação

### Fundamental

 Para criar essa API é necessário ter o <a href="https://nodejs.org/en/" targer="_blank">NodeJs</a> instalado, para fazer a verificação se tem o mesmo instalado

```bash
node -v
```

Após ter a certeza podemos instalar a que tem o NodeJs instalado, pode-se instalar a CLI do NestJs<a href="https://nestjs.com/" targer="_blank">CLI do NestJs</a>

```bash
npm i -g @nestjs/cli
```

```bash
nest new project-name
```


### Banco de Dados
Irá ser utilizado o banco de dados <a href="https://www.postgresql.org/" targer="_blank">PostgreSQL</a> juntamente com o <a href="https://www.docker.com/" targe="_blank">Docker</a> e o <a href="https://typeorm.io/" target="_blank">TypeORM</a>

```bash
npm i typeorm @nestjs/typeorm pg
```


## Relacionamento entre as tabelas
O TypeORM nos ajuda na questão da criação do relacionamento entre as tabelas, usando o decorators

* Relacionamento entre a entidade **Courses** com a tabela **Tags**

![02](https://user-images.githubusercontent.com/68359459/166833113-0fbd4905-fe19-4162-885d-46a47ffcb17f.png)

![01](https://user-images.githubusercontent.com/68359459/166833101-a548afe2-1db8-4615-89d0-8cba3b09c77a.png)

## Migrations
Ao utilizar Migrations, garantimos assim a integridade do banco de dados, caso haja alguma alteração em algo tupla, podemos ver na documentação do TypeORM um exemplo de como usar a migrations, 

* Arquivo configuração
Cria na raiz do projeto um arquivo de configuração chamado `ormconfig.js`

```js
module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'postgres',
  entity: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}
```

* Comando de criação
Nesse caso para não ter que salvar a biblioteca utilizarei o `npx`

```bash
npx typeorm migration:create -n CourseRefactoring
```

* Configuração da Migration
Para no caso de criar uma Migration com o `ALTER TABLE`, no qual irá alterar-se o nome de uma tupla da tabela

```js
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseRefactoring1651705368250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE  "courses" RENAME COLUMN "name" TO "course"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE  "courses" RENAME COLUMN "course" TO "name"`,
    );
  }
}
```

* Executar a Migration
Uma boa pratica para ter certeza que a build esteja atualizada é roda o comando `npm run buil` que irá garantir que ela estaja atualizada antes de executar a migration

```js
npx typeorm migration:run
```


* Refazendo as alterações

```js
npx typeorm migration:revert
```


# Trabalhando com o Docker

### Dockerfile

Criar na raiz do projeto um arquivo `Dockerfile` com essa configuração

```js
FROM node:16.13.0-alpine3.12

RUN apk add --no-cache bash

RUN npm install -g npm@8.9.0

RUN npm install -g webpack

RUN npm install -g @nestjs/cli

USER node

WORKDIR /home/node/app
```

### .docker

Criar na raiz do projeto uma pasta `.docker` e dentro dela uma outra pasta `postgres` e nessa o arquivo `Dockefile` com essa configuração 

```js 
FROM postgres

RUN usermod -u 1000 postgres
```

### Entrypoint

Dentro da pasta `.docker` criar o arquivo `entrypoint.sh` com essa configuração

```js
#!/bin/bash

npm install
npm run build
npx typeorm migration:run
npm run start:dev
```

## docker-compose
Criar na raiz do projeto um arquivo `docker-compose.yml` com essa configuração

```js
version: "3"

services:
  app:
    build: .
    entrypoint: .docker/entrypoint.sh
    container_name: 'my_container_docker'
    ports:
      - "3001:3000"
    volumes:
      - .:/home/node/app
    depends_on:
      - db

  db:
    build: .docker/postgres
    container_name: 'my_container_docker'
    restart: always
    tty: true
    ports:
      - "5432:5432"
    volumes:
      - .docker/dbdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD='my_password_from_docker'
      - POSTGRES_DB=`my_database`

  pgadmin:
    image: dpage/pgadmin4
    container_name: cursonestjs-pgadmin
    tty: true
    environment:
      - PGADMIN_DEFAULT_EMAIL='my_email_from_pgadmim'
      - PGADMIN_DEFAULT_PASSWORD='my_password_from_pgadmim'
    ports:
      - "8000:80"
    depends_on:
      - db
```


No arquivo `tsconfig.json` incluir essas linhas no final 

```json
"include": ["src"],
  "exclude": [
    "node_modules",
    "build",
    "dist",
    ".docker"
  ]
```

Depois dessa configurações roda o comando 

```bash 
docker-compose up
``` 

que ira subir o serviço do container do Docker
Com o Docker em execução pode-se entrar no container através do comando 

```bash
docker-compose exec app bash
```

Pois agora estará trabalhando diretamente com o container do Docker configurado anteriormente, e qualquer comando para instalação terá que ser executado dentro desse container

## Migrations
Tendo feito essas configurações podemos criar as migrações dentro do container

```bash
npx typeorm migration:create -n CreateCoursesTable

npx typeorm migration:create -n CreateTagsTable
```

OBS.: Excluir as antigas migrações

```ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCoursesTable1651749088685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'courses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('courses');
  }
}
```

```ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTagsTable1651749484102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tags');
  }
}
```

* Parar o serviço do Docker

```bash
docker-compose stop
```

* Excluir os volumes

```bash
docker-compose down
```

* Subir o Docker novamente

```bash
docker-compose up
```

* Abri o terminal do container

```bash
docker-compose exec app bash
```