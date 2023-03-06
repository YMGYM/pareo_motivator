import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const pareoViewProvider = new PareoViewProvider();
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      PareoViewProvider.viewType,
      pareoViewProvider
    )
  );
}

class PareoViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'pareoMotivator';
  public readonly imageSrc:Object = {
    'idle': '<div class="tenor-gif-embed" data-postid="25561754" data-share-method="host" data-aspect-ratio="1.29555" data-width="100%"><a href="https://tenor.com/view/pareo-bandor%C4%B1-bang-dream-gif-25561754">Pareo Bandorı GIF</a>from <a href="https://tenor.com/search/pareo-gifs">Pareo GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>',
    'working': '<div class="tenor-gif-embed" data-postid="18252669" data-share-method="host" data-aspect-ratio="1.77778" data-width="100%"><a href="https://tenor.com/view/bangdream-bandori-garupapico-anime-pareo-gif-18252669">Bangdream Bandori GIF</a>from <a href="https://tenor.com/search/bangdream-gifs">Bangdream GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>',
    'rest': '<div class="tenor-gif-embed" data-postid="23805459" data-share-method="host" data-aspect-ratio="1.79775" data-width="100%"><a href="https://tenor.com/view/bang-dream-bandori-garupa-pico-garupa-pico-fever-anime-gif-23805459">Bang Dream Bandori GIF</a>from <a href="https://tenor.com/search/bang+dream-gifs">Bang Dream GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>'
  };

  public imageKey = 'idle';
  public restCounter = 0;

  private _view?: vscode.WebviewView;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
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

  private _getHtmlForWebview(imageSrc: string) {
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

  private _selectImageSrc(imageKey: string):string {
    return this.imageSrc[imageKey as keyof typeof this.imageSrc];
  }

  private _changeKey() {
    this.restCounter += 1;
    console.log(this.restCounter);
    if (this.restCounter >= 60) {
      // when user rest more then 300 seconds, change image to idle
      this.imageKey = 'idle';
    }
    else if (this.restCounter >= 6){
      // when user rest more then 30 seconds, change image to rest
      this.imageKey = 'rest';
    }
    else {
      this.imageKey = 'working';
    }

    this._view!.webview.html = this._getHtmlForWebview(this._selectImageSrc(this.imageKey));
  }

  
}
export function deactivate() {}
