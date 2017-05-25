<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
	min-width: 100vw;
  margin: auto;
}

#app {
  flex: 1 1 auto;
  position: relative;
  overflow-y: auto;
}
</style>
