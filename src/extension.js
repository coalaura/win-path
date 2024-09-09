import vscode from 'vscode';

let activated = false;

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	if (activated) return;

	activated = true;

	vscode.workspace.onDidChangeTextDocument(event => {
		const edit = event.contentChanges[0],
			text = edit?.text;

		if (!text || text.length <= 2) return;

		if (!text.match(/^([A-Z]:|\.{1,2})[\w .\\/-]+$/mi)) return;

		const start = edit.range.start,
			end = start.translate(0, text.length),
			range = new vscode.Range(start, end);

		const workspaceEdit = new vscode.WorkspaceEdit();
		workspaceEdit.replace(event.document.uri, range, text.replace(/\\/g, '\\\\'));

		vscode.workspace.applyEdit(workspaceEdit);
	}, null, context.subscriptions);
}

export function deactivate() { }
