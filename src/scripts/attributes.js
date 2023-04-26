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