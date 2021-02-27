<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="editedItem.company"
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
        <v-toolbar-title>{{ $t('supplier.TITLE') }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="customerdlg" max-width="500px">
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
                      v-model="editedItem.lastname"
                      :label="$t('supplier.headers.LASTNAME')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.firstname"
                      :label="$t('supplier.headers.FIRSTNAME')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.customer_name"
                      :label="$t('supplier.headers.SUPPLIER_NAME')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.email"
                      :label="$t('supplier.headers.EMAIL')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.customer_abn"
                      :label="$t('supplier.headers.SUPPLIER_ABN')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.company"
                      :label="$t('supplier.headers.COMPANY')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.address"
                      :label="$t('supplier.headers.ADDRESS')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.postal_code"
                      :label="$t('supplier.headers.POSTAL_CODE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.city"
                      :label="$t('supplier.headers.CITY')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.province"
                      :label="$t('supplier.headers.PROVINCE')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.mobile"
                      :label="$t('supplier.headers.MOBILE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.phone"
                      :label="$t('supplier.headers.PHONE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.role"
                      :label="$t('supplier.headers.ROLE')"
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
      <v-icon small @click="deleteItem(item)" color="yellow darken-1">
        mdi-delete
      </v-icon>
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
      titleTemplate: `${this.$t('supplier.TITLE')} - %s`
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
      customerdlg: false,
      dialogDelete: false,
      editedItem: {
        firstname: '',
        lastname: '',
        customer_name: '',
        customer_abn: '',
        email: '',
        company: '',
        address: '',
        phone: '',
        mobile: '',
        city: '',
        province: '',
        role: ''
      },
      defaultItem: {
        firstname: '',
        lastname: '',
        customer_name: '',
        customer_abn: '',
        email: '',
        company: '',
        address: '',
        phone: '',
        mobile: '',
        city: '',
        province: '',
        role: ''
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
        // {
        //   text: this.$i18n.t('supplier.headers.FIRSTNAME'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'firstname'
        // },
        // {
        //   text: this.$i18n.t('supplier.headers.LASTNAME'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'lastname'
        // },
        {
          text: this.$i18n.t('supplier.headers.SUPPLIER_NAME'),
          align: 'left',
          sortable: true,
          value: 'company'
        },
        {
          text: this.$i18n.t('supplier.headers.SUPPLIER_ABN'),
          align: 'left',
          sortable: true,
          value: 'customer_abn'
        },
        {
          text: this.$i18n.t('supplier.headers.EMAIL'),
          align: 'left',
          sortable: true,
          value: 'email'
        },
        // {
        //   text: this.$i18n.t('supplier.headers.ADDRESS'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'address'
        // },
        // {
        //   text: this.$i18n.t('supplier.headers.POSTAL_CODE'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'postal_code'
        // },
        // {
        //   text: this.$i18n.t('supplier.headers.CITY'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'city'
        // },
        // {
        //   text: this.$i18n.t('supplier.headers.PROVINCE'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'province'
        // },
        {
          text: this.$i18n.t('supplier.headers.PHONE'),
          align: 'left',
          sortable: true,
          value: 'phone'
        },
        {
          text: this.$i18n.t('supplier.headers.MOBILE'),
          align: 'left',
          sortable: true,
          value: 'mobile'
        },
        // {
        //   text: this.$i18n.t('supplier.headers.ROLE'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'role'
        // },
        // {
        //   text: this.$i18n.t('common.CREATED'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'createdAt'
        // },
        {
          text: this.$i18n.t('common.UPDATED'),
          align: 'left',
          sortable: true,
          value: 'updatedAt'
        }
      ]
    },
    items() {
      return this.$store.state.adminSuppliers.suppliers
    },
    totalItems() {
      return this.$store.state.adminSuppliers.totalSuppliers
    },
    pages() {
      if (this.pagination.rowsPerPage === null || this.totalItems === null) {
        return 0
      }
      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    customerdlg(value) {
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
      'editSupplier',
      'saveSupplier',
      'deleteSupplier',
      'getSuppliers'
    ]),
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'iii, MMMM d yyyy, h:mm a')
    },
    doSomething(v) {
      // console.log('pagination', v)
      this.pagination = v
    },
    async doSearch() {
      try {
        this.dataTableLoading = true
        await this.getSuppliers(
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
      this.customerdlg = true
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
          await this.deleteCustomer(item._id)
          await this.getSuppliers(
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
      this.customerdlg = false
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
    // this.customerdlg = false
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
            await this.editSupplier(this.editedItem)
            await this.getSuppliers(
              buildPayloadPagination(this.pagination, this.buildSearch())
            )
            this.dataTableLoading = false
          } else {
            // Creating new item
            await this.saveSupplier({ name: this.editedItem.name })
            await this.getSuppliers(
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
      this.getSuppliers(
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
      await this.getSuppliers(
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
