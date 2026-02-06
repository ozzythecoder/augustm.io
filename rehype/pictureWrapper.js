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

                figure.children.push(imgContainer);

                // Figure caption is an `<em>` in the same containing block as the `<img>`
                const captionNode = parent.children.find(
                    (e) => e.tagName === "em",
                );
                if (captionNode) {
                    /** @type {Element} figCaption */
                    const figCaption = {
                        type: "element",
                        tagName: "figcaption",
                        properties: {},
                        children: captionNode.children,
                    };
                    figure.children.push(figCaption);
                }

                Object.assign(parent, figure);
                return CONTINUE;
            }
        });
    };
};
