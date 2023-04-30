export function convertPxToRem(px){
    const oneRem = parseInt(getComputedStyle(document.documentElement).fontSize);
    return px / oneRem;
}

export function convertRemToPx(rem){
    const oneRem = parseInt(getComputedStyle(document.documentElement).fontSize);
    return rem * oneRem;
}