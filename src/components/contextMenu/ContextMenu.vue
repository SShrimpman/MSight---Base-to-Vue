<template>
    <main class="context-menu-container" :style="{ left: mousePos.x + 'px', top: mousePos.y + 'px' }">
        <ul id="context-menu-list">
            <li class="context-menu-item" v-for="option in options" :key="option" @click="option.action">
                {{ option.displayText }}
            </li>
        </ul>
    </main>
</template>

<script>
    export default{
        props: ['mousePos', 'options'],
    }
</script>

<style>
.context-menu-container {
    position: absolute;
    width: auto;
    min-width: 120px;
    max-width: 280px;
    padding: 4px;
}

.context-menu-container::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    width: 5px;
    height: 5px;
    background: var(--primary-color);
    border: solid 1px white;
    border-radius: 100%;
    box-shadow: 0 0 3px 0px var(--primary-color-dark);
}
</style>