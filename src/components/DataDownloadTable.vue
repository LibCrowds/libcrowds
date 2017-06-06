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
        <template slot="name" scope="project">
          {{ project.value }}
        </template>
        <template slot="actions" scope="project">
          <b-btn
            size="sm"
            variant="outline-success"
            @click="download(project.item.short_name, 'csv')">
            CSV
          </b-btn>
          <b-btn
            size="sm"
            variant="outline-success"
            @click="download(project.item.short_name, 'json')">
            JSON
          </b-btn>
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
import FileSaver from 'file-saver'
import 'vue-awesome/icons/download'

export default {
  name: 'data-download-table',
  data: function () {
    return {
      pybossaApi: this.$store.state.pybossaApi,
      fields: {
        name: {
          label: 'Project',
          sortable: true
        },
        actions: {
          label: 'Download'
        }
      },
      categoryShortName: 'featured',
      currentPage: 1,
      categories: [],
      projects: [],
      pagination: {
        per_page: 20,
        total: 5
      }
    }
  },

  props: [
    'type'
  ],

  computed: {
    categoryOpts: function () {
      return this.categories.map(function (c) {
        return { text: c.name, value: c.short_name }
      })
    }
  },

  methods: {
    fetchData () {
      let url = `/project/category/${this.categoryShortName}/`
      if (this.currentPage > 1) {
        url += `page/${this.currentPage}/`
      }
      this.pybossaApi.get(url).then(res => {
        this.categories = res.data.categories
        this.projects = res.data.projects
        this.pagination = res.data.pagination
      }).catch(error => {
        console.log(error)
      })
    },
    download (shortName, format) {
      this.pybossaApi.get(`/project/${shortName}/tasks/export`, {
        responseType: 'arraybuffer',
        params: {
          type: this.type,
          format: format
        }
      }).then(res => {
        console.log(res)
        const blob = new Blob([res.data], {type: 'application/zip'})
        const fn = `${shortName}_${this.type}.zip`
        FileSaver.saveAs(blob, fn)
      }).catch(error => {
        console.log(error)
      })
    }
  },

  watch: {
    categoryShortName: function () {
      this.fetchData()
    },
    currentPage: function () {
      this.fetchData()
    }
  },

  mounted () {
    this.fetchData()
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
    text-transform: uppercase;
    color: $text-muted;
    border-top: none;
  }

  tr *:nth-child(2) {
    text-align: center;
  }
}
</style>
