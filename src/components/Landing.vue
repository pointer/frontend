<template>
  <v-container fluid>
    <span class="bg"></span>
  </v-container>
</template>

<script>
// import { makeStyles } from '@material-ui/core/styles'
// import Paper from '@material-ui/core/Paper'
export default {
  data() {
    return {}
  },
  methods: {
    getImageUrl(img) {
      return require(`../../assets/user/images/${img}`)
    }
  }
}
</script>

<style>
.parallax {
  transform: none !important;
  height: auto !important;
  width: 100% !important;
  padding-bottom: 0%;
  padding-left: 0%;
  padding-right: 0%;
  padding-top: 45%;
  background: transparent;
  background-size: cover !important;
  background-position: center center;
  background-attachment: fixed;
}
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url('') no-repeat center center;
  background-size: cover;
  transform: scale(-2, 1);
}
</style>
