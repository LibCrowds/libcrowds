import Error from '@/pages/Error'

export default [
  {
    path: '/404',
    name: '404',
    alias: '*',
    component: Error,
    props: {
      title: 'Page Not Found',
      description: 'We could not find the page you were looking for'
    }
  }
]
