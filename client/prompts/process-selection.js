const inquirer = require('inquirer');
const setPerformerNamePrompt = require('./set-performer-names');
const setCategoriesPrompt = require('./set-categories');
const tsExtractor = require('./extractor')('video', 'ts');
const sceneExtractor = require('./extractor')('video', 'scene');
const audioExtractor = require('./extractor')('audio', 'audio');

const noop = () => {
    console.log('NYI');
};

const PROCESSORS = [
    {name: 'Set performer names', prompt: setPerformerNamePrompt},
    {name: 'Set categories', prompt: setCategoriesPrompt},
    {name: 'Extract ts', prompt: tsExtractor},
    {name: 'Extract scenes', prompt: sceneExtractor},
    {name: 'Extract audio', prompt: audioExtractor},
    {name: 'Delete file', prompt: noop},
    {name: 'Go back', prompt: noop}
];

module.exports = fileName => {
    return inquirer.prompt([{
        message: `What do you want to do with ${fileName}?`,
        name: 'action',
        type: 'list',
        choices: PROCESSORS.map(p => p.name)
    }]).then(({action}) => {
        const processor = PROCESSORS.find(p => p.name === action);
        if (!processor) {
            console.log(`Unhandled input ${action}`);
        }

        return processor.prompt(fileName);
    });
};
