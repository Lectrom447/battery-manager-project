import SerialPort, { PortInfo } from 'serialport';
import { exec } from "child_process";
import os from "os";
import { BrowserWindow, ipcMain } from 'electron';
const Readline = SerialPort.parsers.Readline

let serial:SerialPort
export const getSerials = async():Promise<Array<PortInfo>> => {
    try {
        return await SerialPort.list();
    } catch (error) {
        console.log(error)
        return []
    }
}

export const connectToSerialPort = (path:string , baudRate:number):Promise<any> => {
    return new Promise((resolve, reject) => {
        if(os.platform() == 'linux'){
            exec(`ls -l ${path}`,(err,res) => {
                if(!err){
                    if(res.split(' ')[0] !== 'crw-rw-rw-'){
                        exec(`pkexec chmod 666 ${path}`, err => {
                            (!err)
                                ?serial = new SerialPort(path,{baudRate},err => (!err)?resolve('port open'):reject(err))
                                :reject(err)
                        })
                    }else{
                        serial = new SerialPort(path,{baudRate},err => (!err)?resolve('port open'):reject(err))
                    }
                }else{
                    reject(err)
                }
            })
        }else{
            serial = new SerialPort(path,{baudRate},err => (!err)?resolve('port open'):reject(err))
        }
    })
}

export const serialWrite = (data:string):void => {
    if(serial.isOpen){
        serial.write(data);
    }
}

export const startMonitoring = (win:BrowserWindow) => {    
    if(serial.isOpen){
        // const parser = new Ready({ delimiter: 'READY' })
        // serial.pipe(parser);
        // serial.on("data", (data) => {
        //     win.webContents.send('newSerialData', data);
        //     console.log('data');
            
        // })

        const parser = serial.pipe(new Readline({ delimiter: '\r\n' }))
        parser.on("data",(data) => {
                win.webContents.send('newSerialData', data);
            })
    }
}

export const disconnectToSerialPort = ():void => {
    if(serial !== undefined){
        if(serial.isOpen){
            serial.close();
            serial.destroy();
        }
    }
}
