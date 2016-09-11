const inquirer = require('inquirer');

const fileFinder = require('./files/finder');
const fileRenamer = require('./files/renamer');
const processSelectionPrompt = require('./prompts/process-selection');

function processOneByOne() {
    const fileNames = fileFinder.video();
    inquirer.prompt([
        {
            message: 'Which file do you want to process?',
            name: 'fileName',
            type: 'list',
            choices: fileNames
        }
    ]).then(({fileName}) => {
        processSelectionPrompt(fileName).then(processOneByOne);
    });
}

inquirer.prompt([{
    message: `What do you want to do with ${fileFinder.video().join(', ')}?`,
    name: 'actionType',
    type: 'list',
    choices: [
        'Process one-by-one',
        'Set title'
    ]
}]).then(({actionType}) => {
    if (actionType === 'Set title') {
        inquirer.prompt([{
            message: 'Enter title',
            name: 'title'
        }]).then(({title}) => {
            fileRenamer.setTitle(title, fileFinder.video());
            processOneByOne();
        });
    } else {
        processOneByOne();
    }
});

