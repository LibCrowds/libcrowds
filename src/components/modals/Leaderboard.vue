<template>
  <b-modal :id="name" title="Leaderboard" @shown="fetchData">

    <div v-if="loading">
      <loading></loading>
    </div>

    <b-table
      responsive
      v-else
      striped
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

<style lang="scss">
@import 'src/assets/style/_vars';
@import '~bootstrap/scss/bootstrap';

.modal {
  display: block;

  .modal-dialog{
      overflow-y: initial !important
  }

  .modal-content {
    max-height: 500px;
    border-radius: 0;
  }

  .modal-body{
      overflow-y: auto;
  }

  .modal-footer {
    padding: 25px 15px;
  }
}

.table {
  font-size: $font-size-sm;
  margin-bottom: 0;

  th {
    font-weight: 400;
    text-transform: uppercase;
    color: $text-muted;
    border-top: none;
  }

  tr *:first-child,
  tr *:last-child {
    text-align: center;
  }
}
</style>
