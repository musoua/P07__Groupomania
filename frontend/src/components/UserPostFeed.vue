
<template>
    <div class="feed">
        <h3 class="feed__heading">{{ apiResponseMessage }}</h3>
        <ul>
            <li v-bind:key="index" v-for="(post, index) in userPosts">
                <post
                @updatePostList="updatePostList"   
                v-bind:id="post.id"
                v-bind:title="post.title"
                v-bind:content="post.content"
                v-bind:imageUrl="post.imageUrl"
                v-bind:username="post.username"
                v-bind:date="post.date"
                v-bind:likes="post.likes"
                v-bind:user_Id="post.user_Id"
                >
                </post>
            </li>
        </ul>
    </div>
</template>

<script>

import Post from './Post'

import axios from 'axios'

export default {
    name: 'UserPostFeed',
    data(){
        return {
            userPosts: [],
            token: this.$store.state.token,
            apiResponseMessage: undefined
        }
    },
    props: ['userId'],
    components: {
        'post': Post
    },
    methods: {
        getAllPosts: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            axios
            .get(`http://localhost:3000/api/post/user/${this.userId}`, config)
            .then(response => {
                if(response.data.message === 'Aucun posts !'){
                    this.apiResponseMessage = 'Aucune publication !'
                } else {
                    for (let post of response.data){
                        this.userPosts.push(post);
                        this.apiResponseMessage = 'Les publications :'
                    }
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        updatePostList: function(){
            this.userPosts = []
            this.getAllPosts()
        }
    },
    mounted(){
        this.getAllPosts()       
    },
}

</script>