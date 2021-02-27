<template>
  <div id="coefficients">
    <reactive-bar-chart :chart-data="chartData"></reactive-bar-chart>
  </div>
</template>

<script>
import ReactiveBarChart from '../js/ReactiveBarChart.js'
export default {
  name: 'App',
  components: {
    ReactiveBarChart
  },
  data() {
    return {
      chartData: null
    }
  },
  methods: {
    binomial(n, k) {
      if (typeof n !== 'number' || typeof k !== 'number') {
        return false
      }
      let coeff = 1
      for (let x = n - k + 1; x <= n; x++) {
        coeff *= x
      }
      for (let x = 1; x <= k; x++) {
        coeff /= x
      }
      return coeff
    },
    binomialCoefficient(a, b) {
      const numerator = this.fact(a)
      const denominator = this.fact(a - b) * this.fact(b)
      return numerator / denominator
    },
    // Factorial function.
    fact(x) {
      if (x === 0) {
        return 1
      }
      return x * this.fact(x - 1)
    },
    generateData() {
      const newArray = []
      for (let i = 0; i < 10; i++) {
        const n = Math.floor(Math.random() * 10)
        // const k = Math.floor(Math.random() * 10)
        // const coeff=this.binomialCoefficient(n, k)
        newArray.push(n)
        // this.chartData.config.data.labels.push("Coeff" + coeff)
      }

      this.chartData = {
        datasets: [
          {
            labels: [
              'Coeff 1',
              'Coeff 2',
              'Coeff 3',
              'Coeff 4',
              'Coeff 5',
              'Coeff 6'
            ],
            label: 'Generation AI Coefficients',
            backgroundColor: '#84FFFF',
            data: newArray
          }
        ]
      }
    }
  },
  mounted() {
    setInterval(this.generateData, 2000)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
