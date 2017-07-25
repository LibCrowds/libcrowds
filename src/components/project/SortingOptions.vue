<template>
  <div id="project-sorting-options">
    <div class="justify-content-centermy-1 row my-2">
      <b-form-fieldset
        horizontal
        label="Sort:"
        class="col-4">
        <b-form-select
          :options="sortingOpts"
          v-model="sortKey"
          @change="onSortKeyChange">
        </b-form-select>
      </b-form-fieldset>

      <b-form-fieldset
        horizontal
        label="Show completed:"
        class="col-4">
        <toggle-button
          :value="showCompleted"
          :sync="true"
          :labels="true"
          @change="onToggleCompleted">
        </toggle-button>
      </b-form-fieldset>

      <b-form-fieldset class="col-4">
        <b-button-group class="bg-white">
          <b-button
            v-for="view in views"
            :key="view"
            :variant="getViewBtnVariant(view)"
            @click="onViewChange(view)">
            <icon :name="view"></icon>
          </b-button>
        </b-button-group>
      </b-form-fieldset>
    </div>
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

.bg-white {
  background-color: $white;
}

.form-group {
  margin-bottom: 0;
}
</style>
