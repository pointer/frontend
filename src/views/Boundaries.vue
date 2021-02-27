<template>
  <div class="page">
    <h1 class="text-center">Your Constituent Boundary</h1>
    <template v-if="noLocation">
      <h2 class="text-center">Enable geolocation to see list of boundaries</h2>
    </template>
    <template v-if="!noLocation">
      <b-card v-for="(b, i) in boundaries" :key="i" class="card">
        <b-card-title>
          <h2>{{ b.name }}</h2>
        </b-card-title>
        <b-card-text>
          <p>
            <b>Boundary Set Name:</b>
            {{ b.boundary_set_name }}
          </p>
        </b-card-text>
      </b-card>
    </template>
  </div>
</template>
<script>
import { requestsMixin } from '@/mixins/requestsMixin'
export default {
  name: 'boundaries',
  mixins: [requestsMixin],
  data() {
    return {
      boundaries: [],
      noLocation: true
    }
  },
  beforeMount() {
    this.getBounds()
  },
  methods: {
    async getBounds() {
      try {
        const coordinates = await this.$getLocation({
          enableHighAccuracy: true
        })
        const { lat, lng } = coordinates
        const response = await this.getBoundaries(lat, lng)
        this.boundaries = response.data.objects
        this.noLocation = false
      } catch (error) {
        this.noLocation = true
      }
    }
  }
}
</script>
