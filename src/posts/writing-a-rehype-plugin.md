---
title: Writing my first Rehype plugin
date: 02/03/2026
description: "Augmenting my personal site by adding a simple plugin to its markdown processor."
draft: true
tags:
    - tech
    - building in public
---

I'm a big fan of Markdown. A plain-text document standard that can be styled in whatever way you want while still retaining structure like headings, paragraphs, and bold and italics. This blog is written in .md files, which are converted to [Svelte](https://svelte.dev) components, and then to html. Broadly speaking, the process looks like this:

1. Write post content in `.md` files. Simple stuff.
1. A loader function in `+page.ts` grabs each `.md` file from the file system.
1. My markdown parser of choice, [mdsvex](https://mdsvex.pngwn.io/), reads the markdown and converts it to a Svelte component.
1. At build time, Svelte renders each post to a static .html file.
    - This step happens specifically because I'm using Svelte's static adapter, but several other options are available.

It's a simple process, but not without some hitches. Today I wanna talk about an accessibility issue I ran into with the Markdown parser, how I fixed it, and what I learned in the process. I'll walk through each piece of this, but I'm mainly gonna spend some time at step #3.

## Writing in Markdown

[Neovim](https://neovim.io) is my text editor of choice. At the moment, I'm a *little* burnt out on constantly configuring it, and I've been enjoying [Zed](https://zed.dev) for it's quality of life features and robust Vim engine. That being said, I always come back to Neovim when I need to jump quickly between writing and working in the terminal, and Markdown files are a natural part of this process.

All I need to do is write my content in plain text, with some specific formatting:

```markdown
## Writing in Markdown

[Neovim](https://neovim.io) is my text editor of choice. At the moment, I'm a *little* burnt out on constantly configuring it, and I've been enjoying [Zed](https://zed.dev) for it's quality of life features and robust Vim engine. That being said, I always come back to Neovim when I need to jump quickly between writing and working in the terminal, and Markdown files are a natural part of this process.

All I need to do is write my content in plain text, with some specific formatting:
```

And now I have a structured document, ready to send to a processor.

With a free, open source, unopinionated format like this, that's also easily ingested by code and terminal programs with no external dependencies... I can't see myself reaching for any Microsoft or Google product for word processing. I've written websites, emails, and PDFs on the terminal, and there are more terminal-based tools I've got my eye on in the future ([Typst](https://typst.app/) for type-setting, and [Presenterm](https://github.com/mfontanini/presenterm) for slideshow presentations).

## Loading Markdown

The very first step of the rendering pipeline is simple enough: load the file from disk. I keep my blog posts committed to the same repository as my website code:
```
src/
├── routes/
│   └── blog/
│       └── [slug]/
│           ├── +page.ts        # data fetching/processing
│           └── +page.svelte    # markup and client code
└── posts/
    ├── post.md
    └── another-post.md
```

The `[slug]` directory will resolve to whatever you might navigate to, and creates a parameter called "slug" that I can use in `+page.ts` and `+page.svelte`. I take that slug and use it as an identifier for the article to look up.

```typescript
// +page.ts
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
    const { slug } = params;
    const FILES_GLOB = "/src/posts/*";
    const files = import.meta.glob("/src/posts/*.{md,svx}");

    // search for both .md and .svx files
    const mdPath = FILES_GLOB.replace("*", slug) + ".md";
    const svxPath = FILES_GLOB.replace("*", slug) + ".svx";

    const mdFileExists = files[mdPath];
    const svxFileExists = files[svxPath];

    if (!mdFileExists && !svxFileExists) {
        error(404, {
            message: "Not Found",
        });
    }

    // prioritize svx files
    const postPath = !!svxFileExists ? svxPath : mdPath;

    const { metadata, default: Component } = await files[postPath]();

    return {
        metadata,
        Component,
    }; // this is sent to the $props().data field in +page.svelte
};
```

Mdsvex, the markdown preprocessor, has already done some nice work behind the scenes here. Importing the files gives a Promise that resolves to a Svelte module, without needing to call any intermediate steps. Mdsvex also supports its own `.svx` extension, allowing me to use Svelte components inside of markdown files, similarly to [MDX in React](https://mdxjs.org). I tend to not use this, but it was easy enough to add support for it.

The `Component` field is self-explanatory, but what does that metadata field contain? For that, I use a convention known as [frontmatter](https://www.markdownlang.com/advanced/frontmatter.html), which is just arbitrary YAML data at the top of the document, enclosed between two lines of three dashes. Mdsvex grabs this data automatically, and includes it in the module import.

```yaml
---
title: Writing my first Rehype plugin
date: 02/03/2026
description: "Augmenting my personal site by adding a simple plugin to its markdown processor."
tags:
    - tech
    - building in public
---
```

To keep type-safety throughout, I also created a type definition for the metadata:
```typescript
// types.ts
export interface PostMetadata extends Record<string, unknown> {
    title: string;
    date: string;
    description: string;
    tags?: Array<string>;
}

export interface Post {
    metadata: PostMetadata;
    default: () => Component;
}

// +page.ts
// ...
const files = import.meta.glob("/src/posts/*.{md,svx}") as Record<
    string,             // path & file name
    () => Promise<Post> // post module
>;
// ...
```

I would love to use this interface in my Markdown files, so that I could get an error in my editor if I forget to add one of the required fields, but I haven't looked into that yet. To tide me over, I wrote a small linting script to check all my files for missing metadata, and throw an error if I missed one.


```typescript
interface Rule {
    name: string;
    check: (fm: PostMetadata) => boolean;
    message: string;
}

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
    // ...etc
];

const POSTS_DIR = "src/posts";

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
        // fatal error
        if (!compiled || !compiled.data || !compiled.data.fm) {
            console.error("Failed to compile post:", file);
            return { passed: false, errors: [""] };
        }
        const fm = compiled.data.fm as PostMetadata

        for (const rule of rules) {
            // linting error
            if (!rule.check(fm)) {
                errors.push(`Linting error in ${file}: ${rule.message}`);
                hasErrors = true;
            }
        }
    }

    return { passed: !hasErrors, errors };
}
```

This is a bit hacky, but it allows me to keep the repo light and not need to introduce a database to my stack *just* yet--I know I'll need to go down that road eventually...

## Processing Markdown and the missing `<figure>`
So the good news is the processing has already happened! ...but that's also the bad news. While I have *decent* control of the CSS, the HTML of the page was generated way earlier, and it isn't exactly what I want it to be. While it may *look* good to a sighted person, a lackluster semantic structure could cause real issues for people using assistive technology like screen readers, or browser extensions to help with legibility.

The first issue I ran into had to do with images. Markdown has only one syntax for adding images:

```markdown
![Some descriptive text](https://assets.cdn.example.com/image.jpg)
This is a caption to accompany the image.
```

The processor (correctly) doesn't make assumptions about the semantic purpose of the image, so this becomes:

```html
<p>
    <img src="https://assets.cdn.example.com/image.jpg" alt="Some descriptive text" />
    This is a caption to accompany the image.
</p>
```

The W3C guidelines are pretty clear about how to semantically associate [informative images](https://www.w3.org/WAI/tutorials/images/informative/) and [complex images](https://www.w3.org/WAI/tutorials/images/complex/) with captions or other descriptive text. Nesting an image and some text in a `<p>` is fine in the simplest use cases. But when it comes to more complex data, we need to introduce the `<figure>` and `<figcaption>` elements. And this blog will definitely get into complex data. So I need a standardized way to change the html code above into this:

```html
<figure>
    <img src="https://assets.cdn.example.com/image.jpg" alt="Some descriptive text" />
    <figcaption>This is a caption to accompany the image.</figcaption>
</figure>
```

Now I *could* just write out this HTML as is. In theory I could just write every blog entry as raw markup. But I'm trying to build something for my problem-solving brain to get out of the way, so my writing brain can take over, so the less boilerplate, the better. 

But this means I gotta get into the guts of markdown processing, and man, I was not expecting this rabbit hole.

### Du Hast Mich

There is a multi-step process happening each time a .md file is transformed to a web page.
1. Parse the markdown from a file into a string
1. Transform the string into a Markdown Abstract Syntax Tree (MDAST) 
1. Apply plugin changes to the MDAST
1. Translate the MDAST into an HTML Abstract Syntax Tree (HAST) 
1. Apply plugin changes to the HAST 
1. Transform the HAST into stringified HTML, and send to the Svelte compiler to render.

The MDAST and HAST are based on [unist](https://github.com/syntax-tree/unist), a standardized spec for syntax trees. Simply put, it's a standard for how to break a structured language into a javascript object, and perform operations on it.

Mdsvex, so far, has abstracted all of this away, and even inserted its own steps:

4. Translate the MDAST into ~~an HTML~~ **a Svelte Abstract Syntax Tree ([SVAST](https://github.com/pngwn/MDsveX/tree/main/packages/svast))**
    - This is why I can use Svelte components in `.svx` files!
5. Put it all together into a HAST
6. Apply plugin changes to the HAST
7. Transform the HAST into stringified HTML, and send to the Svelte compiler to render.

(I gotta say a big thank you to [pwngwn](https://github.com/pngwn) and the mdsvex contributors, they have done some great work on this plugin. I had no idea how much was going on in here until I started picking it apart.)

While digging through the documentation, I learned that in the process I described above, steps 2-3 are handled by a transpiler called [Remark](https://remark.js.org/), and steps 4-5 are handled by [Rehype](https://github.com/rehypejs/rehype) (or steps 5-6, in the case of Mdsvex). These are UNIST-based parsers that handle transforming HTML/MD to their respective ASTs and back.

So how do I as an end user hook into this process? Well, as a svelte plugin, Mdsvex exposes a few fields for configuration, and one of them looks like exactly what I need:

```javascript
// svelte.config.js
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // ...
    preprocess: [
        mdsvex({
            extensions: [".md", ".svx"],
            remarkPlugins: [],
            rehypePlugins: [], // 🤔
        }),
    ],
    // ...
};
```

[Looking at the docs](https://mdsvex.pngwn.io/docs#remarkplugins--rehypeplugins), it looks like all I need to do is pass in an array of plugins. There's a rich ecosystem of Re(mark/hype) plugins to dig into, and even [one that seems to fit my needs](https://github.com/josestg/rehype-figure). But I've been getting wary of third-party dependencies lately, [due to reasons](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem), and Mdsvex is already bringing in more than I expected under the hood. Why not be a good developer and write my own plugin?

Yes, this is why I never get anything done.

### Writing the plugin

And finally, the reason for this blog post.

Looking at some example Rehype plugins, they all have one thing in common: a utility function called `visit`. This function comes from syntax-tree, the same maintainers as `unist`. I know I didn't want anymore third-party deps, but looking at the source code, it is so minimal that I feel okay installing it. [(The entire package is a single function in one file, and 90% of that file is just JSDoc type declarations.)](https://github.com/syntax-tree/unist-util-visit/blob/main/lib/index.js)

The `visit` function takes the AST, the type of node to check, and a callback function. It then walks down the syntax tree and runs a callback function on each node. A Rehype plugin is just a higher oder function that feeds the tree to its curried function. So by adding this to my svelte config:

```javascript
import { mdsvex } from 'mdsvex';
import { visit } from 'unist-utils-visit';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // ...
    preprocess: [
        mdsvex({
            rehypePlugins: [
                function () {
                    return (tree) => {
                        visit(tree, "element", () => console.log("Visited node"))
                    }
                }
            ],
        }),
    ],
    // ...
};
```

My console reads:
```sh
Visited node
Visited node
Visited node
Visited node
# and so on for every node in the HAST
```

Nice! Now that I know how the `visit` function works, it's time to revisit my criteria in a fresh file:

```javascript
export function figureWrapper() {
    return (tree) => {
        visit(tree, "element", () => {
            // - Find each `<img>` tag
            // - Wrap it in a `<figure>`
            // - If there's a caption immediately next to the `<img>`,
            //     - wrap the caption in a `<figcaption>`
            //     - include the caption in the `<figure>`
        })
    }
}
```

I usually prefer to work in Typescript, but I don't wanna deal with a transpile step just for this plugin, so I'll be using JSDoc and importing some type definitions from the `hast` package.
```javascript
/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

/**
 * @returns {(tree: Root) => void}
 */
export function figureWrapper() {
```

**1. Find each `<img>` tag**

The callback function (or "visitor") in `visit` receives three arguments - the node being visited, the index of the node, and the node's parent. I don't need the index, so I'll replace that parameter with an underscore.

```javascript
visit(tree, "element", (node, _, parent) => { })
```


The whole `unist` ecosystem utilizes some great type definitions, so `node` is correctly narrowed down to be type `Element`, which represents an HTML element on the syntax tree. This gives some nice autocomplete, and allows me to see the `tagName` property. So now we

```javascript
visit(tree, "element", (node, _, parent) => {
    if (node.tagName === "img") {
        // figcaption stuff
    }
})
```

**2. Wrap each `<img>` tag in a `<figure>`**

The `unist-utils-visitor` documentation tells us that the visitor function can transform both the `node` and the `parent` in place. Considering that each node is just one item of a `Element[]`, and the document will be rendered in array order, I wanna make sure that the current node is the one being mutated, or my image will move to a different place in the document.

So the first step is to create a few new `Element`s:

```javascript
visit(tree, "element", (node, _, parent) => {
    if (node.tagName === "img") {
        /** @type {Element} figure */
        const figure = {
            type: "element",
            tagName: "figure",
            children: [],
            properties: {},
        }

        /** @type {Element} imgContainer */
        const imgContainer = {
            type: "element",
            tagName: "div",
            children: [node],
            properties: {
                class: "img-container",
            },
        };

        figure.children = [imgContainer]

        parent = figure;
    }
})
```

- `figure` is the semantic HTML that will capture both the image and its caption.
- `imgContainer` is a `<div>` element, and the direct parent of `node`, which is our `<img>` tag. It's really just a vehicle for the `img-container` CSS class, which I'm using to constrain the image size and give it a nice drop shadow.

Finally, I set the parent node equal to `figure`. So now, the rendered html should look like this:

```html
<figure>
    <div class="img-container">
        <img src="https://assets.cdn.example.com/image.jpg" alt="Some descriptive text" />
    </div>
</figure>
```

...right?

**2b. JS shenanigans**

Nope. Looking at my HTML, absolutely nothing has changed.

Turns out that last line, `parent = figure`, does nothing! And neither does `parent = { ...figure }`. What the hell!

What makes it even more confounding is that my original approach before writing this article, which I thought was more naive, *does* work:

```javascript
parent.tagName = "figure"
parent.children = figure.children
```

I had a feeling this was something about how Javascript handles object references, and I was right! 

`parent`, in this callback function, is a reference to the original object, which in another language would be exactly what I want. But reassigning the variable itself just mutates the *local reference*, while reassigning its *properties* mutates the original object.

🫩

Okay. Sure man, fuck it, why not. Let's do that. Let's just write our whole stack on this ridiculous language.

Thankfully, in order to not have to reassign every variable one by one, I can just do `Object.assign(parent, figure)`. And for completeness's sake, I'll explicitly return the plugin's `CONTINUE` directive.

The plugin now looks like this:

```javascript
import { visit, CONTINUE } from "unist-util-visit";

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

/**
 * @returns {(tree: Root) => void}
 */
export const pictureWrapper = function () {
    return (tree) => {
        visit(tree, "element", (node, _, parent) => {
            if (node.tagName === "img") {
                /** @type {Element} figure */
                const figure = {
                    type: "element",
                    tagName: "figure",
                    children: [],
                    properties: {},
                }

                /** @type {Element} imgContainer */
                const imgContainer = {
                    type: "element",
                    tagName: "div",
                    children: [node],
                    properties: {
                        class: "img-container",
                    },
                };

                figure.children = [imgContainer]

                // todo: figcaption

                Object.assign(parent, figure)
                return CONTINUE;
            }
        })
    }
}
```

**3. Wrap any existing caption**

That's the end of the (big) gotchas. The biggest chunk of the plugin is done, and the only remaining part is nesting the caption as well.

So how do I wanna determine what the caption is? The [`rehype-figure`](https://github.com/Microflash/rehype-figure) plugin just uses the alt text as the caption, but they even admit that that's an "escape hatch." I personally would just call it wrong - the whole point here is to enhance the semantic structure, so let's not ignore the semantics yeah?

Markdown doesn't have a dedicated syntax for image captions, so for now, I'm going to look for the content of an `<em>` tag, immediately following the image. We don't have a dedicated API for sibling nodes, so I'm just going to check for the length of the parent's `children` property.

```javascript
if (parent.children.length > 1) {
    const contentNode = parent.children[1]
    // ... do stuff
}
```

But this is one of the *small* gotchas. I couldn't get the results I wanted out of this, so I went ahead and took a look at `parent.children` in a console, and...

```json
[
  {
  // ok here's the image...
    type: "element",
    tagName: "img",
    properties: {
      src: "https://assets.cdn.example.com/image.jpg",
      alt: "Some descriptive text"
    },
    children: [],
    position: {
      start: { line: 36, column: 1, offset: 5144 },
      end: { line: 36, column: 147, offset: 5290 }
    }
  },
  {
  // who is this????
    type: "text",
    value: " ",
    position: {
      start: { line: 36, column: 147, offset: 5290 },
      end: { line: 36, column: 148, offset: 5291 }
    }
  },
  {
  // this is what I was looking for!
    type: "element",
    tagName: "em",
    properties: {},
    children: [
      {
        type: "text",
        value: "This is a caption to accompany the image.",
        position: { start: [Object], end: [Object] }
      }
    ],
    position: {
      start: { line: 36, column: 148, offset: 5291 },
      end: { line: 36, column: 199, offset: 5342 }
    }
  }
]
```

There is a *single space* of text between the `<img>` and the `<em>` tag underneath it. I think this just happens because of the line break in the Markdown text:

```markdown
![Some descriptive text](https://assets.cdn.example.com/image.jpg) !HERE!
_This is a caption to accompany the image._
```

At this point I realized it was probably better to just grab the specific node, rather than do magic-number indexing.

```javascript
if (
        parent.children.length > 1 &&
        parent.children.some(c => c.tagName === "em")
   ) {
    const contentNode = parent.children.find(e => e.tagName === "em")
    // ... do stuff
}
```

Finally, I build the `<figcaption>` element and add it to the children of the `<figure>`:

```javascript
if (
        parent.children.length > 1 &&
        parent.children.some(c => c.tagName === "em")
   ) {
    const figCaption = {
        type: "element",
        tagName: "figcaption",
        children: parent.children.find(e => e.tagName === "em"),
        properties: {},
    };
    figure.children.push(figCaption);
}
```

## The complete Rehype plugin

```javascript
// pictureWrapper.js

import { visit, CONTINUE } from "unist-util-visit";

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

/**
 * @returns {(tree: Root) => void}
 */
export const pictureWrapper = function() {
    return (tree) => {
        visit(tree, "element", (node, _, parent) => {
            if (node.tagName === "img") {
                /** @type {Element} figure */
                const figure = {
                    ...parent,
                    type: "element",
                    tagName: "figure",
                    children: [],
                };

                /** @type {Element} imgContainer */
                const imgContainer = {
                    type: "element",
                    tagName: "div",
                    children: [node],
                    properties: {
                        class: "img-container",
                    },
                };

                figure.children = [imgContainer];

                // Figure caption is an `<em>` in the same containing block as the `<img>`
                if (
                    parent.children.length > 1 &&
                    parent.children.some(c => c.tagName === "em")
                ) {
                    const captionNode = parent.children.find(e => e.tagName === "em")
                    const figCaption = {
                        type: "element",
                        tagName: "figcaption",
                        children: captionNode,
                        properties: {},
                    };
                    figure.children.push(figCaption);
                }

                Object.assign(parent, figure);
                return CONTINUE;
            }
        });
    };
};
```

Just stuff it in the config file and I'm done!

```javascript
// svelte.config.js

import { mdsvex } from "mdsvex";
import { pictureWrapper } from "./rehype/pictureWrapper.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // ...
    preprocess: [
        mdsvex({
            extensions: [".md", ".svx"],
            rehypePlugins: [pictureWrapper],
        }),
    ],
    extensions: [".svelte", ".svx", ".md"],
};
```

## Plugin improvements

This solved my problem in the fastest way possible, and also gave me a good foundation for understanding ASTs and writing unist plugins. But I can already see the issues I'd wanna address further down the line.

### Better Structure

I'm making some pretty naïve assumptions about my markdown. For instance, the following cases would have some results I don't want:
```markdown
Maybe I'd like to put an inline ![logo](logo.png) image here? _Maybe?_
```
```html
<figure>
    <div class="img-container">
        <img src="logo.png" alt="logo" />
    </div>
    <figcaption>Maybe?</figcaption>
</figure>
```

The plugin _only_ grabs the image and the italicized block, discarding everything else. If I ever wanna use

### 
