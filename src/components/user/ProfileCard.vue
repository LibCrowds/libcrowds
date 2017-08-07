<template>
  <b-card class="user-card" no-block>

    <div class="avatar-background">
      <user-avatar
        :user="user"
        :size="200">
      </user-avatar>
    </div>

    <div id="user-details" class="card-block">
      <div class="card-title text-center">
        <h2>{{ user.name }}</h2>
      </div>
      <div class="card-text">
        <ul>
          <li>
            <icon name="trophy"></icon>Rank {{ user.rank }}
          </li>
          <li>
            <icon name="tasks"></icon>Contributions: {{ user.n_answers }}
          </li>
        </ul>
      </div>
    </div>
    <div class="card-block">
      <b-button
        v-if="isCurrentUser"
        block
        variant="outline-success"
        :to="{
          name: 'user-settings',
          params: {
            username: user.name
          }
        }">
        Edit
      </b-button>
    </div>
  </div>

  </b-card>
</template>

<script>
import 'vue-awesome/icons/trophy'
import 'vue-awesome/icons/tasks'
import 'vue-awesome/icons/clock-o'
import UserAvatar from '@/components/user/Avatar'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  components: {
    UserAvatar
  },

  computed: {
    isCurrentUser: function () {
      return (
        this.user &&
        this.$store.state.currentUser &&
        this.user.name === this.$store.state.currentUser.name
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

.card.user-card {
  .avatar-background {
    padding-top: $spacer-y * 2;
    padding-left: $spacer-x * 2;
    padding-right: $spacer-x * 2;
    background:
      linear-gradient(to bottom, rgba($brand-info, 0) 0%,
      rgba($brand-info, 0) calc(50% + (#{$spacer-y} * 1)),
      $white calc(50% + (#{$spacer-y} * 1)), $white 100% ),
      url('../../assets/img/background.jpg');
    background-size: cover;
    background-position: center center;
  }

  #user-details {
    ul {
      list-style: none;
      padding: 0;
    }

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 0.5rem;

      svg {
        margin-right: 5px;
      }
    }
  }
}
</style>
