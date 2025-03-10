import dayjs from "dayjs";

export const getFormattedDate = (date) => dayjs(date).format("DD.MM.YYYY");
