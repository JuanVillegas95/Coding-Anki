import * as S from "@/styles/WeeklyCalendar.styles"
import * as F from "@/utils/functions"
import { Time } from "@/utils/classes"

const HourLine: React.FC<{ currentDate: Date, calendarStartTime: Time }> = ({ currentDate, calendarStartTime }) => <S.HourLine $fromTop={F.calculateTopOffset(new Time(currentDate.getHours(),currentDate.getMinutes()),calendarStartTime)}>
    {currentDate.getHours()}:{currentDate.getMinutes()}
    <S.LineAfterHour />
  </S.HourLine>


export default HourLine;


