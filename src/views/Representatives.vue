<template>
  <div class="page">
    <h1 class="text-center">Representative Sets</h1>
    <template v-if="noLocation">
      <h2 class="text-center">
        Enable geolocation to see list of representatives
      </h2>
    </template>
    <template v-if="!noLocation">
      <b-form>
        <b-form-group label="Representative Set" label-for="repSet">
          <b-form-select
            name="repSet"
            v-model="form.repSet"
            :options="repSets"
            required
            @change="getRepSetReps()"
          ></b-form-select>
        </b-form-group>
      </b-form>
      <b-card v-for="(r, i) in reps" :key="i" class="card">
        <b-card-title>
          <h2>
            <avatar :src="r.photo_url" :inline="true"></avatar>
            <span class="title">{{ r.name }}</span>
          </h2>
        </b-card-title>
        <b-card-text>
          <h5>Info:</h5>
          <p>
            <b>Elected Office:</b>
            {{ r.office }}
          </p>
          <p>
            <b>District Name:</b>
            {{ r.district_name }}
          </p>
          <p>
            <b>Party:</b>
            {{ r.party_name || 'None' }}
          </p>
          <h5>Offices:</h5>
          <div v-for="(o, i) in r.offices" :key="i">
            <p>
              <b>Address:</b>
              {{ o.postal }}
            </p>
            <p>
              <b>Telephone:</b>
              {{ o.tel }}
            </p>
            <p>
              <b>Type:</b>
              {{ o.type }}
            </p>
          </div>
        </b-card-text>
      </b-card>
    </template>
  </div>
</template>
<script>
import { requestsMixin } from '@/mixins/requestsMixin'
import Avatar from 'vue-avatar'
export default {
  name: 'boundaries',
  mixins: [requestsMixin],
  data() {
    return {
      repSets: [],
      reps: [],
      form: {
        repSet: 'strathcona-county-council'
      },
      noLocation: true,
      coordinates: {}
    }
  },
  components: {
    Avatar
  },
  beforeMount() {
    this.getRepSets()
    this.getLocation()
  },
  methods: {
    async getRepSets() {
      const response = await this.getRepresentativeSets()
      this.repSets = response.data.objects.map((s) => {
        const [part1, part2, value] = s.url.split('/')
        return {
          text: s.name,
          value
        }
      })
    },
    async getLocation() {
      try {
        const coordinates = await this.$getLocation({
          enableHighAccuracy: true
        })
        this.coordinates = coordinates
        this.noLocation = false
      } catch (error) {
        this.noLocation = true
      }
    },
    async getRepSetReps() {
      const { lat, lng } = this.coordinates
      const response = await this.getRepresentativeSetsRepresentatives(
        this.form.repSet,
        lat,
        lng
      )
      this.reps = response.data.objects
    }
  }
}
</script>
