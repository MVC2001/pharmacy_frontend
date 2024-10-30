<template>
    <div class="flex items-center min-h-screen overflow-hidden dark:bg-dark-header" style="background-color:#1b4f72">
        <div class="w-full max-w-screen-xl px-4 py-4 mx-auto sm:px-6">
            <div class="px-4 py-16 rounded-lg dark:bg-dark-body sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8" style="background-color:#d5dbdb">
                <div class="mx-auto max-w-max">
                    <main class="sm:flex">
                        <router-view />
                    </main>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>