const inquirer = require('inquirer');

const fileRenamer = require('../files/renamer');

module.exports = fileName => {
    return inquirer.prompt([
        {
            message: 'Enter performer name(s) separated by underscores',
            name: 'performerNames'
        }
    ]).then(({performerNames}) => {
        return fileRenamer.setPerformerNames(performerNames, fileName);
    });
};
