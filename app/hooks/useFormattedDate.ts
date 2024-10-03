import dayjs from 'dayjs';
import "dayjs/locale/es";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.locale("es");
dayjs.extend(advancedFormat);

export const useFormattedDate = () => {

  const formatShortDate = (dateString: string) => {
    return dayjs(dateString).format('DD MMM.');
  };

  const formatLongDate = (dateString: string) => {
    return dayjs(dateString).format('dddd, D [de] MMMM [de] YYYY');
  };

  return {
    formatShortDate,
    formatLongDate,
  };
};