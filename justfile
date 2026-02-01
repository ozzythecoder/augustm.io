lint-svx:
    STANDALONE_SCRIPT=1 deno -A scripts/lint-posts.ts

check:
    deno task check

dev: lint-svx check
    deno task dev

build: lint-svx check
    deno task build

run: build
    deno task preview
