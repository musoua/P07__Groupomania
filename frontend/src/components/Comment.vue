
<template>
    <div class="comment__container">
        <div class="comment">
            <h4 class="comment__size">{{ username }} - {{ date }}</h4>
            <p class="comment__size">{{ content }}</p>
        </div>
        <div class="comment__config">
            <div class="comment__config__btn">
                <i v-bind:class="{ green : commentLiked }" v-on:click="likeComment" v-on:keydown.enter="likeComment" class="fa-solid fa-thumbs-up" role="button" tabindex="0"></i><span class="count">{{ likesCount + likes }}</span>
            </div>
            <div v-if="this.userId === this.loggedUserId || this.loggedUserRole === 'admin'|| this.loggedUserRole === 'modérateur' " v-on:click="deleteComment" v-on:keydown.enter="deleteComment" class="comment__config__btn" role="button" tabindex="0">
                <i class="fa-solid fa-trash"></i>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name:'Comment',
    data(){
        return {
            commentDeleted: false,
            commentLiked: false,
            likesCount:0
        }
    },
    props: ['id', 'content', 'postId', 'userId', 'username', 'date', 'likes', 'token', 'loggedUserRole', 'loggedUserId'],
    mounted(){
        this.checkLike()
    },
    updated(){
        this.checkLike()
    },
    methods: {
        deleteComment: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            axios
            .delete(`http://localhost:3000/api/post/${this.postId}/comment/${this.id}`, config)
            .then(response => {
                this.$emit('commentDeleted')
            })
            .catch(error => {
                console.log(error)
            })
        },
        likeComment: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            };
            const data = {};
            axios
            .post(`http://localhost:3000/api/post/comment/${this.id}/like`, data, config)
            .then(response => {
                this.likesCount += response.data.count
            })
            .catch(error => {
                console.log(error)
            })
        },
        checkLike: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            };
            axios
            .get(`http://localhost:3000/api/post/comment/${this.id}/like`, config)
            .then(response => {
                if(response.data.message === 'YES'){
                    this.commentLiked = true;
                } else {
                    this.commentLiked = false;
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
    }
}

</script>