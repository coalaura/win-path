import vscode from "vscode";
import { quotesOnly } from "./config";

let activated = false;

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context) {
	if (activated) {
		return;
	}

	activated = true;

	vscode.workspace.onDidChangeTextDocument(
		event => {
			const edit = event.contentChanges[0],
				text = edit?.text;

			if (!text || text.length <= 2) {
				return;
			}

			if (!text.match(/^([A-Z]:|\.{1,2})[\w .\\/-]+$/im)) {
				return;
			}

			const start = edit.range.start,
				end = start.translate(0, text.length),
				range = new vscode.Range(start, end);

			if (quotesOnly()) {
				const document = event.document,
					line = document.lineAt(start.line).text;

				let insideQuote,
					isEscaped = false;

				for (let i = 0; i < start.character; i++) {
					const char = line[i];

					if (isEscaped) {
						isEscaped = false;
					} else if (char === "\\") {
						isEscaped = true;
					} else if (char === insideQuote) {
						insideQuote = null;
					} else if (!insideQuote && (char === '"' || char === "'" || char === "`")) {
						insideQuote = char;
					}
				}

				if (!insideQuote) {
					return;
				}
			}

			const workspaceEdit = new vscode.WorkspaceEdit();

			workspaceEdit.replace(event.document.uri, range, text.replace(/\\/g, "\\\\"));

			vscode.workspace.applyEdit(workspaceEdit);
		},
		null,
		context.subscriptions
	);
}

export function deactivate() {}
