<template>
  <v-dialog
    v-model="confirmDlg"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancelConfirm"
  >
    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text
        v-show="!!message"
        class="text-warning"
        v-html="message"
      ></v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn
          v-if="!options.noconfirm"
          color="grey"
          text
          class="body-2 font-weight-bold"
          @click.native="cancelConfirm"
          >Cancel</v-btn
        >
        <v-btn
          color="primary"
          class="body-2 font-weight-bold"
          outlined
          @click.native="agreeConfirm"
          >OK</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDlg',
  data() {
    return {
      confirmDlg: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: {
        color: 'grey lighten-3',
        width: 400,
        zIndex: 200,
        noconfirm: false
      }
    }
  },

  methods: {
    openConfirm(title, message, options) {
      this.confirmDlg = true
      this.title = title
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agreeConfirm() {
      this.resolve(true)
      this.confirmDlg = false
    },
    cancelConfirm() {
      this.resolve(false)
      this.confirmDlg = false
    }
  }
}
</script>
