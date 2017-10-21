import capitalize from 'capitalize'
import pybossa from '@/api/pybossa'
import { notifications } from '@/mixins/notifications'

export const deleteDomainObject = {
  methods: {
    deleteDomainObject (type, id, callback) {
      const terminology = type === 'category' ? 'collection' : type
      this.$swal({
        title: `Delete ${capitalize(terminology)}`,
        text: `Are you sure you want to delete this ${terminology}?`,
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return pybossa.client.delete(`/api/${type}/${id}`)
        }
      }).then(r => {
        this.notify({
          type: 'success',
          title: 'Success',
          message: `${capitalize(terminology)} deleted`
        })
        callback()
      }, (dismiss) => {
        this.$swal.close()
      })
    }
  },

  mixins: [ notifications ]
}
