"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const pareoViewProvider = new PareoViewProvider();
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(PareoViewProvider.viewType, pareoViewProvider));
}
exports.activate = activate;
class PareoViewProvider {
    constructor() {
        this.imageKey = 'idle';
        this.restCounter = 0;
        this._configs = vscode.workspace.getConfiguration('PareoMotivator');
        this.imageSrc = {
            idle: this._configs.get('idleImage'),
            working: this._configs.get('workingImage'),
            rest: this._configs.get('restImage'),
        };
    }
    resolveWebviewView(webviewView, context, token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
        };
        const timeout = setInterval(() => this._changeKey(), 5000);
        this._view.webview.html = this._getHtmlForWebview(this._selectImageSrc(this.imageKey));
        // when user work, reset rest counter
        vscode.workspace.onDidChangeTextDocument((e) => {
            this.restCounter = 0;
        });
        // TODO: 소멸자 추가
    }
    _getHtmlForWebview(imageSrc) {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PareoMotivator</title>
      </head>
      <body>
        <img src="${imageSrc}" />
      </body>
      </html>`;
    }
    _selectImageSrc(imageKey) {
        return this.imageSrc[imageKey];
    }
    _changeKey() {
        this.restCounter += 1;
        if (this.restCounter >= 60) {
            // when user rest more then 300 seconds, change image to idle
            this.imageKey = 'idle';
        }
        else if (this.restCounter >= 6) {
            // when user rest more then 30 seconds, change image to rest
            this.imageKey = 'rest';
        }
        else {
            this.imageKey = 'working';
        }
        this._view.webview.html = this._getHtmlForWebview(this._selectImageSrc(this.imageKey));
    }
}
PareoViewProvider.viewType = 'pareoMotivator';
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map