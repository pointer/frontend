<template>
  <v-footer padless app>
    <v-row no-gutters>
      <v-col cols="6">
        <div style="text-align: left">
          <span color="#797979">
            {{ new Date().getFullYear() }} — Miradata
          </span>
        </div>
      </v-col>
      <!-- <v-col>
         <v-btn text v-if="isTokenSet" @click="userLogout"> Logout </v-btn>
         <div style="text-align: right;">
          <v-switch
            label="Logout"
            v-if="isTokenSet"
            @click="userLogout"
            inset
            class="mx-2"
          >
          </v-switch>
        </div>
      </v-col>-->
    </v-row>
  </v-footer>
</template>
<!--
<template>
  <v-footer height="60" class="mt-5 justify-center text-xs-center d-block">
    <div class="mt-2">
      v{{ appVersion }} {{ $t('footer.MADE_WITH') }}
      <v-icon small class="red--text mx-0 px-0"></v-icon>
      &nbsp;{{ $t('footer.BY') }}
    <v-btn
      text
      v-if="isTokenSet"
      @click="userLogout"
      class="hidden-sm-and-down btnLogout"
    >
      <v-icon left>mdi-exit-to-app</v-icon>
      {{ $t('menuItems.LOGOUT') }}
    </v-btn>
    </div>
    <div>
      <a href=""></a>
    </div>

  </v-footer>
</template>
-->
<script>
import { mapGetters } from 'vuex'
import LocaleChanger from '@/components/core/LocaleChanger'
import ResizeText from 'vue-resize-text'

export default {
  name: 'Footer',
  data: () => ({
    links: ['Logout', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us']
  }),
  computed: {
    ...mapGetters(['appTitle', 'isTokenSet', 'user']),
    appVersion() {
      return this.$store.getters.appVersion
    }
  },
  methods: {
    userLogout() {
      this.$store.dispatch('userLogout')
    }
  }
}
</script>
