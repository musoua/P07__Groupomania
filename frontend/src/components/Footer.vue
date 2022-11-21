
<template>
    <div class="footer__bloc">
        <p>©️ Groupomania - {{ year }}</p>
    </div>
</template>

<script>

export default {
    name: 'Footer',
    data(){
        return {
            year: null,
        }
    }, 
    mounted(){
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        this.year = currentYear;
    }
}

</script>