<template>
  <b-card class="user-card" no-block>

    <div class="avatar-background">
      <user-avatar
        :user="user"
        :size="200">
      </user-avatar>
    </div>

    <div class="card-block">
      <div class="card-title"><h2>{{ user.name }}</h2></div>
        <div class="card-text">
          <ul class="list-unstyled">
            <li class="pb-1">
              <span class="fa fa-trophy fa-fw mr-1"></span>Rank {{ user.rank }}
              </li>
              <li class="pb-1">
                  <span class="fa fa-tasks fa-fw mr-1"></span>Contributions: {{ user.n_answers }}
              </li>
              <li class="pb-1">
                  <span class="fa fa-clock-o fa-fw mr-1"></span>Joined: {{ user.created }}
              </li>
              <!-- {% if not private %}
              <li class="pb-1">
                  <span class="fa fa-envelope fa-fw mr-1"></span>{{ user.email_addr }}
              </li>
              <li class="pb-1">
                  <span class="fa fa-key fa-fw mr-1"></span>{{ user.api_key }}
              </li>
              {% endif %} -->
          </ul>
      </div>
      <!-- {% if not private %}
          <a href="{{ url_for('account.update_profile', name=user.name) }}" class="btn btn-outline-primary btn-block" role="button">
              <span class="fa fa-pencil-square-o mr-1"></span>Edit
          </a>

          {% if (user.valid_email == False) %}
              {% if (user.confirmation_email_sent == False) %}
              <a href="{{ url_for('account.confirm_email')}}" class="btn btn-outline-primary" role="button">Validate email</a>
              {% else %}
              <p class="label label-info">Email sent for validation</p>
              {% endif %}
          {% endif %}
      {% endif %} -->
  </div>

  </b-card>
</template>

<script>
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
}
</style>
