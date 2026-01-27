dev:
    deno task dev
    
build:
    docker build -t augustm-io .

run:
    docker run -p 8080:80 augustm-io
