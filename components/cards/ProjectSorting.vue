<template>
  <b-card id="project-sorting-options" header="Sorting Options">

    <div class="mb-2">
      <label>Sort by</label>
      <multiselect
        label="name"
        track-by="name"
        placeholder="Sort projects by"
        :show-labels="false"
        :options="sortOptions"
        @input="onSortChange">
      </multiselect>
    </div>

  </b-card>
</template>

<script>
export default {
  data () {
    return {
      sortOptions: [
        {
          name: 'Most Tasks',
          orderby: 'n_tasks',
          desc: true
        },
        {
          name: 'Least Tasks',
          orderby: 'n_tasks',
          desc: false
        },
        {
          name: 'Most Popular',
          orderby: 'n_volunteers',
          desc: true
        },
        {
          name: 'Least Popular',
          orderby: 'n_volunteers',
          desc: false
        },
        {
          name: 'Most Complete',
          orderby: 'overall_progress',
          desc: true
        },
        {
          name: 'Least Complete',
          orderby: 'overall_progress',
          desc: false
        }
      ]
    }
  },

  methods: {
    /**
     * Handle sort change.
     * @param {Object} value
     *   The sorting option.
     */
    onSortChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#project-sorting-options {
  font-size: $font-size-sm;
  margin-top: 0;

  .card-header {
    background-color: $gray-100;
    text-align: center;
    padding: $list-group-item-padding-y $list-group-item-padding-x;
  }

  #show-completed {
    label {
      margin: 0 5px 0 0;
    }
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>