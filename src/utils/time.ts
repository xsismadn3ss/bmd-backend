export function parseTime(time: string) {
    const [hour, minutes] = time.split(":").map((number) => Number(number));
    return hour * 60 + minutes;
}