<template>
  <section>

    <div class="justify-content-centermy-1 row mt-4 mb-2">
      <b-form-fieldset horizontal label="Category:" class="col-6">
        <b-form-select
          :options="categoryOpts"
          v-model="categoryShortName">
        </b-form-select>
      </b-form-fieldset>

      <b-form-fieldset class="col-6 text-right">
        <b-button-group>
          <b-button
            variant="outline-info"
            @click="activeView = 'list'">
            <icon name="list"></icon>
          </b-button>
          <b-button
            variant="outline-info"
            @click="activeView = 'table'">
            <icon name="table"></icon>
          </b-button>
        </b-button-group>
      </b-form-fieldset>

    </div>

    <b-table
      v-if="activeView === 'table'"
      striped
      show-empty
      :items="projects"
      :fields="fields"
      empty-text="No projects are available for this category">
      <template slot="overall_progress" scope="project">
        {{ project.item.overall_progress }}%
      </template>
      <template slot="actions" scope="project">
        <project-contrib-button
          :shortname="project.item.short_name"
          size="sm">
        </project-contrib-button>
      </template>
    </b-table>

    <ul class="list-unstyled" v-if="activeView === 'list'">
      <li v-for="p in projects">
        <project-card :project="p"></project-card>
      </li>
    </ul>

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
import 'vue-awesome/icons/table'
import 'vue-awesome/icons/list'
import pybossaApi from '@/api/pybossa'
import ProjectCard from '@/components/project/Card'
import ProjectContribButton from '@/components/buttons/ProjectContrib'

export default {
  data: function () {
    return {
      activeView: 'list',
      fields: {
        name: { label: 'Name' },
        n_tasks: { label: 'Tasks' },
        n_volunteers: { label: 'Volunteers' },
        overall_progress: { label: 'Progress' },
        actions: { label: 'Actions' }
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

  components: {
    ProjectContribButton,
    ProjectCard
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
    },
    '$route' () {
      this.fetchCategories()
    }
  },

  created () {
    this.fetchCategories()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.table {
  font-size: $font-size-sm;
  margin-bottom: 0;
  background-color: $white;
  border: $table-border-width solid $table-border-color;

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
