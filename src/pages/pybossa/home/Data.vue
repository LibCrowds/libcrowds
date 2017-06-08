<template>
  <floating-tabs>

    <b-nav slot="nav">
      <b-nav-item href="#background">Datasets</b-nav-item>
      <b-nav-item href="#tasks">Tasks</b-nav-item>
      <b-nav-item href="#taskruns">Task Runs</b-nav-item>
    </b-nav>

    <section id="datasets">
      <h2 class="text-center">Datasets</h2>
      <hr>
      <p>
        All datasets generated from the experimental crowdsourcing projects
        hosted on this platform are made available under
        <a :href="config.dataLicense.url" target="_blank">
          {{ config.dataLicense.name }}
        </a>,
        meaning that they can be used by anyone, without any copyright
        restrictions.
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
      <p>
        Head over to the <a :href="config.discourseUrl">LibCrowds Forum</a>
        to let us and others know how you have made use of the data, or if you
        have any further enquiries.
      </p>
    </section>

    <section id="tasks">
      <h3 class="text-center">Tasks</h3>
      <data-download-table :type="'task'"></data-download-table>
    </section>

    <section id="taskruns">
      <h3 class="text-center">Task Runs</h3>
      <data-download-table :type="'task_run'"></data-download-table>
    </section>

  </floating-tabs>
</template>

<script>
import config from '@/config'
import DataDownloadTable from '@/components/DataDownloadTable'
import FloatingTabs from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config
    }
  },

  components: {
    DataDownloadTable,
    FloatingTabs
  }
}
</script>
