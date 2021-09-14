import { app, BrowserWindow, ipcMain } from 'electron';

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
                    return {status: 'ok'}
                } catch (error) {
                    return {status: 'error', payload: {description: error}}
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



