<template>
  <div id="profile">
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <user-card
            v-if="user"
            :user="user">
          </user-card>
        </div>
        <div class="col-lg-8">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import UserCard from '@/components/user/card'

export default {
  data: function () {
    return {
      user: null,
      favourites: null,
      projectsContrib: null
    }
  },

  props: {
    username: {
      type: String,
      required: true
    }
  },

  components: {
    UserCard
  },

  metaInfo: {
    title: 'Profile',
    bodyAttrs: {
      style: '#666'
    }
  },

  methods: {
    /**
     * Set the user profile data.
     */
    setUserData (data) {
      this.user = data.user
      this.projectsContrib = data.projects_contrib
    },

    /**
     * Load the user favourites data.
     */
    loadFavourites () {
      pybossaApi.get(`/api/favorites`).then(r => {
        this.favourites = r.data
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    const name = to.params.username
    console.log(name)
    pybossaApi.get(`account/${name}/`).then(r => {
      next(vm => vm.setUserData(r.data))
    }).catch(err => {
      console.log(err)
      window.location.path = '/404'
    })
  },

  beforeRouteUpdate (to, from, next) {
    const name = to.params.username
    this.user = null
    pybossaApi.get(`account/${name}/`).then(r => {
      this.setUserData(r.data)
      next()
    }).catch(err => {
      console.log(err)
      window.location.path = '/404'
    })
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#profile {

}
</style>
