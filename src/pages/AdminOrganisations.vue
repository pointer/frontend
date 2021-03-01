<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="editedItem.display_name"
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
          <v-toolbar-title>{{ $t('organisation.TITLE') }}</v-toolbar-title>
        </v-toolbar>
        <v-dialog v-model="dialog" width="640px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="secondary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nouvelle organisation
            </v-btn>
          </template>
          <v-container fluid>
            <v-card elevation="2">
              <v-card-title>
                <span class="headline"> Nouvelle organisation </span>
              </v-card-title>
              <v-card-text>
                <v-tabs
                  dark
                  v-model="tab"
                  align-with-title
                  background-color="primary"
                >
                  <v-tabs-slider color="yellow"></v-tabs-slider>
                  <v-tab v-for="item in tabs" :key="item" color="yellow">
                    {{ item.name }}
                  </v-tab>
                  <v-tab-item>
                    <v-row no-gutters dense>
                      <v-col cols="12" sm="6" md="4">
                        <!-- <v-col class="mx-auto" > -->
                        <v-text-field
                          v-model="editedItem.display_name"
                          :label="$t('organisation.headers.DISPLAY_NAME')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.legal_name"
                          :label="$t('organisation.headers.LEGAL_NAME')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <!-- <v-row no-gutters dense>
                          <v-col class="mx-auto" cols="6" sm="3" md="2">
                            <image-input v-model="editedItem.avatar">
                              <div slot="activator">
                                <v-avatar
                                  size="100px"
                                  v-ripple
                                  v-if="!editedItem.avatar"
                                  class="grey lighten-3 mb-3"
                                  color="teal"
                                  label="Logo"
                                >
                                  <span>Ajouter image</span>
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
                          </v-col>

                        </v-row> -->
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.abn"
                          :label="$t('organisation.headers.ORGANISATION_ABN')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="14" sm="8" md="6">
                        <v-text-field
                          v-model="editedItem.description"
                          :label="
                            $t('organisation.headers.ORGANISATION_DESCRIPION')
                          "
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="14" sm="8" md="6">
                        <v-text-field
                          v-model="editedItem.address"
                          :label="$t('organisation.headers.POSTAL_ADDRESS')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="8" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.postal_code"
                          :label="$t('organisation.headers.POSTAL_CODE')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="8" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.locality"
                          :label="$t('organisation.headers.LOCALITY')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="8" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.province"
                          :label="$t('organisation.headers.PROVINCE')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="8" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.country"
                          :label="$t('organisation.headers.COUNTRY')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto" cols="8" sm="6" md="4">
                        <v-text-field
                          :rules="[numberRule]"
                          v-model="editedItem.phone"
                          :label="$t('organisation.headers.PHONE')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="8" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.email"
                          :rules="emailRules"
                          required
                          :label="$t('organisation.headers.EMAIL')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="8" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.url"
                          :label="$t('organisation.headers.URL')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row no-gutters dense>
                      <v-col cols="12" sm="6" md="4">
                        <!-- <v-col class="mx-auto" > -->
                        <v-text-field
                          v-model="editedItem.vat_num"
                          :label="$t('organisation.headers.VAT')"
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-auto" cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.tax_rating"
                          :label="$t('organisation.headers.TAX_RATE')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto">
                        <v-text-field
                          v-model="editedItem.rib"
                          :label="$t('organisation.headers.RIB')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto">
                        <v-text-field
                          v-model="editedItem.iban"
                          :label="$t('organisation.headers.IBAN')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col class="mx-auto">
                        <v-text-field
                          v-model="editedItem.bic"
                          :label="$t('organisation.headers.BIC')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <!-- <v-row no-gutters dense>
                          <v-col class="mx-auto" cols="6" sm="3" md="2"> -->
                    <ImageInput v-model="editedItem.avatar">
                      <div slot="activator">
                        <v-avatar
                          size="100px"
                          v-ripple
                          v-if="!editedItem.avatar"
                          class="grey lighten-3 mb-3"
                          color="teal"
                          label="Logo"
                        >
                          <span>Ajouter image</span>
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
                    </ImageInput>
                    <!-- </v-col>

                        </v-row>                     -->
                  </v-tab-item>
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
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getFormat, buildPayloadPagination } from '@/utils/utils.js'
import { app } from '../main.js'
import ImageInput from '@/components/ImageInput.vue'
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
  data() {
    return {
      valid: true,
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      active_tab: 0,
      tabs: [
        { index: 0, name: 'Information' },
        { index: 1, name: 'Contact' },
        { index: 2, name: 'Facuration' },
        { index: 4, name: 'Logo' }
      ],
      tab: null,
      editedItem: {
        display_name: null,
        address: null,
        postal_code: null,
        abn: null,
        vat_num: null,
        avatar: null,
        description: null,
        locality: null,
        province: null,
        country: null,
        phone: null,
        email: null,
        url: null,
        rib: null,
        iban: null,
        bic: null
      },
      defaultItem: {
        display_name: null,
        address: null,
        postal_code: null,
        abn: null,
        vat_num: null,
        avatar: null,
        description: null,
        locality: null,
        province: null,
        country: null,
        phone: null,
        email: null,
        url: null,
        rib: null,
        iban: null,
        bic: null
      },
      editedIndex: -1,
      dataTableLoading: false,
      search: null,
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
      dialog: false
    }
  },
  components: {
    ImageInput,
    ConfirmDlg,
    ErrorMessage,
    SuccessMessage
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
          text: this.$i18n.t('organisation.headers.DISPLAY_NAME'),
          align: 'left',
          sortable: true,
          value: 'display_name'
        },
        {
          text: this.$i18n.t('organisation.headers.POSTAL_ADDRESS'),
          align: 'left',
          sortable: true,
          value: 'address'
        },
        {
          text: this.$i18n.t('organisation.headers.POSTAL_CODE'),
          align: 'left',
          sortable: true,
          value: 'postal_code'
        },
        {
          text: this.$i18n.t('organisation.headers.ORGANISATION_ABN'),
          align: 'left',
          sortable: true,
          value: 'abn'
        },
        {
          text: this.$i18n.t('organisation.headers.VAT'),
          align: 'left',
          sortable: true,
          value: 'vat_num'
        }
        // {
        //   text: this.$i18n.t('organisation.headers.PRODUCT_SALE_CLASS'),
        //   align: 'left',
        //   sortable: true,
        //   value: 'organisation_sale_class'
        // }
      ]
    },
    items() {
      return this.$store.state.adminOrganisations.organisations
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
    //     // console.log('set tab : ', tab)
    //   },
    //   get() {
    //     // console.log('get tab : ', this.$route.query.tab)
    //     return this.$route.query.tab
    //   }
    // }
  },
  methods: {
    ...mapActions([
      'editOrganisation',
      'saveOrganisation',
      'deleteOrganisation',
      'getOrganisations'
    ]),
    validate() {
      this.$refs.dialog.validate()
    },
    async save() {
      try {
        // const valid = await this.$validator.validateAll()
        // if (valid) {
        // this.dataTableLoading = true
        // Updating item
        if (this.editedItem._id) {
          // console.log(this.editedItem)
          await this.editOrganisation(this.editedItem)
          await this.getOrganisations(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          // this.dataTableLoading = false
        } else {
          // Creating new item
          // const image = {
          //   data: this.$refs.pictureInput.image,
          //   contentType: this.$refs.pictureInput.fileType
          // }
          await this.saveOrganisation(this.editedItem)
          await this.getOrganisations(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          // this.dataTableLoading = false
        }
        this.close()
        // }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // this.dataTableLoading = false
        this.close()
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
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
          await this.deleteOrganisation(item._id)
          await this.getOrganisations(
            buildPayloadPagination(this.pagination, this.buildSearch())
          )
          this.dataTableLoading = false
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.dataTableLoading = false
      }
    },
    paginationChangeHandler(pageNumber) {
      this.pagination.page = pageNumber
      this.getOrganisations(
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
      await this.getOrganisations(
        buildPayloadPagination(this.pagination, this.buildSearch())
      )
      this.dataTableLoading = false
    } catch (error) {
      this.dataTableLoading = false
    }
  }
}
</script>
