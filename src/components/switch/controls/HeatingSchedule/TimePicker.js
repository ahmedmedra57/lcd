import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
} from '../../../../styles/commonStyles';
import Clock from './Clock';

import InputKeyPad from '../../../keyboard/InputKeyPad';

const TimePicker = ({ time, setTime, id }) => {
  const [openKeypad, setOpenKeypad] = useState(false);
  const [title, setTitle] = useState(null);

  // id = start || end
  const handleSetTime = (title, data) => {
    switch (title) {
      case 'division': {
        setTime({ ...time, division: data }, id);
        return;
      }
      case 'hour': {
        const hour = Number(data);
        if (hour > 12) {
          if (hour <= 24) {
            setTime({ ...time, hour: data - 12, division: 'pm' }, id);
          }
        } else if (hour == 0) {
          setTime({ ...time, hour: '00', division: 'am' }, id);
        } else {
          setTime({ ...time, hour: data, division: 'am' }, id);
        }

        return;
      }
      case 'minute': {
        const minutes = Number(data);
        if (minutes === 0) {
          setTime({ ...time, minute: '00' }, id);
        } else if (minutes < 60) {
          setTime({ ...time, minute: data }, id);
        }

        return;
      }
      default:
        return;
    }
  };

  const handleOpenKeypad = (comp) => {
    if (comp === 'hour') {
      setTime({ hour: '00', minute: '00', division: 'am' }, id);
    }
    setTitle(comp);
    setOpenKeypad(true);
  };

  return (
    <>
      <Wrapper>
        <TimeAndDivisionWrapper>
          <TimeOuter>
            <TimeInner>
              <TimeInputButton onClick={() => handleOpenKeypad('hour')}>
                <TimeInputButtonTop>hour</TimeInputButtonTop>
              </TimeInputButton>

              <HourAndMinute>
                {Number(time.hour) === 0 ? time.hour : Number(time.hour) < 10 ? `0${Number(time.hour)}` : Number(time.hour)}:
                {time.minute < 10
                  ? time.minute == '00'
                    ? time.minute
                    : `${time.minute}`
                  : time.minute}
              </HourAndMinute>

              <TimeInputButton onClick={() => handleOpenKeypad('minute')}>
                <TimeInputButtonTop isMinutes={true}>
                  minutes
                </TimeInputButtonTop>
              </TimeInputButton>
            </TimeInner>
          </TimeOuter>

          <DivisionWrapper>
            <DivisionOuter>
              <DivisionInner>
                <Division
                  isSelected={time.division === 'am' ? true : false}
                  onClick={() => {
                    handleSetTime('division', 'am');
                  }}
                >
                  a.m
                </Division>
              </DivisionInner>
            </DivisionOuter>
            <DivisionOuter>
              <DivisionInner>
                <Division
                  isSelected={time.division === 'pm' ? true : false}
                  onClick={() => {
                    handleSetTime('division', 'pm');
                  }}
                >
                  p.m
                </Division>
              </DivisionInner>
            </DivisionOuter>
          </DivisionWrapper>
        </TimeAndDivisionWrapper>
        <WatchWrapper>
          <Clock time={time} />
        </WatchWrapper>

        {openKeypad && (
          <KeypadWrapper>
            <InputKeyPad
              closeKeyPad={() => setOpenKeypad(false)}
              handleOnSubmit={(data) => handleSetTime(title, data)}
              setMainInput={(data) => handleSetTime(title, data)}
              name={'time'}
            />
          </KeypadWrapper>
        )}
      </Wrapper>
    </>
  );
};

export default TimePicker;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  ${flexDirectionColumn} /* add padding */
  position: relative;
`;

const TimeAndDivisionWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
  padding: 2px 2px;
`;
const TimeOuter = styled.div`
  width: 72px;
  height: 98px;
  border-radius: 12px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};

  ${flexboxCenter};
`;
const TimeInner = styled.div`
  width: 62px;
  height: 89px;
  border-radius: 8px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;

  ${flexDirectionColumn};
  padding: 1px 0;
`;

const TimeInputButton = styled.button`
  width: 60px;
  height: 33px;
  border-radius: 7px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};

  ${flexboxCenter}
`;
const TimeInputButtonTop = styled.div`
  width: 53px;
  height: 27px;
  border-radius: 4px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;

  ${flexboxCenter}
  font-size: 10;
  ${(p) =>
    p.isMinutes &&
    css`
      font-size: 8px;
    `}
`;

const HourAndMinute = styled.span`
  font-size: 12px;
`;

const OptionAndTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 0rem;
  left: 0rem;
  z-index: 1000;
  overflow: hidden;

  width: 61px;
  height: 83px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 12px;
`;
const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 53px;
  height: 60px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 8px;

  overflow: auto;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid ${props => props.theme.layout.card.border};
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.label.primary};
    border-radius: 13px;
    border: 1.5px solid ${props => props.theme.label.success};
    background-clip: padding-box;
    height: 60%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/static/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/static/images/scrollbar-button-end.svg');
  }
`;

const Title = styled.div`
  font-size: 8px;
  text-align: center;
  color: ${props => props.theme.label.secondary};

  width: 53px;
  height: 14px;
  border-radius: 8px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;

  ${flexboxCenter}
`;

const DivisionWrapper = styled.div`
  height: 98px;

  ${flexDirectionColumn};
`;
const DivisionOuter = styled.div`
  width: 71px;
  height: 45px;
  border-radius: 12px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};

  ${flexboxCenter}
`;
const DivisionInner = styled.div`
  width: 62px;
  height: 37px;
  border-radius: 8px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;

  ${flexboxCenter}
`;

const Division = styled.button`
  font-size: 15px;
  letter-spacing: 1.9px;
  text-transform: lowercase;
  color: ${(p) => p.isSelected ? p.theme.label.primary : p.theme.label.disabled};
`;

const WatchWrapper = styled.div`
  width: 100%;
  height: 210px;
  background: #413a3a7d;
`;

const KeypadWrapper = styled.div`
  top: 110px;
  position: absolute;
  z-index: 1000;
`;
