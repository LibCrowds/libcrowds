import addCsrfHeader from '@/api/interceptors/addCsrfHeader'
import handleErrors from '@/api/interceptors/handleErrors'
import handleFlash from '@/api/interceptors/handleFlash'

describe('Interceptors', () => {
  describe('addCsrfHeader', () => {
    it('adds the CSRF header when it exists', () => {
      const token = 'token'
      const request = {
        data: {
          csrf: token
        },
        headers: {}
      }
      addCsrfHeader(request)
      expect(request.headers['X-CSRFToken']).toBe(token)
    })

    it('does not add the CSRF header when it does not exist', () => {
      const request = {
        data: {},
        headers: {}
      }
      addCsrfHeader(request)
      expect(request.headers['X-CSRFToken']).toBe(undefined)
    })
  })

  // describe('handleErrors', () => {
  //   it('handles non-200 errors', () => {
  //     const status = 404
  //     const error = {
  //       response: {
  //         status: status
  //       }
  //     }
  //     handleErrors(error)
  //     expect(router.push).toHaveBeenLastCalledWith({ name: status })
  //     router.push.mockReset()
  //   })

  //   it('handles network errors', () => {
  //     const error = {
  //       request: {}
  //     }
  //     handleErrors(error)
  //     expect(router.push).toHaveBeenLastCalledWith({ name: 598 })
  //     router.push.mockReset()
  //   })

  //   it('handles request setup errors', () => {
  //     const error = {}
  //     handleErrors(error)
  //     expect(router.push).toHaveBeenLastCalledWith({ name: 500 })
  //     router.push.mockReset()
  //   })
  // })

  // describe('handleFlash', () => {
  //   it('dispatches notification from flash message', () => {
  //     const status = 'info'
  //     const flash = 'Something happened'
  //     const response = {
  //       data: {
  //         status: status,
  //         flash: flash
  //       }
  //     }
  //     handleFlash(response)
  //     expect(store.dispatch).toBeCalledWith('NOTIFY', {
  //       msg: flash,
  //       type: status
  //     })
  //     store.dispatch.mockReset()
  //   })

  //   it('does not dispatch notification for error flash message', () => {
  //     const status = 'error'
  //     const flash = 'Something happened'
  //     const response = {
  //       data: {
  //         status: status,
  //         flash: flash
  //       }
  //     }
  //     handleFlash(response)
  //     expect(store.dispatch).not.toHaveBeenCalled()
  //     store.dispatch.mockReset()
  //   })
  // })
})