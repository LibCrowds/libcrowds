<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="data">
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
        There are currently two types of dataset available, both of which
        can be downloaded in JSON or CSV format:
      </p>
      <ul>
        <li>
          <strong>Tasks: </strong>The original input data for the tasks.
        </li>
        <li>
          <strong>Task Runs: </strong>The contribution data for all tasks.
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

    <section id="tasks">
      <h3 class="text-center">Tasks</h3>
      <data-download-table :downloadType="'task'"></data-download-table>
    </section>

    <section id="taskruns">
      <h3 class="text-center">Task Runs</h3>
      <data-download-table :downloadType="'task_run'"></data-download-table>
    </section>

  </floating-tabs-layout>

</template>

<script>
import config from '@/config'
import DataDownloadTable from '@/components/tables/DataDownloadTable'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config,
      navItems: [
        { id: 'data', text: 'Top' },
        { id: 'tasks', text: 'Tasks' },
        { id: 'taskruns', text: 'Task Runs' }
      ]
    }
  },

  components: {
    FloatingTabsLayout,
    DataDownloadTable
  }
}
</script>
