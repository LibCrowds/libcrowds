<template>
  <b-modal :id="modalId" title="Leaderboard" @shown="fetchData">

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
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

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
    win: {
      type: Number,
      default: 0
    }
  },

  methods: {
    fetchData () {
      pybossaApi.get(`leaderboard/window/${this.win}`).then(r => {
        this.loading = false
        this.topUsers = r.data.top_users
      })
    }
  },

  created () {
    this.fetchData()
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
