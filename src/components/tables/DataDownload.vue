<template>
  <section>

    <div class="justify-content-centermy-1 row">
      <b-form-fieldset horizontal label="Category" class="col-6">
        <b-form-select
          :options="categoryOpts"
          v-model="categoryShortName">
        </b-form-select>
      </b-form-fieldset>
    </div>

    <b-table
      striped
      responsive
      show-empty
      :items="projects"
      :fields="fields"
      empty-text="This category is currently empty">
      <template slot="overall_progress" scope="project">
        {{ project.item.overall_progress }}%
      </template>
      <template slot="download" scope="project">
        <data-download-button
          :type="downloadType"
          :format="'json'"
          :projectShortName="project.item.short_name">
          JSON
        </data-download-button>
        <data-download-button
          :type="downloadType"
          :format="'csv'"
          :projectShortName="project.item.short_name">
          CSV
        </data-download-button>
      </template>
    </b-table>

    <div class="justify-content-center row mt-4">
      <b-pagination
        variant="info"
        :total-rows="pagination.total"
        :per-page="pagination.per_page"
        v-model="currentPage">
      </b-pagination>
    </div>

  </section>
</template>

<script>
import DataDownloadButton from '@/components/buttons/DataDownload'
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      fields: {
        name: { label: 'Name' },
        n_tasks: { label: 'Tasks' },
        n_volunteers: { label: 'Volunteers' },
        overall_progress: { label: 'Progress' },
        download: { label: 'Download' }
      },
      categoryShortName: null,
      currentPage: 1,
      projects: [],
      categories: [],
      pagination: {
        per_page: 20,
        total: 5
      }
    }
  },

  props: {
    downloadType: {
      type: String,
      required: true
    }
  },

  components: {
    DataDownloadButton
  },

  computed: {
    categoryOpts: function () {
      const opts = this.categories.map(function (c) {
        return { text: c.name, value: c.short_name }
      })
      this.categoryShortName = opts.length ? opts[0].value : null
      return opts
    }
  },

  methods: {
    fetchCategories () {
      pybossaApi.get('/').then(res => {
        this.categories = res.data.categories
      })
    },
    fetchProjects () {
      let url = `/project/category/${this.categoryShortName}/`
      if (this.currentPage > 1) {
        url += `page/${this.currentPage}/`
      }
      pybossaApi.get(url).then(res => {
        this.projects = res.data.projects
        this.pagination = res.data.pagination
      })
    }
  },

  watch: {
    categoryShortName: function () {
      if (typeof this.categoryShortName !== 'undefined') {
        this.fetchProjects()
      }
    },
    currentPage: function () {
      this.fetchProjects()
    }
  },

  created () {
    this.fetchCategories()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

.table {
  th:not(:first-child),
  td:not(:first-child) {
    text-align: center;
  }
}
</style>
