import dayjs from "dayjs";

const DATE_TYPE = {
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm:ss",
};

// 日期格式化函数
export function formatDate(date, dateType = "datetime") {
  return dayjs(date).format(DATE_TYPE[dateType]);
}

export default {};
