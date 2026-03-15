import 'dotenv/config'

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '3600',
}

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida en el archivo .env')
}

if (!env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definida en el archivo .env')
}

if (!env.JWT_EXPIRES_IN) {
  throw new Error('JWT_EXPIRES_IN no está definida en el archivo .env')
}