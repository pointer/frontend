<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Canadian Politicians App</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" :active="path == '/'">Home</b-nav-item>
          <b-nav-item to="/boundaries" :active="path == '/boundaries'"
            >Boundaries</b-nav-item
          >
          <b-nav-item to="/representatives" :active="path == '/representatives'"
            >Representatives</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      path: this.$route && this.$route.path
    }
  },
  watch: {
    $route(route) {
      this.path = route.path
    }
  }
}
</script>
<style>
.page {
  padding: 20px;
  margin: 0 auto;
}
.card,
form {
  max-width: 800px;
  margin: 0 auto;
}
.title {
  position: relative;
  top: -13px;
  left: 10px;
}
</style>
