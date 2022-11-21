
<template>
    <div>
        <img class="logo__groupomania" src="../assets/icon-left-font-monochrome-black.png" alt="Logo de Groupomania">
        <signup> </signup>
        <footerBottom> </footerBottom>
    </div>
</template>

<script>

    import Signup from '../components/Signup'
    import Footer from '../components/Footer'

    export default {
        name: 'landing',
        components: {
            'signup' : Signup,
            'footerBottom' : Footer
        }
    }

</script>