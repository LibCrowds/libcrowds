<template>
  <section>
    <p>
      All datasets generated from the experimental crowdsourcing projects hosted
      on this platform are made available under
      <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">CC0</a>,
      meaning that they can be used by anyone, without any copyright
      restrictions.
    </p>
    <p>
      There are three types of dataset available:
    </p>
    <ul>
      <li><strong>Tasks: </strong>The original task input.</li>
      <li><strong>Task Runs: </strong>The contribution data for each task.</li>
      <li><strong>Results: </strong>The final results for each task.</li>
    </ul>
    <p>
      All datasets can be downloaded in JSON or CSV format.
    </p>
    <p>
      We are keen for these datasets to be used in innovative ways, perhaps to
      further research into new technologies. For instance, the digitised images
      alongside the final results might prove useful for testing pattern
      recognition applications, such as those using OCR or NER technologies.
    </p>
    <p>
      Head over to the <a :href="config.discourseUrl">LibCrowds Forum</a>
      to let us and others know how you have made use of the data, or if you
      have any further enquiries.
    </p>
  </section>
</template>

<script>
import config from '@/config'

export default {
  data: function () {
    return {
      config: config
    }
  }
}
</script>
