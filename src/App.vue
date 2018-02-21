<template>
  <v-app ligth>
    <v-navigation-drawer
      temporary
      v-model="sideNav">
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="{ name: item.linkName }">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="userIsAuthenticated" @click="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class="primary">
      <v-toolbar-side-icon class="hidden-sm-and-up" @click.stop="sideNav = !sideNav"></v-toolbar-side-icon>

      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">DevMeetup</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="{ name: item.linkName }">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <v-btn
          @click="logout"
          v-if="userIsAuthenticated"
          flat>
          <v-icon left dark>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    data () {
      return {
        sideNav: false,
      }
    },

    computed: {
      ...mapState([
        'user'
      ]),

      menuItems() {
        let menuItems = [
          { icon: 'face', title: 'Sign up', linkName: 'Signup' },
          { icon: 'lock_open', title: 'Sign in', linkName: 'Signin' }
        ]
        if(this.userIsAuthenticated) {
          menuItems = [
            { icon: 'supervisor_account', title: 'View Meetups', linkName: 'Meetups' },
            { icon: 'room', title: 'Organize Meetup', linkName: 'CreateMeetup' },
            { icon: 'person', title: 'Profile', linkName: 'Profile' }
          ]
        }
        return menuItems
      },

      userIsAuthenticated() {
        return this.user !== null && this.user !== undefined
      }
    },

    methods: {
      ...mapActions([
        'logout'
      ])
    }
  }

</script>

<style lang="stylus">
  @import './stylus/main'
</style>
