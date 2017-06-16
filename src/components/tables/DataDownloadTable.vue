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

    <b-card no-block>
      <b-table
        striped
        show-empty
        :items="projects"
        :fields="fields"
        empty-text="No projects are available for this category">
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
    </b-card>

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
  name: 'data-download-table',
  data: function () {
    return {
      fields: {
        name: { label: 'Name' },
        n_tasks: { label: 'Tasks' },
        n_volunteers: { label: 'Volunteers' },
        overall_progress: { label: 'Progress' },
        download: { label: 'Download' }
      },
      categoryShortName: this.$store.state.siteConfig.categories[0].shortName,
      currentPage: 1,
      projects: [],
      pagination: {
        per_page: 20,
        total: 5
      }
    }
  },

  props: [
    'downloadType'
  ],

  components: {
    DataDownloadButton
  },

  computed: {
    categoryOpts: function () {
      return this.siteConfig.categories.map(function (c) {
        return { text: c.name, value: c.shortName }
      })
    }
  },

  methods: {
    fetchProjects () {
      // Fetch all projects for the selected category
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
      this.fetchProjects()
    },
    currentPage: function () {
      this.fetchProjects()
    }
  },

  mounted () {
    this.fetchProjects()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.table {
  font-size: $font-size-sm;
  margin-bottom: 0;

  th {
    font-weight: 400;
    text-transform: uppercase;
    color: $text-muted;
    border-top: none;
  }

  tr *:not(:first-child) {
    text-align: center;
  }
}
</style>
