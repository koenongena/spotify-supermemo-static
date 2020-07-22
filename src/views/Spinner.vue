<template>
    <div>
        <div class="lds-dual-ring"></div>
        <p>{{message}}</p>
    </div>
</template>

<script>
    export default {
        name: "Spinner",
        props: {
            "message": {}
        }
    }
</script>

<style scoped>
    .lds-dual-ring {
        display: inline-block;
        width: 64px;
        height: 64px;
    }
    .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 46px;
        height: 46px;
        margin: 1px;
        border-radius: 50%;
        border: 5px solid #5c5c5c;
        border-color: #5c5c5c transparent #5c5c5c transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

</style>