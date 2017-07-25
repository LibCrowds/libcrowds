<template>
  <div id="project-pagination">

    <div class="justify-content-center row mt-2">
      <b-pagination
        variant="info"
        :total-rows="pagination.total"
        :per-page="pagination.per_page"
        v-model="page"
        @change="onPageChange">
      </b-pagination>
    </div>

  </div>
</template>

<script>
export default {
  data: function () {
    return {
      page: 1
    }
  },

  props: {
    pagination: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Emit the change event on page change.
     */
    onPageChange () {
      this.$emit('change', this.page)
    }
  }
}
</script>
