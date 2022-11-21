
<template>
    <div>
        <headerTop></headerTop>
        <usersList></usersList>
        <footerBottom></footerBottom>
    </div>
</template>

<script>

import Header from '../components/Header'
import UsersList from '../components/UsersList.vue'
import Footer from '../components/Footer'

export default {
    name: 'Users',
    components: {
        'headerTop': Header,
        'usersList': UsersList,
        'footerBottom': Footer
    },
}

</script>