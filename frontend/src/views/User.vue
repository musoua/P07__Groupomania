
<template>
    <div>
        <headerTop></headerTop>
        <div class="user__container">
            <h3 class="user__heading">Profile de {{ username }}</h3>
            <div class="user__img__container">
                <img crossorigin="anonymous" v-bind:src="this.imageUrl" v-bind:alt="`Photo de ${this.username}`">
            </div>
            <p class="user__bio">{{ bio }}</p>
            <a v-if="this.loggedUserId != this.userId" class="user__contact" v-bind:href="`mailto:${this.email}`">
                <i class="fa-solid fa-envelope"></i>
            </a>
        </div>
        <userPostFeed
        v-bind:userId="this.userId">
        </userPostFeed>
        <footerBottom></footerBottom>
    </div>
</template>

<script>

import Header from '../components/Header.vue'
import UserPostFeed from '../components/UserPostFeed'
import Footer from '../components/Footer.vue'

import axios from 'axios'

export default {
    name:'User',
    data(){
        return {
            userId: this.$route.params.id,
            token: this.$store.state.token,
            username: undefined,
            bio: undefined,
            email: undefined,
            imageUrl: undefined,
            loggedUserId: this.$store.state.userId,
        }
    },
    components: {
        'headerTop': Header,
        'userPostFeed': UserPostFeed,
        'footerBottom': Footer
    },
    methods: {
        getUser: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            axios
            .get(`http://localhost:3000/api/user/${this.userId}`, config)
            .then(response => {
                this.username = response.data.username;
                this.bio = response.data.bio;
                this.email = response.data.email;
                this.imageUrl = response.data.imageUrl;
            })
            .catch(error => {
                if(error.response.request.status === 404){
                    this.$router.push('/introuvable')
                } else {
                    console.log(error)
                }     
            })
        }
    },
    mounted(){
        this.getUser()
    }
}

</script>
