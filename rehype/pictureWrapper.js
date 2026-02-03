import { visit } from "unist-util-visit";

export const pictureWrapper = function () {
    return (tree) => {
        visit(tree, "element", (node, index, parent) => {
            if (node.tagName === "img") {
                const picture = {
                    type: "element",
                    tagName: "picture",
                    children: [node],
                    properties: {},
                };

                parent.children[index] = picture;
                parent.tagName = "figure";
                parent.properties.style =
                    "text-align: center; display: flex; flex-direction: column; gap: 0.4rem; max-width: 100dvw;";

                // Figure caption is determined by the presence of an <em> element directly under the figure
                if (
                    parent.children.length > 1 &&
                    parent.children[1].tagName === "em"
                ) {
                    const figcaption = {
                        type: "element",
                        tagName: "figcaption",
                        children: parent.children.slice(1),
                        properties: {},
                    };
                    parent.children = [picture, figcaption];
                }
            }
        });
    };
};
