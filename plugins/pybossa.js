import pybossa from '@/api/pybossa'

export default (ctx, inject) => {
  ctx.$pybossa = pybossa
  inject('pybossa', pybossa)
}
