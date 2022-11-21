
<template>
    <div v-if="showDeletionModale" class="deletion">
        <div v-on:click="closeModale" class="deletion__overlay"></div>
        <div class="deletion__modale">
            <h3 class="deletion__modale__title">Êtes-vous sûr ?</h3>
            <p>La suppression du profil est irréversible !</p>
            <div v-on:click="deleteUser" v-on:keydown.enter="deleteUser" class="deletion__modale__btn validate_btn" role="button" tabindex="0">CONFIRMER</div>
            <div v-on:click="closeModale" v-on:keydown.enter="closeModale" class="deletion__modale__btn cancel_btn" role="button" tabindex="0">ANNULER</div>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name: 'UserDeletion',
    props: ['showDeletionModale', 'token', 'id'],
    methods: {
        deleteUser: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            };

            axios
            .delete(`http://localhost:3000/api/user/${this.id}`, 
            config)
            .then(response => {
                this.$emit('deleteUser')
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
