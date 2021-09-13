<template>
<div>
    <v-card>
      <v-card-title>Selecione dispositivo</v-card-title>
      <v-row>
        <v-col 
        md="4"
        xs = "6"
        >
          
            <div class="px-10">
              <v-row>
                <v-select
                  :disabled="serialPorts.length === 0 || connectioStatus == 'connected' || connectioStatus == 'pending'"
                  :items="getSerialsPath"
                  v-model="portSelected"
                  @change="serialSelectionChange"
                  label="Puerto"
                  dense
                  outlined
                ></v-select>
              <v-btn
                :disabled="connectioStatus == 'connected' || connectioStatus == 'pending'"
                id="syncSerialsBtn" 
                @click="getSerials"
                icon
                ><v-icon>mdi-sync</v-icon></v-btn>
              </v-row>
              <v-row class="mb-6">
                <div
                    id="baudRateSelect"
                >
                  <v-select    
                    :disabled="serialPorts.length === 0 || connectioStatus == 'connected' || connectioStatus == 'pending'"
                    class="mr-5"
                    :items="BaudrateOpt"
                    v-model="baudRateSelected"
                    dense
                    outlined
                    label="BaudRate"
                  ></v-select>
                </div>
                <v-btn
                v-if="connectioStatus ===  'pending' || connectioStatus ===  'disconnected'"
                :disabled="serialPorts.length === 0 || connectioStatus == 'pending'"
                @click="serialConnect"
                 color="success"
                >Conectar</v-btn>
                <v-btn
                v-if="connectioStatus ===  'connected'"
                @click="serialDisconnect"
                 color="error"
                >Desonectar</v-btn>
                <v-btn
                 :disabled=" connectioStatus == 'disconnected'"
                @click="serialWrite"
                 color="primary"
                >Ping</v-btn>
              </v-row>
          </div>
        </v-col>  
      </v-row>

    </v-card>
</div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {ipcRenderer} from 'electron';
  import  { PortInfo } from 'serialport';


  export default Vue.extend({
    name: 'Home',

    components: {
    },
    data () {
      return{
        serialPorts:[],
        connectioStatus: 'disconnected',
        portSelected: '',
        baudRateSelected: 9600,
        BaudrateOpt: [
          9600,
          1200
        ]
      }
    },
    computed:{
      getSerialsPath ():Array<string> {
        let serials = this.serialPorts;
        return serials.map((val:PortInfo) => {return val.path})
      }
    },
    methods:{
      getSerials() {
          this.serialPorts = ipcRenderer.sendSync('serialPortsList');
          if(this.serialPorts.length !== 0){
            this.portSelected = this.getSerialsPath[0];
          }
          
      },
      serialSelectionChange() {
        console.log(this.portSelected)
      },
      serialConnect () {
        ipcRenderer.sendSync('serialPortConection',{action:'connect',payload:{path:this.portSelected,baudRate:this.baudRateSelected}});
        this.connectioStatus = 'connected';
      },
      serialWrite () {
        ipcRenderer.sendSync('serialPortConection',{action:'write',payload:{data:'Hola'}});
      },
      serialDisconnect () {
        ipcRenderer.sendSync('serialPortConection',{action:'disconnect',payload:{}});
        this.connectioStatus = 'disconnected';
      }
    },
    mounted: function () {
      this.getSerials()
    }
  })
</script>

<style scoped>
  #baudRateSelect {
    max-width: 12rem!important;
  }
</style>
