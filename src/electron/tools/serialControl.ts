import SerialPort, { PortInfo } from 'serialport';

// const baudRate = 9600;
let serial:SerialPort
export const getSerials = async():Promise<Array<PortInfo>> => {
    try {
        return await SerialPort.list();
    } catch (error) {
        console.log(error)
        return []
    }
}

export const connectToSerialPort = (path:string , baudRate:number):void => {
    serial = new SerialPort(path,{baudRate})
}

export const serialWrite = (data:string):void => {
    serial.write(data);
}

export const disconnectToSerialPort = ():void => {
    if(serial.isOpen){
        serial.close();
        serial.destroy();
    }
}
