<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="editedItem.product_type_code"
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
          <v-toolbar-title>{{ $t('productType.TITLE') }}</v-toolbar-title>
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
                        v-model="editedItem.product_type_code"
                        :label="$t('productType.headers.PRODUCT_TYPE_CODE')"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.product_type_designation"
                        :label="$t('productType.headers.DESCRIPTION')"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.tax_rating"
                        :label="$t('productType.headers.TAX_RATING')"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.product_type_details"
                        :label="
                          $t('productType.headers.OTHER_PRODUCT_TYPE_DETAILS')
                        "
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
        <v-icon color="yellow darken-1" small @click="deleteItem(item)">
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
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import { app } from '../main.js'
import ConfirmDlg from '@/components/common/ConfirmDlg'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { SuccessMessage } from '@/components/common/SuccessMessage'
export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('productType.TITLE')} - %s`
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
      pagination: {},
      fieldsToSearch: ['product_type_code'],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      sortBy: 'product_type_code',
      sortDesc: false,
      errorMessages: [],
      dataTableLoading: '',
      dialog: false,
      dialogDelete: false,
      editedItem: {
        product_type_code: '',
        product_type_designation: '',
        tax_rating: '',
        product_type_details: ''
      },
      defaultItem: {
        product_type_code: '',
        product_type_designation: '',
        tax_rating: '',
        product_type_details: ''
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
          text: this.$i18n.t('productType.headers.PRODUCT_TYPE_CODE'),
          align: 'left',
          sortable: true,
          value: 'product_type_code'
        },
        {
          text: this.$i18n.t('productType.headers.DESCRIPTION'),
          align: 'left',
          sortable: true,
          value: 'product_type_designation'
        },
        {
          text: this.$i18n.t('productType.headers.TAX_RATING'),
          align: 'left',
          sortable: true,
          value: 'tax_rating'
        },
        {
          text: this.$i18n.t('productType.headers.OTHER_PRODUCT_TYPE_DETAILS'),
          align: 'left',
          sortable: true,
          value: 'product_type_details'
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
      return this.$store.state.adminProductType.producttypes
    },
    totalItems() {
      return this.$store.state.adminProductType.totalProductTypes
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
          await this.getProductTypes(
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
      'getProductTypes',
      'editProductType',
      'saveProductType',
      'deleteProductType'
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
        await this.getProductTypes(
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
        if (
          await this.$refs.confirm.openConfirm(
            'Confirmer',
            this.$t('common.DO_YOU_REALLY_WANT_TO_DELETE_THIS_ITEM')
          )
        ) {
          this.dataTableLoading = true
          await this.deleteProductType(item._id)
          await this.getProductTypes(
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
          await this.editProductType(this.editedItem)
          await this.getProductTypes(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        } else {
          // Creating new item
          debugger
          await this.saveProductType(this.editedItem)
          await this.getProductTypes(
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
      this.getProductTypes(
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
      await this.getProductTypes(
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
