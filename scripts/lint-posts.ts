import { join } from "@std/path";
import { compile } from "mdsvex";
import type { PostMetadata } from "../src/lib/types.ts";

interface Rule {
    name: string;
    check: (fm: PostMetadata) => boolean;
    message: string;
}

const POSTS_DIR = "src/posts";

const rules: Array<Rule> = [
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
        check: (fm) =>
            !fm.tags || !fm.tags?.some((t) => t.toLowerCase() === "all"),
        message: '"All" is an invalid tag name.',
    },
];

export async function lint() {
    console.log(`\nLinting svx files in ${POSTS_DIR}...`);
    const files = Array.from(Deno.readDirSync(POSTS_DIR))
        .filter((entry) => entry.isFile && entry.name.endsWith(".svx"))
        .map((entry) => entry.name);
    let hasErrors = false;
    const errors: Array<string> = [];

    for (const file of files) {
        const content = Deno.readTextFileSync(join(POSTS_DIR, file));
        const compiled = await compile(content);
        if (!compiled || !compiled.data || !compiled.data.fm) {
            console.error("Failed to compile svx file:", file);
            return { passed: false, errors: [""] };
        }
        const fm = compiled.data.fm as PostMetadata

        for (const rule of rules) {
            if (!rule.check(fm)) {
                errors.push(`Linting error in ${file}: ${rule.message}`);
                hasErrors = true;
            }
        }
    }

    return { passed: !hasErrors, errors };
}

if (Deno.env.get("STANDALONE_SCRIPT") === "1") {
    const { passed, errors } = await lint();
    if (!passed) {
        console.error(errors.join("\n"));
        console.log("\n❌ Linting failed\n");
        Deno.exit(1);
    } else {
        console.log("👍 All posts linted successfully\n");
        Deno.exit(0);
    }
}
