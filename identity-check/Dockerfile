FROM node:20.18.0-alpine3.20 AS next-frontend

WORKDIR /app

COPY next-frontend/ ./next-frontend/
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_ARCHIPELS_APP_URL="https://app.archipels.io"
ENV NEXT_PUBLIC_INVITATION_LINK="eyJAdHlwZSI6ICJodHRwczovL2RpZGNvbW0ub3JnL291dC1vZi1iYW5kLzEuMS9pbnZpdGF0aW9uIiwgIkBpZCI6ICJiNmVlYmM4ZS1jMmI0LTRiYjQtODcyZC1iYTNjZTljYWI3ODciLCAibGFiZWwiOiAiSWRlbnRpdHkgdmVyaWZpY2F0aW9uIiwgImhhbmRzaGFrZV9wcm90b2NvbHMiOiBbImh0dHBzOi8vZGlkY29tbS5vcmcvZGlkZXhjaGFuZ2UvMS4wIl0sICJzZXJ2aWNlcyI6IFsiZGlkOnNvdjpFNjlHTHoycjZwTW00YXoyQlFSdlFYIl19"

# Use empty string locally?
ENV NEXT_PUBLIC_BASE_PATH="/identity-check"

RUN cd next-frontend && npm install && npm run build


FROM denoland/deno:2.1.0 AS identity-check
WORKDIR /app

COPY --from=next-frontend /app/next-frontend/out ./public


COPY deno.json ./
COPY deno.lock ./
COPY src/ ./src/

RUN deno cache src/index.ts

RUN chmod o+r $DENO_DIR/npm/registry.npmjs.org/proxy-from-env/1.1.0/package.json
RUN chmod o+r $DENO_DIR/npm/registry.npmjs.org/proxy-from-env/1.1.0/index.js

CMD [ "deno", "run", "start" ]