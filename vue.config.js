module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
        nodeIntegration: true,
        externals: ['serialport'],
        mainProcessWatch:['src/electron'],
        builderOptions: {
          appId: "com.example.app",
          buildDependenciesFromSource: true,
          npmRebuild: false,
        }
    }
}
}
