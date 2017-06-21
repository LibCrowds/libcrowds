<template>
  <div class="project-shuffle">

    <div id="sorting-options" class="justify-content-centermy-1 row my-2">

      <b-form-fieldset horizontal label="Category:">
        <b-form-select
          :options="categoryOpts"
          v-model="categoryShortName">
        </b-form-select>
      </b-form-fieldset>

      <b-form-fieldset horizontal label="Sorting:">
        <b-form-select
          :options="sortingOpts"
          v-model="sortKey">
        </b-form-select>
      </b-form-fieldset>

      <b-form-fieldset horizontal class="col-3">
       <toggle-button :value="false" :sync="true" :labels="true">
       </toggle-button>
      </b-form-fieldset>

      <b-form-fieldset class="col-3">
        <b-button-group class="bg-white">
          <b-button
            :variant="getViewBtnVariant('list')"
            @click="activeView = 'list'">
            <icon name="list"></icon>
          </b-button>
          <b-button
            :variant="getViewBtnVariant('table')"
            @click="activeView = 'table'">
            <icon name="table"></icon>
          </b-button>
        </b-button-group>
      </b-form-fieldset>

    </div>

    <project-contrib-table
       v-if="activeView === 'table'"
      :projects="projects">
    </project-contrib-table>

    <transition-group
      v-if="activeView === 'list'"
      ref="shuffle-grid" 
      tag="ul"
      class="list-unstyled">
      <li class="shuffle-grid-item" 
        v-for="p in projects" 
        :key="p.short_name">
        <project-card :project="p"></project-card>
      </li>
    </transition-group>

    <div class="justify-content-center row mt-4">
      <b-pagination
        variant="info"
        :total-rows="pagination.total"
        :per-page="pagination.per_page"
        v-model="currentPage">
      </b-pagination>
    </div>

  </div>
</template>

<script>
import 'vue-awesome/icons/table'
import 'vue-awesome/icons/list'
import { sortBy, forEach } from 'lodash'
import pybossaApi from '@/api/pybossa'
import ProjectCard from '@/components/project/Card'
import ProjectContribTable from '@/components/project/ContribTable'

export default {
  data: function () {
    return {
      activeView: 'list',
      categoryShortName: null,
      currentPage: 1,
      projects: [],
      categories: [],
      pagination: {
        per_page: 20,
        total: 5
      },
      sortKey: 'overall_progress',
      sortingOpts: [
        { text: 'Closest to Completion', value: 'overall_progress' },
        { text: 'Most Tasks Remaining', value: 'n_tasks' },
        { text: 'Most Popular', value: 'n_volunteers' },
        { text: 'Most Recently Added', value: 'created' }
      ]
    }
  },

  components: {
    ProjectCard,
    ProjectContribTable
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
    },
    getViewBtnVariant (view) {
      return view === this.activeView ? 'info' : 'outline-info'
    },
    sort () {
      const sortedProjects = sortBy(this.projects, this.sortKey)
      this.projects = forEach(sortedProjects, function (p) {
        return p
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
    },
    sortKey: function () {
      this.sort()
    }
  },

  created () {
    this.fetchCategories()
  },

  mounted () {
    this.sort()
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

.shuffle-grid-item {
  transition: all 400ms;
}

.bg-white {
  background-color: $white;
}
</style>
