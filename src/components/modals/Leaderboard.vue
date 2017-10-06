<template>
  <b-modal
    :id="modalId"
    title="Leaderboard"
    ok-only>

    <loading
      v-if="loading"
      text="Loading leaderboard">
    </loading>

    <b-table
      responsive
      v-else
      striped
      hover
      show-empty
      :items="topUsers"
      :fields="fields">
    </b-table>

  </b-modal>
</template>

<script>
import Loading from '@/components/Loading'
import pybossa from '@/api/pybossa'

export default {
  data: function () {
    return {
      loading: true,
      topUsers: [],
      fields: {
        rank: { label: 'Rank' },
        name: { label: 'Name' },
        score: { label: 'Score' }
      }
    }
  },

  components: {
    Loading
  },

  props: {
    modalId: {
      type: String,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    },
    win: {
      type: Number,
      default: 0
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.loading = false
      this.topUsers = data.top_users.map(user => {
        if (this.currentUser && this.currentUser.name === user.name) {
          user._rowVariant = 'success'
        }
        return user
      })
      let userRepeated = this.topUsers.filter(user => {
        return user.name === this.currentUser.name
      }).length
      if (userRepeated) {
        this.topUsers.splice(-1, 1)
      }
    }
  },

  created () {
    pybossa.getLeaderboard().then(r => {
      this.setData(r.data)
    })
  }
}
</script>

<style lang="scss" scoped>
.table {
  tr *:first-child,
  tr *:last-child {
    text-align: center;
  }
}
</style>
