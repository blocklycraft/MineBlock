import * as fs from 'fs';
import * as path from 'path';
import { MineBlock } from './mineblock';

const xml2js = require('xml2js');



export function loadblocks(): string {
    let script_code: string = '';
    //internal block
    script_code += fs.readFileSync(path.join(MineBlock.context.extensionPath,
        'res',
        'blocks',
        'blocks_compressed.js'
    ));
    //other location....

    return script_code;
}
export function loadtoolbox(): string {
    let toolbox_code: string = '';
    let toolbox_obj = {};
    xml2js.parseString(fs.readFileSync(path.join(MineBlock.context.extensionPath,
        'res',
        'toolbox',
        'toolbox.xml'
    )).toString(),{explicitArray : false},(err: any,data: any)=>{
        if(err !== null){
            return;
        }
        toolbox_obj = data;
    });
    return new xml2js.Builder().buildObject(toolbox_obj);
}

export function loadcfgtoolbox(): string{
    return fs.readFileSync(path.join(MineBlock.context.extensionPath,
        'res',
        'toolbox',
        'config.xml'
    )).toString();
}