<template>
  <v-container id="dashboard" fluid tag="section">
    <v-row>
      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="emailsSubscriptionChart.data"
          :options="emailsSubscriptionChart.options"
          :responsive-options="emailsSubscriptionChart.responsiveOptions"
          color="#E91E63"
          hover-reveal
          type="Bar"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Acces au serveur
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Dernières visites
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >updated 10 minutes ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="dailySalesChart.data"
          :options="dailySalesChart.options"
          color="success"
          hover-reveal
          type="Line"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Ventes hebdomadaires
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            <v-icon color="green" small> mdi-arrow-up </v-icon>
            <span class="green--text">55%</span>&nbsp; augmentation des ventes
            d'aujourd'hui
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >updated 4 minutes ago</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" lg="4">
        <base-material-chart-card
          :data="dataCompletedTasksChart.data"
          :options="dataCompletedTasksChart.options"
          hover-reveal
          color="info"
          type="Line"
        >
          <template v-slot:reveal-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" color="info" icon v-on="on">
                  <v-icon color="info"> mdi-refresh </v-icon>
                </v-btn>
              </template>

              <span>Refresh</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" light icon v-on="on">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <span>Change Date</span>
            </v-tooltip>
          </template>

          <h3 class="card-title font-weight-light mt-2 ml-2">
            Couvertures Completées
          </h3>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            Dernière performance de la dernière campagne
          </p>

          <template v-slot:actions>
            <v-icon class="mr-1" small> mdi-clock-outline </v-icon>
            <span class="caption grey--text font-weight-light"
              >campagne envoyée il y a 26 minutes</span
            >
          </template>
        </base-material-chart-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="info"
          icon="mdi-twitter"
          title="Followers"
          value="+245"
          sub-icon="mdi-clock"
          sub-text="Juste mis à jour"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="primary"
          icon="mdi-poll"
          title="Visites Website "
          value="75.521"
          sub-icon="mdi-tag"
          sub-text="Suivi de Google Analytics"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="success"
          icon="mdi-store"
          title="Revenu"
          value="34,245 €"
          sub-icon="mdi-calendar"
          sub-text="24 dernières heures"
        />
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <base-material-stats-card
          color="orange"
          icon="mdi-sofa"
          title="Bookings"
          value="184"
          sub-icon="mdi-alert"
          sub-icon-color="red"
          sub-text="Dernières données"
        />
      </v-col>

      <v-col cols="12" md="6">
        <base-material-card color="warning" class="px-5 py-3">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Stats Employés</div>

            <div class="subtitle-1 font-weight-light">
              Nouveaux employés le 15 décembre 2020
            </div>
          </template>
          <v-card-text>
            <v-data-table :headers="headers" :items="items" />
          </v-card-text>
        </base-material-card>
      </v-col>

      <v-col cols="12" md="6">
        <base-material-card class="px-5 py-3">
          <template v-slot:heading>
            <v-tabs
              v-model="tabs"
              background-color="transparent"
              slider-color="white"
            >
              <span
                class="subheading font-weight-light mx-3"
                style="align-self: center"
                >Taches:</span
              >
              <v-tab class="mr-3">
                <v-icon class="mr-2"> mdi-bug </v-icon>
                Bugs
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2"> mdi-code-tags </v-icon>
                Website
              </v-tab>
              <v-tab>
                <v-icon class="mr-2"> mdi-cloud </v-icon>
                Server
              </v-tab>
            </v-tabs>
          </template>

          <v-tabs-items v-model="tabs" class="transparent">
            <v-tab-item v-for="n in 3" :key="n">
              <v-card-text>
                <template v-for="(task, i) in tasks[tabs]">
                  <v-row :key="i" align="center">
                    <v-col cols="1">
                      <v-list-item-action>
                        <v-checkbox v-model="task.value" color="secondary" />
                      </v-list-item-action>
                    </v-col>

                    <v-col cols="9">
                      <div class="font-weight-light" v-text="task.text" />
                    </v-col>

                    <v-col cols="2" class="text-right">
                      <v-icon class="mx-1"> mdi-pencil </v-icon>
                      <v-icon color="error" class="mx-1"> mdi-close </v-icon>
                    </v-col>
                  </v-row>
                </template>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DashboardDashboard',

  data() {
    return {
      dailySalesChart: {
        data: {
          labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
          series: [[12, 17, 7, 17, 23, 18, 38]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 50, // Miradata: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      dataCompletedTasksChart: {
        data: {
          labels: ['00h', '15h', '18h', '21h', '12h', '03h', '06h', '09'],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]]
        },
        options: {
          lineSmooth: this.$chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // Miradata: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      emailsSubscriptionChart: {
        data: {
          labels: [
            'Ja',
            'Fe',
            'Ma',
            'Av',
            'Mai',
            'Ju',
            'Jul',
            'Au',
            'Se',
            'Oc',
            'No',
            'De'
          ],
          series: [[542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            'screen and (max-width: 640px)',
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc(value) {
                  return value[0]
                }
              }
            }
          ]
        ]
      },
      headers: [
        {
          sortable: false,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Nom',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Salaire',
          value: 'salary',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Dept',
          value: 'country',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Ville',
          value: 'city',
          align: 'right'
        }
      ],
      items: [
        {
          id: 1,
          name: 'Dakota Rice',
          country: 'Ain',
          city: 'Oud-Tunrhout',
          salary: '35,738 €'
        },
        {
          id: 2,
          name: 'Minerva Hooper',
          country: 'Paris',
          city: 'Sinaai-Waas',
          salary: '23,738 €'
        },
        {
          id: 3,
          name: 'Sage Rodriguez',
          country: 'Val de marne',
          city: 'Overland Park',
          salary: '56,142 €'
        },
        {
          id: 4,
          name: 'Philip Chanley',
          country: 'Marseille',
          city: 'Gloucester',
          salary: '38,735 €'
        },
        {
          id: 5,
          name: 'Doris Greene',
          country: 'Matinique',
          city: 'Feldkirchen in Kārnten',
          salary: '63,542 €'
        }
      ],
      tabs: 0,
      tasks: {
        0: [
          {
            text:
              'Signer un contrat pour "De quoi les organisateurs de la conférence ont-ils peur?"',
            value: true
          },
          {
            text:
              'Des lignes de la grande littérature russe? Ou des e-mails de mon patron?',
            value: false
          },
          {
            text:
              'Inondé: un an plus tard, évaluant ce qui a été perdu et ce qui a été trouvé lorsqu\'une pluie ravageuse a balayé le métro de d\'Orleans',
            value: false
          },
          {
            text:
              'Créez 4 expériences utilisateur invisibles dont vous ne saviez jamais rien',
            value: true
          }
        ],
        1: [
          {
            text:
              "Inondé: un an plus tard, évaluation de ce qui a été perdu et de ce qui a été trouvé lorsqu'une pluie ravageuse a balayé le métro de d'orleans",
            value: true
          },
          {
            text:
              'Signer un contrat pour "De quoi les organisateurs de la conférence ont-ils peur?"',
            value: false
          }
        ],
        2: [
          {
            text:
              'Des lignes de la grande littérature russe? Ou des e-mails de mon patron?',
            value: false
          },
          {
            text:
              "Inondé: un an plus tard, évaluation de ce qui a été perdu et de ce qui a été trouvé lorsqu'une pluie ravageuse a balayé le métro de d'orleans",
            value: true
          },
          {
            text:
              'Signer un contrat pour "De quoi les organisateurs de la conférence ont-ils peur?"',
            value: true
          }
        ]
      },
      list: {
        0: false,
        1: false,
        2: false
      }
    }
  },

  methods: {
    complete(index) {
      this.list[index] = !this.list[index]
    }
  }
}
</script>
