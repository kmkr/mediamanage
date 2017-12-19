function divmod (y, x) {
  const div = Math.floor(y / x)
  const rem = y % x

  return [div, rem]
}
module.exports = function ({ separator = ':', padZeros = true, trimStart = false } = {}) {
  return seconds => {
    let dd, hh, mm, ms, ss; // eslint-disable-line no-unused-vars
    [ss, ms] = divmod(1000 * seconds, 1000);
    [mm, ss] = divmod(ss, 60);
    [hh, mm] = divmod(mm, 60);
    [dd, hh] = divmod(hh, 24) // eslint-disable-line prefer-const
    ms = Math.floor(ms)

    if (!padZeros) {
      let foundData = false
      return [hh, mm, ss]
                .filter(entry => {
                  if (trimStart && !foundData) {
                    if (entry) {
                      foundData = true
                    }
                    return entry
                  }

                  return true
                })
                .join(separator)
    }

    if (trimStart) {
      throw new Error('nyi: Trim start requires padZeros')
    }

    hh = hh >= 10 ? hh : `0${hh}`
    mm = mm >= 10 ? mm : `0${mm}`
    ss = ss >= 10 ? ss : `0${ss}`
    ms = ms >= 100 ? ms : (ms >= 10 ? `0${ms}` : `00${ms}`)

    return [hh, mm, ss].join(separator)
  }
}
