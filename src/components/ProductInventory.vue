<template>
  <v-dialog v-model="inventoryDlg" max-width="800px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container> </v-container>
      </v-card-text>

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
      inventoryDlg: false
    }
  },
  methods: {
    next() {
      this.inventoryDlg = true
    }
  },
  created() {
    const that = this
    bus.$on('inventoryDlg', (value) => {
      that.inventoryDlg = value
    })
  }
}
</script>
