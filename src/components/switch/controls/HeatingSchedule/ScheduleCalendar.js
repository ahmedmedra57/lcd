import { useEffect, useMemo, useRef, useState } from 'react';
import { useDatepicker, START_DATE, useMonth } from '@datepicker-react/hooks';

import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
} from '../../../../styles/commonStyles';

import Month from './Month';
import DatepickerContext from './datepickerContext';
import SchedulerButton from './SchedulerButton';
import TimePicker from './TimePicker';

import TempInputAndSelectBox from '../TempInputAndSelectBox';
import InputTempMessage from '../../../userMessages/InputTempMessage';
import {
  convertFahrenheitToCelsius,
  isAnotherSystemRunning,
  tgsUpdateSchedule,
  unixTime,
  updateSchedule,
} from '../../../../helpers/helpers';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {
  useUserStore,
  useTgsSwitchStore,
  useEssSwitchStore
} from '../../../../store/zustand';
import { useNavigate } from 'react-router-dom';

const ScheduleCalendar = ({
  handleScheduler,
  handleClose,
  handleClear,
  scheduleList,
  // unit is about °F or °C
  unit,
  tempInput,
  setTempInput,
}) => {
  const [isFirstSchedule, setIsFirstSchedule] = useState(
    scheduleList[0].start.date ? true : false
  );
  // const [start, setStart] = useState(scheduleList[0].start);
  // const [end, setEnd] = useState(scheduleList[0].end);
  const [currSchedule, setCurrSchedule] = useState(0);
  const [scheduleNumber, setScheduleNumber] = useState(scheduleList.length);
  const [message, setMessage] = useState([
    'in order to finalize  your heating schedule, ',
    'please input your temperature',
    '(the minimum temperature is 121°C - 250°F)',
    '( the maximum temperature is 999°C - 1830°F )',
  ]);
  const [displayMessageBox, setDisplayMessageBox] = useState(false);
  const [displayMessageBoxConfirm, setDisplayMessageBoxConfirm] =
    useState(false);
  const navigate = useNavigate();

  const [editable, setEditable] = useState(true);
  const { isEssSwitch, isGas } = useUserStore();
  const {
    settings,
    EBP,
    electricalInfo,
    gasInfo,
    currentRunSystem,
    heatingScheduleList: gasHeatingScheduleList,
    activateTgsConflictMessage,
    setDevicesConflicts,
  } = useTgsSwitchStore();
  const { heatingScheduleList: electricalHeatingScheduleList } = useEssSwitchStore();
  const mode = JSON.parse(localStorage.getItem("themeMode"));
  const currHour = moment().format('hh');
  const currMinutes = moment().format('mm');
  const currDivision = moment().format('a') > 12 ? 'pm' : 'am';

  // Time Picker states
  // const initialStartTimeState = isFirstSchedule
  //   ? {
  //       hour: scheduleList[0].start.time
  //         ? scheduleList[0].start.time.hour
  //         : '00',
  //       minute: scheduleList[0].start.time
  //         ? scheduleList[0].start.time.minute
  //         : '00',
  //       division: scheduleList[0].start.time
  //         ? scheduleList[0].start.time.division
  //         : 'am',
  //     }
  //   : { hour: '00', minute: '00', division: 'am' };

  // const initialEndTimeState = isFirstSchedule
  //   ? {
  //       hour: end.time ? end.time.hour : '00',
  //       minute: end.time ? end.time.minute : '00',
  //       division: end.time ? end.time.division : 'am',
  //     }
  //   : { hour: '00', minute: '00', division: 'am' };

  // const initialDateState = isFirstSchedule
  //   ? {
  //       startDate: start.date ? start.date : null,
  //       endDate: end.date ? end.date : null,
  //       focusedInput: START_DATE,
  //     }
  //   : { startDate: null, endDate: null, focusedInput: START_DATE };

  // const initialEditableState = isFirstSchedule ? false : true;

  const [startTime, setStartTime] = useState({
    hour: scheduleList[0].start.time
      ? scheduleList[0].start.time.hour
      : currHour,
    minute: scheduleList[0].start.time
      ? scheduleList[0].start.time.minute.toString().padStart(2, '0')
      : currMinutes.toString().padStart(2, '0'),
    division: scheduleList[0].start.time
      ? scheduleList[0].start.time.division
      : currDivision,
  });

  const [endTime, setEndTime] = useState({
    hour: scheduleList[0].end.time ? scheduleList[0].end.time.hour : '00',
    minute: scheduleList[0].end.time 
      ? scheduleList[0].end.time.minute.toString().padStart(2, '0')
      : '00',
    division: scheduleList[0].end.time
      ? scheduleList[0].end.time.division
      : 'am',
  });

  const [dateState, setDateState] = useState({});

  useEffect(() => {
    if (scheduleList[currSchedule].start.date) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  }, [scheduleList[currSchedule], currSchedule]);

  useEffect(() => {
    if (!scheduleList[0].start.date) {
      setIsFirstSchedule(false);
    } else {
      setIsFirstSchedule(true);
      setScheduleNumber(scheduleList.length);
    }
  }, [scheduleList]);

  useEffect(() => {
    // setStart(scheduleList[currSchedule].start);
    // setEnd(scheduleList[currSchedule].end);

    // set time and date states to display
    setStartTime({
      hour: scheduleList[currSchedule].start.time
        ? scheduleList[currSchedule].start.time.hour
        : currHour,
      minute: scheduleList[currSchedule].start.time
        ? scheduleList[currSchedule].start.time.minute.toString().padStart(2, '0')
        : currMinutes.toString().padStart(2, '0'),
      division: scheduleList[currSchedule].start.time
        ? scheduleList[currSchedule].start.time.division
        : currDivision,
    });
    setEndTime({
      hour: scheduleList[currSchedule].end.time
        ? scheduleList[currSchedule].end.time.hour
        : '00',
      minute: scheduleList[currSchedule].end.time
        ? scheduleList[currSchedule].end.time.minute.toString().padStart(2, '0')
        : '00',
      division: scheduleList[currSchedule].end.time
        ? scheduleList[currSchedule].end.time.division
        : 'am',
    });
    setDateState({
      startDate: scheduleList[currSchedule].start.date,
      endDate: scheduleList[currSchedule].end.date,
      focusedInput: START_DATE,
    });
  }, [currSchedule, scheduleList[currSchedule]]);

  //***** */ set live time AM/PM, Hour and Minute
  const hourLiveRef = useRef();
  const minuteLiveRef = useRef();
  const am_pmRef = useRef();

  useEffect(() => {
    hourLiveRef.current = moment().format('h');
    minuteLiveRef.current = moment().format('mm');
    am_pmRef.current = moment().format('a');
  }, [moment().format('mm')]);

  //****** Date format logic ******
  const startArray =
    dateState.startDate &&
    moment.unix(dateState.startDate).format('DD MMM YYYY ddd').split(' ');
  const endArray =
    dateState.endDate &&
    moment.unix(dateState.endDate).format('DD MMM YYYY ddd').split(' ');

  const startDate =
    dateState.startDate &&
    `${startArray[0]} / ${startArray[1]} / ${startArray[2]} ${startArray[3]}`;

  const endDate =
    dateState.endDate &&
    `${endArray[0]} / ${endArray[1]} / ${endArray[2]} ${endArray[3]}`;

  const handleDateChange = (data) => {
    if (!data.focusedInput) {
      setDateState({
        ...data,
        focusedInput: START_DATE,
        startDate: moment(data.startDate).utc().unix(),
        endDate: moment(data.endDate).utc().unix(),
      });
    } else {
      setDateState({
        ...data,
        startDate: moment(data.startDate).utc().unix(),
        endDate: moment(data.endDate).utc().unix(),
      });
    }
  };
  //****** Date format logic ******

  // ***** Time picker *****
  const handleSetTime = (time, id) => {
    const paddedTime = {
      ...time,
      minute: time.minute.toString().padStart(2, '0')
    };
    
    if (id === 'start') {
      setStartTime(paddedTime);
    } else {
      setEndTime(paddedTime);
    }
  };

  const startTimeSet = `${startTime.hour}:${startTime.minute} ${startTime.division}`;
  const endTimeSet = `${endTime.hour}:${endTime.minute} ${endTime.division}`;

  // ***** Time picker *****
  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths,
    goToPreviousYear,
    goToNextMonthsByOneMonth,
    goToNextYear,
    onResetDates,
    isStartDate,
    goToDate,
  } = useDatepicker({
    startDate: dateState.startDate * 1000,
    endDate: dateState.endDate * 1000,
    focusedInput: dateState.focusedInput,
    onDatesChange: handleDateChange,
    minBookingDate: moment()._d,
  });

  const months = [
    'January',
    'February',
    'March',
    'April',
    'may',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currMonth = months[activeMonths[0].month];
  const nextMonth = months[activeMonths[1].month];

  // Pass them as props to Day component For styling(border-radious)
  const startDay =
    dateState.startDate &&
    `${moment(dateState.startDate * 1000).month()}${moment(
      dateState.startDate * 1000
    ).date()}`;
  const endDay =
    dateState.endDate &&
    `${moment(dateState.endDate * 1000).month()}${moment(
      dateState.endDate * 1000
    ).date()}`;

  const checkTemp = (temp) => {
    return unit ? temp >= 250 && temp <= 1830 : temp >= 121 && temp <= 999;
  };

  const handleOnClick = (id) => {
    // id  is the button number (1 - clear / 2 - close / 3 - add schedule and ready)
    switch (id) {
      // clear logic
      case '1': {
        // reset calender library
        onResetDates();
        setStartTime({
          hour: currHour,
          minute: currMinutes,
          division: currDivision,
        });
        setEndTime({
          hour: '00',
          minute: '00',
          division: 'am',
        });

        if (scheduleList[currSchedule].id) {
          const data = {
            ack_id: uuidv4(),
            schedule: {
              delete: {
                id: scheduleList[currSchedule].id,
              },
            },
          };
          isGas ? tgsUpdateSchedule(data) : updateSchedule(data);
        }

        // setEditable(false);
        // target index to delete
        handleClear(currSchedule);
        setTempInput('');
        return;
      }
      case '2': {
        // close logic
        handleClose();
        return;
      }
      case '3': {
        const tempValue = Number(tempInput.split(' ')[0]);
        const idSchedule = uuidv4();
        const data = {
          ack_id: uuidv4(),
          schedule: {
            add: {
              id: idSchedule,
              threshold: unit
                ? convertFahrenheitToCelsius(tempValue, settings?.unit)
                : tempValue,
              start: unixTime(dateState.startDate, startTime),
              end: unixTime(dateState.endDate, endTime),
            },
          },
        };
        const startDate = new Date(moment.unix(unixTime(dateState.startDate, startTime)).format('YYYY-MM-DD HH:mm:ss'));
        const endDate = new Date(moment.unix(unixTime(dateState.endDate, endTime)).format('YYYY-MM-DD HH:mm:ss'));
        // newStartDate has start date and add to it 3 minutes
        const newStartDate = new Date(moment.unix(unixTime(dateState.startDate, startTime)).add(180000, 'millisecond'));
        
        //  verify if the set start time is valid or not.
        if (startDate > endDate) {
          setDisplayMessageBox(true);
          setMessage(['selected start time is not valid']);
          return;
        }
        if (newStartDate < new Date()) {
          setDisplayMessageBox(true);
          setMessage(['selected start time is not valid']);
          return;
        }
        //  verify if the set end time is valid or not.
        if (endDate <= startDate) {
          setDisplayMessageBox(true);
          setMessage(['selected end time is not valid']);
          return;
        }
        
        if (
          EBP &&
          ((isGas && (gasInfo?.EBP === 0 || gasInfo?.EBP === null)) ||
            (!isGas &&
              (electricalInfo?.EBP === 0 || electricalInfo?.EBP === null)))
        ) {
          setDisplayMessageBox(true);
          setMessage([
            `ATS SIGNAL IS TRIGGERED ON ${
              isEssSwitch ? 'ESS' : isGas ? 'TGS' : 'TES'
            }, `,
            'SYSTEM IS NOW ON GENERATOR BACKUP POWER, ',
            `${
              isEssSwitch
                ? 'ESS ELECTRIC HEATING ELEMENTS'
                : isGas
                ? 'TGS GAZ HEATING'
                : 'TES ELECTRIC HEATING ELEMENTS'
            } WILL NOT START UNTIL GRID POWER IS REESTABLISHED`,
          ]);
          return;
        }
        if (EBP && !isGas && electricalInfo?.EBP === 2) {
          if (gasInfo?.EBP === 0 || gasInfo?.EBP === null) {
            setDisplayMessageBox(true);
            setMessage([
              'ATS SIGNAL IS TRIGGERED ON TES, ',
              'SYSTEM IS NOW ON GENERATOR BACKUP POWER, ',
              'TES ELECTRIC HEATING ELEMENTS WILL NOT START UNTIL GRID POWER IS REESTABLISHED',
            ]);
          } else {
            setDisplayMessageBoxConfirm(true);
            setMessage([
              'ATS SIGNAL IS TRIGGERED ON TES, ',
              'SYSTEM IS NOW ON GENERATOR BACKUP POWER, ',
              'TES ELECTRIC HEATING ELEMENTS WILL NOT START UNTIL GRID POWER IS REESTABLISHED',
              'switch to typhoon gas system',
            ]);
          }
          return;
        }

        if (!checkTemp(tempValue)) {
          setDisplayMessageBox(true);
          setMessage([
            'in order to finalize  your heating schedule, ',
            'please input your temperature',
            '(the minimum temperature is 121°C - 250°F)',
            '( the maximum temperature is 999°C - 1830°F )',
          ]);
          return;
        }

        if (!isEssSwitch && (isAnotherSystemRunning(isGas ? 'electrical' : 'gas', currentRunSystem)
          || (isGas && electricalHeatingScheduleList[0].start?.date)
          || (!isGas && gasHeatingScheduleList[0].start?.date))) {
          activateTgsConflictMessage();
          setDevicesConflicts({
            currentSwitch: isGas
              ? 'tes-typhoon electric system'
              : 'tgs-typhoon gas system',
            DesiredSwitch: isGas
              ? 'tgs-typhoon gas system'
              : 'tes-typhoon electrical system',
            systemTarget: isGas ? 'gas' : 'electrical',
            commandTarget: 'schedule',
            extraData: data,
          });
          return;
        }
        if (scheduleList[0].inputTemp) {
          handleClose();
          return;
        }
        // add a schedule and be ready
        // 1. check schedule (dateState)
        // 1. check unit
        // 2. check temperature range
        if (dateState.startDate && dateState.endDate) {
          if (checkTemp(tempValue)) {
            handleScheduler(
              {
                start: { date: dateState.startDate, time: startTime },
                end: { date: dateState.endDate, time: endTime },
                id: idSchedule,
              },
              currSchedule
            );
            isGas ? tgsUpdateSchedule(data) : updateSchedule(data);
            handleClose();
          } else {
            // message
            setDisplayMessageBox(true);
            setMessage([
              'in order to finalize  your heating schedule, ',
              'please input your temperature',
              '(the minimum temperature is 121°C - 250°F)',
              '( the maximum temperature is 999°C - 1830°F )',
            ]);
          }
        } else {
          //
          setDisplayMessageBox(true);
          setMessage([
            'in order to finalize your heating schedule, ',
            'please choose schedule first',
          ]);
        }

        return;
      }
      default:
        return;
    }
  };

  useEffect(() => {
    goToDate(dateState.startDate * 1000);
  }, [currSchedule, dateState.startDate]);

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
        goToDate,
      }}
    >
      <Wrapper>
        <HatWrapper imgSrc={mode?'/static/images/scheduler-hat_light.svg': '/static/images/scheduler-hat.svg'}>
          <TitleIcon src={'/static/images/scheduler-icon.svg'} />
          <Title>start date - end date</Title>
        </HatWrapper>

        <SectionMain>
          <CalendarWrapper>
            <Calendar>
              <YearAndMonthWrapper>
                <YearOuter>
                  <YearInner>
                    <YearTop>
                      <GoButton onClick={() => goToPreviousYear(`1`)}>
                        <GoLogo src='/static/images/go-previous.svg' />
                      </GoButton>
                      <YearTitle>{activeMonths[0].year}</YearTitle>
                      <GoButton onClick={() => goToNextYear('1')}>
                        <GoLogo src='/static/images/go-next.svg' />
                      </GoButton>
                    </YearTop>
                  </YearInner>
                </YearOuter>

                <MonthOuter>
                  <MonthInner>
                    <MonthTop>
                      <GoButton onClick={goToPreviousMonths}>
                        <GoLogo src='/static/images/go-previous.svg' />
                      </GoButton>
                      <MonthTitle>{currMonth}</MonthTitle>

                      <GoButton onClick={goToNextMonthsByOneMonth}>
                        <GoLogo src='/static/images/go-next.svg' />
                      </GoButton>
                    </MonthTop>
                  </MonthInner>
                </MonthOuter>
              </YearAndMonthWrapper>
              <Month
                key={`${activeMonths[0].year}-${activeMonths[0].month}`}
                year={activeMonths[0].year}
                month={activeMonths[0].month}
                firstDayOfWeek={firstDayOfWeek}
                startDay={dateState.startDate && startDay}
                endDay={dateState.endDate && endDay}
                isDisabled={!editable}
                isDateBlocked={isDateBlocked}
              />
            </Calendar>

            <WatchWrapper>
              <TimePicker id='start' time={startTime} setTime={handleSetTime} />
            </WatchWrapper>

            <Calendar>
              <YearAndMonthWrapper>
                <YearOuter>
                  <YearInner>
                    <YearTop>
                      <GoButton onClick={() => goToPreviousYear(`1`)}>
                        <GoLogo src='/static/images/go-previous.svg' />{' '}
                      </GoButton>
                      <YearTitle>{activeMonths[1].year}</YearTitle>
                      <GoButton onClick={() => goToNextYear('1')}>
                        <GoLogo src='/static/images/go-next.svg' />
                      </GoButton>
                    </YearTop>
                  </YearInner>
                </YearOuter>

                <MonthOuter>
                  <MonthInner>
                    <MonthTop>
                      <GoButton onClick={goToPreviousMonths}>
                        <GoLogo src='/static/images/go-previous.svg' />
                      </GoButton>
                      <MonthTitle>{nextMonth}</MonthTitle>
                      <GoButton onClick={goToNextMonthsByOneMonth}>
                        <GoLogo src='/static/images/go-next.svg' />
                      </GoButton>
                    </MonthTop>
                  </MonthInner>
                </MonthOuter>
              </YearAndMonthWrapper>

              <Month
                key={`${activeMonths[1].year}-${activeMonths[1].month}`}
                year={activeMonths[1].year}
                month={activeMonths[1].month}
                firstDayOfWeek={firstDayOfWeek}
                startDay={dateState.startDate && startDay}
                endDay={dateState.endDate && endDay}
                isDisabled={!editable}
              />
            </Calendar>

            <WatchWrapper>
              <TimePicker id='end' time={endTime} setTime={handleSetTime} />
            </WatchWrapper>
          </CalendarWrapper>

          <DisplayAndButtonWrapper>
            <DisplayDateWrapper>
              <DisplayDateOuter>
                <DisplayDateInner>
                  <DateTitleWrapper>
                    <DateTitle>start date</DateTitle>
                  </DateTitleWrapper>

                  <DisplayTop>
                    <DateC>
                      {dateState.startDate
                        ? startDate + ` - ${startTimeSet}`
                        : 'Choose the start date'}
                    </DateC>
                  </DisplayTop>
                </DisplayDateInner>
              </DisplayDateOuter>

              <DisplayDateOuter>
                <DisplayDateInner>
                  <DateTitleWrapper>
                    <DateTitle>end date</DateTitle>
                  </DateTitleWrapper>

                  <DisplayTop>
                    <DateC>
                      {dateState.endDate
                        ? endDate + ` -  ${endTimeSet}`
                        : 'Choose the end date'}
                    </DateC>
                  </DisplayTop>
                </DisplayDateInner>
              </DisplayDateOuter>
            </DisplayDateWrapper>

            <ButtonWrapper>
              <ButtonGroupWrapper option={true}>
                <TempInputAndSelectBox
                  tempInput={tempInput}
                  setTempInput={setTempInput}
                  unit={unit}
                  currSchedule={currSchedule}
                  setCurrSchedule={setCurrSchedule}
                  isFirstSchedule={isFirstSchedule}
                  scheduleNumber={scheduleNumber}
                  scheduleList={scheduleList}
                  editable={editable}
                />
              </ButtonGroupWrapper>
              <ButtonGroupWrapper>
                <SchedulerButton
                  name='clear'
                  id='1'
                  onClickHandler={handleOnClick}
                />
                <SchedulerButton
                  name='close'
                  id='2'
                  onClickHandler={handleOnClick}
                />
                <SchedulerButton
                  name={'apply'}
                  id='3'
                  onClickHandler={handleOnClick}
                />
              </ButtonGroupWrapper>
            </ButtonWrapper>
          </DisplayAndButtonWrapper>
        </SectionMain>
        {displayMessageBox && (
          <InputTempMessage
            onClose={() => setDisplayMessageBox(false)}
            messages={message}
            title='heating schedule'
          />
        )}
        {displayMessageBoxConfirm && (
          <InputTempMessage
            onClose={() => setDisplayMessageBoxConfirm(false)}
            messages={message}
            title='heating schedule'
            onConfirm={() => navigate('/')}
          />
        )}
      </Wrapper>
    </DatepickerContext.Provider>
  );
};

