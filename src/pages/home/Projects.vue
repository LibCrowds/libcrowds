<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="intro">
      <h2 class="text-center">Projects</h2>
      <hr>
      <p class="lead text-center">
        Choose a project from the list below to get started!
      </p>
    </section>

    <section :id="navItems[0].id">
      <h3 class="text-center">{{ navItems[0].text }}</h3>
      <hr class="w-50"></hr>
      <category-list-chooser
        @change="onCategoryChange">
      </category-list-chooser>
      <hr class="w-50"></hr>
    </section>

    <section :id="navItems[1].id">
      <h3 class="text-center">{{ navItems[1].text }}</h3>
      <hr>

      <span v-if="projects.length">
        <project-sorting-options
          :views="views"
          :showCompleted="showCompleted"
          @sort="onSort"
          @viewchange="onViewChange"
          @togglecompleted="onToggleCompleted">
        </project-sorting-options>
        <hr>

        <project-card-list
          v-if="activeView === 'list'"
          :projects="filteredProjects">
        </project-card-list>

        <project-table
          v-if="activeView === 'table'"
          :action="'contribute'"
          :projects="filteredProjects">
        </project-table>

        <project-pagination
          :pagination="pagination"
          @change="onPageChange">
        </project-pagination>
      </span>
      <span v-else-if="this.category">
        <p class="lead text-center mb-0">
          Sorry, no projects have been published for this category.
        </p>
      </span>
      <span v-else>
        <p class="lead text-center mb-0">
          Please choose a category first.
        </p>
      </span>

    </section>

  </floating-tabs-layout>

</template>

<script>
import { sortBy, forEach } from 'lodash'
import pybossaApi from '@/api/pybossa'
import ProjectSortingOptions from '@/components/project/SortingOptions'
import ProjectPagination from '@/components/project/Pagination'
import ProjectTable from '@/components/project/Table'
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
      navItems: [
        { id: 'categories', text: 'Choose a Category' },
        { id: 'projects', text: 'Choose a Project' }
      ],
      projects: [],
      category: null
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
    ProjectTable,
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
