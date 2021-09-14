'use strict'
import { app, BrowserWindow, dialog, ipcMain, Notification } from 'electron';

import {
  connectToSerialPort,
  disconnectToSerialPort,
  getSerials,
  serialWrite,
  startMonitoring,
} from '../tools/serialControl';

interface portconnpayload {
    action:string,
    payload: {
        [key:string]: any
    }
}

export const startComunications = (win:BrowserWindow):void => { 
    ipcMain.on('serialPortsList', async (event) => {
        event.returnValue = await getSerials()
    })
    
    ipcMain.handle('serialPortConection', async(event, args:portconnpayload) => {
        switch (args.action) {
            case 'connect':{
                try {
                    await connectToSerialPort(args.payload.path, args.payload.baudRate);
                    startMonitoring(win);

                    new Notification({title:'Conexion establecida'}).show();
                    return {status: 'ok'}
                } catch (error) {
                    await dialog.showErrorBox('Conexion fallida', error.message);
                    return {status: 'error', payload: {description: error.message}}
                }
                break;
            }
            case 'disconnect':{
                disconnectToSerialPort();
                event.returnValue = {status: 'ok'}
                break;
            }
            case 'write':{
                serialWrite(args.payload.data);
                event.returnValue = {status: 'ok'}
                break;
            }
            
        
            default:
                break;
        }
    })

    

}



