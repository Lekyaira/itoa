export function strEncumbered(str) {
    if(str === 1) return 1/5;
    else if(str === 2) return 2/5;
    else if(str >= 3) {
        return Math.floor(strMaxLoad(str)/2);
    }
    else return 0;
}

export function strMaxLoad(str) {
    if(str === 1) return 2/5;
    else if(str === 2) return 1;
    else if(str === 3) return 2;
    else if(str <= 5) return 4;
    else if(str <= 8) return 6;
    else if(str <= 12) return 10;
    else if(str <=15) return 14;
    else if(str <= 17) return 18;
    else if(str >= 18) {
        return 18+(str-17)*5;
    }
    else return 0;
}

export function witsDodgeMod(wits) {
    if(wits === 1) return -5;
    if(wits === 2) return -4;
    if(wits === 3) return -3;
    if(wits <= 5) return -2;
    if(wits <= 8) return -1;
    if(wits <= 12) return 0;
    if(wits <=15) return 1;
    if(wits <= 17) return 2;
    return wits - 15;
}

export function modText(value) {
    return value >= 0 ? `+${value}` : `${value}`;
}