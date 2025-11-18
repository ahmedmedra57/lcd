import { useRef, useContext, useEffect } from 'react';
import { useDay } from '@datepicker-react/hooks';
import DatepickerContext from './datepickerContext';
import getColor from './getColor';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { flexboxCenter } from '../../../../styles/commonStyles';

const Day = ({ dayLabel, date, startDay, endDay, month, isDisabled }) => {
  const today = `${month}` + Number(dayLabel);

  const MDate = moment(date);
  const currDate = moment();
  const diffDays = MDate.diff(currDate, 'days');
  const diffHours = MDate.diff(currDate, 'hours');

  const dayRef = useRef(null);
  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover,
  } = useContext(DatepickerContext);

  const {
    isSelected,
    isSelectedStartOrEnd,
    isWithinHoverRange,
    disabledDate,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex,
  } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef,
  });

  if (!dayLabel) {
    return <div />;
  }

  const getColorFn = getColor(
    isSelected,
    isSelectedStartOrEnd,
    isWithinHoverRange,
    disabledDate
  );

  const btnStyle = {
    color: getColorFn({
      selectedFirstOrLastColor: p => p.theme.label.primary,
      normalColor: p => p.theme.label.primary,
      selectedColor: p => p.theme.label.primary,
      rangeHoverColor: p => p.theme.label.primary,
      disabledColor: p => p.theme.layout.card.border,
    }),

    background: getColorFn({
      selectedFirstOrLastColor: p => p.theme.status.warning.bg,
      normalColor: 'none',
      selectedColor: p => p.theme.status.warning.bgLight,
      rangeHoverColor: p => p.theme.status.warning.bgLight,
      disabledColor: 'transparent',
    }),
  };

  return (
    <Date
      onClick={() => {
        if (!isDisabled) {
          if (diffDays >= 0) {
            onClick();
          }
        }
      }}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      type='button'
      ref={dayRef}
      style={btnStyle}
      isStartDay={today === startDay ? true : false}
      isEndDay={today === endDay ? true : false}
      isDisabled={isDisabled || diffDays < 0}
      // isDisabled={
      //   isToSelectPastDates ? diffDays > 0 : noTimePicker ? false : diffDays < 0
      // }
      isThePast={diffDays < 0}
      isToday={diffDays === 0 && diffHours <= 0}
    >
      {dayLabel}
    </Date>
  );
};

export default Day;

const Date = styled.div`
  height: 35px;
  /* width: 35px; */
  text-align: center;

  ${flexboxCenter}
  font-size: 15px;

  ${(p) =>
    p.isDisabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
        `};

  ${(p) =>
    p.isThePast &&
    css`
      color: ${p.theme.label.disabled};
    `}

  ${(p) =>
    p.isToday &&
    css`
      border-radius: 50%;
      border: 2px solid ${p.theme.status.info.border};
    `}
  ${(p) =>
    p.isStartDay &&
    css`
      border-radius: 50% 0 0 50%;
      border: none;
    `}

    ${(p) =>
    p.isEndDay &&
    css`
      border-radius: 0 50% 50% 0;
      border: none;
    `}

    :hover {
  }
`;
