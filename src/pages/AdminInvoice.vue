<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="editedItem.invoice_num"
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
          <v-toolbar-title>{{ $t('invoice.TITLE') }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="invoicedlg" max-width="500px">
            <!-- <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ $t('invoice.headers.EDIT_INVOICE') }}
            </v-btn>
          </template> -->
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.invoice_no"
                        :label="$t('invoice.headers.INVOICE_NUM')"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.invoice_customer"
                        :label="$t('order.headers.CUSTOMER')"
                        disabled
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="8" md="9">
                      <v-text-field
                        v-model="editedItem.invoice_details"
                        :label="$t('invoice.headers.OTHER_INVOICE_DETAILS')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-combobox
                        v-model="editedItem.invoice_type"
                        :items="types"
                        :label="$t('invoice.headers.INVOICE_TYPE')"
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-combobox
                        v-model="editedItem.invoice_status"
                        :items="status"
                        :label="$t('invoice.headers.INVOICE_STATUS')"
                      ></v-combobox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-divider class="mt-6 mx-4 primary"></v-divider>
                      <v-data-table
                        id="invoiceItems"
                        v-model="invoiceItems"
                        :headers="subHeaders"
                        :items="invoiceItems"
                        class="elevation-1 primary"
                        :hide-default-footer="true"
                      >
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="generateInvoice">
                  {{ $t('invoice.headers.GENERATE_INVOICE') }}
                </v-btn>
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
        <v-icon color="yellow darken-1" small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <ErrorMessage />
    <SuccessMessage />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { SuccessMessage } from '@/components/common/SuccessMessage'
