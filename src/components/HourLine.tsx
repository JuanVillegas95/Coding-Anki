import * as S from "@/styles/WeeklyCalendar.styles"
import * as F from "@/utils/functions"



const HourLine: React.FC<{ currentTime: Date }> = ({ currentTime }) => <S.HourLine $fromTop={F.getFromTop(currentTime.getHours(), currentTime.getMinutes())}>
    {currentTime.getHours()}:{currentTime.getMinutes()}
    <S.LineAfterHour />
  </S.HourLine>


export default HourLine;
