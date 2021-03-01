<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="editedItem.invoice_type"
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
        <v-toolbar-title>{{ $t('invoiceType.TITLE') }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
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
                      v-model="editedItem.invoice_type"
                      :label="$t('invoiceType.headers.INVOICE_TYPE')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.description"
                      :label="$t('invoiceType.headers.DESCRIPTION')"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
  <!-- <ErrorMessage />
  <SuccessMessage />   -->
</template>

<script>
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import { app } from '../main.js'

export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('account.TITLE')} - %s`
    }
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
      dialog: false,
      dialogDelete: false,
      editedItem: {
        invoice_type: '',
        customer: '',
        account_open_date: '',
        other_account_details: ''
      },
      defaultItem: {
        account_name: '',
        description: ''
      },
      editedIndex: -1
    }
  },
  computed: {
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
        {
          text: this.$i18n.t('invoiceType.headers.INVOICE_TYPE'),
          align: 'left',
          sortable: true,
          value: 'invoice_type'
        },
        {
          text: this.$i18n.t('invoiceType.headers.DESCRIPTION'),
          align: 'left',
          sortable: true,
          value: 'description'
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
    dialog(value) {
      return value ? true : this.close()
    },
    dialogDelete(val) {
      return val || this.closeDelete()
    },
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getCities(
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
      'getInvoiceTypes',
      'editInvoiceType',
      'saveInvoiceType',
      'deleteInvoiceType'
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
      this.dialog = true
    },
    async deleteItem(item) {
      try {
        const response = await this.$confirm(
          this.$t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM'),
          {
            title: this.$t('common.WARNING'),
            buttonTrueText: this.$t('common.DELETE'),
            buttonFalseText: this.$t('common.CANCEL'),
            buttonTrueColor: 'red lighten3',
            buttonFalseColor: 'yellow lighten3'
          }
        )
        if (response) {
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
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    // close () {
    // this.dialog = false
    // this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    // })
    // },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async save() {
      try {
        const valid = await this.$validator.validateAll()
        if (valid) {
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
            await this.saveAccount({ name: this.editedItem.name })
            await this.getAccounts(
              buildPayloadPagination(this.pagination, this.buildSearch())
            )
            this.dataTableLoading = false
          }
          this.close()
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
        this.close()
      }
    },
    paginationChangeHandler(pageNumber) {
      this.pagination.page = pageNumber
      this.getInvoiceTypes(
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
      await this.getInvoiceTypes(
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
