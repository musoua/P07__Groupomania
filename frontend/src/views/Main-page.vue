
<template>
    <div>
        <headerTop> </headerTop>
        <postFeed
        v-bind:userId="userId"
        v-bind:role="role"
        v-bind:imageUrl="imageUrl"
        v-bind:username="username"
        > </postFeed>
        <footerBottom> </footerBottom>
    </div>

</template>

<script>

    import axios from 'axios'

    import Header from '../components/Header'
    import PostFeed from '../components/PostFeed'
    import Footer from '../components/Footer.vue'

    export default {
        name: 'MainPage',
        data(){
            return {
                userId: this.$store.state.userId,
                role: this.$store.state.role,
                token: this.$store.state.token,
                username:undefined,
                imageUrl:undefined
            }
        },
        components: {
            'headerTop' : Header,
            'postFeed' : PostFeed,
            'footerBottom' : Footer
        },
        mounted: function(){
            this.getOneUser()
        },
        methods: {
            getOneUser: function(){

                const config = {
                    headers: { Authorization: `Bearer ${this.token}` }
                }

                axios
                .get(`http://localhost:3000/api/user/${this.userId}`, config)
                .then(response => {
                    this.username = response.data.username
                    this.imageUrl = response.data.imageUrl
                })
                .catch(error => {
                    console.log(error)
                })
            }
        }
    }

</script>