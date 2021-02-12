const vscode = require('vscode');
const fs = require('fs');
const config = require(`${vscode.workspace.workspaceFolders[0].uri.fsPath}/bc.json`) || null;
const extension = config.typescript ? ['tsx', 'ts'] : ['jsx', 'js'];

/**
 * MAIN
 **/ 
const createMainFiles = (folder, name) => {

	const mainData = `import React from 'react';
${config.typescript ? `import { ${name}Props } from './types';` : ''};
import { ${name}Div } from './styles/${name}Styles';

const ${name}${config.typescript ? `:React.FC<${name}Props>` : ''} = () => {
	return <${name}Div>Boxed it, boss</${name}Div>
}

export default ${name};

`

// Index file
const indexData = `export { default } from './${name}';

`
// Typescripting
const typesData = `export interface ${name}Props {

}

`
	
	fs.writeFileSync(`${folder}/${name}.${extension[0]}`, mainData);
	fs.writeFileSync(`${folder}/index.${extension[0]}`, indexData);

    if (config.typescript)
	    fs.writeFileSync(`${folder}/types.${extension[1]}`, typesData);
}


/**
 * STYLES
 **/
const createStyleSection = (folder, name) => {
    const stylesData = `import styled from 'styled-components';
    ${config.typescript ? `import { ${name}Props } from '../types';` : ''};
    
    export const ${name}Div = styled.div${config.typescript ? `<${name}Props>` : ''}${'`'}
        // Make it look good 💅
    ${'`'}
    
    `;
	fs.mkdirSync(`${folder}/styles`);
	fs.writeFileSync(`${folder}/styles/${name}Styles.${extension[0]}`, stylesData);
}


/**
 * TESTS
 */

const createTestSection = (folder, name) => {

	const testData = `import { mount, shallow } from 'enzyme';
import React from 'react';
import ${name} from '../${name}';

describe('${name}', () => {
	it('needs a test, replace this.', () => {
		const COMPONENT = shallow(<${name} />);
		expect(COMPONENT).toBeTruthy();
	});
});
`;

	fs.mkdirSync(`${folder}/__tests__`);
	fs.writeFileSync(`${folder}/__tests__/${name}.test.${extension[0]}`, testData);
}

/**
 * STORIES
 */

const createStorySection = (folder, name) => {
	
    const storyData = `import React from 'react';
    import { Story, Meta } from '@storybook/react';
    
    import ${name} from './${name}';
    ${config.typescript ? `import { ${name}Props } from './types';`: '' }
    
    export default {
        title: 'Components/${name}',
        component: ${ name },
    } as Meta;
    
    const Template${config.typescript ? `: Story<${ name }Props>` : ''} = (args) => (
        <>
            <${name} {...args} />
        </>
    )
    
    export const Primary = Template.bind({});
    Primary.args = {
        // primary: true
        };
    
    `
        fs.writeFileSync(`${folder}/${name}.stories.${extension[0]}`, storyData);
}

module.exports = {
    createMainFiles,
    createStorySection,
    createTestSection,
    createStyleSection
}