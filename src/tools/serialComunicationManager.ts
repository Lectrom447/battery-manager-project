import { ipcRenderer } from "electron";


export const serialWrite = (arg:string) => {
    ipcRenderer.invoke('serialPortConection',{action:'write',payload:{data:arg}});
}