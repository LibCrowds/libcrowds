import addCsrfHeader from '@/api/pybossa/interceptors/addCsrfHeader'
import handleErrors from '@/api/pybossa/interceptors/handleErrors'

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

  describe('handleErrors', () => {
    it('handles non-200 errors', () => {
      const status = 404
      const statusText = 'Uh oh'
      const error = {
        response: {
          status: status,
          statusText: statusText
        }
      }
      return handleErrors(error).catch(err => {
        expect(err.statusCode).toBe(status)
        expect(err.message).toBe(statusText)
      })
    })

    it('handles network errors', () => {
      const error = {
        request: {}
      }
      return handleErrors(error).catch(err => {
        expect(err.statusCode).toBe(598)
        expect(err.message).toBe('Network Error')
      })
    })

    it('handles request setup errors', () => {
      const error = {}
      return handleErrors(error).catch(err => {
        expect(err.statusCode).toBe(500)
        expect(err.message).toBe('Axios Error')
      })
    })
  })

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
