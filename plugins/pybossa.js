import pybossa from '@/api/pybossa'
import handleFlash from '@/api/pybossa/interceptors/handleFlash'

export default (ctx, inject) => {
  // handleFlash intercetor can only be made available on the client
  pybossa.client.interceptors.response.use((res, ctx) => handleFlash)

  ctx.$pybossa = pybossa
  inject('pybossa', pybossa)
}
