import * as vscode from 'vscode';
import * as path from 'path';
import * as util from './util';

export class MineBlock {
    static context: vscode.ExtensionContext;

    constructor(_context: vscode.ExtensionContext) {
        MineBlock.context = _context;
        this.regEventListeners();
        this.checkEditor();
    }

    private checkEditor(): void {

        if (vscode.window.activeTextEditor) {

            if (path.extname(vscode.window.activeTextEditor.document.fileName) === '.mineblock') {
                let file = vscode.window.activeTextEditor.document.fileName;
                vscode.commands.executeCommand('workbench.action.closeActiveEditor').then(() => {
                    util.Utils.regPanel(file);

                });

            }
        }
    }
    private regEventListeners(): void {
        //监听打开事件，并拦截指定文件
        vscode.workspace.onDidOpenTextDocument(this.onOpenDoc);
        //监听文件删除事件，并确定是否关闭编辑器
        vscode.workspace.onDidDeleteFiles(this.onRmDoc);
        //监听文件重命名事件，保证编辑器状态同步
        vscode.workspace.onDidRenameFiles(this.onRnDoc);

    }
    private onOpenDoc(doc: vscode.TextDocument): void {
        //判断扩展名
        if (path.extname(doc.fileName) === '.mineblock') {
            vscode.commands.executeCommand('workbench.action.closeActiveEditor').then(() => {
                if (!util.Utils.hasPanel(doc.fileName)) {
                    util.Utils.regPanel(doc.fileName);
                }else{
                    util.Utils.activePanel(doc.fileName);
                }
            });

        }
    }

    private onRmDoc(e: vscode.FileDeleteEvent): void {
        e.files.forEach((file) => {
            if (path.extname(file.path) === '.mineblock' && util.Utils.hasPanel(file.fsPath)) {
                util.Utils.closePanel(file.fsPath);
            }
        });
    }
    private onRnDoc(e: vscode.FileRenameEvent): void {
        //重新打开编辑器
        e.files.forEach((file)=>{
            if(path.extname(file.oldUri.toString()) === '.mineblock'){
                util.Utils.closePanel(file.oldUri.fsPath);
            }
            if(path.extname(file.newUri.toString()) === '.mineblock'){
                if (!util.Utils.hasPanel(file.newUri.fsPath)) {
                    util.Utils.regPanel(file.newUri.fsPath);
                }
            }
            
        });
    }
}