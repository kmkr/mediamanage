module.exports = string => {
    const match = string.split(/\D/);
    if (match.length) {
        const seconds = Number(match.pop() || 0);
        const minutes = Number(match.pop() || 0);
        const hours = Number(match.pop() || 0);

        return seconds + (minutes * 60) + (hours * 3600);
    }
};
