const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config = Object.freeze({
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  get mongoUri() {
    return required('MONGODB_URI');
  },
  corsOrigin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? '*',
});
