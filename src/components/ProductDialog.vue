<template>
  <v-dialog v-model="productDlg" max-width="800px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <!--
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_name"
                      :label="$t('product.headers.PRODUCT_NAME')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_code"
                      :label="$t('product.headers.PRODUCT_CODE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_type_code"
                      :label="$t('product.headers.PRODUCT_TYPE_CODE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_price"
                      :label="$t('product.headers.PRODUCT_PRICE')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-autocomplete
                      v-model="editedItem.product_nature"
                      :items="productNature"
                      dense
                      :label="$t('product.headers.PRODUCT_NATURE')"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_tax_rating"
                      :label="$t('product.headers.PRODUCT_TAX_RATING')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.product_weigth"
                      :label="$t('product.headers.PRODUCT_WEIGTH')"
                    ></v-text-field>
                  </v-col>
                  <v-row>
                    <v-col cols="12" sm="6" md="8">
                      <v-autocomplete
                        v-model="editedItem.product_sale_class"
                        :items="saleClass"
                        dense
                        :label="$t('product.headers.PRODUCT_SALE_CLASS')"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.product_description"
                      :label="$t('product.headers.PRODUCT_DESCRIPTION')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="8">
                    <v-autocomplete
                      v-model="editedItem.product_supplier"
                      :items="suppliers"
                      dense
                      :label="$t('product.headers.PRODUCT_SUPPLIER')"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.other_product_details"
                      :label="$t('product.headers.OTHER_PRODUCT_DETAILS')"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
 -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { bus } from '@/main.js'
export default {
  data() {
    return {
      productDlg: true
    }
  },
  methods: {
    next() {
      this.productDlg = true
    }
  },
  created() {
    const that = this
    bus.$on('productDlg', (value) => {
      that.productDlg = value
    })
  }
}
</script>
