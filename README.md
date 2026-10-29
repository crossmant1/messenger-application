# Messenger

A local web messenger with account registration, direct chats, group chats, stored message history, and Socket.IO live updates.

## Prerequisites

- Node.js **20.19+ or 22.12+** and npm. These versions meet the Vite 7 runtime requirement used by the client.
- MongoDB **7.0** running locally, or a compatible MongoDB server reachable from this machine.
- Git, to clone the repository.

## Clone and install

```sh
git clone https://github.com/crossmant1/messenger-application.git
cd messenger-application
npm ci
cd client
npm ci
cd ..
```

Install dependencies in both the root (backend) and `client` (React frontend) directories. The committed lockfiles make `npm ci` repeatable.

## Configure local environment

Copy the safe example and edit `.env` for your local MongoDB address:

```sh
cp .env.example .env
```

Example `.env.example` (contains no credentials):

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/messenger
JWT_SECRET=
```

**JWT configuration:** Generate `JWT_SECRET`, a private 64-character hex secret with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Never commit a generated secret or a real MongoDB connection string.

## Start the application

Start MongoDB separately using the installation method for your operating system. Verify that it is listening at the URI configured above.

In one terminal, from the repository root, start the backend:

```sh
node --env-file=.env server/server.js
```

The current source does not automatically load `.env`.

In another terminal, start the React development server:

```sh
cd client
npm run dev
```

Open <http://127.0.0.1:5173>. Vite proxies API requests to the backend at `127.0.0.1:3000`. The backend binds to loopback, so it is intended for local use.

## Checks

### API smoke/integration check

With MongoDB and the backend already running, run:

```sh
node --test server/health.test.js
```

This checks that `GET /api/health` returns HTTP 200 and JSON. It is a narrow smoke check, just ensuring the backend is capable of receving requests. 

### Frontend checks

```sh
npm --prefix client run lint
npm --prefix client run build
```

The build creates `client/dist/`, which verifies compilation only. 

## Troubleshooting

- **“MongoDB connection failed” / server selection timeout:** Confirm MongoDB is running and `MONGODB_URI` points to the correct host, port, and database. The default URI uses port `27018`; a standard local MongoDB install commonly uses `27017`, so set `MONGODB_URI` to match your service. Check readiness at <http://127.0.0.1:3000/api/ready> after the API starts.
- **Port 3000 is occupied:** Stop the process using port 3000 or change the backend listen port in `server/server.js`. The API and frontend proxy configuration must agree if you change it.
- **Port 5173 is occupied:** Stop the other process or start Vite on another port with `npm run dev -- --port 5174`. If the port change prevents the API proxy from reaching the backend, review `client/vite.config.js`.
- **`npm ci` or native bcrypt install fails:** Confirm the Node.js version and platform build prerequisites, then retry `npm ci` in the directory that failed (root or `client`). Do not delete lockfiles to work around dependency installation errors.
- **HTTP 401 from chat routes or live socket:** Log in again and use the newly issued bearer token, as access tokens expire after 15 minutes.

## Known limitations

- This is a local development release; there is no hosted deployment destination for the assignment.
- The automated test suite is incomplete. Only the health endpoint has a smoke test; no other tests exist. 
- Message and chat list endpoints are limited to the last 100 messages. 

## Release and deployment procedure

The required release for this assignment is that it can be locally run from a clone. 

1. Clone the repository and install dependencies with `npm ci` in the root and `client` directories.
2. Install/run a local MongoDB service, create a private `.env` from `.env.example`, and set its `MONGODB_URI` to that service.
3. Before a release, configure JWT signing from a private environment secret in the source, and complete the missing automated and acceptance checks listed above.
4. Start the backend and frontend using the commands in “Start the application.” Verify `GET /api/health`, then register two or more test accounts and manually check direct messaging, group messaging, persisted history, access denial, and live delivery.
