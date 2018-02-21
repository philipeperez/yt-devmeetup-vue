<template>
  <v-dialog persistent v-model="registerDialog">
    <v-btn class="primary" accent slot="activator">
      {{ userIsRegistered ? 'Unregister' : 'Register' }}
    </v-btn>

    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title class="primary--text" v-if="userIsRegistered">Unregister from Meetup?</v-card-title>
            <v-card-title class="primary--text" v-else>Register for Meetup?</v-card-title>
          </v-flex>
        </v-layout>

        <v-divider></v-divider>

        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>You can always change your decision later on.</v-card-text>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-btn
            flat
            @click="registerDialog = false"
            class="red--text darken-1">Cancel</v-btn>
          <v-btn
            flat
            @click="onAgree"
            class="green--text">Confirm</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    props: ['meetupId'],
    data() {
      return {
        registerDialog: false
      }
    },
    computed: {
      ...mapState([
        'user'
      ]),

      userIsRegistered() {
        return this.user.registeredMeetups.findIndex(meetupId => meetupId === this.meetupId) >= 0
      }
    },

    methods: {
      ...mapActions([
        'unregisterUserFromMeetup',
        'registerUserForMeetup'
      ]),
      onAgree() {
        if(this.userIsRegistered)
          this.unregisterUserFromMeetup(this.meetupId)
        else
          this.registerUserForMeetup(this.meetupId)
      }
    }
  }
</script>
