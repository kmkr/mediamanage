const inquirer = require('inquirer');

const config = require('./config.json');
const fileFinder = require('./files/finder');
const fileRenamer = require('./files/renamer');

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
        processOne(fileName).then(processOneByOne);
    });
}

function setPerformerNames(fileName) {
    return inquirer.prompt([
        {
            message: 'Enter performer name(s) separated by underscores',
            name: 'performerNames'
        }
    ]).then(({performerNames}) => {
        return fileRenamer.setPerformerNames(performerNames, fileName);
    });
}

function setCategories(fileName) {
    return inquirer.prompt([
        {
            message: 'Enter categories',
            type: 'checkbox',
            name: 'categories',
            choices: config.categories
        }
    ]).then(({categories}) => {
        return fileRenamer.setCategories(categories, fileName);
    });
}

function processOne(fileName) {
    inquirer.prompt([
        {
            message: `What do you want to do with ${fileName}?`,
            name: 'action',
            type: 'list',
            choices: [
                'Set performer names',
                'Set categories',
                'Extract ts',
                'Extract scenes',
                'Extract audio',
                'Delete file',
                'Go back'
            ]
        }
    ]).then(({action}) => {
        switch (action) {
        case 'Set performer names':
            return setPerformerNames(fileName);
        case 'Set categories':
            return setCategories(fileName);
        case 'Extract ts':
            //return extractTs(fileName);
            return;
        default:
            console.log(`Unhandled input ${action}`);
        }
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

