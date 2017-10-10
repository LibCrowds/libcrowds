import BootstrapVue from 'bootstrap-vue'
import capitalize from 'capitalize'
import pluralize from 'pluralize'

import { mount, createLocalVue } from 'vue-test-utils'
import CategoriesList from '~/components/lists/Categories'

describe('Categories list', () => {
  let localVue = null
  let categories = null
  let wrapper = null
  let changeCategorySpy = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.filter('capitalize', capitalize)
    localVue.filter('pluralize', pluralize)
    categories = [
      {
        id: 1,
        name: 'london'
      },
      {
        id: 2,
        name: 'plymouth'
      }
    ]
    changeCategorySpy = jest.spyOn(CategoriesList.methods, 'changeCategory')
    wrapper = mount(CategoriesList, {
      localVue,
      propsData: {
        categories: categories,
        header: 'Locations'
      }
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('changes to the first category when mounted', () => {
    expect(changeCategorySpy).toHaveBeenCalledWith(categories[0])
  })

  it('emits change event and sets activeCategory on category change', () => {
    wrapper.vm.changeCategory(categories[1])
    console.log(wrapper.vm.changeCategory)
    expect(wrapper.vm.activeCategory).toBe(categories[1])
    expect(wrapper.emitted()).toBe({
      'change': categories[1]
    })
  })
})
