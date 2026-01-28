<script lang="ts">
    import { page } from "$app/state";

    const isActive = (url: string) => {
        return page.url.pathname === url;
    };

    const getActiveStyle = (url: string) => {
        return isActive(url) ? "text-surface-500 group-hover:text-" : "";
    };

    const links = [
        {
            href: "/",
            text: "Home",
        },
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

<nav class="mb-8">
    <ul class="flex justify-evenly items-center">
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
