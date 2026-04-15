<script lang="ts">
    import { getRandomElement } from "$src/lib/utils/random";

    const ANIMATION_DURATION = 1000;
    const TRANSITION_DURATION = 150;
    const transitionClass = "duration-150"; // should be same as TRANSITION_DURATION

    let titleNode: HTMLHeadingElement;
    const titleBaseStyles =
        "h1 whitespace-nowrap text-5xl sm:text-8xl transition-opacity transition-filter ease-in-out " +
        transitionClass;
    const fontStyles = [
        "font-mono",
        "font-sans",
        "font-base",
        "font-serif",
        "font-code",
        "font-cursive",
    ];
    const fontColors = [
        "text-primary-500",
        "text-success-600-400",
        "text-secondary-500",
        "text-error-600",
        "text-fuchsia-500",
        "text-amber-600",
    ];

    const fontAnimationEffect = () => {
        const transitionInterval = setInterval(() => {
            // randomize each element
            const italic = Math.random() > 0.5 ? "italic" : "",
                weight = Math.random() > 0.5 ? "font-semibold" : "",
                upper = Math.random() > 0.5 ? "uppercase" : "";
            const currentFont = titleNode.classList
                .toString()
                .split(" ")
                .find((e) => fontStyles.includes(e));
            const currentColor = titleNode.classList
                .toString()
                .split(" ")
                .find((e) => fontColors.includes(e));
            const newFont = getRandomElement(fontStyles, true, currentFont),
                newColor = getRandomElement(fontColors, true, currentColor);

            titleNode.classList.add("opacity-0", "blur");

            setTimeout(() => {
                titleNode.className = [
                    titleBaseStyles,
                    newFont === "font-cursive"
                        ? "font-cursive capitalize! -pl-6" // all-caps cursive looks like shit!
                        : newFont,
                    newColor,
                    italic,
                    weight,
                    upper,
                ].join(" ");

                titleNode.classList.remove("opacity-0", "blur");
            }, TRANSITION_DURATION);
        }, ANIMATION_DURATION);

        return () => clearInterval(transitionInterval);
    };

    $effect(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? () => {} // respect reduced motion with empty callback
            : fontAnimationEffect,
    );
</script>

<div>
    <h1 bind:this={titleNode} class={titleBaseStyles}>august m</h1>
</div>
