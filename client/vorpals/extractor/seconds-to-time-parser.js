function divmod(y, x) {
    const div = Math.floor(y / x);
    const rem = y % x;

    return [div, rem];
}
module.exports = function (includeMs = false) {
    return seconds => {
        let dd, hh, mm, ms, ss;
        [ss, ms] = divmod(1000 * seconds, 1000);
        [mm, ss] = divmod(ss, 60);
        [hh, mm] = divmod(mm, 60);
        [dd, hh] = divmod(hh, 24);
        ms = Math.floor(ms);

        hh = hh >= 10 ? hh : `0${hh}`;
        mm = mm >= 10 ? mm : `0${mm}`;
        ss = ss >= 10 ? ss : `0${ss}`;
        ms = ms >= 100 ? ms : (ms >= 10 ? `0${ms}` : `00${ms}`);
        let out = `${hh}:${mm}:${ss}`;
        if (includeMs) {
            out += `.${ms}`;
        }

        return out;
    };
};
