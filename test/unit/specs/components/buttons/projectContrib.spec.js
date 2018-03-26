import BootstrapVue from 'bootstrap-vue'

import collection from '@/test/fixtures/collection.json'
import pbTestResponses from '@/test/fixtures/pybossaTestResponses.json'
import { mount, createLocalVue } from '@vue/test-utils'
import ProjectContribButton from '@/components/buttons/ProjectContrib'

describe('ProjectContrib button', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    wrapper = mount(ProjectContribButton, {
      localVue,
      propsData: {
        collection: collection,
        project: pbTestResponses.getProject.data.project
      }
    })
  })

  it('is active by default', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('is disabled when project is completed', () => {
    let completedProject = {
      overall_progress: 100
    }
    wrapper.setProps({
      project: completedProject
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
