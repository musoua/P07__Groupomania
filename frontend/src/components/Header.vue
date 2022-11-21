
<template>
    <div class="header">
        <router-link to="/fil" class="header__logo__desktop__container">
            <img class="header__logo__desktop" src="../assets/icon-left-font-monochrome-white.png" alt="logo de Groupomania">
        </router-link>
        <router-link to="/fil" class="header__logo__mobile__container">
            <img class="header__logo__mobile" src="../assets/icon-white.png" alt="logo de Groupomania">
        </router-link>
        <router-link v-if="location !== '/profile'" to="/profile" role="button" tabindex=0 class="header__link">
            <i class="fa-solid fa-user"></i>
            <span class="tooltiptext">Profil</span>
        </router-link>
        <router-link v-if="location === '/profile' || location === '/utilisateurs'" to="/fil" role="button" tabindex=0 class="header__link">
            <i class="fa-solid fa-arrow-left"></i>
            <span class="tooltiptext">Retour</span>
        </router-link>
        <router-link v-if="location.includes('/utilisateur/') " to="/utilisateurs" role="button" tabindex=0 class="header__link">
            <i class="fa-solid fa-arrow-left"></i>
            <span class="tooltiptext">Retour</span>
        </router-link>
        <router-link v-if="location === '/fil' || location === '/profile'" to="/utilisateurs" role="button" tabindex="0" class="header__link">
            <i class="fa-solid fa-users"></i>
            <span class="tooltiptext">Utilisateurs</span>
        </router-link>
        <div v-on:click="logOut" v-on:keydown.enter="logOut" role="button" tabindex=0 class="header__link">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span class="tooltiptext">Déconnexion</span>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'header-top',
        data(){
            return {
                location: ''
            }
        },
        props: ['role', 'token', 'username'],
        
        methods: {
            logOut: function(){
                this.$router.push('/login')
                this.$store.commit('CLEAR_USER_ROLE')
                this.$store.commit('CLEAR_USER_ID')
                this.$store.commit('CLEAR_USER_TOKEN')
                localStorage.clear()
            }
        },
        created(){
            const currentLocation = window.location.pathname;
            this.location = currentLocation;
        }
    }

</script>
