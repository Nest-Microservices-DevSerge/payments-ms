# Payments MicroService

## Development pasos

1. Clonar el proyecto
2. Crear un archivo `.env` basado en el archivo `.env.template`
3. Ejecutar migracion de prisma `npx prisma migrate dev`
4. Levantar el servidor de NATS

```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```

5. Levantar el proyecto con `npm run start:dev`
