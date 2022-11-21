
<template>
    <div>
        <headerTop> </headerTop>
        <profileDetails
        v-bind:userId="userId"
        v-bind:token="token"
        >
        </profileDetails>
        <footerBottom></footerBottom>
    </div>
</template>

<script>

import Header from '../components/Header'
import Footer from '../components/Footer'
import ProfileDetails from '../components/ProfileDetails.vue'

export default {
    name: 'Profile',
    data(){
        return {
            userId:this.$store.state.userId,
            token:this.$store.state.token
        }
    },
    components: {
        'headerTop': Header,
        'footerBottom': Footer,
        'profileDetails': ProfileDetails
    },
}

</script>