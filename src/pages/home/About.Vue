<template>
  <div id="about">
    <main :style="mainStyle">
      <div class="container">
        <section class="p-3 p-md-5" v-html="about"></section>
        <section class="p-3 p-md-5">
          <ul id="example-1">
          <li v-for="member in team"></li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import marked from 'marked'

export default {
  name: 'about',
  data: function () {
    return {
      mainStyle: {
        backgroundImage: `url('')`
      },
      team: []
    }
  },
  computed: {
    about: function () {
      return marked('')
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

main {
  height: 100vh;
  overflow-y: auto;
}

section {
  &:nth-child(odd) {
    background-color: $white;
  }

  &:nth-child(even) {
    @extend .bg-faded;
  }
}

.container {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 5rem;
}
</style>
