import moment from "moment";

export function beautifyDateTime(rawDateTime: Date) {
    return moment(rawDateTime).format('DD-MM-YYYY');
}