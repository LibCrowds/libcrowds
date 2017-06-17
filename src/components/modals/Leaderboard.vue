<template>
  <b-modal id="lb-modal" title="Leaderboard">

    <b-table
      striped
      show-empty
      :items="topUsers"
      :fields="fields">
    </b-table>

  </b-modal>
</template>

<script>
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      topUsers: [],
      fields: {
        rank: { label: 'Rank' },
        name: { label: 'Name' },
        score: { label: 'Score' }
      }
    }
  },

  props: {
    name: {
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
        this.topUsers = r.data.top_users
      })
    }
  },

  mounted () {
    this.fetchData()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

.modal {
  display: block;
}

.modal-content {
  border-radius: 0;
}

.modal-dialog{
    overflow-y: initial !important
}

.modal-body{
    height: 400px;
    overflow-y: auto;
}

.modal-footer {
  padding: 25px 15px;
}
</style>
