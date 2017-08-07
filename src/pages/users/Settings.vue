<template>
  <div id="profile">
    <basic-layout
      :background="'faded'"
      navbarType="light"
      :navbarInvertable="false">

      <div class="container mt-5 mb-3">
        <div class="row">
          <div class="col-lg-4">
            <user-profile-card
              v-if="user"
              :user="user">
              <b-button
                block
                variant="success"
                :to="{
                  name: 'profile',
                  params: {
                    username: user.name
                  }
                }">
                Profile
              </b-button>
            </user-profile-card>
          </div>
          <div class="col-lg-8">
          </div>
        </div>
      </div>

    </basic-layout>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import UserProfileCard from '@/components/user/ProfileCard'
import BasicLayout from '@/components/layouts/Basic'

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
    BasicLayout,
    UserProfileCard
  },

  metaInfo: {
    title: 'User Settings'
  },

  methods: {
    /**
     * Set the form data.
     */
    setData (data) {
      this.user = data.user
    }
  },

  beforeRouteEnter (to, from, next) {
    const name = to.params.username
    pybossaApi.get(`account/${name}/update`).then(r => {
      next(vm => vm.setUserData(r.data))
    }).catch(err => {
      console.log(err)
      window.location.path = '/404'
    })
  },

  beforeRouteUpdate (to, from, next) {
    const name = to.params.username
    this.user = null
    pybossaApi.get(`account/${name}/update`).then(r => {
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
