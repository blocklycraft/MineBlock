import * as vscode from 'vscode';
import * as path from 'path';
import * as mineblock from './mineblock';
import * as fs from 'fs';
import * as blockly from './blockly';

export class Utils {
    private static openedPanel: vscode.WebviewPanel[] = [];
    public static addPanel(panel: vscode.WebviewPanel): void {
        if (!this.hasPanel(panel.viewType)) {
            this.openedPanel.push(panel);
        }
    }
    public static closePanel(uri: string): void {
        this.openedPanel.forEach((panel, index) => {
            if (panel.viewType === uri) {
                panel.dispose();
            }
        });
    }
    public static hasPanel(uri: string): boolean {
        let flag = false;
        this.openedPanel.forEach((panel) => {
            if (panel.viewType === uri) {
                flag = true;
            }
        });
        return flag;
    }
    public static activePanel(uri: string): void {
        this.openedPanel.forEach((panel) => {
            if (panel.viewType === uri) {
                panel.reveal(panel.viewColumn);
            }
        });
    }
    public static getPanelFromUri(uri: string): vscode.WebviewPanel | null {
        let flag = null;
        this.openedPanel.forEach((panel) => {
            if (panel.viewType === uri) {
                return flag = panel;
            }
        });
        return flag;
    }
    public static regPanel(uri: string) {
        let panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
            uri,
            '积木>' + path.basename(uri, '.mineblock'),
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(mineblock.MineBlock.context.extensionPath, 'res'))
                ],
                retainContextWhenHidden: true
            }
        );
        panel.webview.onDidReceiveMessage((e) => {
            switch (e.command) {
                case 'helo':
                    //编辑器加载完成
                    //初始化数据
                    if (path.basename(panel.viewType) === 'plugin.mineblock') {
                        panel.webview.postMessage({
                            command: 'loadblock',
                            blocks: blockly.loadblocks()
                        });
                        panel.webview.postMessage({
                            command: 'toolbox',
                            blocks: blockly.loadtoolbox()
                        });
                    } else if (path.dirname(panel.viewType)
                        ===
                        vscode.workspace.getWorkspaceFolder(
                            vscode.Uri.parse(panel.viewType)
                        )?.uri.fsPath) {

                    }

            }

        });
        panel.webview.html = this.getEditorHTML();
        this.addPanel(panel);
        panel.onDidDispose(() => {
            this.openedPanel.splice(this.openedPanel.indexOf(panel), 1);
        });
    }
    public static getEditorHTML(): string {
        let html: string = fs.readFileSync(
            path.join(mineblock.MineBlock.context.extensionPath, 'res', 'editor.html')
        ).toString();
        //替换'__RES__'
        html = html.replace(/\_\_RES\_\_/g, vscode.Uri.file(
            mineblock.MineBlock.context.extensionPath + '/res')
            .with({ scheme: 'vscode-resource' })
            .toString()
        );
        return html;
    }
}
