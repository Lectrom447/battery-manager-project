module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
        nodeIntegration: true,
        externals: ['serialport'],
        builderOptions: {
          appId: "com.example.app",
          buildDependenciesFromSource: true,
          npmRebuild: false
        }
    }
}
}
