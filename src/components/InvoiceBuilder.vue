<template>
  <div class="page-container">
    <main class="main-content">
      <div id="invoice-app">
        <div class="header">
          <div>
            <h1>Facturier</h1>
            <p>Date: <input type="date" v-model="invoiceDate" /></p>
          </div>
          <div>
            <div class="section-spacer">
              <input
                type="text"
                placeholder="Company Name"
                class="company-name"
                v-model="company.name"
              />
              <textarea
                v-on:keyup="adjustTextAreaHeight"
                v-model="company.contact"
              ></textarea>
            </div>
            <div class="section-spacer">
              <p><strong>Facturé à:</strong></p>
              <textarea
                v-on:keyup="adjustTextAreaHeight"
                v-model="client"
              ></textarea>
            </div>
          </div>
        </div>
        <div>
          <label for="currency-picker">Devise:</label>
          <select id="currency-picker" v-model="invoiceCurrency">
            <option
              v-for="currency in currencies"
              v-bind:key="currency.code"
              :value="currency"
            >
              {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>
        <table class="responsive-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Item</th>
              <th>Prix/unite</th>
              <th>Quantité</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tr v-for="(item, index) in items" v-bind:key="index">
            <td data-label="No">{{ index + 1 }}</td>
            <td data-label="Item">
              <input type="text" v-model="item.description" />
            </td>
            <td data-label="Prix/unite">
              <div class="cell-with-input">
                {{ invoiceCurrency.symbol }}
                <input type="number" min="0" v-model="item.price" />
              </div>
            </td>
            <td data-label="Quantité">
              <input type="number" min="0" v-model="item.quantity" />
            </td>
            <td data-label="Total">
              {{ decimalDigits(item.price * item.quantity) }}
            </td>
            <td class="text-right">
              <button class="is-danger" v-on:click="deleteItem(index)">
                Effacer item
              </button>
            </td>
          </tr>
        </table>
        <button v-on:click="addNewItem">Ajouter item</button>
        <table>
          <tr>
            <td>Sous total</td>
            <td>{{ decimalDigits(subTotal) }}</td>
          </tr>
          <tr>
            <td>
              <div class="cell-with-input">
                Remise
                <input
                  class="text-right"
                  type="number"
                  min="0"
                  max="100"
                  v-model="discountRate"
                />%
              </div>
            </td>
            <td>{{ decimalDigits(discountTotal) }}</td>
          </tr>
          <tr>
            <td>
              <div class="cell-with-input">
                Tax
                <input
                  class="text-right"
                  type="number"
                  min="0"
                  max="100"
                  v-model="taxRate"
                />%
              </div>
            </td>
            <td>{{ decimalDigits(taxTotal) }}</td>
          </tr>
          <tr class="text-bold">
            <td>Grand Total</td>
            <td>{{ decimalDigits(grandTotal) }}</td>
          </tr>
        </table>
        <div class="section-spacer">
          <p>Notes:</p>
          <textarea v-on:keyup="adjustTextAreaHeight"></textarea>
        </div>

        <div class="section-spacer">
          <p>Termes:</p>
          <textarea v-on:keyup="adjustTextAreaHeight"></textarea>
        </div>
        <button v-on:click="printInvoice">Imprimer</button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  el: '#invoice-app',
  data() {
    return {
      invoiceCurrency: {
        symbol: '$',
        name: 'US Dollar',
        symbol_native: '$',
        decimal_digits: 2,
        rounding: 0,
        code: 'USD',
        name_plural: 'US dollars'
      },
      taxRate: 20,
      discountRate: 0,
      items: [
        { description: 'Item name', quantity: 0, price: 0 },
        { description: 'Item name', quantity: 0, price: 0 }
      ],
      currencies: this.currenciesData,
      company: {
        name: 'Your company name',
        contact: 'Your address\nYour tel\nYour email'
      },
      client: 'Client information',
      invoiceDate: '',
      currenciesData: {
        symbol: '€',
        name: 'Euro',
        symbol_native: '€',
        decimal_digits: 2,
        rounding: 0,
        code: 'EUR',
        name_plural: 'euros'
      }
    }
  },
  methods: {
    addNewItem() {
      this.items.push({ description: 'Nom item', quantity: 0, price: 0 })
    },
    deleteItem(index) {
      this.items.splice(index, 1)
    },
    decimalDigits(value) {
      return `${this.invoiceCurrency.symbol} ${value.toFixed(
        this.invoiceCurrency.decimal_digits
      )}`
    },
    printInvoice() {
      window.print()
    },
    adjustTextAreaHeight(event) {
      const el = event.target
      el.style.height = '1px'
      el.style.height = `${25 + el.scrollHeight}px`
    }
  },
  computed: {
    subTotal() {
      const total = this.items.reduce((accumulator, item) => {
        return accumulator + item.price * item.quantity
      }, 0)
      return total
    },
    discountTotal() {
      const total = this.subTotal * (this.discountRate / 100)
      return total
    },
    taxTotal() {
      const total = (this.subTotal - this.discountTotal) * (this.taxRate / 100)
      return total
    },
    grandTotal() {
      const total = this.subTotal - this.discountTotal + this.taxTotal
      return total
    }
  },

  async mounted() {
    try {
      //  // console.log(this.invoiceCurrency)
    } catch (error) {}
  }
}
</script>

