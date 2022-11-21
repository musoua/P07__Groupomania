
<template>
    <div role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1">
        <div v-if="showDeletionModale" class="deletion" role="document" >
            <div v-on:click="closeModale" class="deletion__overlay"></div>
            <div class="deletion__modale">
                <h3 class="deletion__modale__title">Êtes-vous sûr ?</h3>
                <div v-on:click="deletePost" v-on:keydown.enter="deletePost" tabindex="0" class="deletion__modale__btn validate_btn">CONFIRMER</div>
                <div v-on:click="closeModale" v-on:keydown.enter="closeModale" tabindex="0" class="deletion__modale__btn cancel_btn">ANNULER</div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name: 'Validation',
    props: ['showDeletionModale', 'token', 'id'],
    methods: {
        deletePost: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            };
            axios
            .delete(`http://localhost:3000/api/post/${this.id}`, config)
            .then(response => {
                this.$emit('updatePostList')
            })
            .catch(error => {
                console.log(error)
            })
        },
        closeModale: function(){
            this.$emit('closeModale')
        }
    }
}

</script>

<style scoped>