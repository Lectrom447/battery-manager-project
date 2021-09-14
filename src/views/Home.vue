<template>
  <div class="mt-5">
    <v-card>
      <v-card-title>
        <h3>Serial Console</h3>
        <v-container id="scroll-target" style="height: 300px" class="overflow-y-auto"> 
          <v-container class="d-flex  flex-column-reverse" v-scroll:#scroll-target="onScroll" style="min-height: 300px">
            <p class="log-style" v-for="item in consoleHistory" :key="item.index">{{item}}</p>
          </v-container >
        </v-container>
        <v-text-field
          outlined
          dense
          :disabled="!isConected"
          prepend-inner-icon="mdi-chevron-right"
          v-model="consoleInput"
          @keypress="handleConsoleInputChange"
        ></v-text-field>
      </v-card-title>

    </v-card>
  </div>
</template>

<script lang='ts'>
import { ipcRenderer } from 'electron';
import Vue from 'vue';
import { serialWrite } from "../tools/serialComunicationManager";


export default Vue.extend({
  data() {
    return{
      consoleInput:'',
      consoleHistory:[''],
      offsetTop:0
    }
  },
  computed:{
    conectionStatus(){
      return this.$store.state.conectionStatus
    },

    isConected():boolean{
      return this.conectionStatus === 'connected'
    }
  },
  methods: {
    handleConsoleInputChange(e:KeyboardEvent) {
      if(e.code === "Enter"){
        this.consoleHistory.unshift(this.consoleInput)
        serialWrite(this.consoleInput);
        this.consoleInput = ''
        this.scrollDown()
      }
      
    },
    startDataMonitoring(){
      ipcRenderer.on('newSerialData', (event, data) => {
        // console.log(new TextDecoder().decode(data) );
        this.consoleHistory.unshift(`[Arduino]: ${data}`)
    })

    },
    scrollDown(){
        const object = document.querySelector('#scroll-target');
        if(object){
          console.log(object.scrollHeight);
          
          object.scrollTop = object.scrollHeight - 300
        }
    },
      onScroll (e:any) {
        this.offsetTop =  e.target.scrollTop
      }
  },
  mounted: function(){
    this.startDataMonitoring();
  }

})
</script>

<style scoped>
  .log-style{
    font-size: 14px;
    margin: 0!important;
    padding: 0!important;
    height: 20px;
  }
</style>