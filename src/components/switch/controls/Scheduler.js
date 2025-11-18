import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

const Scheduler = ({ handleOpenScheduler, start, end }) => {
  const displayStart =
    start.date !== null
      ? `${start.time.hour} : ${start.time.minute} ${
          start.time.division
        } - ${start.date.getDate()} / ${
          start.date.getMonth() + 1
        } / ${start.date.getFullYear()} `
      : ' -----------------';

  const displayEnd =
    end.date !== null
      ? `${end.time.hour} : ${end.time.minute} ${
          end.time.division
        } - ${end.date.getDate()} / ${
          end.date.getMonth() + 1
        } / ${end.date.getFullYear()} `
      : ' -----------------';

  return (
    <Wrapper>
      <ScheduleDisplayWrapper>
        <DateAndTimeWrapper>{displayStart} </DateAndTimeWrapper>
        <DateAndTimeWrapper>{displayEnd}</DateAndTimeWrapper>
      </ScheduleDisplayWrapper>
      <CalendarButton onClick={() => handleOpenScheduler(1)}>
        <Img src={'/static/images/calendar-button.svg'} />
      </CalendarButton>
    </Wrapper>
  );
};

export default Scheduler;

const Wrapper = styled.div`
  width: 270px;
  height: 50px;
  border-radius: 30px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};

  display: flex;
  align-items: center;
  padding-left: 10px;

  box-sizing: border-box;
`;

const ScheduleDisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  /* border: 1px solid ${props => props.theme.label.primary}; */
`;

const DateAndTimeWrapper = styled.div`
  margin-bottom: 3px;
  width: 192px;
  height: 18px;
  /* UI Properties */

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 14px;

  font-size: 8px;
  ${flexboxCenter}
`;

const CalendarButton = styled.button`
  width: 22px;
  height: 20px;
  background-color: ${props => props.theme.label.disabled};
  margin-top: 0.2rem;
  cursor: pointer;
`;

const Img = styled.img``;
