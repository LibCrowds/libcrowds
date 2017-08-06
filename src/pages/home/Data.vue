<template>

  <floating-tabs-layout
    id="data-download-page"
    :nav-items="navItems">

    <section>
      <h2 class="text-center">Data</h2>
      <hr>
      <p>
        All datasets generated from the experimental crowdsourcing projects
        hosted on this platform are made available under a
        <a :href="config.dataLicense.url" target="_blank">
          {{ config.dataLicense.name }}
        </a> license.
      </p>
      <p>
        There are three types of dataset available, all of which
        can be downloaded in JSON or CSV format:
      </p>
      <ul>
        <li>
          <strong>Tasks: </strong>The original input data for the tasks.
        </li>
        <li>
          <strong>Task Runs: </strong>The contribution data for all tasks.
        </li>
        <li>
          <strong>Results: </strong>The final results, following any analysis
          of the contribution data.
        </li>
      </ul>
      <p>
        We are keen for these datasets to be used in innovative ways, perhaps
        to further research into new technologies. For instance, the digitised
        images alongside the final results might prove useful for testing
        pattern recognition applications, such as those using OCR or NER
        technologies.
      </p>
      <p v-if="config.forumUrl">
        Head over to the
        <a :href="config.forumUrl">
          {{ config.brand }} Forum
        </a>
        to let us and others know how you have made use of the data, or if you
        have any further enquiries.
      </p>
    </section>

    <section :id="navItems[0].id">
      <h3 class="text-center">{{ navItems[0].text }}</h3>
      <hr class="w-50"></hr>
      <category-list-chooser
        @change="onCategoryChange">
      </category-list-chooser>
    </section>

    <section :id="navItems[1].id">
      <h3 class="text-center">{{ navItems[1].text }}</h3>
      <project-table
        :action="'download'"
        :projects="projects">
      </project-table>

      <project-pagination
        :pagination="pagination"
        @change="onPageChange">
      </project-pagination>
    </section>

  </floating-tabs-layout>

</template>

<script>
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'
import ProjectTable from '@/components/project/Table'
import CategoryListChooser from '@/components/category/ListChooser'
import ProjectPagination from '@/components/project/Pagination'

export default {
  data: function () {
    return {
      config: config,
      navItems: [
        { id: 'categories', text: 'Choose a Category' },
        { id: 'download', text: 'Download' }
      ],
      page: 1,
      pagination: {
        per_page: 0,
        total: 0
      },
      projects: [],
      category: null
    }
  },

  metaInfo: {
    title: 'Data'
  },

  components: {
    FloatingTabsLayout,
    ProjectTable,
    CategoryListChooser,
    ProjectPagination
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
     * Handle page change.
     */
    onPageChange (page) {
      this.page = page
      this.fetchProjects()
    }
  }
}
</script>

<style lang="scss" scoped>
#data-download-page {
  table {
    overflow-y: initial;
  }
}
</style>
