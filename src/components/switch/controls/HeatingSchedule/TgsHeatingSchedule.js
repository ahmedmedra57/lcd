import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

import {
  activateTgsConflictMessage,
  activatedisplayTGSScheduleModal,
  deActivatedisplayTGSScheduleModal,
  selectTgsSwitch,
  tgsAddHeatingSchedule,
  tgsHeatingScheduleBeReady,
  tgsHeatingScheduleClear,
} from '../../../../store/slices/tgsSwitchSlice';
import { selectSettingsOfEss } from '../../../../store/slices/settingsOfEssSlice';
import { selectEssSwitch } from '../../../../store/slices/essSwitchSlice';

import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  activeLayer1,
  readyHole,
  readyLayer,
  activeHole,
  disableLayer,
} from '../../../../styles/commonStyles';

import ScheduleCalendar from './ScheduleCalendar';

const TgsHeatingSchedule = ({ isDisabled, setDisplayModeFaultMessageBox }) => {
  // Global states
  const state = useSelector(selectTgsSwitch);
  const { heatingScheduleList, gasInfo,displayTgsScheduleModal } = state;

  // const firstHeatingSchedule = heatingScheduleList[0];
  // const { start, end } = firstHeatingSchedule;

  const esState = useSelector(selectEssSwitch);
  const { isEsSwitchActivated } = esState;

  const unitsState = useSelector(selectSettingsOfEss);
  const { unitsMeasurement } = unitsState.buttonsOfSettings;

  // Local
  const IMG_SRC = '/static/images/heating-Schedule-Program-Logo.svg';
  const dispatch = useDispatch();
  const [displayScheduler, setDisplayScheduler] = useState(false);
  const [tempInput, setTempInput] = useState('');

  const isReady = useMemo(() => {
    return (gasInfo?.schedule_enabled === 1 && gasInfo?.mode !== 'SCHEDULE') || heatingScheduleList[0].start?.date;
  }, [heatingScheduleList, gasInfo]);

  const isActivated = useMemo(() => {
    return gasInfo?.schedule_enabled === 1 && gasInfo?.mode === 'SCHEDULE';
  }, [gasInfo]);

  // Change the heating schedule state depending on whether the first schedule.
  useEffect(() => {
    if (!isEsSwitchActivated) {
      if (heatingScheduleList[0].start.date) {
        dispatch(tgsHeatingScheduleBeReady(true));
      } else {
        dispatch(tgsHeatingScheduleBeReady(false));
      }
    } else {
      // Activate Conflict Message Box
      dispatch(tgsHeatingScheduleBeReady(false));
      dispatch(activateTgsConflictMessage());
    }
  }, [heatingScheduleList[0].start.date]);

  // const handleDispatch = (temp) => {
  //   if (!isEsSwitchActivated) {
  //     if (start.date) {
  //       dispatch(tgsHeatingScheduleBeReady({ temp, unitsMeasurement }));
  //     } else {
  //       // Change it to modal!! make it beautiful
  //       window.alert('input schedule');
  //     }
  //   } else {
  //     // Activate Conflict Message Box
  //     dispatch(activateTgsConflictMessage());
  //   }
  // };

  // Schedule calendar handlers
  // const handleOpenScheduler = (id) => {
  //   dispatch(tgsHeatingScheduleOpen(id));
  // };

  const handleClear = (index) => {
    // delete
    if (heatingScheduleList[index].start.date) {
      dispatch(tgsHeatingScheduleClear(index));
    } else {
      return;
    }
  };

  const handleClose = () => {
    setDisplayScheduler(false);
    dispatch(deActivatedisplayTGSScheduleModal())
  };

  const handleSetNewSchedule = (data, index) => {
    // data :object / index === schedule list's index
    // Add schedule to the slice
    dispatch(
      tgsAddHeatingSchedule({
        start: data.start,
        end: data.end,
        index,
        inputTemp: tempInput,
        id: data.id,
      })
    );
  };

  const handleDisplayScheduler = () => {
    if (isDisabled && setDisplayModeFaultMessageBox) {
      setDisplayModeFaultMessageBox(true);
      return;
    }
    setDisplayScheduler(true);
    dispatch(activatedisplayTGSScheduleModal())
  };

  return (
    <Wrapper>
      <ContentWrapper
        isReady={isReady}
        isActivated={isActivated}
        isDisabled={isDisabled}
        onClick={handleDisplayScheduler}
      >
        <Title>
          Heating <br></br>schedule
        </Title>

        <ButtonWrapper isReady={isReady} isActivated={isActivated} disabled={isDisabled}>
          <ButtonHole isReady={isReady} isActivated={isActivated} disabled={isDisabled}>
            <ButtonTop isReady={isReady} isActivated={isActivated} disabled={isDisabled}>
              <ButtonImage src={IMG_SRC} />
            </ButtonTop>
          </ButtonHole>
        </ButtonWrapper>
      </ContentWrapper>
      {(displayScheduler &&displayTgsScheduleModal )&& (
        <ScheduleCalendarWrapper>
          <ScheduleCalendar
            handleScheduler={handleSetNewSchedule}
            handleClose={handleClose}
            handleClear={handleClear}
            // start={start}
            // end={end}
            scheduleList={heatingScheduleList}
            // heatingScheduleCalendar.id  == number of schedulers
            unit={unitsMeasurement}
            tempInput={tempInput}
            setTempInput={setTempInput}
          />
        </ScheduleCalendarWrapper>
      )}
    </Wrapper>
    // <Wrapper>
    //   <ControllerName isEnable={true} name={CONTROLLER_NAME} imgSrc={IMG_SRC} />

    //   <SchedulerWrapper>
    //     <ScheduleSetTitleAndButton>
    //       <ScheduleSetTitle>start date - end date</ScheduleSetTitle>
    //       <AddScheduleButton
    //         handleOpenScheduler={handleOpenScheduler}
    //         isVisible={start.date}
    //       />
    //     </ScheduleSetTitleAndButton>
    //     <SchedulerCenter>
    //       <Scheduler
    //         handleOpenScheduler={handleOpenScheduler}
    //         start={start}
    //         end={end}
    //       />
    //     </SchedulerCenter>
    //   </SchedulerWrapper>

    //   <TempAndButton
    //     isEnable={true}
    //     buttonHandler={handleDispatch}
    //     isActivated={activated}
    //     isReady={isReady}
    //     currTemp={inputTemp}
    //     title='scheduler'
    //     isAble={start}
    //     isF={isF}
    //   />

    //   {heatingScheduleCalendar.isDisplayed && (
    //     <ScheduleCalendarWrapper>
    //       <ScheduleCalendar
    //         handleScheduler={handleDispatchSchedulerDate}
    //         handleCancel={handleCancel}
    //         handleClear={handleClear}
    //         start={start}
    //         end={end}
    //         unit={heatingScheduleCalendar.id}
    //       />
    //     </ScheduleCalendarWrapper>
    //   )}
    // </Wrapper>
  );
};

