import { Sidebar, Scene } from './js/Sidebar.js';
import { Editor } from './js/Editor.js';

function inspector(scene) {
  Number.prototype.format = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };
  const editor = new Editor(scene);
  const sidebar = new Sidebar(editor);
  document.body.appendChild(sidebar.dom);

  const sceneSidebar = new Scene(editor);
  document.body.appendChild(sceneSidebar.dom);
}

export { inspector };
