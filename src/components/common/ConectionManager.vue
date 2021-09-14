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
                <div
                  id="portSelect"
                >
                  <v-select
                    :disabled="getSerialsPath.length === 0 || connectioStatus == 'connected' || connectioStatus == 'pending'"
                    :items="getSerialsPath"
                    v-model="portSelected"
                    @change="serialSelectionChange"
                    label="Puerto"
                    dense
                    outlined
                  ></v-select>
                </div>
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
                    :disabled="getSerialsPath.length === 0 || connectioStatus == 'connected' || connectioStatus == 'pending'"
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
                :disabled="getSerialsPath.length === 0 "
                @click="serialConnect"
                :loading="(connectioStatus === 'pending')"
                 color="success"
                >Conectar</v-btn>

                <v-btn
                v-if="connectioStatus ===  'connected'"
                @click="serialDisconnect"
                 color="error"
                >Desonectar</v-btn>
                <v-btn
                  class="ml-5"
                  :disabled=" connectioStatus == 'disconnected' || connectioStatus == 'pending'"
                  @click="sendPing"
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
import { ipcRenderer } from 'electron';
import { serialWrite } from "../../tools/serialComunicationManager";

  import  { PortInfo } from 'serialport';
  import { mapActions} from 'vuex';

  interface selectObj {
    text: string ,
    value: string,
    disabled?: boolean,
    divider?: boolean,
    header?: string
  }


  export default Vue.extend({
    name: 'ConectionManager',

    components: {
    },
    data () {
      return{
        serialPorts:[],
        portSelected: '',
        baudRateSelected: 9600,
        BaudrateOpt: [
          9600,
          1200,
          115200
        ]
      }
    },
    computed:{
      connectioStatus(){
        return this.$store.state.conectionStatus;
      },

      getSerialsPath ():Array<selectObj> {
        let serials = this.serialPorts;
        serials = serials.filter((port:PortInfo) =>  port.productId != undefined)
        return serials.map((val:PortInfo) => {
          return {
            text: `${val.path} | ${val.manufacturer}`,
            value: val.path,
          }
        })
      }
    },
    methods:{
      
      ...mapActions([
        'changeConectionState'
      ]),
      sendPing(){
        serialWrite('ping')
      },
      checkReady() {
        ipcRenderer.once('app-ready',() => {
          this.getSerials();
        } )
      },
      getSerials() {
          this.serialPorts = ipcRenderer.sendSync('serialPortsList');
          console.log(this.serialPorts);
            let serials = this.serialPorts;
            serials = serials.filter((port:PortInfo) =>  port.productId != undefined)
          if(serials.length !== 0){
            this.portSelected = this.getSerialsPath[0].value;
          }
          console.log(this.serialPorts);
          
          
      },
      serialSelectionChange() {
        console.log(this.portSelected)
      },
      async serialConnect () {
        this.changeConectionState('pending');
        let res = await ipcRenderer.invoke('serialPortConection',{action:'connect',payload:{path:this.portSelected,baudRate:this.baudRateSelected}})
          console.log(res);
        if(res.status === 'ok'){
        this.changeConectionState('connected');          
        }else{
          console.error(res.payload.description);
          this.changeConectionState('disconnected');
        }
      },
      serialDisconnect () {
        ipcRenderer.invoke('serialPortConection',{action:'disconnect',payload:{}});
        this.changeConectionState('disconnected');
      }
    },
    mounted: function () {
      this.checkReady()
    }
  })
</script>

<style scoped>
  #baudRateSelect {
    max-width: 50%!important;
  }
  #portSelect {
    max-width: 85%!important;
  }
</style>
