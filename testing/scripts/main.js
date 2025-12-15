import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { xml } from "@codemirror/lang-xml";
import { python } from "@codemirror/lang-python";

import { oneDark } from "@codemirror/theme-one-dark";
import { githubLight } from "@fsegurai/codemirror-theme-github-light";
import { indentUnit } from "@codemirror/language";
import { foldGutter } from "@codemirror/language";
import { bracketMatching } from "@codemirror/autocomplete";
import { closeBrackets } from "@codemirror/autocomplete";
import { lineNumbers } from "@codemirror/view";
const startDoc = ``;

import * as fx from "./functions.js";

const editorArea = document.getElementById("editorArea");
function getSurroundingTag(code) {
  const openTags = [...code.matchAll(/<([a-zA-Z0-9]+)(\s[^>]*)?>/g)];
  const closeTags = [...code.matchAll(/<\/([a-zA-Z0-9]+)>/g)];

  if (openTags.length === 0) return null;

  // Find the deepest open tag that isn't yet closed
  for (let i = openTags.length - 1; i >= 0; i--) {
    const tagName = openTags[i][1];
    const stillOpen = closeTags.filter(t => t[1] === tagName).length < openTags.filter(t => t[1] === tagName).length;
    if (stillOpen) return tagName;
  }

  // Fallback: return last open tag
  return openTags[openTags.length - 1][1];
}
function conditionalPython() {
    return EditorState.transactionFilter.of(tr => {
        const code = tr.newDoc.sliceString(tr.newSelection.main.from, tr.newSelection.main.to);
        const parentTag = getSurroundingTag(code);
        if (["exec", "validate", "virtual"].includes(parentTag)) {
            return [tr, {
                    effects: EditorView.updateListener.of(() => editorView.dispatch({
                            effects: python()
                        }))
                }
            ];
        }
        return [tr];
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const defaultEditor = new EditorView({
        doc: startDoc,
        extensions: [
            basicSetup,
            xml(),
            oneDark,
            conditionalPython(),
            keymap.of([{
                        key: "Ctrl-q",
                        run: view => {
                            // custom fold logic or toggle visibility here
                            return true;
                        }
                    }, {
                        key: "Tab",
                        run: view => {
                            const tab = "\t";
                            view.dispatch(view.state.replaceSelection(tab));
                            return true;
                        }
                    }, {
                        key: "Enter",
                        run: view => {
                            const { state } = view;
                            const { from } = state.selection.main;
                            const line = state.doc.lineAt(from);
                            const match = line.text.match(/^([ \t]+)/);
                            const indent = match ? match[1] : "";
                            view.dispatch(state.replaceSelection("\n" + indent));
                            return true;
                        }
                    }, {
                        key: "Ctrl-B",
                        run: view => {
                            fx.wrapSelection(view, "b");
                            return true;
                        }
                    }, {
                        key: "Ctrl-I",
                        run: view => {
                            fx.wrapSelection(view, "i");
                            return true;
                        }
                    }, {
                        key: "Ctrl-U",
                        run: view => {
                            fx.wrapSelection(view, "u");
                            return true;
                        }
                    }, {
                        key: "Esc",
                        run: () => {
                            const editor = getActiveEditor();
                            const isBoxVisible = commandBox.style.display !== "none";

                            if (isBoxVisible) {
                                commandBox.style.display = "none";
                                commandInput.value = "";
                                selectedIndex = -1;
                                editor.focus();
                            } else {
                                positionCommandBox();
                                commandBox.style.display = "block";
                                commandInput.value = lastCommand || "";
                                updateSuggestions(commandInput.value);
                                commandInput.focus();
                                commandInput.select();
                                updateSuggestions(commandInput.value);
                            }
                        },
                    }

                    // ... other shortcuts like Ctrl-B, Ctrl-I, etc.
                ])
        ],
        parent: editorArea
    });

    // Assuming you have access to the EditorView instance as `editorView`
    document.getElementById("boldBtn").addEventListener("click", () => fx.wrapSelection(defaultEditor, "b"));
    document.getElementById("italicBtn").addEventListener("click", () => fx.wrapSelection(defaultEditor, "i"));
    document.getElementById("underlineBtn").addEventListener("click", () => fx.wrapSelection(defaultEditor, "u"));
    document.getElementById("superscriptBtn").addEventListener("click", () => fx.wrapSelection(defaultEditor, "sup"));
    document.getElementById("subscriptBtn").addEventListener("click", () => fx.wrapSelection(defaultEditor, "sub"));

    document.getElementById("toggleFoldBtn").addEventListener("click", () => {
        // You can define toggleFold logic or collapse all folded ranges here
    });

});
