<script lang="ts">
    import { page } from "$app/state";

    const isActive = (url: string) => {
        return page.url.pathname === url;
    };

    const getActiveStyle = (url: string) => {
        return isActive(url) ? "text-primary-200" : "";
    };

    const links = [
        {
            href: "/about",
            text: "About",
        },
        {
            href: "/projects",
            text: "Projects",
        },
        {
            href: "/blog",
            text: "Blog",
        },
    ];
</script>

<nav class="mb-8 flex justify-between">
    <a data-active={isActive("/")} href="/" class="h4 data-[active='true']:text-primary-200 hover:text-primary-200 hover:underline">augustm</a>
    <ul class="flex justify-between gap-8 items-center">
        {#each links as link}
            <li class="text-lg group">
                <a
                    class={`group-hover:underline ${getActiveStyle(link.href)}`}
                    href={link.href}>{link.text}</a
                >
            </li>
        {/each}
    </ul>
</nav>
