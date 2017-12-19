exports.unique = (el, i, a) => (
    i === a.indexOf(el)
)

exports.flatten = (flat, toFlatten) => (
    flat.concat(toFlatten)
)
