<template>
  <div>
    <!-- <v-app> -->
    <v-layout wrap>
      <v-flex xs12 sm12 md4 mt-3 pl-4>
        <v-toolbar-title>{{ $t('users.TITLE') }}</v-toolbar-title>
      </v-flex>
      <v-flex xs12 sm6 md4 px-3>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('dataTable.SEARCH')"
          single-line
          hide-details
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm6 md4 text-xs-right mb-2 mt-2 pr-2>
        <v-dialog
          v-model="dialog"
          max-width="800px"
          content-class="dlgNewEditItem"
        >
          <template v-slot:activator="{ on }">
            <v-btn color="secondary" v-on="on" class="btnNewItem pr-4">
              <v-icon class="mr-2">mdi-plus</v-icon>
              {{ $t('dataTable.NEW_ITEM') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <template v-if="editedItem._id">
                    <v-col cols="12" sm="6" md="4">
                      <label for="createdAt">{{ $t('common.CREATED') }}</label>
                      <div name="createdAt">
                        {{ getFormat(editedItem.createdAt) }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <label for="updatedAt">{{ $t('common.UPDATED') }}</label>
                      <div name="updatedAt">
                        {{ getFormat(editedItem.updatedAt) }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <label for="verified">{{
                        $t('users.headers.VERIFIED')
                      }}</label>
                      <div
                        name="verified"
                        v-html="trueFalse(editedItem.verified)"
                      ></div>
                    </v-col>
                  </template>
                  <!-- <v-col cols="12" sm="6" md="4">
                    <image-input v-model="editedItem.avatar">
                      <div slot="activator">
                        <v-avatar
                          size="100px"
                          v-ripple
                          v-if="!editedItem.avatar"
                          class="grey lighten-3 mb-3"
                          color="teal"
                        >
                          <span>Click to add avatar</span>
                        </v-avatar>
                        <v-avatar
                          size="75px"
                          v-ripple
                          v-else
                          class="mb-3"
                          color="teal"
                        >
                          <v-img
                            :src="editedItem.avatar.imageURL"
                            alt="avatar"
                          />
                        </v-avatar>
                      </div>
                    </image-input>
                  </v-col> -->
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      id="username"
                      name="username"
                      v-model="editedItem.username"
                      :label="$t('users.headers.USER_NAME')"
                      :data-vv-as="$t('users.headers.USER_NAME')"
                      :error-messages="errorMessages"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      id="firstname"
                      name="firstname"
                      v-model="editedItem.firstname"
                      :label="$t('users.headers.FIRST_NAME')"
                      :data-vv-as="$t('users.headers.FIRST_NAME')"
                      :error-messages="errorMessages"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      id="lastname"
                      name="lastname"
                      v-model="editedItem.lastname"
                      :label="$t('users.headers.LAST_NAME')"
                      :data-vv-as="$t('users.headers.LAST_NAME')"
                      :error-messages="errorMessages"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      id="email"
                      name="email"
                      type="email"
                      v-model="editedItem.email"
                      :label="$t('users.headers.EMAIL')"
                      :data-vv-as="$t('users.headers.EMAIL')"
                      :error-messages="errorMessages"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <template v-if="!editedItem._id">
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        id="password"
                        name="password"
                        type="password"
                        :label="$t('users.PASSWORD')"
                        v-model="editedItem.password"
                        :data-vv-as="$t('users.PASSWORD')"
                        :error-messages="errorMessages"
                        key="password"
                        v-validate.disable="'required|min:5'"
                        ref="password"
                        autocomplete="off"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        :label="$t('users.CONFIRM_PASSWORD')"
                        v-model="editedItem.confirmPassword"
                        :data-vv-as="$t('users.PASSWORD')"
                        :error-messages="errorMessages"
                        key="confirmPassword"
                        v-validate.disable="'required|min:5|confirmed:password'"
                        autocomplete="off"
                      ></v-text-field>
                    </v-col>
                  </template>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      clearable
                      id="role"
                      name="role"
                      v-model="editedItem.role"
                      :items="roles"
                      item-text="name"
                      item-value="value"
                      :label="$t('users.headers.ROLE')"
                      :data-vv-as="$t('users.headers.ROLE')"
                      :error-messages="errorMessages"
                      class="inputRole"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-autocomplete
                      id="city"
                      name="city"
                      :label="$t('users.headers.CITY')"
                      :search-input.sync="searchInput"
                      v-model="editedItem.city"
                      :items="allCities"
                      clearable
                      :data-vv-as="$t('users.headers.CITY')"
                      :error-messages="errorMessages"
                      autocomplete="off"
                      class="inputCity"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      id="phone"
                      name="phone"
                      type="tel"
                      v-model="editedItem.phone"
                      :label="$t('users.headers.PHONE')"
                      :data-vv-as="$t('users.headers.PHONE')"
                      :error-messages="errorMessages"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      id="skill"
                      name="skill"
                      v-model="editedItem.skill"
                      :label="$t('users.headers.SKILLS')"
                      :data-vv-as="$t('users.headers.SKILLS')"
                      :error-messages="errorMessages"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-text-field
                    id="observations"
                    name="observations"
                    v-model="editedItem.observations"
                    :label="$t('users.headers.OBSERVATIONS')"
                    :data-vv-as="$t('users.headers.OBSERVATIONS')"
                    :error-messages="errorMessages"
                    autocomplete="off"
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red lighten3"
                text
                @click="close"
                class="btnCancel"
                >{{ $t('dataTable.CANCEL') }}</v-btn
              >
              <v-btn
                color="yellow lighten3"
                text
                @click="save"
                class="btnSave"
                >{{ $t('dataTable.SAVE') }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex xs12 sm6 md4 text-xs-right mb-2 mt-2 pr-2>
        <template>
          <v-row justify="center">
            <v-dialog v-model="confirm" persistent max-width="290">
              <v-card>
                <v-card-title class="headline">{{
                  $t('common.WARNING')
                }}</v-card-title>
                <v-card-text>{{
                  $t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM')
                }}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="confirm = false">{{
                    $t('common.CANCEL')
                  }}</v-btn>
                  <v-btn color="red darken-1" text @click="doDeleteItem()">{{
                    $t('common.DELETE')
                  }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="items"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      item-key="username"
      :search="search"
      :server-items-length="totalItems"
      class="elevation-1"
      @page-count="pageCount = $event"
      @pagination="doSomething"
    >
      <template v-slot:item.createdAt="{ item }">
        <span>{{ $d(new Date(item.createdAt), 'short') }}</span>
      </template>
      <template v-slot:item.updatedAt="{ item }">
        <span>{{ $d(new Date(item.updatedAt), 'longNum') }}</span>
      </template>
      <template v-slot:item._id="props">
        <v-layout class="justify-center">
          <!-- <v-tooltip top>
            <template #activator="on">
              <v-btn
                v-on="on"
                color="blue darken-1"
                @click="sendMessage(props.item)"
                icon
                class="mx-0"
              >
                <v-icon>mdi-message-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('dataTable.EDIT') }}</span>
          </v-tooltip> -->
          <v-tooltip top>
            <template #activator="on">
              <v-btn v-on="on" @click="editItem(props.item)" icon class="mx-0">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('dataTable.EDIT') }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="on">
              <v-btn
                icon
                color="yellow darken-1"
                class="mx-0"
                v-on="on"
                @click="deleteItem($event, props.item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('dataTable.DELETE') }}</span>
          </v-tooltip>
        </v-layout>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
      <v-text-field
        :value="itemsPerPage"
        label="Items per page"
        type="number"
        min="-1"
        max="15"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field>
    </div>
    <ErrorMessage />
    <SuccessMessage />
    <!-- </v-app> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
// import ImageInput from './ImageInput.vue'

// const fs = require('fs')
export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('users.TITLE')} - %s`
    }
  },
  data() {
    return {
      searchInput: '',
      dataTableLoading: true,
      delayTimer: null,
      dialog: false,
      confirm: false,
      messageText: '',
      messageSubject: '',
      messageDialog: false,
      search: '',
      pagination: {
        itemsPerPage: 10,
        pageStart: null,
        pageStop: null,
        pageCount: null,
        itemsLength: null,
        descending: !!this.$route.query.desc,
        sortBy: this.$route.query.orderby || 'name',
        rowsPerPage: `Number(this.$route.query.limit)` || 10,
        page: `Number(this.$route.query.page)` || 1,
        totalItems: 0
      },
      editedItem: { status: true },
      defaultItem: {},
      item2Delete: {},
      fieldsToSearch: ['username', 'email', 'role', 'city', 'phone'],
      saving: false,
      saved: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      sortBy: 'username',
      sortDesc: false,
      errorMessages: []
    }
  },
  components: {
    // ImageInput
    // binData,
    // serialize,
    // deserialize
  },
  computed: {
    roles() {
      return [
        { name: this.$t('roles.ADMIN'), value: 'admin' },
        { name: this.$t('roles.USER'), value: 'user' }
      ]
    },
    allCities() {
      return this.$store.state.cities.allCities
    },
    formTitle() {
      return this.editedItem._id
        ? this.$t('dataTable.EDIT_ITEM')
        : this.$t('dataTable.NEW_ITEM')
    },
    headers() {
      return [
        {
          text: this.$i18n.t('dataTable.ACTIONS'),
          value: 'actions',
          sortable: false,
          width: 100
        },
        // {
        //   text: this.$i18n.t('users.headers.USER_AVATAR'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'avatar'
        // },
        {
          text: this.$i18n.t('users.headers.USER_NAME'),
          align: 'left',
          sortable: true,
          value: 'username'
        },
        {
          text: this.$i18n.t('users.headers.FIRST_NAME'),
          align: 'left',
          sortable: true,
          value: 'firstname'
        },
        {
          text: this.$i18n.t('users.headers.LAST_NAME'),
          align: 'left',
          sortable: true,
          value: 'lastname'
        },
        {
          text: this.$i18n.t('users.headers.EMAIL'),
          align: 'left',
          sortable: true,
          value: 'email'
        },
        {
          text: this.$i18n.t('users.headers.PHONE'),
          align: 'left',
          sortable: true,
          value: 'phone'
        },
        {
          text: this.$i18n.t('users.headers.ROLE'),
          align: 'left',
          sortable: true,
          value: 'role'
        },
        {
          text: this.$i18n.t('users.headers.STATUS'),
          align: 'left',
          sortable: true,
          value: 'status'
        }
        // {
        //   text: this.$i18n.t('users.headers.VERIFIED'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'verified'
        // },
        // {
        //   text: this.$i18n.t('users.headers.CITY'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'city'
        // },
        // {
        //   text: this.$i18n.t('users.headers.SKILLS'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'skill'
        // },
        // {
        //   text: this.$i18n.t('users.headers.OBSERVATIONS'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'observations'
        // },
        // {
        //   text: this.$i18n.t('common.CREATED'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'createdAt'
        // },
        // {
        //   text: this.$i18n.t('common.UPDATED'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'updatedAt'
        // }
      ]
    },
    items() {
      return this.$store.state.adminUsers.users
    },
    totalItems() {
      return this.$store.state.adminUsers.totalUsers
    },
    // confirm: {
    //   get() {
    //     return this.visible
    //   },
    //   set(value) {
    //     if (!value) {
    //       this.$emit('close')
    //     }
    //   }
    // }
    pages() {
      if (this.pagination.rowsPerPage === null || this.totalItems === null) {
        return 0
      }
      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    dialog(value) {
      return value ? true : this.close()
    },
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getUsers(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          this.dataTableLoading = false
        }
      },
      deep: true
    },
    search() {
      clearTimeout(this.delayTimer)
      this.delayTimer = setTimeout(() => {
        this.doSearch()
      }, 400)
    },
    avatar: {
      handler() {
        this.saved = false
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'getAllCities',
      'getUsers',
      'editUser',
      'saveUser',
      'deleteUser'
    ]),
    // formatAvatar(userArray) {},
    getObjectKeys(obj, prefix = '') {
      return Object.entries(obj).reduce((collector, [key, val]) => {
        const newKeys = [...collector, prefix ? `${prefix}.${key}` : key]
        if (Object.prototype.toString.call(val) === '[object Object]') {
          const newPrefix = prefix ? `${prefix}.${key}` : key
          const otherKeys = this.getObjectKeys(val, newPrefix)
          return [...newKeys, ...otherKeys]
        }
        return newKeys
      }, [])
    },
    doSomething(v) {
      // // console.log('pagination', v)
      this.pagination = v
    },
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'iii, MMMM d yyyy, h:mm a')
    },
    roleName(value) {
      if (value === 'admin') {
        return this.$t('roles.ADMIN')
      } else if (value === 'user') {
        return this.$t('roles.USER')
      }
      return this.$t('roles.AGENT')

      // return value === 'admin'
      //   ? this.$t('roles.ADMIN')
      //   : value === 'user'
      //   ? this.$t('roles.USER')
      //   : this.$t('roles.AGENT')
    },
    trueFalse(value) {
      return value
        ? '<i aria-hidden="true" class="v-icon mdi mdi-check green--text" style="font-size: 16px;"></i>'
        : '<i aria-hidden="true" class="v-icon mdi mdi-close red--text" style="font-size: 16px;"></i>'
    },
    async doSearch() {
      try {
        this.dataTableLoading = true
        await this.getUsers(
          buildPayloadPagination(this.pagination, this.buildSearch())
        )
        this.dataTableLoading = false
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    },
    buildSearch() {
      return this.search
        ? { query: this.search, fields: this.fieldsToSearch.join(',') }
        : {}
    },
    editItem(item) {
      // // console.log(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    sendMessage(item) {
      this.sendItem = Object.assign({}, item)
      this.messageDialog = true
    },
    async deleteItem($event, item) {
      try {
        this.item2Delete = Object.assign({}, item)
        this.confirm = true
        // const response = this.doDeleteItem(item)
        // if (response) {
        //   this.dataTableLoading = false
        // }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // // console.log(error)
        this.dataTableLoading = false
      }
    },
    async doDeleteItem() {
      this.dataTableLoading = true
      this.confirm = false
      await this.deleteUser(this.item2Delete._id)
      await this.getUsers(
        buildPayloadPagination(this.pagination, this.buildSearch())
      )
      this.dataTableLoading = false
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      }, 300)
    },
    async save() {
      try {
        // const valid = await this.$validator.validateAll()
        // if (valid) {
        this.dataTableLoading = true
        // Updating item
        if (this.editedItem._id) {
          await this.editUser(this.editedItem)
          await this.getUsers(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        } else {
          // Creating new item
          await this.saveUser({
            username: this.editedItem.username,
            email: this.editedItem.email,
            role: this.editedItem.role,
            phone: this.editedItem.phone,
            firstname: this.editedItem.firstname,
            lastname: this.editedItem.lastname,
            password: this.editedItem.password
          })
          await this.getUsers(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        }
        this.close()
        return
        // }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
        this.close()
      }
    },
    uploadImage() {
      this.saving = true
      setTimeout(() => this.savedAvatar(), 1000)
      // // console.log(this.editItem.avatar)
    },
    savedAvatar() {
      this.saving = false
      this.saved = true
      // debugger
      // // console.log(this.editItem.avatar)
    },
    paginationChangeHandler(pageNumber) {
      this.pagination.page = pageNumber
      this.getUsers()
    },
    toggleOrder() {
      this.pagination.sortDesc = !this.pagination.sortDesc
    },
    nextSort() {
      let index = this.headers.findIndex((h) => h.value === this.sortBy)
      index = (index + 1) % this.headers.length
      this.sortBy = this.headers[index].value
    }
  },
  async mounted() {
    await this.getAllCities()
    try {
      this.dataTableLoading = true
      await this.getUsers(
        buildPayloadPagination(this.pagination, this.buildSearch())
      )
      this.dataTableLoading = false
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      this.dataTableLoading = false
    }
  }
  // props: ['visible']
}
</script>

<style>
table.v-table {
  max-width: none;
}
</style>

<!--
<template>
    <form novalidate ref="loginForm" v-model="formValid" @submit.stop.prevent="formSubmitted" @keyup.enter="formSubmitted">
      <v-container grid-list-md text-xs-center>
        <v-layout column>
          <v-flex>
            <v-text-field
              name="passwordField"
              label="Enter your Password"
              hint="At least 6 characters"
              v-model="submissionDetails.password"
              :type="passwordShown ? 'text' : 'password'"
              min="6"
              required
              :append-icon="passwordShown ? 'visibility_off': 'visibility'"
              :append-icon-cb="()=>(passwordShown = !passwordShown)"
              v-validate="'required|min:6'"
              data-vv-name="password"
              :error-messages="errors.collect('password')"
              ref="password"
              @change="inputTriggered"
              @input="inputTriggered"
            />
          </v-flex>
          <v-flex v-show="createAccountTicked">
            <v-text-field
              name="confirmPasswordField"
              label="Confirm your Password"
              hint="At least 6 characters"
              v-model="confirmPassword"
              :type="passwordShown ? 'text' : 'password'"
              min="6"
              required
              :append-icon="passwordShown ? 'visibility_off': 'visibility'"
              :append-icon-cb="()=>(passwordShown = !passwordShown)"
              v-validate="'required|confirmed:$password'"
              data-vv-name="confirmPassword"
              :error-messages="errors.collect('confirmPassword')"/>
          </v-flex>
        </v-layout>
      </v-container>
    </form>
  </template>
  //<script>

//
//   export default {
//     name: 'email-password-form',
//     data () {
//       return {
//         submissionDetails: {
//           email: '',
//           password: ''
//         },
//         confirmPassword: '',
//         passwordShown: false,
//         createAccountTicked: false
//       };
//     }
//   };
// </script>
-->