<style>
$red: #ff5f6d;
$yellow: #ffc371;
$green: #81cf71;
$white: #faebd7;
$grey: darken($white, 10%);

body {
  background: linear-gradient(to right, $red, $yellow);
}

.main-content {
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  @media print {
    align-items: flex-start;
  }
}

#invoice-app {
  background-color: $white;
  padding: 2rem;
  border-radius: 0.5rem;
}

.header {
  @media (min-width: 761px) {
    display: flex;
  }

  > div {
    &:nth-child(-n + 1) {
      @media (min-width: 761px) {
        order: 1;
        flex: 1;
        text-align: right;
        padding-left: 1rem;
      }
    }
  }
}

.section-spacer {
  margin: 1rem 0;
}

input,
select,
textarea {
  background-color: transparentize($color: white, $amount: 0.7);
  border: none;
  display: inline-block;
  transition: background-color 0.3s ease-in-out;
  width: 100%;

  &:focus {
    outline-color: $yellow;
    background-color: transparentize($color: white, $amount: 0.4);
  }

  &:hover {
    background-color: transparentize($color: white, $amount: 0.5);
  }

  @media print {
    background-color: transparent;
  }

  @media only screen and (min-width: 761px) {
    width: auto;
  }
}

textarea {
  width: 100%;
  min-height: 80px;
}

select {
  @media only screen and (max-width: 760px) {
    width: 100%;
  }

  @media print {
    appearance: none;
  }
}

.company-name {
  font-size: 2rem;
}

table {
  width: auto;
  border-collapse: collapse;
  margin: 2rem 0;

  thead {
    th {
      padding: 0.5rem 1rem;

      &:nth-child(-n + 1) {
        padding-left: 0;
      }
      &:nth-last-child(-n + 1) {
        padding-right: 0;
      }
    }
  }

  tr {
    border-bottom: 1px solid $grey;

    td {
      padding: 0.5rem 1rem;

      &:nth-child(-n + 1) {
        padding-left: 0;
      }
      &:nth-last-child(-n + 1) {
        padding-right: 0;
      }

      input {
        width: 100%;
      }

      .cell-with-input {
        display: flex;

        input {
          margin: 0 0.2rem;
        }
      }
    }
  }
}

.responsive-table {
  width: 100%;
  @media only screen and (max-width: 760px) {
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }

    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    tr {
      padding: 2rem 0;
    }

    td[data-label] {
      position: relative;
      padding-left: 40%;
      display: flex;
      align-items: center;

      &:before {
        content: attr(data-label);
        position: absolute;
        top: 0.5rem;
        left: 0;
        width: 35%;
        padding-right: 10px;
        white-space: nowrap;
        font-weight: bold;
      }
    }
  }
}

button {
  background-color: $green;
  border: none;
  border-radius: 100px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:focus {
    outline-color: $yellow;
    background-color: darken($color: $green, $amount: 7%);
  }

  &:hover {
    background-color: darken($color: $green, $amount: 5%);
  }

  @media print {
    display: none;
  }

  &.is-danger {
    background-color: $red;

    &:focus {
      background-color: darken($color: $red, $amount: 7%);
    }

    &:hover {
      background-color: darken($color: $red, $amount: 5%);
    }
  }
}

.text-right {
  text-align: right;
}

.text-bold {
  font-weight: bold;
}
</style>
