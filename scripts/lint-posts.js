// @ts-nocheck
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { compile } from "mdsvex";
import { exit } from "node:process";
import { error, log } from "node:console";

/**
 * @typedef { import('../src/lib/types').PostMetadata } PostMetadata
 */

/**
 * @typedef Rule {Object}
 * @property name {string}
 * @property check {(fm: PostMetadata) => boolean}
 * @property message {string}
 */

const POSTS_DIR = "src/posts";

/**
 * Rules to lint against
 * @type Array<Rule>
 */
const rules = [
    {
        name: "title-required",
        check: (fm) => !!(fm.title && fm.title !== ""),
        message: "Title is required",
    },
    {
        name: "date-required",
        check: (fm) => !!fm.date,
        message: "Date is required",
    },
    {
        name: "date-format",
        check: (fm) => !!(fm.date && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fm.date)),
        message: "Date must be in M/D/YYYY format",
    },
    {
        name: "description-length",
        check: (fm) => !fm.description || fm.description.length <= 170,
        message:
            "Description, if included, cannot be longer than 170 characters.",
    },
    {
        name: "tags-array",
        check: (fm) => !fm.tags || Array.isArray(fm.tags),
        message: "Tags, if included, must be an array.",
    },
    {
        name: "tag-limit",
        check: (fm) => !fm.tags || fm.tags.length <= 5,
        message: "A post cannot have more than 5 tags.",
    },
    {
        name: "tag-no-all",
        check: (fm) => !fm.tags || !fm.tags?.some(t => t.toLowerCase() === "all"),
        message: '"All" is an invalid tag name.',
    },
];

export async function lint() {
    log(`\nLinting svx files in ${POSTS_DIR}...`);
    const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".svx"));
    let hasErrors = false;
    /** @type {string[]} */
    const errors = [];

    for (const file of files) {
        const content = readFileSync(join(POSTS_DIR, file), "utf-8");
        const {
            data: { fm },
        } = await compile(content);

        for (const rule of rules) {
            if (!rule.check(fm)) {
                errors.push(`Linting error in ${file}: ${rule.message}`);
                hasErrors = true;
            }
        }
    }

    return { passed: !hasErrors, errors };
}

if (process.env.STANDALONE_SCRIPT === "1") {
    const { passed, errors } = await lint();
    if (!passed) {
        error(errors.join("\n"));
        log("\n❌ Linting failed\n");
        exit(1);
    } else {
        log("👍 All posts linted successfully\n");
        exit(0);
    }
}
