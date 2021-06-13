# boxed-components README

Boxed Components lets you create component templates called 'boxes'. These are full folder snippets that you can spawn instances of, set a replacement string in file names and file content to swap out when it's spawned, making scaffolding a new named component a breeze. You can have as many templates as you want. Stylish.

## Instructions

1. Create a standard component somewhere you'd like to keep the template, for instance 'templates/component' or 'src/components/template', and inside this folder author a new component, including everything your component file structure usually needs. A Styles folder, an index.tsx, a ComponentName.tsx, a \_\_tests\_\_ folder with a ComponentName.test.tsx file, etc.

2. This component should be in essence a \_\_box\_\_.tsx component. Everywhere inside the file, replace where the component name should go with the string '\_\_box\_\_'.

Example: `__box__.tsx` looks like this.

    import React from 'react';
    import { __box__Props } from './types';
    import '../styles';
    
    const __box__:React.FC<__box__Props> = () => {
    	return <div>This is the __box__ component.</div>
    }
    
    export default __box__;

and the `./types` folder that is being imported looks like this

    export interface __box__Props {
    
    }

The \_\_box\_\_ string will work everywhere, for instance `__box__.scss`.

If you need to convert the name to UPPERCASE, use `_u_box_u_` which can be helpful in constants, for intance CARD_ADD_ACTION.

The same can be done to lowercase with `_l_box_l_` to generate things like cardIsActive.

Finally, you can also convert it to title case with `_u_box__`, handy for situations like `export type Card`.

3. In order to spawn a new component, you will need some .vscode settings. Inside `.vscode/settings.json`, you'd create your setting like so

:


    {
        "boxed-components.useTemplates": {
            "component" : {
                "src" : "templates/component",
                "dest" : "src/components"
            },
            "feature" : {
                "src" : "templates/feature",
                "dest" : "src/store/features"
            },
            "page" : {
                "src": "templates/html",
                "dest" : "src/pages"
            },
            "justAFile" : {
                "src": "templates/__box__.html",
                "dest" : "src/pages"
            }
        }
    }


4. Finally, use this extension whenever you need to spawn a new boxed component by `CMD+Shift+P` and searching for __Boxed Components__.

## Release Notes

### 1.0.0

- All initial features complete and working okay

### 0.0.3

- Add case support

### 0.0.2

- Fix race conditions 
- Experimental multiroot support

### 0.0.1

- Initial release
