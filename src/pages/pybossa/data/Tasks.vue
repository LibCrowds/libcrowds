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

    <!-- Main table element -->
    <b-table striped show-empty :items="projects" :fields="fields">
      <template slot="name" scope="project">
        {{ project.value }}
      </template>
      <template slot="actions" scope="project">
        <b-btn @click="download(project.item.short_name, 'csv')">Download CSV</b-btn>
        <b-btn @click="download(project.item.short_name, 'json')">Download JSON</b-btn>
      </template>
    </b-table>

    <div class="justify-content-center row my-1">
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

export default {
  data: function () {
    return {
      pybossaApi: this.$store.state.pybossaApi,
      fields: {
        name: {
          label: 'Project',
          sortable: true
        },
        actions: {
          label: 'Actions'
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
        data: {
          type: 'task',
          format: format
        }
      }).then(res => {
        const blob = new Blob([res.data], {type: 'application/zip'})
        const fn = `${shortName}_task.zip`
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

<style>
</style>
