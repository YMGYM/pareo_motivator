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
        this.imageSrc = {
            normal: 'https://media.tenor.com/nrLeNeQqSacAAAAC/bandori-pareo.gif',
            working: 'https://i.bandori.party/u/activities/wMlPo9iAewyLQrBPZFVdnWui70jf74.gif',
            rest: 'https://media.tenor.com/Ea1tc2l5DcYAAAAC/bang-dream-bandori.gif'
        };
        this.imageKey = 'idle';
        this.restCounter = 0;
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
        console.log(this.restCounter);
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