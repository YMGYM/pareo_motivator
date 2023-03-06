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
            'idle': '<div class="tenor-gif-embed" data-postid="25561754" data-share-method="host" data-aspect-ratio="1.29555" data-width="100%"><a href="https://tenor.com/view/pareo-bandor%C4%B1-bang-dream-gif-25561754">Pareo Bandorı GIF</a>from <a href="https://tenor.com/search/pareo-gifs">Pareo GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>',
            'working': '<div class="tenor-gif-embed" data-postid="18252669" data-share-method="host" data-aspect-ratio="1.77778" data-width="100%"><a href="https://tenor.com/view/bangdream-bandori-garupapico-anime-pareo-gif-18252669">Bangdream Bandori GIF</a>from <a href="https://tenor.com/search/bangdream-gifs">Bangdream GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>',
            'rest': '<div class="tenor-gif-embed" data-postid="23805459" data-share-method="host" data-aspect-ratio="1.79775" data-width="100%"><a href="https://tenor.com/view/bang-dream-bandori-garupa-pico-garupa-pico-fever-anime-gif-23805459">Bang Dream Bandori GIF</a>from <a href="https://tenor.com/search/bang+dream-gifs">Bang Dream GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
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
        ${imageSrc}
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