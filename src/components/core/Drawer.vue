<template>
  <div id="drawerapp">
    <!-- <v-app-bar app color="primary" dark elevation="0">
      <v-app-bar-nav-icon
        @click.stop="sidebarMenu = !sidebarMenu"
      ></v-app-bar-nav-icon>
      <v-list-item class="hidden-sm-and-down">
        <v-icon>mdi-weather-sunny</v-icon>
        <v-list-item-action>
          <v-switch color="primary " v-model="isDark" inset></v-switch>
        </v-list-item-action>
        <v-icon class="pl-2">mdi-weather-night</v-icon>
      </v-list-item>
      <v-toolbar-items>
        <v-btn
          text
          v-for="(item, index) in menuItems"
          :key="index"
          :to="{ name: item.link }"
          exact
          :class="['hidden-sm-and-down', item.class]"
          color="primary"
        >
          <v-icon>{{ item.icon }}</v-icon>
          &nbsp;{{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <LocaleChanger />
    </v-app-bar> -->

    <v-navigation-drawer
      v-model="sidebarMenu"
      app
      expand-on-hover
      :permanent="sidebarMenu"
      :mini-variant.sync="mini"
      height="100%"
      width="344"
      color="dark"
    >
      <!-- <v-system-bar></v-system-bar> -->
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-icon @click.stop="sidebarMenu = !sidebarMenu" color="primary"
              >mdi-chevron-left</v-icon
            >
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="primary--text" dark>
              <h4 class="font-weight-thin">{{ appTitle }}</h4>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- </v-list> -->
        <v-list-item class="px-2" @click="toggleMini = !toggleMini">
          <v-list-item-avatar>
            <v-icon color="primary">mdi-account-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-truncate">
            <v-list-item-title class="primary--text" dark>
              <h4 class="font-weight-thin">{{ username }}</h4>
            </v-list-item-title>
          </v-list-item-content>
          <v-btn icon small>
            <v-icon color="primary">mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <template>
        <v-card class="mx-auto" width="300">
          <v-list nav>
            <v-list-item href="/home">
              <v-list-item-icon>
                <v-icon color="primary">mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="primary--text" dark
                >Home</v-list-item-title
              >
            </v-list-item>
            <v-list-group v-if="admin" :value="true" no-action color="primary">
              <v-icon slot="prependIcon" color="primary">mdi-creation</v-icon>
              <template v-slot:activator>
                <!-- <v-list-item-content> -->
                <v-list-item>
                  <v-list-item-title class="primary--text" dark>{{
                    $t('manageItems.TITLE')
                  }}</v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item
                v-for="(item, index) in manageItems"
                :key="index"
                :to="{ name: item.link }"
                exact
                :class="[item.class]"
              >
                <v-list-item-content>
                  <!-- :class="customColor(item.title)" -->
                  <v-list-item-title class="primary--text">{{
                    item.title
                  }}</v-list-item-title>
                </v-list-item-content>
                <v-icon color="primary">
                  {{ item.icon }}
                </v-icon>
              </v-list-item>
            </v-list-group>
            <v-list-group v-if="admin" :value="true" no-action color="primary">
              <v-icon slot="prependIcon" color="primary"
                >mdi-account-supervisor</v-icon
              >
              <template v-slot:activator>
                <!-- <v-list-item-content> -->
                <v-list-item>
                  <v-list-item-title class="primary--text" dark>{{
                    $t('adminItems.ADMIN')
                  }}</v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item
                v-for="(item, index) in adminItems"
                :key="index"
                :to="{ name: item.link }"
                exact
                :class="[item.class]"
              >
                <v-list-item-content>
                  <!-- :class="customColor(item.title)" -->
                  <v-list-item-title class="primary--text">{{
                    item.title
                  }}</v-list-item-title>
                </v-list-item-content>
                <v-icon color="primary">
                  {{ item.icon }}
                </v-icon>
              </v-list-item>
            </v-list-group>
            <v-list-item v-if="admin">
              <v-list-item-icon>
                <v-icon color="primary">mdi-settings</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="primary--text" dark>{{
                $t('adminItems.SYSTEM_CONFIG')
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
// Utilities
import { mapGetters, mapState, mapActions } from 'vuex'
// import LocaleChanger from '@/components/core/LocaleChanger'
// import Home from '../components/Home.vue'
import ResizeText from 'vue-resize-text'
export default {
  name: 'Drawer',
  props: {
    expandOnHover: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      sidebarMenu: true,
      toggleMini: false,
      items: [],
      isDark: false,
      username: null,
      mini: true
    }
  },
  components: {
    // LocaleChanger
  },
  directives: {
    ResizeText
  },
  computed: {
    ...mapState(['', '']),
    ...mapGetters(['appTitle', 'isTokenSet', 'user']),
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('SET_DRAWER', val)
      }
    },
    computedItems() {
      return this.items.map(this.mapItem)
    },
    profile() {
      return {
        avatar: true,
        title: this.$t('avatar')
      }
    },
    buttonText() {
      return !this.$vuetify.theme.dark ? 'Go Dark' : 'Go Light'
    },
    admin() {
      return this.user !== null ? this.user.role === 'admin' : false
    },
    manageItems() {
      return [
        {
          title: this.$t('manageItems.headers.ORDER'),
          link: 'admin-order',
          icon: 'mdi-reorder-horizontal',
          class: 'btnAdminBusiness'
        },
        {
          title: this.$t('manageItems.headers.ORDER_ITEM'),
          link: 'admin-order-item',
          icon: 'mdi-sitemap',
          class: 'btnAdminBusiness'
        },
        {
          title: this.$t('manageItems.headers.INVOICE'),
          link: 'admin-invoice',
          icon: 'mdi-billiards-rack',
          class: 'btnAdminSite'
        },
        {
          title: this.$t('manageItems.headers.INVOICE_LINE_ITEM'),
          link: 'admin-invoice-line-item',
          icon: 'mdi-details',
          class: 'btnAdminSite'
        },
        {
          title: this.$t('manageItems.headers.TRANSACTION'),
          link: 'admin-transaction',
          icon: 'mdi-bank-transfer',
          class: 'btnAdminSite'
        }
      ]
    },
    adminItems() {
      return [
        {
          title: this.$t('adminItems.DOCUMENTS'),
          link: 'admin-documents',
          icon: 'mdi-file-document-box-multiple-outline',
          class: 'btnAdminTask'
        },
        {
          title: this.$t('adminItems.ACCOUNTS'),
          link: 'admin-account',
          icon: 'mdi-account-box-multiple',
          class: 'btnAdminTask'
        },
        {
          title: this.$t('adminItems.CUSTOMER'),
          link: 'admin-customer',
          icon: 'mdi-clipboard-account-outline',
          class: 'btnAdminEquip'
        },
        {
          title: this.$t('supplier.TITLE'),
          link: 'admin-suppliers',
          icon: 'mdi-clipboard-account-outline',
          class: 'btnAdminEquip'
        },
        {
          title: this.$t('adminItems.PRODUCT'),
          link: 'admin-product',
          icon: 'mdi-factory',
          class: 'btnAdminEquipTask'
        },
        {
          title: this.$t('adminItems.PRODUCT_TYPE'),
          link: 'admin-product-type',
          icon: 'mdi-format-list-checks',
          class: 'btnAdminEquipTask'
        },
        {
          title: this.$t('adminItems.INVOICE_TYPE'),
          link: 'admin-invoice-type',
          icon: 'mdi-garage-alert',
          class: 'btnAdminSite'
        },
        {
          title: this.$t('adminItems.TRANSACTION_TYPE'),
          link: 'admin-transaction-type',
          icon: 'mdi-garage-alert',
          class: 'btnAdminSite'
        },
        {
          title: this.$t('adminItems.USERS'),
          link: 'admin-users',
          icon: 'mdi-account-multiple',
          class: 'btnAdminUsers'
        },
        {
          title: this.$t('adminItems.BUSINESS'),
          link: 'admin-organisation',
          icon: 'mdi-information',
          class: 'btnAdminUsers'
        }
      ]
    },
    controlItems() {
      return []
    },
    metricItems() {
      return []
    },
    menuItems() {
      if (this.isTokenSet) {
        return [
          {
            title: this.$t('Home'),
            link: 'home',
            icon: 'mdi-home',
            class: 'btnHome'
          }
          // {
          //   title: this.$t('menuItems.ABOUT'),
          //   link: 'about',
          //   icon: 'mdi-help-circle-outline',
          //   class: 'btnAbout'
          // },
          // {
          //   title: this.$t('menuItems.MY_PROFILE'),
          //   link: 'profile',
          //   icon: 'mdi-face',
          //   class: 'btnProfile'
          // }
        ]
      }
      return [
        {
          title: this.$t('Home'),
          link: 'landing',
          icon: 'mdi-home',
          class: 'btnHome'
        },
        // {
        //   title: this.$t('menuItems.ABOUT'),
        //   link: 'about',
        //   icon: 'mdi-help-circle-outline',
        //   class: 'btnAbout'
        // },
        {
          title: this.$t('menuItems.LOGIN'),
          link: 'login',
          icon: 'mdi-lock',
          class: 'btnLogin'
        }
        // {
        //   title: this.$t('menuItems.SIGNUP'),
        //   link: 'signup',
        //   icon: 'mdi-plus-circle-outline',
        //   class: 'btnLogin'
        // }
      ]
    },
    dashboardItems() {
      return []
    }
  },
  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title)
      }
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    customColor(text) {
      return text === 'Controles' ? 'green--text' : ''
    }
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark
      localStorage.setItem('dark', this.isDark)
    }
  },
  async mounted() {
    const theme = localStorage.getItem('dark')

    if (theme === 'true') {
      this.isDark = true
    } else {
      this.isDark = false
    }
    const user = JSON.parse(localStorage.getItem('user'))
    this.username = user.username
  }
}
</script>
<!-- <style lang="sass"> -->
<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.theme--light.v-application ::-webkit-scrollbar {
  width: 13px;
}

.theme--light.v-application ::-webkit-scrollbar-track {
  background: #e6e6e6;
  border-left: 1px solid #dadada;
}

.theme--light.v-application ::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border: solid 3px #e6e6e6;
  border-radius: 7px;
}

.theme--light.v-application ::-webkit-scrollbar-thumb:hover {
  background: black;
}

.theme--dark.v-application ::-webkit-scrollbar {
  width: 13px;
}

.theme--dark.v-application ::-webkit-scrollbar-track {
  background: #202020;
  border-left: 1px solid #2c2c2c;
}

.theme--dark.v-application ::-webkit-scrollbar-thumb {
  background: #3e3e3e;
  border: solid 3px #202020;
  border-radius: 7px;
}

.theme--dark.v-application ::-webkit-scrollbar-thumb:hover {
  background: white;
}
</style>
