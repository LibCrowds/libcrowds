<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      {{ users }}
    </h1>
  </section>
</template>

<script>
import pybossa from '~/plugins/pybossa'

export default {
  asyncData ({ params }) {
    return pybossa.getLeaderboard().then(r => {
      return {
        users: r.data.top_users
      }
    })
  },
  head () {
    return {
      title: 'Users'
    }
  }
}
</script>

<style scoped>
.title
{
  margin: 30px 0;
}
.users
{
  list-style: none;
  margin: 0;
  padding: 0;
}
.user
{
  margin: 10px 0;
}
</style>
