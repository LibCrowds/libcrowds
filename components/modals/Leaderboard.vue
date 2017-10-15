<template>
  <b-modal
    :id="modalId"
    title="Leaderboard"
    hide-header-close
    ok-only>
    <b-table
      responsive
      striped
      hover
      show-empty
      :items="filteredUsers"
      :fields="fields">
    </b-table>
  </b-modal>
</template>

<script>
export default {
  data () {
    return {
      fields: {
        rank: { label: 'Rank' },
        name: { label: 'Name' },
        score: { label: 'Score' }
      }
    }
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    },
    topUsers: {
      type: Array,
      required: true
    },
    modalId: {
      type: String,
      required: true
    }
  },

  computed: {
    /**
     * Highlight current user and remove from the end if they appear twice.
     */
    filteredUsers () {
      let users = JSON.parse(JSON.stringify(this.topUsers))

      users = users.map(user => {
        if (this.currentUser && this.currentUser.name === user.name) {
          user._rowVariant = 'success'
        }
        return user
      })

      let userRepeated = users.filter(user => {
        return user.name === this.currentUser.name
      }).length

      if (userRepeated) {
        users.splice(-1, 1)
      }

      return users
    }
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