export default ScheduleCalendar;

const Wrapper = styled.div`
  width: 968px;
  height: 518px;
  position: relative;
`;
const HatWrapper = styled.div`
  width: 476px;
  height: 41px;
  background: url(${(p) => p.imgSrc}) no-repeat;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
`;

const SectionMain = styled.section`
  width: 968px;
  height: 478px;
  border-radius: 0px 16px 16px 16px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  border: 1px solid #000000;

  ${flexDirectionColumn};
  padding: 8px 10px;
`;

const TitleIcon = styled.img`
  height: 45%;
  margin-right: 12px;
`;
const Title = styled.span`
  font-size: 20px;
  letter-spacing: 2.6px;
`;

const CalendarWrapper = styled.div`
  height: auto;
  width: 100%;

  ${justifyContentSpaceBetween}
`;

const Calendar = styled.div`
  width: 310px;
  height: 318px;
  border-radius: 23px;

  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: inset 0px 0px 6px #000000;

  ${flexDirectionColumn};
  justify-content: flex-start;

  padding: 2px 2px;
`;

const YearAndMonthWrapper = styled.div`
  height: auto;
  width: 100%;
  ${justifyContentSpaceBetween}

  margin-bottom: 22px;
`;

const YearOuter = styled.div`
  width: 140px;
  height: 44px;
  border-radius: 26px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  ${flexboxCenter}
`;
const YearInner = styled.div`
  width: 122px;
  height: 29px;
  border-radius: 17px;
  background: ${props => props.theme.button.secondary.bg};
  box-shadow: inset 0px 0px 3px #000000;
  ${flexboxCenter}
`;
const YearTop = styled.div`
  width: 119px;
  height: 27px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.status.warning.border};
  ${justifyContentSpaceBetween}
`;

