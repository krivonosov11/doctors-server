# Doctors API

REST API for managing doctors and patient appointments, built with **Express 5**, **MongoDB** and **Mongoose**.

## Features

- CRUD for doctors and appointments
- Appointments reference doctors and are returned with the doctor embedded (Mongoose virtual populate)
- Consistent JSON error format with field-level validation details
- Input hardening: ObjectId validation, protected fields stripped from request bodies, JSON body size limit
- Security headers (`helmet`) and configurable CORS
- Health check endpoint and graceful shutdown
- Integration tests against an in-memory MongoDB (`node:test` + `supertest`)

## Getting started

Requires Node.js 22.9+ and a MongoDB instance (local or Atlas).

```bash
npm install
cp .env.example .env   # then set MONGODB_URI
npm run dev            # auto-restarts on file changes
```

| Variable      | Required | Default | Description                             |
| ------------- | -------- | ------- | --------------------------------------- |
| `MONGODB_URI` | yes      | -       | MongoDB connection string               |
| `PORT`        | no       | `3000`  | HTTP port                               |
| `CORS_ORIGIN` | no       | `*`     | Comma-separated list of allowed origins |

## Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `npm start`      | Start the server                           |
| `npm run dev`    | Start with `--watch`                       |
| `npm test`       | Run integration tests (no DB setup needed) |
| `npm run lint`   | Lint with ESLint                           |
| `npm run format` | Format with Prettier                       |

## API

### Doctors

| Method   | Path           | Description            | Success |
| -------- | -------------- | ---------------------- | ------- |
| `GET`    | `/doctors`     | List doctors (by name) | 200     |
| `GET`    | `/doctors/:id` | Get a doctor           | 200     |
| `POST`   | `/doctors`     | Create a doctor        | 201     |
| `PUT`    | `/doctors/:id` | Update a doctor        | 200     |
| `DELETE` | `/doctors/:id` | Delete a doctor        | 204     |

```json
{
  "name": "Dr. Jane Smith",
  "description": "Experienced cardiologist",
  "specialization": "Cardiology",
  "age": 45,
  "img": "assets/images/d1.jpg"
}
```

### Appointments

| Method   | Path                | Description                      | Success |
| -------- | ------------------- | -------------------------------- | ------- |
| `GET`    | `/appointments`     | List appointments (newest first) | 200     |
| `GET`    | `/appointments/:id` | Get an appointment               | 200     |
| `POST`   | `/appointments`     | Create an appointment            | 201     |
| `PUT`    | `/appointments/:id` | Update an appointment            | 200     |
| `DELETE` | `/appointments/:id` | Delete an appointment            | 204     |

```json
{
  "name": "John Doe",
  "doctor_id": "6650c1f4e1b2a3c4d5e6f7a8",
  "gender": "male",
  "picker": "2026-12-01T10:00",
  "comment": "Regular check-up"
}
```

Responses include the related doctor under `doctor` (or `null` if it was deleted).

### Other

`GET /health` returns `200 {"status":"ok","db":true}` when the database is connected, `503` otherwise.

### Errors

All errors share one shape:

```json
{
  "error": {
    "message": "Validation failed",
    "details": { "age": "Path `age` is required." }
  }
}
```

| Status | When                                                           |
| ------ | -------------------------------------------------------------- |
| 400    | Validation error, malformed id, malformed JSON, unknown doctor |
| 404    | Resource or route not found                                    |
| 500    | Unexpected server error (details are logged, not returned)     |

## Project structure

```
src/
  app.js              Express app factory (used by server and tests)
  server.js           DB connection, HTTP server, graceful shutdown
  config/             Environment-based configuration
  models/             Mongoose schemas
  services/           Data access and business rules
  routes/             HTTP routing
  middleware/         Error handling, id validation, body sanitizing
  utils/              HttpError
test/                 Integration tests (in-memory MongoDB)
```
