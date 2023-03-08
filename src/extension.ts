import * as vscode from 'vscode';

type ImageSource = {
  [key: string]: string;
};

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
  public static readonly viewType: string = 'pareoMotivator';
  public readonly imageSrc: ImageSource;
  public imageKey:string;
  public restCounter:number;
  private _configs: vscode.WorkspaceConfiguration;
  private _view?: vscode.WebviewView;

  constructor() {
    
    this.imageKey = 'idle';
    this.restCounter = 0;
    this._configs = vscode.workspace.getConfiguration('PareoMotivator');
    this.imageSrc = {
      idle: this._configs.get('idleImage') as string,
      working: this._configs.get('workingImage') as string,
      rest: this._configs.get('restImage') as string,
    };
  }
  
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
    // TODO: 소멸자 추가
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
        <img src="${imageSrc}" />
      </body>
      </html>`;
  }

  private _selectImageSrc(imageKey: string):string {
    return this.imageSrc[imageKey];
  }

  private _changeKey() {
    this.restCounter += 1;
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
