
<template>
    <div class="signup">
        <form class="signup__form">
            <h2>Inscrivez-vous</h2>

            <div>
                <p>Déjà inscrit ?</p>
                <router-link to="/login">Connexion</router-link>
            </div>
            <label class="signup__form__label" for="username">Nom d'utilisateur</label>
            <input class="signup__form__input" v-model="username" v-on:input="checkUsername" type="text" id="username" contenteditable spellcheck="false" required>
            <p class="error__message">{{ usernameErrorMessage }}</p>

            <label class="signup__form__label" for="email">Email</label>
            <input class="signup__form__input" v-model="email" v-on:input="checkEmail" type="email" id="email" contenteditable spellcheck="false" required>
            <p class="error__message">{{ mailErrorMessage }}</p>

            <label class="signup__form__label" for="password">Mot de passe <i v-on:click="showPassword" class="fa-solid fa-eye showPasswordIcon"></i></label>
            <input class="signup__form__input" v-model="password" v-on:input="checkPassword" v-bind:type="passwordFieldType" id="password" contenteditable spellcheck="false" required>
            <p class="error__message">{{ passwordErrorMessage }}</p>

            <label class="signup__form__label" for="passwordConfirm">Confirmez le mot de passe <i v-on:click="showPassword" class="fa-solid fa-eye showPasswordIcon"></i></label>
            <input class="signup__form__input" v-model="passwordConfirm" v-bind:type="passwordFieldType" id="passwordConfirm" contenteditable spellcheck="false" required>
            <p class="error__message">{{ passwordConfirmErrorMessage }}</p>

            <button class="submit-btn" v-on:click.prevent="signingUp">Inscription</button>

            <p>{{ apiResponseMessage }}</p>
        </form>
    </div>
</template>

<script>

    import axios from 'axios'

    export default {
        name: 'signup',
        data() {
            return {
                username: '',
                email: '',
                password: '',
                passwordConfirm: '',
                apiResponseMessage: '',
                usernameErrorMessage:'',
                mailErrorMessage:'',
                passwordErrorMessage:'',
                passwordConfirmErrorMessage:'',
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
            checkUsername: function(){
                const usernameRegex = /^[a-zéèôöîïûùü' -]{1,50}$/gi
                if(this.username.match(usernameRegex)){
                    this.usernameErrorMessage = ''
                } else {
                    this.usernameErrorMessage = `Vous ne pouvez utiliser que des lettres, espaces, - et ' "`
                }
            },
            checkEmail: function(){
                const mailRegex = /^[a-z0-9-._]+[@]{1}[a-z0-9.-_]+[.]{1}[a-z]{2,10}$/gi
                if(this.email.match(mailRegex)){
                    this.mailErrorMessage = ''
                } else {
                    this.mailErrorMessage = 'Format incorrect'
                }
            },
            checkPassword: function(){
                const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?!.* ).{8,16}$/
                if(this.password.match(passwordRegex)){
                    this.passwordErrorMessage = ''
                } else {
                    this.passwordErrorMessage = 'Utilisez des lettres majuscules, minuscules, des chiffres et au moins un symbole parmi *#&§!%+, pour 8 caractères minimum et 16 caractères maximum'
                }
            },
            signingUp: function(){

                if(this.username === '' || this.email === '' || this.password === '' || this.passwordConfirm === ''){
                    this.apiResponseMessage = "Veuillez renseigner tous les champs !"
                    this.usernameErrorMessage = "Obligatoire"
                    this.mailErrorMessage = "Obligatoire"
                    this.passwordErrorMessage = "Obligatoire"
                    this.passwordConfirmErrorMessage = "Obligatoire"
                } else {
                    axios
                    .post('http://localhost:3000/api/user/signup', {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        passwordConfirm: this.passwordConfirm   
                    })
                    .then(response => {
                        this.$router.push('/login')
                    })
                    .catch(error => {
                        this.apiResponseMessage = error.response.data.message
                    })              
                }
            }
        }
    }

</script>