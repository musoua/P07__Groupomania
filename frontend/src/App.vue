<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import Landing from './views/Landing'

export default {
  name: 'App',
  components: {
      'landing': Landing
  }
}
</script>

<style lang="scss">

  @import'./style/main.scss';

</style>
