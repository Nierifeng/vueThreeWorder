
import { Sidebar } from './js/Sidebar.js';
import { Editor } from './js/Editor.js';

function cerate() {
  const editor = new Editor();
  const sidebar = new Sidebar(editor);
  document.body.appendChild(sidebar.dom);
}

export { cerate };
