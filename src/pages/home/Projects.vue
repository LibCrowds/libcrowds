<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="projects">
      <h2 class="text-center">Projects</h2>
      <hr>
      <span v-html="config.projectsMd" v-if="'projectsMd' in config"></span>
      <p v-else>
        Each {{ config.brand }} project comprises a collection of similar tasks.
        With each completed task you will be directly contributing towards
        important research. Choose a project from the list below to get started!
      </p>
    </section>

    <section id="choose">
      <h3 class="text-center">Choose a Project</h3>
      <hr class="w-50"></hr>

      <category-list-chooser
        @change="onCategoryChange">
      </category-list-chooser>
      <hr class="w-50"></hr>

      <project-sorting-options
        :views="views"
        :showCompleted="showCompleted"
        @sort="onSort"
        @viewchange="onViewChange"
        @onToggleCompleted="onToggleCompleted">
      </project-sorting-options>
      <hr class="w-50"></hr>

      <project-card-list
        v-if="activeView === 'list'"
        :projects="filteredProjects">
      </project-card-list>

      <project-contribute-table
        v-if="activeView === 'table'"
        :projects="filteredProjects">
      </project-contribute-table>

      <project-pagination
        :pagination="pagination"
        @change="onPageChange">
      </project-pagination>

    </section>

  </floating-tabs-layout>

</template>

<script>
import { sortBy, forEach } from 'lodash'
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import ProjectSortingOptions from '@/components/project/SortingOptions'
import ProjectPagination from '@/components/project/Pagination'
import ProjectContributeTable from '@/components/project/ContributeTable'
import ProjectCardList from '@/components/project/CardList'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'
import CategoryListChooser from '@/components/category/ListChooser'

export default {
  data: function () {
    return {
      views: ['list', 'table'],
      activeView: 'list',
      showCompleted: false,
      page: 1,
      pagination: {
        per_page: 0,
        total: 0
      },
      config: config,
      navItems: [
        { id: 'choose', text: 'Choose a Project' }
      ],
      projects: [],
      category: {}
    }
  },

  computed: {
    filteredProjects: function () {
      return this.projects.filter((project) => {
        if (!this.showCompleted && project.overall_progress === 100) {
          return false
        } else {
          return true
        }
      })
    }
  },

  components: {
    FloatingTabsLayout,
    ProjectSortingOptions,
    ProjectPagination,
    ProjectContributeTable,
    ProjectCardList,
    CategoryListChooser
  },

  metaInfo: {
    title: 'Projects'
  },

  methods: {
    /**
     * Handle category change.
     */
    onCategoryChange (category) {
      this.category = category
      this.fetchProjects(category)
    },

    /**
     * Fetch the projects in a category.
     */
    fetchProjects () {
      let url = `/project/category/${this.category.short_name}/`
      if (this.page > 1) {
        url += `page/${this.page}/`
      }
      pybossaApi.get(url).then(r => {
        this.projects = r.data.projects
        this.pagination = r.data.pagination
      })
    },

    /**
     * Handle sort.
     */
    onSort (key) {
      const sortedProjects = sortBy(this.projects, key)
      this.projects = forEach(sortedProjects, function (p) {
        return p
      })
    },

    /**
     * Handle view change.
     */
    onViewChange (view) {
      this.activeView = view
    },

    /**
     * Handle completed toggle.
     */
    onToggleCompleted () {
      this.showCompleted = !this.showCompleted
    },

    /**
     * Handle page change.
     */
    onPageChange (page) {
      this.page = page
      this.fetchProjects()
    }
  }
}
</script>
