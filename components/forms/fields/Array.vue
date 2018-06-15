<template>
  <div>
    <b-list-group>
      <b-list-group-item
        v-for="(item, index) in value"
        :key="index"
        class="d-flex justify-content-between align-items-center">
        {{ item }}
        <b-button-group>
          <b-btn
            variant="link"
            size="sm"
            class="d-flex"
            :disabled="index === 0"
            @click="moveUp(item)">
            <icon name="arrow-up"></icon>
          </b-btn>
          <b-btn
            variant="link"
            size="sm"
            class="d-flex"
            :disabled="index === value.length - 1"
            @click="moveDown(item)">
            <icon name="arrow-down"></icon>
          </b-btn>
          <b-btn
            variant="link"
            size="sm"
            class="d-flex"
            @click="remove(index)">
            <icon name="times"></icon>
          </b-btn>
        </b-button-group>
      </b-list-group-item>
    </b-list-group>
    <b-input-group class="mt-1">
      <b-form-input
        ref="input"
        :placeholder="schema.placeholder"
        @keyup.enter.native.stop="add">
      </b-form-input>
      <b-input-group-append>
        <b-btn variant="success" @click="add">
          Add
        </b-btn>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/arrow-up'
import 'vue-awesome/icons/arrow-down'
import { abstractField } from 'vue-form-generator'

export default {
  mixins: [ abstractField ],

  methods: {
    /**
     * Add the current input value to the array.
     */
    add () {
      const inputValue = this.$refs.input.$el.value
      if (inputValue.length && this.value.indexOf(inputValue) < 0) {
        this.value.push(inputValue)
      }
      this.$refs.input.$el.value = ''
    },

    /**
     * Remove an item from the array.
     * @param {Number} index
     *   The index of the item to remove.
     */
    remove (index) {
      this.value.splice(index, 1)
    },

    /**
     * Move an element up in the array.
     * @param {*} elem
     *  The element.
     */
    moveUp (elem) {
      const idx = this.value.indexOf(elem)
      if (idx > 0) {
        this.value.splice(idx - 1, 0, this.value.splice(idx, 1)[0])
      }
    },

    /**
     * Move an element down in the array.
     * @param {*} elem
     *  The element.
     */
    moveDown (elem) {
      const idx = this.value.indexOf(elem)
      if (idx < this.value.length) {
        this.value.splice(idx + 1, 0, this.value.splice(idx, 1)[0])
      }
    }
  }
}
</script>
