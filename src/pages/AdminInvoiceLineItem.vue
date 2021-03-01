<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="editedItem.invoice_num"
    class="elevation-1"
  >
    <template v-slot:item.createdAt="{ item }">
      <span>{{ $d(new Date(item.createdAt), 'short') }}</span>
    </template>
    <template v-slot:item.updatedAt="{ item }">
      <span>{{ $d(new Date(item.updatedAt), 'longNum') }}</span>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ $t('invoiceLineItem.TITLE') }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="invoiceLineItemDlg" max-width="500px">
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
                      v-model="editedItem.line_item_num"
                      :label="$t('invoiceLineItem.headers.LINE_ITEM_NUM')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.invoice_num"
                      :label="$t('invoiceLineItem.headers.INVOICE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.order_item_id"
                      :label="$t('invoiceLineItem.headers.ORDER_ITEM')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_name"
                      :label="$t('invoiceLineItem.headers.PRODUCT')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_price"
                      :label="$t('invoiceLineItem.headers.PRODUCT_PRICE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_quantity"
                      :label="$t('invoiceLineItem.headers.PRODUCT_QUANTITY')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.tax_payable"
                      :label="$t('invoiceLineItem.headers.TAX_PAYABLE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.other_line_item_details"
                      :label="
                        $t('invoiceLineItem.headers.OTHER_LINE_ITEM_DETAILS')
                      "
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
      titleTemplate: `${this.$t('invoiceLineItem.TITLE')} - %s`
    }
  },
  data() {
    return {
      search: '',
      pagination: {},
      fieldsToSearch: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      sortBy: '',
      sortDesc: false,
      errorMessages: [],
      dataTableLoading: '',
      accountDlg: false,
      dialogDelete: false,
      editedItem: {
        order_item_id: '',
        invoice_id: '',
        product_id: '',
        product_name: '',
        product_price: '',
        product_quantity: '',
        tax_payable: '',
        other_line_item_details: ''
      },
      defaultItem: {
        order_item_id: '',
        invoice_id: '',
        product_id: '',
        product_name: '',
        product_price: '',
        product_quantity: '',
        tax_payable: '',
        other_line_item_details: ''
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
          text: this.$i18n.t('invoiceLineItem.headers.LINE_ITEM_NUM'),
          align: 'left',
          sortable: true,
          value: 'line_item_num'
        },
        {
          text: this.$i18n.t('invoiceLineItem.headers.INVOICE'),
          align: 'left',
          sortable: true,
          value: 'invoice_num'
        },
        {
          text: this.$i18n.t('invoiceLineItem.headers.ORDER_ITEM'),
          align: 'left',
          sortable: true,
          value: 'order_item_id'
        },
        {
          text: this.$i18n.t('invoiceLineItem.headers.PRODUCT'),
          align: 'left',
          sortable: true,
          value: 'product_name'
        },
        {
          text: this.$i18n.t('invoiceLineItem.headers.PRODUCT_PRICE'),
          align: 'left',
          sortable: true,
          value: 'product_price'
        },
        {
          text: this.$i18n.t('invoiceLineItem.headers.PRODUCT_QUANTITY'),
          align: 'left',
          sortable: true,
          value: 'product_quantity'
        },
        {
          text: this.$i18n.t('invoiceLineItem.headers.TAX_PAYABLE'),
          align: 'left',
          sortable: true,
          value: 'tax_payable'
        },
        {
          text: this.$i18n.t('invoiceLineItem.headers.OTHER_LINE_ITEM_DETAILS'),
          align: 'left',
          sortable: true,
          value: 'other_line_item_details'
        },
        {
          text: this.$i18n.t('invoiceLineItem.headers.CREATED_BY'),
          align: 'left',
          sortable: true,
          value: 'created_by'
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
      return this.$store.state.adminInvoiceLineItem.invoicelineitems
    },
    totalItems() {
      return this.$store.state.adminInvoiceLineItem.totalInvoiceLineitems
    }
  },
  watch: {
    invoiceLineItemDlg(value) {
      return value ? true : this.close()
    },
    dialogDelete(val) {
      return val || this.closeDelete()
    },
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getInvoiceLineitems(
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
      'getInvoiceLineitems',
      'editInvoiceLineitem',
      'editInvoiceLineitem',
      'editInvoiceLineitem'
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
        await this.getInvoiceLineitems(
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
      this.invoiceLineItemDlg = true
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
          await this.deleteInvoiceLineitem(item._id)
          await this.getInvoiceLineitems(
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
      this.invoiceLineItemDlg = false
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
    // this.accountDlg = false
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
            await this.editInvoiceLineitem(this.editedItem)
            await this.getInvoiceLineitems(
              buildPayloadPagination(this.pagination, this.buildSearch())
            )
            this.dataTableLoading = false
          } else {
            // Creating new item
            await this.saveInvoiceLineitem({ name: this.editedItem.name })
            await this.getInvoiceLineitems(
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
    }
  }
}
</script>
