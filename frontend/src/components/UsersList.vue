
<template>
    <div>
        <ul class="usersList">
            <li v-bind:key="index" v-for="(user, index) in allUsers">
                <userCard
                @updateUsersList="updateUsersList" 
                v-bind:id="user.id"
                v-bind:username="user.username"
                v-bind:role="user.role"
                v-bind:email="user.email"
                v-bind:bio="user.bio"
                v-bind:imageUrl="user.imageUrl"
                
                v-bind:loggedUserRole="loggedUserRole"
                v-bind:loggedUserId="loggedUserId"
                v-bind:token="token">
                </userCard>
            </li>
        </ul>
    </div>
</template>

<script>

import UserCard from './UserCard.vue'

import axios from 'axios';

export default {
    name:'usersList',
    data(){
        return {
            allUsers: [],
            loggedUserRole: this.$store.state.role,
            loggedUserId: this.$store.state.userId,
            token: this.$store.state.token
        }
    },
    components: {
        'userCard': UserCard
    },
    methods: {
        getAllUsers: function(){
                 
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            axios
            .get('http://localhost:3000/api/user', config)
            .then(response => {
                for(let user of response.data){
                    this.allUsers.push(user)
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        updateUsersList: function(){
            this.allUsers = []
            this.getAllUsers()
        }
    },
    mounted(){
        this.getAllUsers()
    }
}

</script>