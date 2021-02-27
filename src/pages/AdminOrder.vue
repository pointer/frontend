<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="editedItem.order_name"
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
          <v-toolbar-title>{{ $t('order.TITLE') }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog
            v-model="orderDlg"
            transition="slide-up"
            bg-transition="fade"
            :classes="{ bg: 'bg-black-alpha' }"
            max-width="700px"
            persistent
            scrollable
            @blur="validate"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                {{ $t('dataTable.NEW_ITEM') }}
              </v-btn>
            </template>
            <v-card
              class="text-center primary d-flex flex-column align-center justify-center"
              height="100%"
            >
              <v-card-title class="green-text text-darken-5">
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-lg>
                  <v-row no-gutters justify="space-around">
                    <v-col cols="12" sm="6" class="d-flex justify-center">
                      <v-combobox
                        v-model="editedItem.customer"
                        :items="allCustomers"
                        :item-text="items.company"
                        :item-value="item"
                        return-object
                        dense
                        filled
                        outlined
                        :label="$t('order.headers.CUSTOMER')"
                        @input="getSalesTax"
                      >
                      </v-combobox>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="6" sm="3" md="2">
                      <v-autocomplete
                        v-model="editedItem.order_status"
                        :items="orderStatus"
                        dense
                        :label="$t('order.headers.ORDER_STATUS')"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="editedItem.order_details"
                        :label="$t('order.headers.OTHER_ORDER_DETAILS')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-divider class="mt-6 mx-4 primary"></v-divider>
                  <v-data-table
                    v-model="editedItem.order_items"
                    :headers="subHeaders"
                    :items="orderItems"
                    class="elevation-1 primary"
                    :hide-default-footer="true"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-icon small @click="deleteRow(index, item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-right">
                        {{ props.item.product_code }}
                      </td>
                      <td class="text-xs-right">
                        {{ props.item.product_name }}
                      </td>
                      <td class="text-xs-right">
                        {{ props.item.product_price }}
                      </td>
                      <td class="text-xs-right">
                        {{ props.item.product_quantity }}
                      </td>
                      <!-- <td class="text-xs-right">{{ props.item.product_tax_rating }}</td> -->
                      <td class="text-xs-right">{{ props.item.line_total }}</td>
                    </template>
                  </v-data-table>
                  <v-row :align="alignment" :justify="justify">
                    <v-col cols="12" sm="6" md="8">
                      <v-combobox
                        :items="productNames"
                        v-model="orderItems.product_name"
                        label="Produit"
                        max-height="auto"
                        autocomplete
                      >
                      </v-combobox>
                    </v-col>
                    <v-col cols="6" sm="3" md="2">
                      <v-text-field
                        label="Quantité"
                        :rules="[numberRule]"
                        v-model="orderItems.product_quantity"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- <v-layout row justify-space-between> -->
                  <v-card height="35" flat color="primary">
                    <!-- <v-tooltip bottom>
                      <template v-slot:activator="">                       -->
                    <v-btn
                      class="mx-2"
                      dark
                      absolute
                      left
                      color="primary"
                      @click="addNewOrderItem(orderItems)"
                    >
                      <v-icon dark> mdi-plus </v-icon>
                      {{ $t('common.ADD') }}
                    </v-btn>
                    <!-- </template>
                      <span>Ajouter à la liste</span>
                  </v-tooltip> -->
                    <v-btn
                      class="mx-2"
                      disabled
                      absolute
                      centered
                      outlined
                      depressed
                      tile
                      text
                      color="accent"
                    >
                      {{ orderItemsSubtotal }}
                    </v-btn>
                    <v-btn
                      class="mx-2"
                      disabled
                      absolute
                      right
                      outlined
                      depressed
                      tile
                      texr
                      color="accent"
                    >
                      {{ orderTotal }}
                    </v-btn>
                  </v-card>
                  <!-- </v-layout> -->
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" dark @click="saveOrder2Invoice(item)">
                  {{ $t('adminItems.INVOICE') }}
                </v-btn>
                <v-divider></v-divider>
                <v-btn color="accent" text @click="close">
                  {{ $t('common.CANCEL') }}
                </v-btn>
                <v-btn color="accent" text @click="save">
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
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <ConfirmDlg ref="confirm"> </ConfirmDlg>
    <ErrorMessage />
    <SuccessMessage />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import { app } from '../main.js'
import SalesTax from 'sales-tax'
import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'
import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/vue'
import ConfirmDlg from '@/components/common/ConfirmDlg'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { SuccessMessage } from '@/components/common/SuccessMessage'
import frenchLocale from 'date-fns/locale/fr'

const orderMachine = Machine({
  id: 'toggle',
  initial: 'new',
  states: {
    new: { on: { SWITCH_PROGRESS: 'inprogress' } },
    inprogress: { on: { SWITCH_APPROVED: 'approved' } },
    approved: { on: { SWITCH_INVOICING: 'invoicing' } },
    invoicing: { on: { SWITCH_COMPLETED: 'completed' } },
    completed: { on: { SWITCH_REOPEN: 'reopen' } },
    closed: { on: { SWITCH_CLOSED: 'hist' } },
    hist: { type: 'history' }
  }
})

export default {
  setup() {
    const { state, send } = useMachine(orderMachine)
    return { state, send }
  },
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('order.TITLE')} - %s`
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
      searchPrice: '',
      select: '',
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
      fieldsToSearch: ['order_name'],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      sortBy: 'order_name',
      sortDesc: false,
      errorMessages: [],
      dataTableLoading: '',
      orderDlg: false,
      dialogDelete: false,
      TVA20: 1.2,
      TVA10: 1.1,
      TVA55: 1.055,
      TVA21: 1.021,
      orderStatus: [
        'Nouveau',
        'Approuvé',
        'Annulé',
        'En progrés',
        'En attente',
        'Complété',
        'Corrigé'
      ],
      invoiceTypes: [
        'Situation',
        'Normal',
        'Advance',
        'Credit',
        'Reverse',
        'Devis'
      ],
      username: null,
      orderItems: [
        {
          order_item_no: null,
          product_code: null,
          product_name: null,
          product_price: null,
          product_quantity: null,
          product_tax_rating: null,
          line_total: null
        }
      ],
      defaultOrderItems: [
        {
          order_item_no: null,
          product_code: null,
          product_name: null,
          product_price: null,
          product_quantity: null,
          product_tax_rating: null,
          line_total: null
        }
      ],
      editedItem: {
        order_no: null,
        customer: null,
        order_status: null,
        order_details: null,
        order_items: null,
        created_by: this.username
      },
      defaultItem: {
        order_no: null,
        customer: null,
        order_status: null,
        order_details: null,
        order_items: null,
        created_by: this.username
      },
      editedIndex: -1,
      orderItemsHeaders: ['Produit', 'Quantité'],
      numberRule: (v) => {
        if (!v) {
          return true
        }
        if (!isNaN(parseFloat(v))) {
          return true
        }
        return 'Nombre seulement!'
      },
      orderItemsSubtotal: 0,
      orderTotal: 0,
      orderItemsTax: 0,
      orderTax: 0,
      productPrices: [],
      value: '',
      index: 0,
      selected: [],
      // line_total: 0,
      lineTotal: 0,
      lineTotalTax: 0,
      subTotal: 0,
      subTotalTax: 0,
      total: 0,
      totalTax: 0,
      tax: {
        type: 'vat',
        rate: 0.2,
        area: 'regional',
        exchange: 'business',
        charge: {
          direct: true,
          reverse: false
        },
        details: []
      },
      isEdit: false,
      closeOnClick: true
    }
  },
  computed: {
    formTitle() {
      return this.editedItem._id
        ? this.$t('dataTable.EDIT_ITEM')
        : this.$t('order.headers.NEW_ITEM')
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
          text: this.$i18n.t('order.headers.ORDER_NUM'),
          align: 'left',
          sortable: true,
          value: 'order_no'
        },
        {
          text: this.$i18n.t('order.headers.CUSTOMER'),
          align: 'left',
          sortable: true,
          value: 'customer'
        },
        {
          text: this.$i18n.t('order.headers.CREATED_BY'),
          align: 'left',
          sortable: true,
          value: 'created_by'
        },
        {
          text: this.$i18n.t('order.headers.ORDER_STATUS'),
          align: 'left',
          sortable: true,
          value: 'order_status'
        },
        {
          text: this.$i18n.t('order.headers.OTHER_ORDER_DETAILS'),
          align: 'left',
          sortable: true,
          value: 'order_details'
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
    subHeaders() {
      return [
        {
          text: this.$i18n.t('dataTable.ACTIONS'),
          value: 'actions',
          sortable: false,
          width: 100
        },
        {
          text: this.$i18n.t('orderItem.headers.PRODUCT'),
          align: 'left',
          sortable: true,
          value: 'product_name'
        },
        {
          text: this.$i18n.t('product.headers.PRODUCT_CODE'),
          align: 'left',
          sortable: true,
          value: 'product_code'
        },
        {
          text: this.$i18n.t('orderItem.headers.PRODUCT_PRICE'),
          align: 'left',
          sortable: true,
          value: 'product_price'
        },
        {
          text: this.$i18n.t('orderItem.headers.PRODUCT_QUANTITY'),
          align: 'left',
          sortable: true,
          value: 'product_quantity'
        },
        // {
        //   text: this.$i18n.t('product.headers.PRODUCT_TAX_RATING'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'product_tax_rating'
        // },
        {
          text: this.$i18n.t('orderItem.headers.LINE_ITEM'),
          align: 'left',
          sortable: true,
          value: 'line_total'
        }
      ]
    },
    items() {
      return this.$store.state.adminOrder.orders
    },
    totalItems() {
      return this.$store.state.adminOrder.totalOrders
    },
    productNames() {
      return this.$store.state.products.allProducts
    },
    products() {
      return this.$store.state.adminProduct.products
    },
    allCustomers() {
      return this.$store.state.customers.allCustomers
    },
    pages() {
      if (this.pagination.rowsPerPage === null || this.totalItems === null) {
        return 0
      }
      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    orderDlg(value) {
      if (!this.isEdit) {
        this.editedItem = Object.assign({}, this.defaultItem)
        //  this.orderItems =  Object.assign({}, this.defaultOrderItems)
      }
      return value ? true : this.close()
    },
    dialogDelete(val) {
      return val || this.closeDelete()
    },
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getOrders(
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
    },
    editedItem(newVal) {
      //  console.log('item changed', newVal)
    }
  },
  methods: {
    ...mapActions([
      'getOrders',
      'editOrder',
      'saveOrder',
      'deleteOrder',
      'getOrderItems',
      'editOrderItem',
      'saveOrderItem',
      'deleteOrderItem',
      'getAllCustomers',
      'getAllProducts',
      'getProducts',
      'saveInvoice'
    ]),
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'iii, MMMM d yyyy, h:mm a')
    },
    getComponentByColumnType(header, data) {
      console.log('updatePrice', header, data)
    },
    async doSearch() {
      try {
        this.dataTableLoading = true
        await this.getOrders(
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
      // console.log('>>>editItem>>>>>>>>>>>>>>>>>>>', this.isEdit)
      this.isEdit = true
      this.editedItem = Object.assign(item)
      this.orderItems = Object.assign(item.order_items)
      this.editedIndex = this.items.indexOf(item)
      this.orderItems.forEach((element) => {
        this.calculateLineTotal(element)
      })
      this.orderDlg = true
    },
    async deleteItem(item) {
      try {
        if (
          await this.$refs.confirm.openConfirm(
            'Confirmer',
            this.$t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM')
          )
        ) {
          this.dataTableLoading = true
          await this.deleteOrder(item._id)
          await this.getOrders(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    },
    // close() {
    //   this.orderDlg = false
    //   setTimeout(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    //   }, 300)
    // },
    close() {
      this.orderDlg = false
      // console.log('>>>close>>>>>>>>>>>>>>>>>>>', this.isEdit)
      this.isEdit = false
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async save() {
      try {
        // const valid = await this.$validator.validateAll()
        // if (valid) {
        // Updating item
        if (this.editedItem._id) {
          await this.editOrder()
          await this.getOrders(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
        } else {
          // Creating new item
          this.editedItem.order_no = format(new Date(), 'yyMMddHHmm-SSS')
          const customer = this.editedItem.customer.text
          this.editedItem.customer = {}
          this.editedItem.customer = customer
          this.editedItem.created_by = this.username
          this.orderItems.forEach((element) => {
            delete element.line_total
          })
          // console.log(this.orderItems)
          this.editedItem.order_items = Object.assign(this.orderItems)
          // this.editedItem.orderItems = Object.assign(this.orderItems)
          // console.log(this.editedItem)
          await this.saveOrder(this.editedItem)
          await this.getOrders(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
        }
        this.editedItem.order_items = Object.assign(this.defaultOrderItems)
        this.editedItem = Object.assign(this.defaultItem)
        this.close()
        // }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.editedItem.order_items = Object.assign(this.defaultOrderItems)
        this.editedItem = Object.assign(this.defaultItem)
        this.close()
      }
    },
    async saveOrder2Invoice(item) {
      const items = []
      this.editedItem.order_items.forEach((element) => {
        items.push({
          product_quantity: element.product_quantity,
          product_name: element.product_name,
          product_code: element.product_code,
          product_price: element.product_price,
          product_tax_rating: this.tax.rate * 100
        })
      })
      const payload = {
        invoice_status: 'Non payé',
        invoice_type: 'Normal',
        invoice_details: this.editedItem.order_details,
        invoice_customer: this.editedItem.customer,
        created_by: this.editedItem.created_by,
        updated_by: this.editedItem.created_by,
        owed: '',
        isPaid: false,
        order_no: this.editedItem.order_no,
        invoice_items: items
      }
      await this.saveInvoice(payload)
    },
    calculateTotal(items) {
      let subtotal = 0
      this.orderItems.forEach((item) => {
        const lineTotal =
          parseFloat(item.product_price) * parseFloat(item.product_quantity)
        // console.log(lineTotal.toFixed(2))
        if (!isNaN(lineTotal)) {
          this.lineTotal = lineTotal.toFixed(2)
          this.orderItems.line_total = lineTotal.toFixed(2)
        }
        subtotal += lineTotal
      })
      this.orderItemsSubtotal = subtotal.toFixed(2)
      let total = subtotal * (this.tax.rate / 100) + subtotal
      total = parseFloat(total)
      if (!isNaN(total)) {
        this.orderTotal = total.toFixed(2)
      } else {
        this.orderTotal = '0.00'
      }
    },
    filterFloat(value) {
      if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
        return Number(value)
      }
      return NaN
    },
    calculateLineTotal(item) {
      const lineTotal =
        parseFloat(item.product_price) * parseFloat(item.product_quantity)
      // console.log(lineTotal.toFixed(2))
      if (!isNaN(lineTotal)) {
        this.lineTotal = lineTotal.toFixed(2)
        item.line_total = lineTotal.toFixed(2)
      }
      this.calculateTotal(this.orderItems)
    },
    async deleteRow(index, item) {
      const idx = this.orderItems.indexOf(item)
      if (idx > -1) {
        this.orderItems.splice(idx, 1)
      }
      this.selected = []

      if (item.product_quantity > 0) {
        this.calculateTotal(this.orderItems)
      }
    },
    addNewOrderItem(item) {
      for (const product of this.products) {
        if (product.product_name === item.product_name) {
          const lineTotal =
            this.filterFloat(product.product_price) *
            this.filterFloat(item.product_quantity)
          if (!isNaN(lineTotal)) {
            this.lineTotal = lineTotal.toFixed(2)
          }
          item.push({
            product_name: item.product_name,
            product_quantity: item.product_quantity,
            product_price: product.product_price,
            product_code: product.product_code,
            product_tax_rating: product.product_tax_rating,
            line_total: this.lineTotal
          })
          break
        }
      }
      this.orderItems = Object.assign(item)
      // console.log(this.orderItems)
      this.calculateTotal(this.orderItems)
    },
    getSalesTax(item) {
      SalesTax.getSalesTax('FR', null, item.value).then((tax) => {
        this.tax.type = tax.type
        this.tax.rate = tax.rate
        this.tax.area = tax.area
        this.tax.exchange = tax.exchange
        this.tax.charge.direct = tax.charge.direct
        this.tax.charge.reverse = tax.charge.reverse
        this.tax.details = [...tax.details]
      })
    },
    validate() {
      console.log('validate')
    },
    paginationChangeHandler(pageNumber) {
      this.pagination.page = pageNumber
      this.getOrders(
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
      SalesTax.setTaxOriginCountry('FR', false)
      // invoiceIt.configure({
      //   language: {
      //     locales: ['fr'],
      //     directory: `${__dirname}/locales`,
      //     defaultLocale: 'fr'
      //   }
      // })
      this.dataTableLoading = true
      await this.getAllProducts()
      await this.getProducts()
      await this.getOrders(
        buildPayloadPagination(this.pagination, this.buildSearch())
      )
      await this.getAllCustomers()
      const user = JSON.parse(localStorage.getItem('user'))
      this.username = user.username
      this.dataTableLoading = false
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      this.dataTableLoading = false
    }
  },
  updated() {
    // this.orders.forEach((order) => {
    //   console.log(order.order_status)
    //   this.orderStatus.push(order.order_status)
    // })
  }
}
</script>
<style>
.max-width-chip.v-chip {
  max-width: calc(100% - 16px);
}

.max-width-chip .v-chip__content {
  line-height: 32px;
  padding-right: 30px !important;
  display: inline-block !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}

.max-width-chip .v-chip__close {
  position: absolute;
  top: 5px;
  right: 0;
  width: 24px;
}
.x-input-select {
  width: 300px;
  flex: unset;
  margin: 0 5px;
}
.x-ctn {
  border: 1px solid orangered;
}
.x-row {
  height: 100%;
}
fade-enter-active,
.fade-leave-active {
  transition: 0.5s ease opacity;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transform: translateY(0);
  transition: 0.5s ease opacity, 0.5s ease transform;
}

.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
fade-enter-active,
.fade-leave-active {
  transition: 0.5s ease opacity;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transform: translateY(0);
  transition: 0.5s ease opacity, 0.5s ease transform;
}

.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
