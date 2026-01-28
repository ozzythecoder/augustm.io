lint-svx:
    STANDALONE_SCRIPT=1 deno -A scripts/lint-posts.js

dev:
    just lint-svx
    deno task dev
    
build:
    docker build -t augustm-io .

run:
    docker run -p 8080:80 augustm-io
