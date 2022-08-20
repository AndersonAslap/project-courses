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

