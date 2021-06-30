Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push((new Date(currentDate)).toISOString().slice(0, 10));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
