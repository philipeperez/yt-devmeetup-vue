<template>
  <v-container class="mt-0">
    <v-layout v-for="meetup in meetups" :key="meetup.id" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-card-media
                  class="mt-3 mb-3"
                  :src="meetup.imageUrl"
                  height="130px"
                  ></v-card-media>
              </v-flex>

              <v-flex xs7 sm9 md9>
                <v-card-title primaryTitle>
                  <div>
                    <h5 class="white--text mb-0">{{ meetup.title }}</h5>
                    <div>{{ meetup.date | date }}</div>
                  </div>
                </v-card-title>

                <v-card-actions>
                  <v-btn flat :to="{ name: 'Meetup', params: { id: meetup.id } }">
                    <v-icon left>arrow_forward</v-icon>
                    View Meetup
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        meetups: 'loadedMeetups'
      })
    }
  }
</script>
