
<template>
    <div role="dialog" aria-labelledby="modaleHeading" aria-describedby="modaleForm" aria-modal="true" aria-hidden="true" tabindex="-1">
        <div v-if="showEditModale" class="modale__container" role="dialog">
            <div v-on:click="closeEditModale" class="edit__form__modale__overlay"></div>
            <div class="edit__form__modale">
                <div v-on:click="closeEditModale" v-on:keydown.enter="closeEditModale" class="close_btn" role="button" tabindex="1"><i class="fa-solid fa-xmark"></i></div>
                <h3 id="modaleHeading" class="edit__form__modale__heading">Modifiez votre publication</h3>
                <form id="modaleForm" class="edit__form">
                    <div class="edit__form__bloc">
                        <label class="edit__form__bloc__label" for="title">Titre :</label>
                        <input v-model="title" class="edit__form__bloc__input" type="text" id="title" contenteditable spellcheck="false" required>
                    </div>

                    <div class="edit__form__bloc">
                        <label class="edit__form__bloc__label" for="content">Message :</label>
                        <textarea v-model="content" class="edit__form__bloc__textarea" type="text" id="content" contenteditable spellcheck="false" required></textarea>
                    </div>
                    <div class="edit__form__bloc btn__bloc__container">
                        <div class="btn__bloc">
                            <label v-on:keydown.enter="keydownTrigger" tabindex=0 role="button" class="edit__form__bloc__file__label" for="file"><i class="fa-solid fa-image"></i></label>
                            <input v-on:change="previewFile" type="file" class="edit__form__bloc__file__input" id="file">
                        </div>
                        <div class="btn__bloc">
                            <button v-on:click.prevent="editPublication" v-on:keydown.prevent="editPublication" class="edit__form__bloc__submit-btn"><i class="fa-solid fa-paper-plane"></i></button>
                        </div>
                    </div>
                    <p class="fileMessage" v-if="this.file != ''">Fichier sélectionné : {{ this.file.name }}</p>
                    <p class="error__message">{{ apiResponseMessage }}</p> 
                </form>
            </div>
        </div>
    </div>

</template>

<script>

import axios from 'axios'

export default {
    name:'EditPost',
    data(){
        return {
            token:this.$store.state.token,
            apiResponseMessage:'',
            title:'',
            content:'',
            file:'',
            fileExtension: ''
        }
    },
    props: ['showEditModale', 'id'],
    methods: {
        closeEditModale: function(){
            this.$emit('closeEditModale')
        },
        keydownTrigger(){
            let fileBtnLabel = document.querySelector(".edit__form__bloc__file__label")
            let fileBtnInput = document.querySelector(".edit__form__bloc__file__input")
            fileBtnLabel.addEventListener("keypress", function(e){
                if(e.key === "Enter"){
                    fileBtnInput.click()
                }
            })
        },
        getPost: function(){

            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }
            axios
            .get(`http://localhost:3000/api/post/${this.id}`, config)
            .then(response => {
                this.title = response.data.title
                this.content = response.data.content
            })
            .catch(error => {
                console.log(error)
            })
        },
        previewFile(event){
            this.file = event.target.files[0]
            this.fileExtension = event.target.files[0].name.split('.').pop()
        },
        editPublication: function(){

            const config = {
                headers: { Authorization: `Bearer ${this.token}` }
            }

            if (this.file === ''){
                axios
                .put(`http://localhost:3000/api/post/${this.id}`, {
                    title: this.title,
                    content: this.content
                }, config)
                .then(response => {
                    this.$emit('closeEditModale')
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
                    .put(`http://localhost:3000/api/post/${this.id}`, postData, config)
                    .then(response => {
                        this.$emit('closeEditModale')
                        this.$emit('updatePostList')
                        this.apiResponseMessage = "";
                    })
                    .catch(error => {
                        this.apiResponseMessage = error.response.data.message
                    })
                } else {
                    this.apiResponseMessage = "Seuls les formats .jpg, .jpeg et .png sont autorisés !"
                }
            }
        },
    },
    mounted(){
        this.getPost()
    }
}

</script>