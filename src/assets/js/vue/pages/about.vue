<template>
    <div class="child">
        <p>アバウトのページ</p>
    </div>
</template>
<style scoped lang="scss">
    @mixin sp {
        @media print, screen and (max-width: 640px) {
            @content;
        }
    }
    p{
        font-size: 20px;
        font-weight: bold;
    }
</style>

<script>
export default {
    data: function() {
        return {

        }
    },
    computed: {

    },
    methods: {

    }
}
</script>