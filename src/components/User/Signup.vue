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
              <form @submit.prevent="onSignup">
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
                      required
                      :rules="[passwordSize]"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="confirmPassword"
                      label="Confirm Password"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      type="password"
                      :rules="[comparePasswords]"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row mt-3>
                  <v-flex xs12>
                    <v-btn type="submit" :disabled="loading" :loading="loading">
                      Sign up
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
        password: '',
        confirmPassword: ''
      }
    },

    computed: {
      ...mapState([
        'user',
        'error',
        'loading'
      ]),
      comparePasswords() {
        return this.password !== this.confirmPassword ? 'Passwords do not match!' : ''
      },

      passwordSize() {
        return this.password.length < 6 ? 'Password should be at least 6 characters!' : ''
      },
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
        'clearError'
      ]),

      onSignup() {
        this.signUserUp({ email: this.email, password: this.password })
      }
    }
  }
</script>
