
<template>
    <div>
        <div class="profile">
            <div class="profile__img__container">
                <img crossorigin="anonymous" class="profile__img" v-bind:src="imageUrl" v-bind:alt="`Photo de ${username}`">
            </div>
            <h3 class="profile__username">{{ username }}</h3>
            <p class="profile__bio">{{ bio }}</p>
            <div class="profile__management">
                <div v-on:click="editFormIsVisible = !editFormIsVisible, passwordFormIsVisible = false" v-on:keydown.enter="editFormIsVisible = !editFormIsVisible, passwordFormIsVisible = false" class="profile__management__btn" role="button" tabindex="0">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span class="tooltiptext">Modifier le profil</span>
                </div>
                <div v-on:click="passwordFormIsVisible = !passwordFormIsVisible, editFormIsVisible = false" v-on:keydown.enter="passwordFormIsVisible = !passwordFormIsVisible, editFormIsVisible = false" class="profile__management__btn" role="button" tabindex="0">
                    <i class="fa-solid fa-gear"></i>
                    <span class="tooltiptext">Changer le mot de passe</span>
                </div>
                <div v-on:click="deleteProfile" v-on:keydown.enter="deleteProfile" class="profile__management__btn" role="button" tabindex="0">
                    <i class="fa-solid fa-trash"></i>
                    <span class="tooltiptext">Supprimer le compte</span>
                </div>
            </div>
        </div>
        <editProfileForm
        @closeForm="closeEditForm"
        @reloadProfile="reloadProfile"
        v-if="editFormIsVisible"
        v-bind:username="username"
        v-bind:bio="bio"
        v-bind:imageUrl="imageUrl"
        v-bind:userId="userId"
        v-bind:token="token"
        >
        </editProfileForm>
        <changePasswordForm
        @closeForm="closePasswordForm"
        v-bind:userId="userId"
        v-bind:token="token"
        v-if="passwordFormIsVisible">
        </changePasswordForm>

        <profileDeletionModale
        v-bind:userId="userId"
        v-bind:showDeletionModale="showDeletionModale"
        v-bind:token="token"
        v-on:closeModale="closeModale"
        >
        </profileDeletionModale>
    </div>
</template>

<script>

import ProfileDeletionModale from './ProfileDeletionModale.vue'
import EditProfileForm from './EditProfile.vue'
import ChangePasswordForm from './ChangePasswordForm.vue'

import axios from 'axios'

export default {
    name: 'ProfileDetails',
    data(){
        return {
            username: '',
            imageUrl: '',
            bio: '', 
            showDeletionModale: false,
            editFormIsVisible:false,
            passwordFormIsVisible: false
        }
    },
    props: ['userId', 'token'],
    components: {
        'profileDeletionModale': ProfileDeletionModale,
        'editProfileForm': EditProfileForm,
        'changePasswordForm': ChangePasswordForm
    },
    mounted: function(){
        this.getProfile()
    },
    methods: {
        getProfile: function(){
            const config = {
                    headers: { Authorization: `Bearer ${this.token}` }
                }
            axios
            .get(`http://localhost:3000/api/user/${this.userId}`, config)
            .then(response => {
                this.username = response.data.username;
                this.imageUrl = response.data.imageUrl;
                this.bio = response.data.bio;
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
        closeEditForm: function(){
            this.editFormIsVisible = false
        },
        closePasswordForm: function(){
            this.passwordFormIsVisible = false
        },
        reloadProfile: function(){
            this.getProfile()
            this.editFormIsVisible = false
        }
    }
}

</script>