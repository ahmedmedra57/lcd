import { useMonth } from '@datepicker-react/hooks';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import styled from 'styled-components';
import moment from 'moment';

import Day from './Day';

function Month({ year, month, firstDayOfWeek, startDay, endDay, isDisabled }) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek,
  });

  return (
    <Wrapper>
      {/* <MonthLabel>
        <strong>{monthLabel}</strong>
      </MonthLabel> */}

      <WeekDayWrapper>
        {weekdayLabels.map((dayLabel) => (
          <Weekday key={dayLabel}>{dayLabel}</Weekday>
        ))}
      </WeekDayWrapper>
      <WeekdayUnderline />

      <DateWrapper>
        {days.map((day, index) => {
          if (typeof day === 'object') {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
                startDay={startDay}
                endDay={endDay}
                month={month}
                isDisabled={isDisabled}
              />
            );
          }

          return <div key={index} />;
        })}
      </DateWrapper>
    </Wrapper>
  );
}

export default Month;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* grid-gap: 0 64px; */
  /* border: 1px solid ${props => props.theme.label.primary}; */
  width: 100%;
`;

const WeekDayWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 15px;
  margin-bottom: 0.1rem;
`;
const WeekdayUnderline = styled.div`
  width: 96%;
  border-bottom: 1px solid #ffff;
  margin-bottom: 0.5rem;
`;

const Weekday = styled.div`
  text-align: center;
`;

const DateWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-content: space-between;
`;
