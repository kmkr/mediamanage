const inquirer = require('inquirer');

module.exports = (fileName, destDirectory) => {
    return inquirer.prompt([
        {
            message: 'Start at and ends at in format <performer1<_performer2>><_[category]>@>hh:mm:ss hh:mm:ss (blank to finish)',
            name: 'extractPoint'
        }
    ]).then(({extractPoint}) => {
        console.log(`todo: handle extract point ${extractPoint}`);
    });
};
