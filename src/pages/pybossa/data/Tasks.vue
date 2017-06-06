<template>
  <section>
    <div class="justify-content-centermy-1 row">

      <b-form-fieldset horizontal label="Category" class="col-6">
        <b-form-select :options="categories" v-model="categoryId">
        </b-form-select>
      </b-form-fieldset>

    </div>

    <!-- Main table element -->
    <b-table striped show-empty :items="projects" :fields="fields" :current-page="currentPage" :per-page="perPage">
      <template slot="name" scope="project">
        {{ project.value }}
      </template>
      <template slot="actions" scope="project">
        <b-btn size="sm" variant="success" @click="downloadCsv(project.item)">Download CSV</b-btn>
        <b-btn size="sm" variant="success" @click="downloadJson(project.item)">Download JSON</b-btn>
      </template>
    </b-table>

    <div class="justify-content-center row my-1">
      <b-pagination :total-rows="this.projects.length" v-model="currentPage" />
    </div>
  </section>
</template>

<script>
import * as pybossaApi from '@/store/pybossa-api'
import config from '@/config'
import { debounce } from 'lodash'

export default {
  data: function () {
    return {
      config: config,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ],
      currentPage: 1,
      categoryId: null,
      perPage: 20,
      fields: {
        name: {
          label: 'Project',
          sortable: true
        },
        actions: {
          label: 'Actions'
        }
      },
      categories: [],
      projects: []
    }
  },

  methods: {
    fetchCategories () {
      pybossaApi.request('GET', this.pbConfig.host, '/api/category').then(res => {
        this.categories = res.data.map(function (category) {
          return { text: category.name, value: category.id }
        })
        this.categoryId = this.categories[0].value
      }).catch(error => {
        console.log(error)
      })
    },
    updateTable: debounce(
      function () {
        pybossaApi.request('GET', this.pbConfig.host, '/api/project?category_id=' + this.categoryId + '&limit=' + this.perPage).then(res => {
          this.projects = res.data
        }).catch(error => {
          console.log(error)
        })
      },
      500  // Number of milliseconds to wait for user input to stop
    ),
    downloadCsv (item) {
      alert('CSV' + item)
    },
    downloadJson (item) {
      alert('JSON')
    },

    watch: {
      categoryId: 'updateTable'
    }
  },

  mounted () {
    this.fetchCategories()
  }
}
</script>

<style>
</style>
