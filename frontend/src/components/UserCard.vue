
<template>
    <div class="userCard">
        <div class="userCard__avatar__container">
            <img crossorigin="anonymous" class="userCard__avatar" v-bind:src="imageUrl" v-bind:alt="`photo de ${username}`">
        </div>
        <h3 class="userCard__username">{{ username }}</h3>
        <div class="userCard__role__bloc userCard__bloc">
            <button class="userCard__change__role__btn" v-if="loggedUserRole === 'admin' && this.role != 'admin'" v-on:click="changeRole">{{ role }}</button>
            <p class="userCard__role" v-if="loggedUserRole !== 'admin'" disabled>{{ role }}</p>
        </div>
        <router-link v-bind:to="`/utilisateur/${id}`" class="userCard__profile__link userCard__bloc">
            <i class="fa-solid fa-user userCard__icon"></i>
        </router-link>
        <div v-if="this.id != loggedUserId" class="userCard__contact__btn userCard__bloc">
            <a v-bind:href="`mailto:${this.email}`"><i class="fa-solid fa-envelope userCard__icon"></i></a>
        </div>
        <div class="userCard__delete__bloc userCard__bloc" v-if="loggedUserRole === 'admin' && loggedUserId !== this.id">
            <i v-on:click="deleteProfile" v-on:keydown.enter="deleteProfile" class="fa-solid fa-trash userCard__icon" role="button" tabindex="0"></i>
        </div>

        <userDeletionModale
        @deleteUser="updateUsersList" 
        v-bind:id="id"
        v-bind:showDeletionModale="showDeletionModale"
        v-bind:token="token"
        v-on:closeModale="closeModale()"
        >
        </userDeletionModale>
    </div>
</template>

<script>

import UserDeletionModale from './UserDeletionModale.vue'

import axios from 'axios'

export default {
    name:'UserCard',
    data(){
        return {
            showDeletionModale: false,
            apiResponseMessage: undefined
        }
    },
    components: {
        'userDeletionModale': UserDeletionModale
    },
    props: ['username', 'bio', 'email', 'id', 'role', 'imageUrl', 'loggedUserRole', 'loggedUserId', 'token'],
    methods: {
        changeRole: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            const data = {}
            axios
            .put(`http://localhost:3000/api/user/${this.id}/role`, data, config)
            .then(response => {
                this.apiResponseMessage = response.data.message
                this.$emit('updateUsersList')

                if(this.role === 'utilisateur'){
                    axios
                    .post('http://localhost:3000/api/post', {
                        title: 'nouveau modérateur',
                        content: `${this.username} est désormais modérateur, Il peut supprimer vos publications et commentaires.`
                    }, config)
                    .then(response => {
                        console.log("Rôle de modérateur attribué. Information postée.")              
                    })
                    .catch(error => {
                        console.log(error)
                    })
                } else if (this.role === 'modérateur'){
                    axios
                    .post('http://localhost:3000/api/post', {
                        title: 'modérateur suprimé',
                        content: `${this.username} n'est plus modérateur. Il ne peut plus supprimer vos publications et commentaires.`
                    }, config)
                    .then(response => {
                        console.log("Rôle de modérateur retiré. Information postée")
                        
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        deleteProfile: function(){
            this.showDeletionModale = true
        },
        closeModale: function(){
            this.showDeletionModale = false
        },
        updateUsersList: function(){
            this.$emit('updateUsersList')
        }  
    }
}

</script>