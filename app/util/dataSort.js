function getTotal(input) {
    let total = 0;
    total += parseInt(input["Reg. Hourly Pay"]);
    total += parseInt(input["Reg. Salary Pay"]);
    total += parseInt(input["Stat Holiday Pay (Hourly)"]);
    total += parseInt(input["Stat Worked @1.5 (Hourly)"]);
    total += parseInt(input["Vacation Pay Earned (Accrued)"]);
    total += parseInt(input["Vacation Pay Earned (Paid)"]);
    total += parseInt(input["Vacation Pay Taken (Salary)"]);

    return total;
}


function getDept(input) {
    if (input.localeCompare("Uncategorized") == 0) {
        return "FOH";
    } else if (input.localeCompare("Batch Brew") == 0) {
        return "FOH";
    } else if (input.localeCompare("Dope Coffee") == 0) {
        return "FOH";
    } else if (input.localeCompare("Espresso") == 0) {
        return "FOH";
    } else if (input.localeCompare("Filter") == 0) {
        return "FOH";
    } else if (input.localeCompare("Retail Merchandise") == 0) {
        return "FOH";
    } else if (input.localeCompare("Taps (non-alcoholic)") == 0) {
        return "FOH";
    } else if (input.localeCompare("Tea") == 0) {
        return "FOH";
    } else if (input.localeCompare("Beer ") == 0) {
        return "FOH";
    } else if (input.localeCompare("Cocktails") == 0) {
        return "FOH";
    } else if (input.localeCompare("Food") == 0) {
        return "BOH";
    } else if (input.localeCompare("Pastry") == 0) {
        return "BOH";
    }
    return null;
}

module.exports = {
    getTotal, getDept
}