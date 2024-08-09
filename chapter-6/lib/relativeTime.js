function getTimeAgo(date) {
    let formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

    let duration = (date - new Date()) / 1000
    const DIVISION = [
        { amount: 60, name: 'seconds' },
        { amount: 60, name: 'minutes' },
        { amount: 24, name: 'hours' },
        { amount: 7, name: 'days' },
        { amount: 4.34524, name: 'weeks' },
        { amount: 12, name: 'months' },
        { amount: Number.POSITIVE_INFINITY, name: 'years' }
    ]

    for (let i = 0; i < DIVISION.length; i++) {
        let division = DIVISION[i]

        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name)
        }
        duration /= division.amount
    }
}

module.exports = { timePassed: getTimeAgo }