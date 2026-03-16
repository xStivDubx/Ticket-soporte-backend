# Gestión de tickets

Este proyecto está construido con arquitectura MVC y lógica separada por módulos para mantener escalabilidad y mejor rendimiento. Cada responsabilidad (controladores, servicios, rutas y modelos) se organiza en módulos específicos para que sea más fácil mantener, escalar y optimizar.

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
