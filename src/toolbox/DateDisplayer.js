const listDiv = [
    {div : 1000*60*60*24*365, postfix:"년전"},
    {div : 1000*60*60*24*30.4, postfix:"달전"},
    {div : 1000*60*60*24, postfix:"일전"},
    {div : 1000*60*60, postfix:"시간전"},
    {div : 1000*60, postfix:"분전"},
    {div : 1000, postfix:"초전"},
];

export const displayDate = (regDate, upDate) => {
    const now = new Date();
    const diffMilli = now.getTime() - new Date(upDate ? upDate : regDate).getTime();
    return displayDatess(diffMilli, 0);
}

const displayDatess = (diff, idx) => {
    const howLong = Math.round(diff / listDiv[idx].div);

    if (howLong < 1 && idx < listDiv.length - 1)
        return displayDatess(diff, idx + 1);
    return howLong + listDiv[idx].postfix;
}
