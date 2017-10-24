<template>
  <b-row id="project-sorting-toolbar">
    <b-col>
      <label class="label-muted">Sort projects by</label>
      <multiselect
        track-by="name"
        label="label"
        v-model="value"
        :options="sortingOpts"
        :searchable="false"
        placeholder="Select an atrribute"
        @input="updateOrderby">
      </multiselect>
    </b-col>

    <!--<b-col>
      <label class="label-muted">View</label>
      <multiselect
        track-by="name"
        label="label"
        :options="viewOpts"
        :value="viewModel"
        :searchable="false"
        placeholder="Select the list or table view"
        @input="$emit('changeview', value, id)">
      </multiselect>
    </b-col>-->

    <b-col id="show-completed" class="form-group mb-0 mt-2">
      <label class="label-muted">Show completed</label>
      <toggle-button
        :value="completedShown"
        :sync="true"
        :labels="true"
        @change="$emit('togglecompleted', completedShown)">
      </toggle-button>
    </b-col>

  </b-row>
</template>

<script>
export default {
  data () {
    return {
      sortingOpts: [
        { label: 'Overall Progress', orderby: 'overall_progress', desc: true },
        { label: 'Volunteers', orderby: 'n_volunteers', desc: true },
        { label: 'Creation Date', orderby: 'created', desc: true }
      ],
      viewOpts: [
        { label: 'List View', orderby: 'list' },
        { label: 'Table View', orderby: 'table' }
      ],
      completedShown: this.showCompleted
    }
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  methods: {
    updateOrderby (value) {
      // Make a copy of the search params passed in v-model
      const params = JSON.parse(JSON.stringify(this.value))

      params.orderby = value.orderby
      params.desc = value.desc
      this.$emit('input', params)
    }
  }
}
</script>
