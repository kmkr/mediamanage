const inquirer = require('inquirer');

const config = require('../config.json');
const fileRenamer = require('../files/renamer');

module.exports = fileName => {
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
};
