
<template>
    <div class="form__container">
        <div v-on:click="closeForm" v-on:keydown.enter="closeForm" class="close_btn" role="button" tabindex="0"><i class="fa-solid fa-xmark"></i></div>
        <form class="password__change__form">
            <h3 class="password__change__form__heading">Changement du mot de passe</h3>
            <div class="password__change__form__bloc">
                <label class="password__change__form__bloc__label" for="password">Nouveau mot de passe <i v-on:click="showPassword" class="fa-solid fa-eye showPasswordIcon"></i></label>
                <input v-model="password" v-bind:type="passwordFieldType" class="password__change__form__bloc__input" id="password" required>
            </div>
            <div class="password__change__form__bloc">
                <label class="password__change__form__bloc__label" for="passwordConfirm">Confirmez le mot de passe <i v-on:click="showPassword" class="fa-solid fa-eye showPasswordIcon"></i></label>
                <input v-model="passwordConfirm" v-bind:type="passwordFieldType" class="password__change__form__bloc__input" id="passwordConfirm" required>
            </div>
            <p>{{ apiResponseMessage }}</p>
            <button v-on:click.prevent="changePassword" class="submit-btn">Valider</button>

        </form>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name: 'ChangePasswordForm',
    data(){
        return {
            password:'',
            passwordConfirm:'',
            apiResponseMessage:'',
            passwordFieldType: 'password'
        }
    },
    props: ['userId', 'token'],
    methods: {
        showPassword: function(){
                if(this.passwordFieldType === 'password'){
                    this.passwordFieldType = 'text'
                } else if (this.passwordFieldType === 'text'){
                    this.passwordFieldType = 'password'
                }
            },
        changePassword: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            axios
            .put(`http://localhost:3000/api/user/${this.userId}/password`, {
                password: this.password,
                passwordConfirm: this.passwordConfirm
            }, config)
            .then(response => {
                this.apiResponseMessage = response.data.message
                this.password = ''
                this.passwordConfirm = ''
            })
            .catch(error => {
                this.apiResponseMessage = error.response.data.message
            })
        },
        closeForm: function(){
            this.$emit('closeForm')
        }
    }
}

</script>