import { app } from '../main.js'
// import { jsPDF } from '../../node_modules/jspdf/dist/jspdf.debug.js'
import { jsPDF } from 'jspdf'
// import 'jspdf-autotable'
import pdfobject from 'pdfobject'
// import addImage from '../../node_modules/jspdf/dist/jspdf.plugin.addimage.js'
// import PDFDocument from 'pdfkit'
import blobStream from 'blob-stream'
import fs from 'fs'
import base64Img from 'base64-img'
import autoTable from 'jspdf-autotable'
// applyPlugin(jsPDF)/jspdf/jspdf.plugin.addimage.js
import i18n from '@/plugins/i18n'
export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('invoice.TITLE')} - %s`
    }
  },
  components: {
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
      fieldsToSearch: ['invoice_no'],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      sortBy: 'invoice_no',
      sortDesc: false,
      errorMessages: [],
      dataTableLoading: '',
      invoicedlg: false,
      username: null,
      editedItem: {
        invoice_no: '',
        invoice_items: [],
        invoice_type: '',
        order_id: '',
        invoice_details: ''
      },
      defaultItem: {
        invoice_no: '',
        invoice_items: [],
        invoice_type: '',
        order_id: '',
        invoice_details: ''
      },
      editedIndex: -1,
      transactions: [],
      nextTxnId: 1,
      loading: '',
      status: ['Payé', 'Non payé'],
      // company_logo: '',
      tax: '',
      types: [
        'Situation',
        'Cancel',
        'Normal',
        'Advance',
        'Credit',
        'Reverse',
        'Devis'
      ],
      tva20: 1.2,
      tva10: 1.1,
      tva55: 1.055,
      tva21: 1.021,
      invoiceView: false,
      company: {
        display_name: null,
        address: null,
        postal_code: null,
        locality: null,
        province: null,
        country: null,
        rib: null,
        iban: null,
        bic: null,
        vat_num: null
      },
      invoice: {
        id: null,
        items: [],
        dueDate: null
      },
      customer: {
        name: null,
        address: null,
        postal_code: null,
        city: null,
        province: null,
        country: null,
        email: null,
        description: null
      },
      logo: null,
      absolute: false,
      opacity: 1,
      overlay: false,
      zIndex: 0,
      margins: {
        top: 10,
        bottom: 60,
        left: 10,
        width: 522
      },
      lineSpacing: {
        NormalSpacing: 12
      },
      company_logo: {
        src1:
          'data:image/pngbase64,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',
        w: 80,
        h: 50
      },
      formatConfig: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol'
      },
      locale: 'fr-FR', //  this.$i18n.locale
      numberFormatter: new Intl.NumberFormat(this.locale, this.formatConfig)
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
          text: this.$i18n.t('invoice.headers.INVOICE_NUM'),
          align: 'left',
          sortable: true,
          value: 'invoice_no'
        },
        {
          text: this.$i18n.t('order.headers.CUSTOMER'),
          align: 'left',
          sortable: true,
          value: 'invoice_customer'
        },
        {
          text: this.$i18n.t('invoice.headers.INVOICE_STATUS'),
          align: 'left',
          sortable: true,
          value: 'invoice_status'
        },
        {
          text: this.$i18n.t('invoice.headers.INVOICE_TYPE'),
          align: 'left',
          sortable: true,
          value: 'invoice_type'
        },
        {
          text: this.$i18n.t('invoice.headers.INVOICE_DATE'),
          align: 'left',
          sortable: true,
          value: 'createdAt'
        },
        {
          text: this.$i18n.t('invoice.headers.ORDER'),
          align: 'left',
          sortable: true,
          value: 'order_no'
        },
        {
          text: this.$i18n.t('invoice.headers.UPDATED_BY'),
          align: 'left',
          sortable: true,
          value: 'updated_by'
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
      return this.processItems(this.$store.state.adminInvoice.invoices)
    },
    totalItems() {
      return this.$store.state.adminInvoice.totalInvoices
    },
    organisation() {
      return this.$store.state.adminOrganisations.organisations
    },
    subHeaders() {
      return [
        // {
        //   text: this.$i18n.t('dataTable.ACTIONS'),
        //   value: 'actions',
        //   sortable: false,
        //   width: 100
        // },
        {
          text: this.$i18n.t('orderItem.headers.PRODUCT'),
          align: 'left',
          sortable: true,
          value: 'product_name'
        },
        // {
        //   text: this.$i18n.t('product.headers.PRODUCT_CODE'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'product_code'
        // },
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
        // {
        //   text: this.$i18n.t('orderItem.headers.LINE_ITEM_TAX'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'line_total_tax'
        // }
      ]
    },
    invoiceItems() {
      return this.editedItem.invoice_items
    },
    customers() {
      return this.$store.state.adminCustomer.customers
    },
    pages() {
      if (this.pagination.rowsPerPage === null || this.totalItems === null) {
        return 0
      }
      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
    }
  },
  watch: {
    invoicedlg(value) {
      return value ? true : this.close()
    },
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getInvoices(
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
    // overlay (val) {
    //   val && setTimeout(() => {
    //     this.overlay = false
    //   }, 2000)
    // },
  },
  methods: {
    ...mapActions([
      'getInvoices',
      'editInvoice',
      'saveInvoice',
      'deleteInvoice',
      'getOrganisations',
      'getCustomers'
    ]),
    processItems(items) {
      items.forEach((element) => {
        element.invoice_items.forEach((item) => {
          const lineTotal = item.product_price * item.product_quantity // parseFloat(
          // ).toFixed(2)

          item.line_total = this.formatNum(lineTotal)
          element.product_price = this.formatNum(item.product_price)
          element.product_quantity = this.formatNum(item.product_quantity)
          element.total += item.line_total
          item.product_price = this.formatNum(element.product_price)
          // item.product_quantity = this.formatNum(item.product_quantity)
        })
      })
      return items
    },
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
        await this.getInvoices(
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
      // this.invoice.items = this.editedItem.invoice_items.reduce(function(prev, curr) {
      //   prev[curr.key] = curr.value
      //   return prev
      // }, {})
      // let i = 0
      // // console.log(this.organisation)
      // this.editedItem.invoice_items.forEach((element) => {
      //   const subitem = {
      //     description: element.product_name,
      //     price: element.product_price,
      //     quantity: element.product_quantity
      //   }
      //   this.invoice.items[i] = subitem
      //   i++
      // })
      // // console.log(this.invoice.items)
      // // .display_name,
      // // company.address
      // this.company = {
      //   name: this.organisation.display_name,
      //   address: this.organisation.address
      // }
      // this.invoice.id = this.editedItem.invoice_no
      // this.invoice.dueDate = ''
      // this.customer = {
      //   name: this.editedItem.customer,
      //   email: 'stefandoe@aol.com',
      //   description: 'Steafanie GmbH'
      // }
      // this.logo = ''
      this.invoicedlg = true
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
          await this.deleteInvoice(item._id)
          await this.getInvoices(
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
      this.invoicedlg = false
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
          this.editedItem.updated_by = this.username
          await this.editInvoice(this.editedItem)
          await this.getInvoices(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        } else {
          // Creating new item

          await this.saveInvoice({ name: this.editedItem.name })
          await this.getInvoices(
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
    saveTransaction() {
      // append data to the arrays
      // let name = document.getElementById("txn_name_modal").value
      // let price = document.getElementById("txn_price_modal").value
      // if( name.length != 0 && price > 0){
      //   this.transactions.push({
      //     id: this.nextTxnId,
      //     name: name,
      //     price: price
      //   })
      //   this.nextTxnId++
      //   this.calcTotal()
      //   // clear their values
      //   document.getElementById("txn_name_modal").value = ""
      //   document.getElementById("txn_price_modal").value = ""
    },
    deleteTransaction(id) {
      //   let newList = this.transactions.filter(function(el) {
      //     return el.id !== id
      //   })
      //   this.nextTxnId--
      //   this.transactions = newList
      //   this.calcTotal()
      // },
      // calcTotal(){
      //   let total = 0
      //   this.transactions.forEach(element => {
      //     total += parseInt(element.price)
      //   })
      //   this.invoice.total_price = total
    },
    getInvoiceData(item) {
      return {
        // "documentTitle": "RECEIPT", // Defaults to INVOICE
        currency: ' €',
        taxNotation: 'TVA', // or gst
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,
        logo: '../public/logo.png', // or base64
        // "logoExtension": "png", // only when logo is base64
        sender: {
          company: 'Miradata Corp',
          address: 'Sample Street 123',
          zip: '1234 AB',
          city: 'Sampletown',
          country: 'Samplecountry'
          // "custom1": "custom value 1",
          // "custom2": "custom value 2",
          // "custom3": "custom value 3"
        },
        client: {
          company: item.invoice_customer,
          address: 'Clientstreet 456',
          zip: '4567 CD',
          city: 'Clientcity',
          country: 'Clientcountry'
          // "custom1": "custom value 1",
          // "custom2": "custom value 2",
          // "custom3": "custom value 3"
        },
        invoiceNumber: `2021.${item.invoice_no}`,
        invoiceDate: this.eFrench(new Date().toString().substr(0, 10)),
        products: [...item.invoice_items],
        bottomNotice: 'Veuillez payer votre facture dans les 15 jours.'
      }
    },
    eFrench(x) {
      // return x.toLocaleString('fr-FR')
      return x.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    formatNum(num) {
      window.__localeId__ = this.$store.getters.locale
      // new Intl.NumberFormat('fr-FR', {
      //   style: 'currency',
      //   currency: 'EUR'
      // }).format(num)

      let str = num.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      })
      str = str.replace('.', ',')
      return str
    },
    displayInvoice() {
      this.invoicedlg = false
      this.overlay = !this.overlay
    },
    async generateInvoice() {
      const doc = new jsPDF('p', 'mm', 'a4', 1)
      const isChromium = window.chrome
      const winNav = window.navigator
      const vendorName = winNav.vendor
      const isOpera = typeof window.opr !== 'undefined'
      const isIEedge = winNav.userAgent.indexOf('Edge') > -1
      const isIOSChrome = winNav.userAgent.match('CriOS')
      // doc = new jsPDF({
      //   unit: "in",
      //   lineHeight: lineHeight
      // }).setProperties({ title: "String Splitting" })
      doc.setLanguage('fr-FR')
      doc.canvas.height = 72 * 11
      doc.canvas.width = 72 * 8.5
      let yPos = 10
      const xPos = 10
      const text = 'This is a text without real content but with 59 characters.'
      const lineHeight = doc.getLineHeight(text) / doc.internal.scaleFactor
      const pageWidth = 8.5,
        // lineHeight = 1.2,
        margin = 0.5,
        maxLineWidth = pageWidth - margin * 2,
        fontSize = 24,
        ptsPerInch = 72,
        oneLineHeight = (fontSize * lineHeight) / ptsPerInch
      const textLines = ''
      const textHeight = (textLines.length * fontSize * lineHeight) / ptsPerInch
      const splittedText = doc.splitTextToSize(text, 50)
      const lines = splittedText.length // splitted text is a string array
      const blockHeight = lines * lineHeight
      const columns = [
        { title: 'ID', dataKey: 'id', width: 90 },
        {
          title: this.$i18n.t('orderItem.headers.PRODUCT'),
          dataKey: 'product',
          width: 40
        },
        {
          title: this.$i18n.t('orderItem.headers.PRODUCT_PRICE'),
          dataKey: 'price',
          width: 40
        },
        {
          title: this.$i18n.t('orderItem.headers.PRODUCT_QUANTITY'),
          dataKey: 'qty',
          width: 40
        },
        {
          title: this.$i18n.t('invoice.headers.SUB_TOTAL'),
          dataKey: 'sTotal',
          width: 40
        }
      ]
      await this.getCustomers({ company: this.editedItem.invoice_customer })
      const company = this.$store.state.adminOrganisations.organisations
      const customer = this.$store.state.adminCustomer.customers
      console.log(customer)
      doc.lineHeightProportion = 1
      // console.log('getfont size' , doc.getFontSize())
      doc.text(company[0].display_name, xPos, yPos)
      doc.setFontSize(8)
      yPos += lineHeight
      doc.text(company[0].address, xPos, yPos)
      yPos += lineHeight
      doc.text(company[0].postal_code + ', ' + company[0].locality, xPos, yPos)
      yPos += lineHeight
      doc.text(company[0].province + ' ' + company[0].country, xPos, yPos)
      yPos += 3 * lineHeight
      const invoiceNo = 'Facture N° ' + this.editedItem.invoice_no.toString()
      doc.setFontSize(16)
      doc.text(invoiceNo, xPos, yPos, null, null, 'left')
      // doc.setFontSize(8)
      const date = this.eFrench(new Date()).slice(0, 10)
      // yPos += lineHeight
      doc.text('Date : ' + date, 185 + xPos, yPos, null, null, 'right')
      yPos = 10
      doc.setFontSize(16)
      doc.text(customer[0].company, 185 + xPos, yPos, null, null, 'right')
      yPos += lineHeight
      doc.setFontSize(8)
      doc.text(customer[0].address, 185 + xPos, yPos, null, null, 'right')
      yPos += lineHeight
      doc.text(
        customer[0].postal_code + ' ' + customer[0].locality,
        185 + xPos,
        yPos,
        null,
        null,
        'right'
      )
      yPos += lineHeight
      doc.text(
        customer[0].province + ' ' + customer[0].country,
        185 + xPos,
        yPos,
        null,
        null,
        'right'
      )
      yPos += 2 * lineHeight
      // let i = 5
      // let subTotal = 0
      const rows = []
      let j = 1
      this.editedItem.invoice_items.forEach((element) => {
        const row = {}
        row.id = j++
        row.product = element.product_name
        // const price = parseFloat(element.product_price).toFixed(2)
        row.price = this.formatNum(element.product_price)
        // const qty = element.product_quantity.toFixed(2)
        row.qty = this.eFrench(element.product_quantity)
        // parseFloat(element.product_quantity).toFixed(2)
        const sTotal =
          parseFloat(element.product_quantity) *
          parseFloat(element.product_price)
        row.sTotal = this.formatNum(sTotal)
        // parseFloat(
        //   element.product_quantity * element.product_price
        // ).toFixed(2)
        rows.push(row)
      })
      // doc.autoTable(columns, rows )
      yPos += blockHeight
      /**
      startY: number = null Where the table should start to be printed (basically a margin top value only for the first page)
      margin: Margin = 40
      pageBreak: 'auto'|'avoid'|'always' If set to avoid the plugin will only split a table onto multiple pages if table height is larger than page height.
      rowPageBreak: 'auto'|'avoid' = 'auto' If set to avoid the plugin will only split a row onto multiple pages if row height is larger than page height.
      tableWidth: 'auto'|'wrap'|number = 'auto'
      showHead: 'everyPage'|'firstPage'|'never' = 'everyPage''
      showFoot: 'everyPage'|'lastPage'|'never' = 'everyPage''
      tableLineWidth: number = 0
      tableLineColor: Color = 200 The table line/border color
      */
      doc.autoTable(columns, rows, {
        startY: yPos,
        margin: {
          top: 200,
          bottom: 60,
          left: 10,
          width: 522
        }
      })
      doc.setFontSize(10)

      yPos = doc.lastAutoTable.finalY
      doc.line(10, yPos, 195, yPos)
      yPos = doc.lastAutoTable.finalY + lineHeight
      let subTotal = 0
      this.editedItem.invoice_items.forEach((element) => {
        subTotal +=
          parseFloat(element.product_quantity) *
          parseFloat(element.product_price)
      })
      const localeSubtotal = subTotal.toFixed(2)
      yPos += lineHeight
      doc.text(
        170,
        yPos,
        'Sous total :  ' + this.formatNum(localeSubtotal) + ' €',
        null,
        null,
        'right'
      )
      const tax = parseFloat(subTotal * 0.2).toFixed(2)
      let total = subTotal + subTotal * 0.2
      // const tax = subTotal * this.tva20
      yPos += lineHeight
      doc.text(
        170,
        yPos,
        'TVA (20%) : ' + this.formatNum(tax) + ' €',
        null,
        null,
        'right'
      )
      total = parseFloat(total).toFixed(2)
      yPos += lineHeight
      doc.text(
        170,
        yPos,
        'Total :  ' + this.formatNum(total) + ' €',
        null,
        null,
        'right'
      )

      yPos += doc.lastAutoTable.finalY + blockHeight
      doc.setDrawColor(100, 100, 255) // draw red lines
      doc.setFontSize(8)
      doc.line(xPos, yPos, 190, yPos)
      yPos += lineHeight
      doc.text(xPos, yPos, 'BIC : ' + company[0].bic, null, null, 'left')
      yPos += lineHeight
      doc.text(xPos, yPos, 'IBAN : ' + company[0].iban, null, null, 'left')
      yPos += lineHeight
      doc.text(xPos, yPos, 'RIB : ' + company[0].rib, null, null, 'left')
      // const total = subTotal * 1.2
      // const tax =
      //   20 % doc.text('S/Total : ' + this.eFrench(subTotal), 205, 65 + i)
      // doc.text('Taxe : ' + tax, 210, 65 + i)
      // doc.text(this.eFrench(total), 215, 65 + i)
      // doc.fromHTML(document.body)
      const today = new Date().toISOString().slice(0, 10)
      const filename =
        customer[0].company.substring(0, 4) +
        '-' +
        today +
        '-' +
        this.editedItem.invoice_no
      if (isIOSChrome) {
        // is Google Chrome on IOS
      } else if (
        isChromium !== null &&
        typeof isChromium !== 'undefined' &&
        vendorName === 'Google Inc.' &&
        isOpera === false &&
        isIEedge === false
      ) {
        doc.save(filename + '.pdf')
      } else {
        doc.output('dataurl')
      }
    },
    toFrench(x) {
      x.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    async getImage(name) {
      /**
       * async function getResponseSize(url) {
          const response = await fetch(url)
          const reader = response.body.getReader()
          let result = await reader.read()
          let total = 0

          while (!result.done) {
            const value = result.value
            total += value.length
            console.log('Received chunk', value)
            // get the next result
            result = await reader.read()
          }

          return total
          */
    },
    paginationChangeHandler(pageNumber) {
      this.pagination.page = pageNumber
      this.getInvoices(
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
      await this.getInvoices(
        buildPayloadPagination(this.pagination, this.buildSearch())
      )
      await this.getOrganisations()
      const user = JSON.parse(localStorage.getItem('user'))
      this.username = user.username
      // this.locale =this.$store.getters.locale
      this.dataTableLoading = false
    } catch (error) {
      this.dataTableLoading = false
    }
  }
}
</script>
