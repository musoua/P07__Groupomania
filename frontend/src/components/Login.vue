
<template>
    <div class="login">
        <form class="login__form">
            <h2>Connectez-vous</h2>
            <div>
                <p>Pas encore inscrit ?</p>
                <router-link to="/signup">Inscription</router-link>
            </div>
            <label class="login__form__label" for="email">Email</label>
            <input class="login__form__input" v-model="email" type="email" id="email" contenteditable spellcheck="false" required>
            <p class="error__message">{{ mailErrorMessage }}</p>

            <label class="login__form__label" for="password">Mot de passe <i v-on:click="showPassword" class="fa-solid fa-eye showPasswordIcon"></i></label>
            <input class="login__form__input" v-model="password" v-bind:type="passwordFieldType" id="password" contenteditable spellcheck="false" required>
            <p class="error__message">{{ passwordErrorMessage }}</p>

            <button class="submit-btn" v-on:click.prevent="logingIn">Connexion</button>
            <p>{{ apiResponseMessage }}</p>
        </form>
    </div>
</template>

<script>

    import axios from 'axios'

    export default {
        name: 'login',
        data(){
            return {
                email: '',
                password: '',
                userId: '',
                role: '',
                token: '',
                mailErrorMessage:'',
                passwordErrorMessage:'',
                apiResponseMessage: '',
                passwordFieldType:'password'
            }
        },
        methods: {
            showPassword: function(){
                if(this.passwordFieldType === 'password'){
                    this.passwordFieldType = 'text'
                } else if (this.passwordFieldType === 'text'){
                    this.passwordFieldType = 'password'
                }
            },
            logingIn: function(){

                if(this.email === '' || this.password === ''){
                    this.apiResponseMessage = "Veuillez vous identifier pour vous connecter"
                    this.mailErrorMessage = "Obligatoire"
                    this.passwordErrorMessage = "Obligatoire"
                } else {
                    axios
                    .post('http://localhost:3000/api/user/login', {
                        email: this.email,
                        password: this.password,
                    })
                    .then(response => {
                        this.$store.commit('SET_USER_ROLE', response.data.role)
                        this.$store.commit('SET_USER_ID', response.data.userId)
                        this.$store.commit('SET_USER_TOKEN', response.data.token)
                        this.$router.push('/fil')
                    })
                    .catch(error => {
                        this.apiResponseMessage = error.response.data.message
                    })
                }
            }
        }
    }

</script>