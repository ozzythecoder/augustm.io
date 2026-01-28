FROM denoland/deno:2.6.6 AS build
WORKDIR /augustm.io
COPY package.json ./
RUN deno install
COPY . .
RUN deno task build

FROM caddy:2-alpine
COPY --from=build /augustm.io/build /var/www/augustm
