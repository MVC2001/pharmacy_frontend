<template>
    <div class="sidebar">
    <MobileSidebar></MobileSidebar>

    <div class="hidden lg:flex lg:shrink-0">
        <div
            class="flex flex-col w-64 pt-5 pb-4 transition-all duration-200 ease-out border-r border-primary dark:border-gray-700 dark:bg-dark-header"
         style="background-color: #154360 ;">
            <div class="flex flex-col flex-1 h-0 scroller-x">
                <div class="flex items-center" style="margin-left:60px">
                    <a href="/dashboard"><img src="/images/logo.png" class="h-10 ml-4 mr-2 sm:hidden" /></a>
                    <a href="/dashboard"><img src="/images/logo.png" class="hidden h-10 ml-4 mr-2 sm:block" /></a>
                </div>
                <nav class="px-0 mt-6">
                    <AppNavigation />
                </nav>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'AppSidebar'
}
</script>

<script setup>

</script>