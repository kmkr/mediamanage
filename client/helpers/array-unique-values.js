module.exports = array => (
    array.sort().filter((el, i, a) => (
        i === a.indexOf(el)
    ))
);
