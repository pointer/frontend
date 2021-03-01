module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
  },
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: ['/node_modules/', '/public/', '**/.#*']
      },
      disableHostCheck: true,
      public: process.env.DEV_PUBLIC || 'localhost',
      port: process.env.DEV_PORT || 8080
    },
    plugins: []
  },
  productionSourceMap: false,
  transpileDependencies: [/node_modules[/\\\\]vuetify[/\\\\]/],
  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    },
    electronBuilder: {
      builderOptions: {
        productName: 'facturier'
      }
    }
  }
}
