To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

## Comandos de base de datos

Para crear las tablas y sincronizar el esquema de la base de datos puedes usar estos comandos:

```sh
db:migrate  # ejecuta drizzle-kit migrate para aplicar migraciones y crear/actualizar tablas

db:pull     # ejecuta drizzle-kit introspect para sincronizar el esquema de la base de datos con drizzle
```

Ejecuta el comando desde la raíz del proyecto (`c:\proyecto-test\tickets-test`).
