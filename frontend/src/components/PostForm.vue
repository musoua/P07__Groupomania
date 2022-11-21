
<template>
    <div>
        <div class="post__form__container">
            <div class="post__form__header">
                <div class="avatar__container">
                    <img crossorigin="anonymous" class="avatar" v-bind:src="imageUrl" v-bind:alt="`Photo de ${username}`">
                </div>
                <h3 class="post__form__header__title">Quoi de neuf {{ username }} ?</h3>
                <div v-if="!isVisible" v-on:click="isVisible = !isVisible" v-on:keydown.enter="isVisible = !isVisible" class="post__form__header__btn" role="button" tabindex="0"><i class="fa-solid fa-pen"></i></div>
                <div v-if="isVisible" v-on:click="isVisible = !isVisible" v-on:keydown.enter="isVisible = !isVisible" class="post__form__header__btn" role="button" tabindex="0"><i class="fa-solid fa-xmark"></i></div>
            </div>
            <form v-if="isVisible" class="post__form">
                <div class="post__form__bloc">
                    <label class="post__form__bloc__label" for="title">Titre :</label>      
                    <input v-model="title" class="post__form__bloc__input" type="text" id="title" contenteditable spellcheck="false" required>
                </div>

                <div class="post__form__bloc">
                    <label class="post__form__bloc__label" for="content">Message :</label>
                    <textarea v-model="content" class="post__form__bloc__textarea" type="text" id="content" contenteditable spellcheck="false" required></textarea>
                </div>
                <div class="post__form__bloc btn__bloc__container">
                    <div class="btn__bloc">
                        <label v-on:keydown.enter="keydownTrigger" tabindex=0 role="button" class="post__form__bloc__file__label" for="file"><i class="fa-solid fa-image"></i></label>
                        <input v-on:change="previewFile" type="file" class="post__form__bloc__file__input" id="file">
                    </div>
                    <div class="btn__bloc">
                        <button v-on:click.prevent="postPublication" v-on:keydown.enter.prevent="postPublication" class="post__form__bloc__submit-btn"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
                <p class="fileMessage" v-if="this.file != ''">Fichier sélectionné : {{ this.file.name }}</p>
                <p class="error__message">{{ apiResponseMessage }}</p> 
            </form>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name: 'postForm',
    data(){
        return {
            isVisible: false,
            title: '',
            content: '',
            file: '',
            apiResponseMessage: '',
            fileExtension: ''
        }
    },
    props: ['username', 'imageUrl', 'token'],                           
    methods: {
        previewFile(event){
            this.file = event.target.files[0]
            this.fileExtension = event.target.files[0].name.split('.').pop()
        },
        keydownTrigger(){
            let fileBtnLabel = document.querySelector(".post__form__bloc__file__label")
            let fileBtnInput = document.querySelector(".post__form__bloc__file__input")
            fileBtnLabel.addEventListener("keypress", function(e){
                if(e.key === "Enter"){
                    fileBtnInput.click()
                }
            })
        },
        postPublication: function(){

            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }

            if (this.file === ''){
                axios
                .post('http://localhost:3000/api/post', {
                    title: this.title,
                    content: this.content
                }, config)
                .then(response => {
                    this.apiResponseMessage = ''
                    this.title = '';
                    this.content = '';
                    this.isVisible = false;
                    this.$emit('updatePostList')
                })
                .catch(error => {
                    this.apiResponseMessage = error.response.data.message
                })
            } else {
                let postData = new FormData();
                const post = JSON.stringify({title: this.title, content: this.content})
                const image = this.file
                postData.append('post', post)
                postData.append('image', image)
                if(this.fileExtension === 'jpeg' || this.fileExtension === 'jpg' || this.fileExtension === 'png'){
                    axios
                    .post('http://localhost:3000/api/post', postData, config)
                    .then(response => {
                        this.title = '';
                        this.content = '';
                        this.file = '';
                        this.fileExtension = '';
                        this.apiResponseMessage = ''
                        this.isVisible = false;
                        this.$emit('updatePostList')
                    })
                    .catch(error => {
                        this.apiResponseMessage = error.response.data.message
                    })
                } else {
                    this.apiResponseMessage = "Seuls les formats .jpg, .jpeg et .png sont autorisés !"
                }
            }
        }
    }
}

</script>