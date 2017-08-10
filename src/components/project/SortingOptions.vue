<template>
  <div class="project-sorting-options">

    <div class="form-group">
      <label>Sort:</label>
      <b-form-select
        :options="sortingOpts"
        v-model="sortKey"
        @change="onSortKeyChange">
      </b-form-select>
    </div>

    <div class="form-group">
      <label>Show completed:</label>
      <toggle-button
        :value="showCompleted"
        :sync="true"
        :labels="true"
        @change="onToggleCompleted">
      </toggle-button>
    </div>

    <b-button-group class="view-buttons">
      <b-button
        v-for="view in views"
        :key="view"
        :variant="getViewBtnVariant(view)"
        @click="onViewChange(view)">
        <icon :name="view"></icon>
      </b-button>
    </b-button-group>

  </div>
</template>

<script>
import 'vue-awesome/icons/table'
import 'vue-awesome/icons/list'

export default {
  data: function () {
    return {
      activeView: this.views[0],
      sortKey: 'overall_progress',
      sortingOpts: [
        { text: 'Closest to Completion', value: 'overall_progress' },
        { text: 'Most Tasks Remaining', value: 'n_tasks' },
        { text: 'Most Popular', value: 'n_volunteers' },
        { text: 'Most Recently Added', value: 'created' }
      ]
    }
  },

  props: {
    views: {
      type: Array,
      required: true,
      validator: function (arr) {
        return arr.length > 0
      }
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
    onSortKeyChange () {
      this.$emit('sort', this.sortKey)
    },

    /**
     * Emit the viewchange event on key change.
     */
    onViewChange (view) {
      this.activeView = view
      this.$emit('viewchange', view)
    },

    /**
     * Emit the togglecompleted event.
     */
    onToggleCompleted () {
      this.$emit('togglecompleted')
    },

    /**
     * Handle view button styles.
     */
    getViewBtnVariant (view) {
      return view === this.activeView ? 'info' : 'outline-info'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

.project-sorting-options {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-sm;

  @include media-breakpoint-up(lg) {
    flex-direction: row;
  }

  .view-buttons {
    background-color: $white;

    button {
      display: flex;
    }
  }

  .form-group {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;

    @include media-breakpoint-up(lg) {
      margin-bottom: 0;
    }
  }

  label {
    margin-right: 1rem;
    margin-bottom: 0;
  }
}
</style>
