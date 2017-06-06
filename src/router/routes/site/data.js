import Datasets from '@/pages/pybossa/data/Datasets'
import Tasks from '@/pages/pybossa/data/Tasks'
import TaskRuns from '@/pages/pybossa/data/TaskRuns'

export default {
  path: 'data',
  name: 'data',
  component: require('@/components/Tabs'),
  props: {
    tabs: [
      { title: 'Datasets', content: Datasets },
      { title: 'Tasks', content: Tasks },
      { title: 'Task Runs', content: TaskRuns }
    ]
  }
}
