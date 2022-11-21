
<template>
    <div v-if="showCommentModale" class="comment__modale__container">
        <div v-on:click="closeCommentModale" class="comment__modale__overlay"></div>
        <div class="comment__modale">
            <div v-on:click="closeCommentModale" v-on:keydown.enter="closeCommentModale" class="close_btn" role="button" tabindex="0"><i class="fa-solid fa-xmark"></i></div>
            <h3 class="comment__modale__form__heading">{{ heading }}</h3>
            <ul class="comment__modale__list">
                <li v-bind:key="index" v-for="(comment, index) in allComments">
                    <comment
                    v-on:commentDeleted="commentDeleted"
                    v-bind:id="comment.id"
                    v-bind:content="comment.content"
                    v-bind:postId="comment.post_id"
                    v-bind:username="comment.username"
                    v-bind:userId="comment.user_id"
                    v-bind:date="comment.date"
                    v-bind:likes="comment.likes"
                    v-bind:token="token"
                    v-bind:loggedUserRole="loggedUserRole"
                    v-bind:loggedUserId="loggedUserId">
                    </comment>
                </li>
            </ul>
            <hr>
            <form class="comment__modale__form">
                <label class="comment__modale__form__label" for="comment"></label>
                <input v-model="comment" class="comment__modale__form__input" type="text" id="comment" placeholder="Écrivez un commentaire ..." required>
                <button v-on:click.prevent="commentPost" class="comment__modale__btn"><i class="fa-solid fa-paper-plane"></i></button>
            </form>
            <p class="error__message">{{ apiResponseMessage }}</p>
        </div>
    </div>
</template>

<script>

import Comment from './Comment.vue'

import axios from 'axios'

export default {
    name:'CommentModale',
    data(){
        return {
            allComments: [],
            token: this.$store.state.token,
            loggedUserRole: this.$store.state.role,
            loggedUserId: this.$store.state.userId,
            heading: "Tous les commentaires",
            comment: '',
            commentsCounts: 0,
            apiResponseMessage:''
        }
    },
    components: {
        'comment': Comment
    },
    props: ['id', 'showCommentModale', 'compteurComment'],
    methods: {
        closeCommentModale: function(){
            this.$emit('closeCommentModale')
        },
        getAllComments: function(){

            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            axios
            .get(`http://localhost:3000/api/post/${this.id}/comment`, config)
            .then(response => {
                if(response.data.length === 0){
                    this.heading = "Aucun commentaire !";
                    this.$emit('commentsCount', response.data.length)
                } else if (response.data !== 0){
                    for (let comment of response.data){
                        this.allComments.push(comment)
                        this.heading = "Tous les commentaires :"
                    }
                    this.$emit('commentsCount', response.data.length)
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        commentPost: function(){
            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }

            axios
            .post(`http://localhost:3000/api/post/${this.id}/comment`, {
                content: this.comment
            }, config)
            .then(response => {
                this.apiResponseMessage = ''
                this.allComments = []
                this.comment = ''
                this.getAllComments()
            })
            .catch(error => {
                this.apiResponseMessage = error.response.data.message
            })
        },
        commentDeleted: function(){
            this.allComments = []
            this.getAllComments()
        }
    },
    mounted(){
        this.getAllComments()       
    },
}

</script>