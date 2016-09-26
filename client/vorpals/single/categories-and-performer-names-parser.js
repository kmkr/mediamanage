const config = require('../../config.json');

module.exports = performerNamesAndCategories => {
    const categories = performerNamesAndCategories.filter(entry => config.categories.includes(entry));
    const performerNames = performerNamesAndCategories.filter(entry => !categories.includes(entry));

    return {categories, performerNames};
};
