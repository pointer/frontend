<template>
  <v-container fluid>
    <v-layout row wrap>
      <Heading :title="$t('login.TITLE')" />
      <Description :description="$t('login.DESCRIPTION')" />
      <v-flex xs12 sm6 offset-sm3>
        <template>
          <ValidationObserver
            ref="observer"
            v-slot="{ invalid }"
            tag="form"
            @submit.prevent="submit()"
          >
            <v-text-field
              v-model="username"
              :error-messages="errors"
              :label="$t('login.USERNAME')"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :label="$t('login.PASSWORD')"
              :error-messages="errors"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              name="password"
              hint="At least 8 characters"
              counter
              @click:append="show = !show"
              required
              :rules="[rules.required, rules.password]"
            ></v-text-field>
            <v-flex text-xs-center mt-5>
              <SubmitButton :disabled="invalid" :text="$t('login.LOGIN')" />
            </v-flex>
            <v-flex text-xs-center>
              <v-btn
                :to="{ name: 'forgotPassword' }"
                color="white"
                small
                text
                class="btnForgotPassword"
                >{{ $t('login.FORGOT_PASSWORD') }}</v-btn
              >
            </v-flex>
          </ValidationObserver>
        </template>
        <!-- <form @submit.prevent="submit">
          <v-layout column>
            <v-flex>
              <v-text-field
                id="email"
                name="email"
                type="email"
                :label="$t('login.EMAIL')"
                v-model="email"
                :data-vv-as="$t('login.EMAIL')"
                :rules="[rules.required, rules.email]"
                :error-messages="errors"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                id="password"
                name="password"
                type="password"
                :label="$t('login.PASSWORD')"
                v-model="password"
                :data-vv-as="$t('login.PASSWORD')"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex text-xs-center mt-5>
              <SubmitButton :text="$t('login.LOGIN')" />
            </v-flex>
            <v-flex text-xs-center>
              <v-btn
                :to="{ name: 'forgotPassword' }"
                color="white"
                small
                text
                class="btnForgotPassword"
                >{{ $t('login.FORGOT_PASSWORD') }}</v-btn
              >
            </v-flex>
          </v-layout>
        </form> -->
      </v-flex>
      <ErrorMessage />
    </v-layout>
  </v-container>
</template>

<script>
import router from '@/router'
import { mapActions } from 'vuex'
import { required, email, max } from 'vee-validate/dist/rules'
import {
  extend,
  ValidationObserver,
  // ValidationProvider,
  setInteractionMode
} from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty'
})

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters'
})

// extend('email', {
//   ...email,
//   message: 'Email must be valid'
// })

export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('login.TITLE')} - %s`
    }
  },
  data() {
    return {
      username: '',
      password: '',
      show: false,
      rules: {
        required: (value) => !!value || 'Required.',
        counter: (value) => value.length <= 20 || 'Max 20 characters',
        min: (v) => v.length >= 8 || 'Min 8 characters',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        emailMatch: () => "The·email and password you entered don't match",
        password: (value) => !!value || 'field is required'
      },
      submissionDetails: {
        username: '',
        password: ''
      },
      errors: []
    }
  },
  methods: {
    ...mapActions(['userLogin']),
    async submit() {
      const valid = await this.$refs.observer.validate() // await this.$validator.validateAll()
      console.log(valid)
      if (valid) {
        await this.userLogin({
          username: this.username,
          password: this.password
        })
      }
    },
    // submit() {
    //   this.$refs.observer.validate()
    // },
    clear() {
      this.$refs.observer.reset()
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },
    reset() {
      this.$refs.form.reset()
    }
    // errors() {}
  },
  created() {
    if (this.$store.state.auth.isTokenSet) {
      router.push({ name: 'home' })
    }
  },
  components: {
    // ValidationProvider,
    ValidationObserver
  }
}
</script>
