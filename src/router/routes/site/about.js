import Background from '@/pages/pybossa/about/Background'
import Technology from '@/pages/pybossa/about/Technology'
import Contact from '@/pages/pybossa/about/Contact'

export default {
  path: 'about',
  name: 'about',
  component: require('@/components/Tabs'),
  props: {
    tabs: [
      { title: 'Background', content: Background },
      { title: 'Technology', content: Technology },
      { title: 'Contact', content: Contact }
    ]
  }
}
