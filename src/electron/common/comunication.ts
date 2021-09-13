import { ipcMain } from 'electron';

import {
  connectToSerialPort,
  disconnectToSerialPort,
  getSerials,
  serialWrite,
} from '../tools/serialControl';

interface portconnpayload {
    action:string,
    payload: {
        [key:string]: any
    }
}

ipcMain.on('serialPortsList', async (event) => {
    event.returnValue = await getSerials()
})

ipcMain.on('serialPortConection', (event, args:portconnpayload) => {
    switch (args.action) {
        case 'connect':{
            connectToSerialPort(args.payload.path, args.payload.baudRate);
            event.returnValue = {status: 'ok'}
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

