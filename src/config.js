import vscode from 'vscode';

export function quotesOnly() {
    return getConfig().get('quotesOnly', true);
}

function getConfig() {
    return vscode.workspace.getConfiguration('win-path');
}