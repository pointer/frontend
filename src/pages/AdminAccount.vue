<template>
  <v-card>
    <v-card-title>
      {{ $t('account.TITLE') }}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="editedItem.account"
      class="elevation-1"
      :server-items-length="totalItems"
    >
      <template v-slot:item.createdAt="{ item }">
        <span>{{ $d(new Date(item.createdAt), 'short') }}</span>
      </template>
      <template v-slot:item.updatedAt="{ item }">
        <span>{{ $d(new Date(item.updatedAt), 'longNum') }}</span>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <!-- <v-toolbar-title>{{ $t('account.TITLE') }}</v-toolbar-title> -->
          <!-- <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer> -->
          <v-dialog v-model="accountDlg" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
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
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.account"
                        :label="$t('account.headers.ACCOUNT_NUM')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="18" sm="8" md="8">
                      <v-text-field
                        v-model="editedItem.account_designation"
                        :label="$t('account.headers.ACCOUNT_NAME')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="18" sm="10" md="8">
                      <v-text-field
                        v-model="editedItem.customer"
                        :label="$t('account.headers.CUSTOMER')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="18">
                      <v-text-field
                        v-model="editedItem.account_details"
                        :label="$t('account.headers.ACCOUNT_DETAILS')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  {{ $t('common.CANCEL') }}
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  {{ $t('common.SAVE') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small color="yellow darken-1" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <ConfirmDlg ref="confirm"> </ConfirmDlg>
    <ErrorMessage />
    <SuccessMessage />
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import { app } from '../main.js'
import ConfirmDlg from '@/components/common/ConfirmDlg'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { SuccessMessage } from '@/components/common/SuccessMessage'
const frenchLocale = require('date-fns/locale/fr')
export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('account.TITLE')} - %s`
    }
  },
  components: {
    // 'picture-input': PictureInput,
    ConfirmDlg,
    ErrorMessage,
    SuccessMessage
  },
  data() {
    return {
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
      fieldsToSearch: ['account_name'],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      sortBy: 'account_name',
      sortDesc: false,
      errorMessages: [],
      dataTableLoading: '',
      accountDlg: false,
      dialogDelete: false,
      editedItem: {
        account: null,
        customer: null,
        account_designation: null,
        account_details: null
      },
      defaultItem: {
        account: null,
        customer: null,
        account_designation: null,
        account_details: null
      },
      editedIndex: -1
    }
  },
  computed: {
    formTitle() {
      return this.editedItem._id
        ? this.$t('dataTable.EDIT_ITEM')
        : this.$t('dataTable.NEW_ACCOUNT')
    },
    headers() {
      return [
        {
          text: this.$i18n.t('dataTable.ACTIONS'),
          value: 'actions',
          sortable: false,
          width: 100
        },
        {
          text: this.$i18n.t('account.headers.ACCOUNT_NUM'),
          align: 'left',
          sortable: true,
          value: 'account'
        },
        {
          text: this.$i18n.t('account.headers.ACCOUNT_NAME'),
          align: 'left',
          sortable: true,
          value: 'account_designation'
        },
        {
          text: this.$i18n.t('account.headers.CUSTOMER'),
          align: 'left',
          sortable: true,
          value: 'customer'
        },
        {
          text: this.$i18n.t('account.headers.ACCOUNT_DETAILS'),
          align: 'left',
          sortable: true,
          value: 'account_details'
        },
        {
          text: this.$i18n.t('common.CREATED'),
          align: 'left',
          sortable: true,
          value: 'createdAt'
        },
        {
          text: this.$i18n.t('common.UPDATED'),
          align: 'left',
          sortable: true,
          value: 'updatedAt'
        }
      ]
    },
    items() {
      return this.$store.state.adminAccount.accounts
    },
    totalItems() {
      return this.$store.state.adminAccount.totalAccounts
    },
    pages() {
      if (this.pagination.rowsPerPage === null || this.totalItems === null) {
        return 0
      }
      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    // accountDlg(value) {
    //   return value ? true : this.close()
    // },
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getAccounts(
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
    async search() {
      clearTimeout(this.delayTimer)
      this.delayTimer = setTimeout(() => {
        this.doSearch()
      }, 400)
    }
  },
  methods: {
    ...mapActions([
      'getAccounts',
      'editAccount',
      'saveAccount',
      'deleteAccount'
    ]),
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'iii, MMMM d yyyy, h:mm a')
    },
    doSomething(v) {
      // // console.log('pagination', v)
      this.pagination = v
    },
    async doSearch() {
      try {
        this.dataTableLoading = true
        await this.getAccounts(
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
      this.editedItem = Object.assign({}, item)
      this.editedIndex = this.items.indexOf(item)
      this.accountDlg = true
    },
    async deleteItem(item) {
      try {
        console.debug()
        if (
          await this.$refs.confirm.openConfirm(
            'Confirmer',
            this.$t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM')
          )
        ) {
          this.dataTableLoading = true
          await this.deleteAccount(item._id)
          await this.getAccounts(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    },
    close() {
      this.accountDlg = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async save() {
      try {
        // const valid = await this.$validator.validateAll()
        // if (valid) {
        this.dataTableLoading = true
        // Updating item
        if (this.editedItem._id) {
          await this.editAccount(this.editedItem)
          await this.getAccounts(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        } else {
          // Creating new item
          await this.saveAccount(this.editedItem)
          await this.getAccounts(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        }
        this.close()
        // }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
        this.close()
      }
    },
    paginationChangeHandler(pageNumber) {
      this.pagination.page = pageNumber
      this.getAccounts(
        buildPayloadPagination(this.pagination, this.buildSearch())
      )
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
    try {
      this.dataTableLoading = true
      await this.getAccounts(
        buildPayloadPagination(this.pagination, this.buildSearch())
      )
      this.dataTableLoading = false
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      this.dataTableLoading = false
    }
  }
}
</script>
