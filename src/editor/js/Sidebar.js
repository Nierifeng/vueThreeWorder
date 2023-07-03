import { UITabbedPanel, UISpan } from './libs/ui.js';

import { SidebarScene } from './Sidebar.Scene.js';
import { SidebarProperties } from './Sidebar.Properties.js';
import { SidebarScript } from './Sidebar.Script.js';
import { SidebarAnimation } from './Sidebar.Animation.js';

function Sidebar( editor ) {

	const container = new UISpan();
	container.setId( 'sidebar' );

	container.add(
		new SidebarProperties( editor ),
		new SidebarAnimation( editor ),
		new SidebarScript( editor )
	);

	return container;

}

function Scene(editor){
  const strings = editor.strings;
  const container = new UITabbedPanel();
  container.setId( 'sceneSidebar' );
  const scene = new UISpan().add(
    new SidebarScene( editor )
  );
  container.addTab( 'scene', strings.getKey( 'sidebar/scene' ), scene );
  container.select( 'scene' );
  return container;

}

export { Sidebar, Scene };
