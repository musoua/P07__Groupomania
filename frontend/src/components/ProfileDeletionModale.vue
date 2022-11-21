
<template>
    <div v-if="showDeletionModale" class="deletion">
        <div v-on:click="closeModale" class="deletion__overlay"></div>
        <div class="deletion__modale">
            <h3 class="deletion__modale__title">Êtes-vous sûr ?</h3>
            <p>La suppression du profil est irréversible !</p>
            <div v-on:click="deleteProfile" v-on:keydown.enter="deleteProfile" class="deletion__modale__btn validate_btn" role="button" tabindex="0">CONFIRMER</div>
            <div v-on:click="closeModale" v-on:keydown.enter="closeModale" class="deletion__modale__btn cancel_btn" role="button" tabindex="0">ANNULER</div>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name: 'ProfileDeletionModale',
    props: ['showDeletionModale', 'token', 'userId'],
    methods: {
        deleteProfile: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            };

            axios
            .delete(`http://localhost:3000/api/user/${this.userId}`, 
            config)
            .then(response => {
                this.$router.push('/')
                this.$store.commit('CLEAR_USER_ID')
                this.$store.commit('CLEAR_USER_ROLE')
                this.$store.commit('CLEAR_USER_TOKEN')
                localStorage.clear()
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