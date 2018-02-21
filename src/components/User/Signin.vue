<template>
  <v-container mt-0>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <app-alert @dismissed="clearError" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="email"
                      label="Email"
                      id="email"
                      v-model="email"
                      type="email"
                      required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row mt-3>
                  <v-flex xs12>
                    <v-btn type="submit" :disabled="loading" :loading="loading">
                      Sign in
                      <span slot="loader" class="custom-loader">
                        <v-icon>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },

    computed: {
      ...mapState([
        'user',
        'loading',
        'error'
      ]),
    },

    watch: {
      user(value) {
        if(value !== null && value !== undefined) {
          this.$router.push({ name: 'Home' })
        }
      }
    },

    methods: {
      ...mapActions([
        'signUserUp',
        'signUserIn',
        'clearError'
      ]),
      onSignin() {
        this.signUserIn({ email: this.email, password: this.password })
      }
    }
  }
</script>



