<template>
  <b-card
    id="project-sorting-options"
    :header="'Sorting Options'">

    <div class="form-group">
      <label>Sort by:</label>
      <b-form-select
        :options="sortingOpts"
        v-model="sortKey"
        @change.native="onSortKeyChange">
      </b-form-select>
    </div>

    <div class="form-group" v-if="viewOpts.length">
      <label>View:</label>
      <b-form-select
        ref="view"
        :options="viewOpts"
        v-model="viewKey"
        @change.native="onViewChange">
      </b-form-select>
    </div>

    <div id="show-completed" class="form-group mb-0 mt-2">
      <label>Show completed:</label>
      <toggle-button
        :value="showCompleted"
        :sync="true"
        :labels="true"
        @change.native="onToggleCompleted">
      </toggle-button>
    </div>
  </b-card>
</template>

<script>
export default {
  data: function () {
    return {
      sortKey: 'default',
      viewKey: this.viewOpts.length ? this.viewOpts[0].value : null,
      sortingOpts: [
        { text: 'Default', value: 'default' },
        { text: 'Progress', value: 'overall_progress' },
        { text: 'Volunteers', value: 'n_volunteers' },
        { text: 'Creation Date', value: 'created' }
      ]
    }
  },

  props: {
    viewOpts: {
      type: Array,
      default: []
    },
    showCompleted: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Emit the sort event on key change.
     */
    onSortKeyChange (evt) {
      this.$emit('sort', evt.target.value)
    },

    /**
     * Emit the viewchange event on key change.
     */
    onViewChange (evt) {
      this.$emit('viewchange', evt.target.value)
    },

    /**
     * Emit the togglecompleted event.
     */
    onToggleCompleted () {
      this.$emit('togglecompleted')
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#project-sorting-options {
  font-size: $font-size-sm;

  .card-header {
    @extend .bg-faded;
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
