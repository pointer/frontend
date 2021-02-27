<template>
  <div>
    <ConfirmDlg ref="confirm"> </ConfirmDlg>
    <v-data-table
      :loading="dataTableLoading"
      :no-data-text="$t('dataTable.NO_DATA')"
      :no-results-text="$t('dataTable.NO_RESULTS')"
      :headers="headers"
      :items="items"
      :options.sync="pagination"
      :items-per-page="5"
      :server-items-length="totalItems"
      class="elevation-1"
      :footer-props="{
        'items-per-page-text': $t('dataTable.ROWS_PER_PAGE'),
        'items-per-page-options': [5, 10, 25]
      }"
    >
      <!-- @update:pagination="paginate" -->
      <template v-slot:item.createdAt="{ item }">
        <span>{{ $d(new Date(item.createdAt), 'short') }}</span>
      </template>
      <template v-slot:item.updatedAt="{ item }">
        <span>{{ $d(new Date(item.updatedAt), 'longNum') }}</span>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t('product.TITLE') }}</v-toolbar-title>
        </v-toolbar>
        <!--  <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer> -->
        <v-dialog v-model="productDlg" width="640px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="secondary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ $t('product.headers.PRODUCT_NEW') }}
            </v-btn>
          </template>
          <v-container fluid>
            <v-card elevation="2">
              <v-card-title>
                <span class="headline">{{
                  $t('product.headers.PRODUCT_NEW')
                }}</span>
              </v-card-title>
              <v-card-text>
                <v-tabs
                  dark
                  v-model="tab"
                  align-with-title
                  background-color="primary"
                >
                  <v-tabs-slider color="yellow"></v-tabs-slider>
                  <v-tab v-for="item in tabs" :key="item">
                    {{ item.name }}
                  </v-tab>
                  <v-tab-item>
                    <v-row no-gutters dense>
                      <!-- <v-col mx-auto cols="8" sm="4" md="2"> -->
                      <v-col class="mx-auto" cols="4" sm="3" md="2">
                        <v-text-field
                          v-model="editedItem.product_name"
                          :label="$t('product.headers.PRODUCT_NAME')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="4" sm="3" md="2">
                        <v-text-field
                          v-model="editedItem.product_code"
                          :label="$t('product.headers.PRODUCT_CODE')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="6" sm="3" md="2">
                        <v-combobox
                          v-model="editedItem.product_measure"
                          :items="measureUnits"
                          solo
                          :label="$t('product.headers.PRODUCT_MEASURE')"
                        ></v-combobox>
                      </v-col>
                      <v-col class="mx-auto" cols="8" sm="4" md="2">
                        <v-text-field
                          v-model="editedItem.product_type_code"
                          :label="$t('product.headers.PRODUCT_TYPE_CODE')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="12" sm="6" md="4">
                        <v-combobox
                          solo
                          v-model="editedItem.product_nature"
                          :items="productNature"
                          :label="$t('product.headers.PRODUCT_NATURE')"
                        ></v-combobox>
                      </v-col>
                      <v-col class="mx-auto" cols="12" sm="8" md="6">
                        <v-combobox
                          solo
                          v-model="editedItem.product_supplier"
                          :items="allSuppliers"
                          :label="$t('product.headers.PRODUCT_SUPPLIER')"
                        ></v-combobox>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.product_description"
                          :label="$t('product.headers.PRODUCT_DESCRIPTION')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.product_details"
                          :label="$t('product.headers.OTHER_PRODUCT_DETAILS')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="4" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_price"
                          :label="$t('product.headers.PRODUCT_PRICE')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="6" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_tax_rating"
                          :label="$t('product.headers.PRODUCT_TAX_RATING')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="6" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_coefficient"
                          :label="$t('product.headers.PRODUCT_COEFFICIENT')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="4" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_margin"
                          :label="$t('product.headers.PRODUCT_MARGIN')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="4" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_gross_margin"
                          :label="$t('product.headers.PRODUCT_GROSS_MARGIN')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="mx-auto" cols="12" sm="8" md="6">
                        <v-combobox
                          solo
                          v-model="editedItem.product_sale_class"
                          :items="allSaleClass"
                          :label="$t('product.headers.PRODUCT_SALE_CLASS')"
                        ></v-combobox>
                      </v-col>
                      <v-col class="mx-auto" cols="12" sm="8" md="6">
                        <v-combobox
                          solo
                          v-model="editedItem.product_purchase_class"
                          :items="allPurchaseClass"
                          :label="$t('product.headers.PRODUCT_PURCHASE_CLASS')"
                        ></v-combobox>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row no-gutters dense>
                      <!-- <v-col mx-auto cols="8" sm="4" md="2"> -->
                      <v-col class="mx-auto" cols="4" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_stock"
                          :label="$t('product.headers.PRODUCT_STOCK')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="4" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_min_stock"
                          :label="$t('product.headers.PRODUCT_MIN_STOCK')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="4" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_safety_stock"
                          :label="$t('product.headers.PRODUCT_SAFETY_STOCK')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="6" sm="3" md="2">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.product_reorder"
                          :label="$t('product.headers.PRODUCT_STOCK_REORDER')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <!-- <v-tab-item>
                  <picture-input
                    ref="pictureInput"
                    v-model="editedItem.product_image"
                    @change="onChange"
                    width="600"
                    height="600"
                    margin="16"
                    accept="image/*"
                    size="10"
                    :removable="true"
                    :customStrings="{
                      upload: '<h1>Bummer!</h1>',
                      drag: ''
                    }">
                  </picture-input>
                </v-tab-item> -->
                </v-tabs>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  {{ $t('dataTable.CANCEL') }}
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  {{ $t('dataTable.SAVE') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-dialog>
        <!-- </v-toolbar> -->
      </template>
      <template v-slot:item._id="props">
        <v-layout class="justify-center">
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
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <!-- <confirm ref="confirm"></confirm> -->
    <!-- <ConfirmDlg ref = "confirm"> </ConfirmDlg>   -->
    <ErrorMessage />
    <SuccessMessage />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import { app } from '../main.js'
// import PictureInput from 'vue-picture-input'
import ConfirmDlg from '@/components/common/ConfirmDlg'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { SuccessMessage } from '@/components/common/SuccessMessage'
export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('product.TITLE')} - %s`
    }
  },
  components: {
    // 'picture-input': PictureInput,
    ConfirmDlg,
    ErrorMessage,
    SuccessMessage
  },
  props: ['source'],
  data() {
    return {
      search: '',
      alert: false,
      options: {
        page: null,
        itemsPerPage: null,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: null,
        mustSort: null
      },
      pagination: {
        itemsPerPage: 10,
        pageStart: null,
        pageStop: null,
        pageCount: null,
        itemsLength: null,
        descending: !!this.$route.query.desc,
        // sortBy: this.$route.query.orderby, // || 'product_name',
        rowsPerPage: `Number(this.$route.query.limit)` || 10,
        page: `Number(this.$route.query.page)` || 1,
        totalItems: 0
      },
      fieldsToSearch: ['product_code'],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      sortBy: 'product_code',
      sortDesc: false,
      errorMessages: [],
      dataTableLoading: null,
      productDlg: false,
      dialogDelete: false,
      productNature: ['Produit', 'Service'],
      editedItem: {
        product_name: null,
        product_code: null,
        product_description: null,
        product_price: null,
        product_tax_rating: null,
        product_type_code: null,
        product_measure: null,
        product_nature: null,
        product_sale_class: null,
        product_purchase_class: null,
        product_supplier: null,
        product_stock: null,
        product_min_stock: null,
        product_safety_stock: null,
        product_reorder: null,
        product_details: null,
        product_coefficient: null,
        product_margin: null,
        product_gross_margin: null,
        product_image: null
      },
      defaultItem: {
        product_name: null,
        product_code: null,
        product_description: null,
        product_price: null,
        product_tax_rating: null,
        product_type_code: null,
        product_measure: null,
        product_nature: null,
        product_sale_class: null,
        product_purchase_class: null,
        product_supplier: null,
        product_stock: null,
        product_min_stock: null,
        product_safety_stock: null,
        product_reorder: null,
        product_details: null,
        product_coefficient: null,
        product_margin: null,
        product_gross_margin: null,
        product_image: null
      },
      editedIndex: -1,
      active_tab: 0,
      tabs: [
        { index: 0, name: 'Produit' },
        { index: 1, name: 'Tenue' },
        { index: 2, name: 'Inventaire' }
        // { index: 3, name: 'Image' }
      ],
      tab: null,
      url: null,
      image: null,
      files: [],
      readers: [],
      numberRule: (v) => {
        if (!v) {
          return true
        }
        if (!isNaN(parseFloat(v))) {
          return true
        }
        return 'Chiffres seulement!'
      },
      supplierNames: [],
      productClasses: [],
      measureUnits: [
        'kg',
        'm',
        'm2',
        'm3',
        'ton',
        'unit',
        'A',
        'cd',
        'doz',
        'kcal',
        'gig',
        'gr',
        'Hz',
        'J',
        'kW',
        'lm',
        'm',
        'Pa',
        'V',
        'W',
        'Ω'
      ],
      newItem: null,
      productPic: null
      // confirm: '' // `${$t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM')}`
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
          value: '_id',
          sortable: false,
          width: 100
        },
        {
          text: this.$i18n.t('product.headers.PRODUCT_NAME'),
          align: 'left',
          sortable: true,
          value: 'product_name'
        },
        {
          text: this.$i18n.t('product.headers.PRODUCT_PRICE'),
          align: 'left',
          sortable: true,
          value: 'product_price'
        },
        {
          text: this.$i18n.t('product.headers.PRODUCT_STOCK'),
          align: 'left',
          sortable: true,
          value: 'product_stock'
        },
        {
          text: this.$i18n.t('product.headers.PRODUCT_SUPPLIER'),
          align: 'left',
          sortable: true,
          value: 'product_supplier'
        },
        {
          text: this.$i18n.t('product.headers.PRODUCT_NATURE'),
          align: 'left',
          sortable: true,
          value: 'product_nature'
        },
        {
          text: this.$i18n.t('product.headers.PRODUCT_CODE'),
          align: 'left',
          sortable: true,
          value: 'product_code'
        }
        // {
        //   text: this.$i18n.t('product.headers.PRODUCT_SALE_CLASS'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'product_sale_class'
        // }
      ]
    },
    items() {
      return this.$store.state.adminProduct.products
    },
    allPurchaseClass() {
      return this.$store.state.productClass.allPurchaseClass
    },
    allSaleClass() {
      return this.$store.state.productClass.allSaleClass
    },
    allSuppliers() {
      return this.$store.state.suppliers.allSuppliers
    },
    totalItems() {
      return this.$store.state.adminProduct.totalProducts
    },
    pages() {
      if (this.pagination.rowsPerPage === null || this.totalItems === null) {
        return 0
      }
      return Math.ceil(this.totalItems / this.pagination.rowsPerPage)
    }
    // tab: {
    //   set(tab) {
    //     this.$router.replace({ query: { ...this.$route.query, tab } })
    //     console.log('set tab : ', tab)
    //   },
    //   get() {
    //     console.log('get tab : ', this.$route.query.tab)
    //     return this.$route.query.tab
    //   }
    // }
  },
  watch: {
    productDlg(value) {
      return value ? true : this.close()
    },
    dialogDelete(val) {
      return val || this.closeDelete()
    },
    pagination: {
      async handler() {
        try {
          this.dataTableLoading = true
          await this.getProducts(
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
    newItem(value) {
      return value ? true : !true
    }
  },
  methods: {
    ...mapActions([
      'getProducts',
      'editProduct',
      'saveProduct',
      'deleteProduct',
      'getAllSuppliers',
      'getAllProductClass'
    ]),
    // addFiles() {
    //   console.log('files', this.files)
    //   this.files.forEach((file, f) => {
    //     this.readers[f] = new FileReader()
    //     this.readers[f].onloadend = (e) => {
    //       const fileData = this.readers[f].result
    //       const imgRef = this.$refs.file[f]
    //       imgRef.src = fileData
    //       // console.log(fileData)
    //       // send to server here...
    //     }

    //     this.readers[f].readAsDataURL(this.files[f])
    //   })
    // },
    populateSuppliers(items) {
      this.supplierNames = items.reduce(
        (accumulator, currentValue, index, array) => {
          accumulator.push(`${currentValue.company}`)
          return accumulator
        },
        []
      )
      return this.supplierNames
    },
    populateSalesclass(items) {
      this.productClasses = items.reduce(
        (accumulator, currentValue, index, array) => {
          accumulator.push(`${currentValue.sales_class}`)
          return accumulator
        },
        []
      )
      return this.productClasses
    },
    openProductDialog() {
      app.$emit('productDlg', true) // emit the event to the bus
    },
    openOthersDlg() {
      app.$emit('othersDlg', true) // emit the event to the bus
    },
    openInventoryDlg() {
      app.$emit('inventoryDlg', true) // emit the event to the bus
    },
    getFormat(date) {
      window.__localeId__ = this.$store.getters.locale
      return getFormat(date, 'iii, MMMM d yyyy, h:mm a')
    },
    doSomething(v) {
      this.pagination = v
    },
    async doSearch() {
      try {
        this.dataTableLoading = true
        await this.getProducts(
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
      this.productDlg = true
    },
    async deleteItem(event, item) {
      try {
        if (
          await this.$refs.confirm.openConfirm(
            'Confirmer',
            this.$t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM')
          )
        ) {
          this.dataTableLoading = true
          const deleteItem = Object.assign({}, item)
          await this.deleteProduct(deleteItem._id)
          await this.getProducts(
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
      this.productDlg = false
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
    // this.productDlg = false
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
        // const valid = await this.$validator.validateAll()
        // if (valid) {
        this.dataTableLoading = true
        // Updating item
        if (this.editedItem._id) {
          console.log(this.editedItem)
          await this.editProduct(this.editedItem)
          await this.getProducts(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        } else {
          // Creating new item
          // const image = {
          //   data: this.$refs.pictureInput.image,
          //   contentType: this.$refs.pictureInput.fileType
          // }
          await this.saveProduct({
            product_name: this.editedItem.product_name,
            product_code: this.editedItem.product_code,
            product_description: this.editedItem.product_description,
            product_price: this.editedItem.product_tax_rating,
            product_tax_rating: this.editedItem.product_tax_rating,
            product_type_code: this.editedItem.product_type_code,
            product_measure: this.editedItem.product_measure,
            product_nature: this.editedItem.product_nature,
            product_sale_class: this.editedItem.product_sale_class,
            product_purchase_class: this.editedItem.product_purchase_class,
            product_supplier: this.editedItem.product_supplier,
            product_stock: this.editedItem.product_stock,
            product_min_stock: this.editedItem.product_min_stock,
            product_safety_stock: this.editedItem.product_safety_stock,
            product_reorder: this.editedItem.product_reorder,
            product_details: this.editedItem.product_details,
            product_coefficient: this.editedItem.product_coefficient,
            product_margin: this.editedItem.product_margin,
            product_gross_margin: this.editedItem.product_gross_margin,
            product_image: null
          })
          await this.getProducts(
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
    async paginate(val) {
      // emitted by the data-table when changing page, rows per page, or the sorted column/direction - will be also immediately emitted after the component was created
      const query = this.$route.query
      const obj = Object.assign({}, query)
      if (val.rowsPerPage !== this.listSize[0]) {
        obj.limit = val.rowsPerPage
      }
      if (val.descending) {
        obj.desc = 'true'
      } else {
        delete obj.desc
      }
      obj.orderby = val.sortBy
      obj.page = val.page
      // check if old and new query are the same - VueRouter will not change the route if they are, so probably this is the first page loading
      let same = true
      for (const key in query) {
        if (query[key] !== obj[key]) {
          same = false
          break
        }
      }
      // to handle the case when a KEY exists in OBJ but not in query
      for (const key in obj) {
        if (query[key] !== obj[key]) {
          same = false
          break
        }
      }
      if (same) {
        await this.getProducts(
          buildPayloadPagination(this.pagination, this.buildSearch())
        )
      }
      // page has been manually reloaded in the browser
      else {
        this.$router.replace({
          ...this.$router.currentRoute,
          query: obj
        })
      }
    },
    paginationChangeHandler(pageNumber) {
      this.pagination.page = pageNumber
      this.getProducts(
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

    // myFetch().then((blob) => {
    //   const objectURL = URL.createObjectURL(blob)
    //   const image = document.createElement('img')
    //   image.src = objectURL
    //   document.body.appendChild(image)
    // })
    // .catch((e) =>
    //   console.log(e)
    // )
  },
  async mounted() {
    try {
      this.dataTableLoading = true
      await this.getProducts(
        buildPayloadPagination(this.pagination, this.buildSearch())
      )
      await this.getAllSuppliers()
      await this.getAllProductClass()
      this.dataTableLoading = false
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      this.dataTableLoading = false
    }
  }
}
</script>
<style>
.v-tab {
  text-transform: none !important;
}
</style>
