
<template>
    <div>
        <postForm
            @updatePostList="updatePostList" 
            v-bind:username="username" 
            v-bind:imageUrl="imageUrl"
            v-bind:token="token"
            >
        </postForm>
        <div class="feed">
            <h3 v-if="apiResponseMessage !== ''" class="feed__heading">{{ apiResponseMessage }}</h3>
            <ul>
                <li v-bind:key="index" v-for="(post, index) in allPosts">
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
    </div>
</template>

<script>

import Post from './Post'
import PostForm from './PostForm.vue'

import axios from 'axios'

export default {
    name: 'PostFeed',
    data(){
        return {
            allPosts: [],
            apiResponseMessage: '',
            token: this.$store.state.token
        }
    },
    props:['userId', 'imageUrl', 'username'],
    components: {
        'post': Post,
        'postForm': PostForm
    },
    methods: {
        getAllPosts: function(){
            
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            axios
            .get('http://localhost:3000/api/post', config)
            .then(response => {
                if(response.data.message === 'Aucun posts !'){
                    this.apiResponseMessage = 'Soyez le premier à publier quelque chose !'
                } else if (response.data.message !== 'Aucun posts !'){
                    this.apiResponseMessage = ''
                    for (let post of response.data){
                        this.allPosts.push(post)
                    }
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        updatePostList: function(){
            this.allPosts = []
            this.getAllPosts()
        }
    },
    mounted(){
        this.getAllPosts()
    }
}

</script>