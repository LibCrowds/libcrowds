export default {
  path: '/404',
  name: '404',
  alias: '*',
  component: require('@/pages/Error'),
  props: {
    title: 'Page Not Found',
    description: 'We could not find the page you were looking for'
  }
}
