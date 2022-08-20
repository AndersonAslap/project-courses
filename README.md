## Migrations

> Criando uma migration

```bash
npx typeorm migration:create <path>
```
- Exemplo

```bash
npx typeorm migration:create src/database/migrations/CreateCourseTable
```

> Rodar as migrations

- É correto buildar o projeto e rodar as migrations da pasta dist

```bash
npx typeorm migration:run -d dist/database/database.providers.ts
```
- o parâmetro '-d' significa datasource e com isso devemos passar o path completo


## DOCKER

> O que é docker ?

- Docker é um serviço de gerenciamento de containers. A ideia do<br>
Docker é que os desenvovedores criem aplicativos que rodem <br>
ou sejam implantados em qualquer lugar facilmente, qualquer <br>
máquina física ou virtual e até mesmo na nuvem.

> A arquitetura Docker inclui alguns componentes principais, como segue:

> Docker Engine (O aplicativo que instalamos no nosso sistema operacional) 
-é a parte que vai gerenciar nossos containers.

> Cliente Docker 
- O cliente onde vamos executar os recursos como criar container, gerenciar container, outros recursos como volumes, redes do docker e etc...

> Docker Registry (Onde as imagens do docker ficam disponíveis) 
- O register oficial do docker docker-hub (https://hub.docker.com/), lá que iremos encontrar as imagens que iremos ultilizar em nosso container.Assim como também
conseguimos criar nossas imagens personalizadas e subir para o docker-hub, cria uma conta lá e se autentica.

> Docker Swarm (Forma de gerênciar clusters e containers) 
- É uma ferramenta que dá condições para criarmos clusters e gerenciar e manter esses clusters de containers do docker.

>Objetos na arquitetura do Docker

> Imagens
- É apartir das imagens que criamos os containes.

- Uma imagem inclui tudo que é necessário para executar o aplicativo: o código ou binário, dependências e quaisquer outros objetos necessários. A imagem é uma cópia, um "snapshot" de uma aplicação criada por vocÊ ou por outra pessoa.

> Containers 
- Processos a partir de uma execução de uma imagem, os containes eles são autos contidos quando eu subo um container, coloco em execução um container tudo que é necessário para que o serviço funcione tá tudo intrícico como. Volumes de dados, rede ... tudo que é necessário para que esse container funcione, quando falamos de volumes de dados seria o seguinte exemplo, se subimos um container de um banco de dados postgress todo conteúdo desse banco de dados vai está dento do container, se o container for apagado todo o volume de dados é deletado da mesma forma, então devemos ter cuidado quanto a isso.

- Criado a partir de uma IMAGEM, o CONTAINER é um processo em execução, com alguns recursos adicionais encapsulado para mantê-lo isolado do host e de outros containers.

> Volumes 
- Os volumes servem para compartilharmos informações entre n containers, então criamos uma estrutura de volume que é fora de todos os containers de forma global dentro do docker engine de uma forma que possamos compartilhar essa informação entre containers, o volume que o container cria intrícicamente é apenas acessível por ele mesmo, então a forma que podemos compartilhar informações entre containers é criando volumes no docker.

> Networks
- As redes servem para conseguirmos gerar comunicações entre containers então podemos criar redes nossas docker.

> Services
- Os serviços criamos quando queremos subir dois ou mais serviços com um único comando através do docker-compose ai conseguimos gerênciar de forma mais facilitada todos os serviços que precisamos para uma solução, ou seja se temos uma aplicação que usa dois, três banco de dados por exemplo, ultiliza postgres, redis e mongo, a própia aplicação em um container precisa de um cliente para gerênciar banco de dados então se cada coisa dessa for um container configurando tudo como serviço através de um único comando conseguimos gerênciar tudo ao mesmo tempo.

# DOCKERFILE

> Dockerfile 
- Precisamos ter a imagem para poder criar o container e colocar o container em execução, porém em muitos casos precisamos alterar algo na imagem, personalizar algo para poder nossa aplicação funcionar 100%, então quando precisamos contruir uma imagem usamos o arquivo 'dockerfile'.

- É um arquivo declarativo (um passo a passo), que tem como objetico construir uma imagem docker usando como base outra imagem (como ponto de partida).

```Dockerfile 
FROM node:14.15.4-alpine3.12 // IMAGEM DE PARTIDA

RUN apk add --no-cache bash // EXECUÇÃO DO GERENCIADO DE PACOTES DE DEPENDENCIA DO SO (LINUX ALPINE)

USER node // DEFINIÇÃO DO USUÁRIO QUE SERÁ O DONO DA IMAGEM

WORKDIR /home/node/app // DIRETÓRIO DE PARTIDA ONDE A APLICAÇÃO SERÁ INSTALADA
```
# Criando um dockerfile

- Na raiz do projeto deve ser criado um arquivo com o seguinte nome (Dockerfile)

```Dockerfile 
FROM <image>

RUN <command>

USER <user> 

WORKDIR <path>
```

- Quando um container sobe o primeiro recurso a entrar em execução é o entrypoint, com isso quando queremos colocar alguns scripts criamos o arquivo chamado (entrypoint.sh) dentro da pasta ./docker, como todo arquivo de script precisa de permisão para execução, vocẽ deve executar esse comando no terminal (chmod +x .docker/entrypoint.sh), senão fizer isso os scripts não executam.

```sh
#!/bin/bash

npm install 
npm run build
npx typeorm migration:run -d dist/databasa.providers.js
npm run start:dev
```

# DOCKER COMPOSE

> docker-compose

- O docker-compose é usado para executar vários containers como um único serviço. Por exemplo, suponha que você tenha um aplicativo que requer Postgres e Redis, você poderia criar um arquivo que iniciaria ambos os containers como um serviço sem a necessidade de iniciar cada um separadamente.
a partir disso ao executar a instrução 'docker-compose' iremos conseguir subir todos esses containers como um único serviço.

- Com isso podemos gerênciar esse serviço ultilizando, pass, stop, up, down, start, exec e etc ...

- O docker-composer vai se orientar com base em um arquivo 'yml' ou 'yaml', então criamos um arquivo 'docker-compose.yml' na raiz do projeto é nele que iremos incluir cada serviço que queremos subir ou seja cada container.

```yml
version: "3"

services:
  app:
    build: .
    entrypoint: .docker/entrypoint.sh
    container_name: cursonestjs-app
    ports:
      - "3001:3001"
    volumes:
      - .:/home/node/app
    depends_on:
      - db

  db:
    build: .docker/postgres
    container_name: cursonestjs-db
    restart: always
    tty: true
    ports:
      - "5432:5432"
    volumes:
      - .docker/dbdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=cursonestjs

  pgadmin:
    image: dpage/pgadmin4
    container_name: cursonestjs-pgadmin
    tty: true
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@admin.com
      - PGADMIN_DEFAULT_PASSWORD=admin
    ports:
      - "8000:80"
    depends_on:
      - db
```

- com o projeto irá ser executado dentro de um container, podemos fazer com que o typescript não fique observando algumas pastas, para fazer verificações de tipagens e tudo mais. depois do objeto compilerOptions.

```json
"include": ["src"],
"exclude": [
    "node_modules",
    "build",
    "dist",
    ".docker"
]
```


### MORE INFORMATION

# API Dev Training

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