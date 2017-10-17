import { createAPI } from '@/api/pybossa'

export default (ctx, inject) => {
  const pybossa = createAPI(ctx)
  ctx.$pybossa = pybossa
  inject('pybossa', pybossa)
}