export default TgsHeatingSchedule;

const Wrapper = styled.div`
  width: 182px;
  height: 40px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 44px;

  ${flexboxCenter}
`;

const ContentWrapper = styled.button`
  width: 180px;
  height: 38px;
  font-weight: 600;

    background: ${props => props.theme.layout.switch_controls.bg};
  box-shadow: ${props => props.theme.layout.switch_controls.shadow};
  border: 0.5px solid ${props => props.theme.button.primary.border};

  border-radius: 43px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 2px 0 35px;

  ${(p) =>
    p.isReady &&
    css`
      ${readyLayer}
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer1};
    `}
  ${(p) => p.isDisabled && css`${disableLayer}`}
`;

const ButtonWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;

  ${flexboxCenter}
  background: #1b2b44 0% 0%;
  box-shadow: inset 0px 0px 1px #000000;

  ${(p) =>
    p.isReady &&
    css`
      ${readyHole}
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeHole};
    `}
  ${(p) => p.disabled && css`${disableLayer}`}
`;

const ButtonHole = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};

  ${(p) =>
    p.isReady &&
    css`
      ${readyLayer}
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer1};
    `}
  ${(p) => p.disabled && css`${disableLayer}`}
`;

const ButtonTop = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;

  ${flexboxCenter}

  ${(p) =>
    p.isReady &&
    css`
      ${readyHole}
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeHole};
    `}
  ${(p) => p.disabled && css`${disableLayer}`}
`;

const Title = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: center;
`;
const ButtonImage = styled.img`
  height: 90%;
`;

const SchedulerWrapper = styled.div`
  width: 272px;
  height: 74px;
  /* UI Properties */

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 10px 10px 26px 26px;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const SchedulerCenter = styled.div`
  ${flexboxCenter}
`;

const ScheduleSetTitleAndButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 2px;
`;

const ScheduleSetTitle = styled.span`
  height: 12px;
  font-size: 8px;
  margin-right: 55px;
`;

const ScheduleCalendarWrapper = styled.div`
  position: absolute;
  top: -22px;
  right: 20px;
  z-index: 1000;
`;
