<template>
  <v-app>
    <conection-manager/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import ConectionManager from "./components/common/ConectionManager.vue";

export default Vue.extend({
  components: {
    ConectionManager
  },
  name: 'App',

  data: () => ({
    //
  }),
  mounted: function() {
    if(this.$route.path !== '/'){
      this.$router.push('/')
    }
  }
});
</script>