const GoButton = styled.button`
  height: 25px;
  width: 25px;
  ${flexboxCenter}
`;
const GoLogo = styled.img`
  height: 90%;
`;
const YearTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const MonthOuter = styled.div`
  width: 163px;
  height: 44px;
  border-radius: 27px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};

  ${flexboxCenter}
`;
const MonthInner = styled.div`
  width: 145px;
  height: 28px;
  border-radius: 17px;
  background: ${props => props.theme.button.secondary.bg};
  box-shadow: inset 0px 0px 3px #000000;

  ${flexboxCenter}
`;
const MonthTop = styled.div`
  width: 142px;
  height: 26px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.status.warning.border};

  ${justifyContentSpaceBetween}
`;

const MonthTitle = styled.span`
  font-size: 12px;
`;

const WatchWrapper = styled.div`
  width: 152px;
  height: 318px;
  border-radius: 13px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
`;

const DisplayAndButtonWrapper = styled.div`
  width: 100%;
  height: 133px;

  ${justifyContentSpaceBetween}
`;
const DisplayDateWrapper = styled.div`
  width: 50%;
  height: 100%

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  
  
`;

const DisplayDateOuter = styled.div`
  width: 469px;
  height: 64px;
  border-radius: 38px;

  background: ${props => props.theme.button.secondary.bg};
  box-shadow: inset 0px 0px 3px #000000;

  ${flexboxCenter}
`;

const DisplayDateInner = styled.div`
  width: 465px;
  height: 60px;
  border-radius: 35px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};

  ${justifyContentSpaceBetween}
  padding: 0 8px 0 40px;
`;

const DateTitleWrapper = styled.div`
  ${flexboxCenter}
`;
const DateTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: ${props => props.theme.label.primary};
`;

const DisplayTop = styled.div`
  width: 301px;
  height: 41px;
  border-radius: 25px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;

  ${flexboxCenter}
`;

const DateC = styled.span`
  /* text-align: left; */
  font-size: 10px;
  letter-spacing: 0.9px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;

const ButtonWrapper = styled.div`
  width: 50%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;
const ButtonGroupWrapper = styled.div`
  width: 469px;
  height: 64px;
  border-radius: 38px;

  background: ${props => props.theme.button.secondary.bg};
  box-shadow: inset 0px 0px 3px #000000;

  ${justifyContentSpaceBetween}
  padding: 0 0.15rem;

  ${(p) =>
    p.option &&
    css`
      background: transparent;
      box-shadow: none;
      padding: 0;
    `}
`;
