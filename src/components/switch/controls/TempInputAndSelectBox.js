import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  justifyContentSpaceBetween,
} from '../../../styles/commonStyles';
import InputKeyPad from '../../keyboard/InputKeyPad';
import { convertCelsiusToFahrenheit } from '../../../helpers/helpers';

const TempInputAndSelectBox = ({
  unit,
  tempInput,
  setTempInput,
  currSchedule,
  setCurrSchedule,
  isFirstSchedule,
  scheduleNumber,
  scheduleList,
  editable,
}) => {
  // console.log(currSchedule, scheduleNumber);
  // console.log('input', scheduleList);

  // Local state
  const [displayKeypad, setDisplayKeypad] = useState(false);

  // setTempInput to display saved temperature
  useEffect(() => {
    if (scheduleList[currSchedule].inputTemp) {
      if (unit) {
        setTempInput(`${Math.floor(convertCelsiusToFahrenheit(scheduleList[currSchedule].inputTemp))} °F`);
      } else {
        setTempInput(`${Math.floor(scheduleList[currSchedule].inputTemp)} °C`);
      }
    } else {
      setTempInput('');
    }
  }, [scheduleList[currSchedule].inputTemp, unit]);

  // console.log(scheduleList[currSchedule].inputTemp);

  const handleSchedulerNumber = (id) => {
    if (id === 1) {
      // id '1'  move to previous schedule
      if (currSchedule > 0) {
        setCurrSchedule(currSchedule - 1);
      } else {
        return;
      }
    } else {
      // id '2' move to previous schedule
      if (currSchedule + 1 < scheduleNumber) {
        setCurrSchedule(currSchedule + 1);
      } else {
        return;
      }
    }
  };

  const leftArrowSrc =
    currSchedule > 0
      ? '/static/images/schedule-arrow-left-active.svg'
      : '/static/images/schedule-arrow-left.svg';

  const rightArrowSrc =
    currSchedule + 1 < scheduleNumber
      ? '/static/images/schedule-arrow-right-active.svg'
      : '/static/images/schedule-arrow-right.svg';

  const handleOpenKeypad = () => {
    setDisplayKeypad(true);
  };

  return (
    <Wrapper>
      <SectionInput>
        <InputWrapper>
          <Title>
            set<br></br>temp.
          </Title>
          <InputDegree
            type='text'
            placeholder={unit ? '0 °F' : '0 °C'}
            value={tempInput}
            onChange={(e) => editable && setTempInput(`${Number(e.target.value)} °${unit ? 'F' : 'C'}`)}
            onClick={() => editable && handleOpenKeypad()}
          />
        </InputWrapper>
      </SectionInput>

      {/* <SectionSelect>
        <SelectHole>
          <SelectTop>
            <ArrowButton
              isActivated={isFirstSchedule}
              onClick={() => handleSchedulerNumber(1)}
            >
              <Img src={leftArrowSrc} />
            </ArrowButton>
            <Title>schedule {currSchedule + 1}</Title>
            <ArrowButton
              isActivated={isFirstSchedule}
              onClick={() => handleSchedulerNumber(2)}
            >
              <Img src={rightArrowSrc} />
            </ArrowButton>
          </SelectTop>
        </SelectHole>
      </SectionSelect> */}

      {displayKeypad && (
        <KeypadWrapper onClick={() => setDisplayKeypad(false)}>
          <InputKeyPad
            handleOnSubmit={() => setDisplayKeypad(false)}
            closeKeyPad={() => setDisplayKeypad(false)}
            setMainInput={(input) => setTempInput(`${Number(input)} °${unit ? 'F' : 'C'}`)}
          />
        </KeypadWrapper>
      )}
    </Wrapper>
  );
};

export default TempInputAndSelectBox;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  ${justifyContentSpaceBetween}
`;
const SectionInput = styled.section`
  width: 157px;
  height: 64px;
  border-radius: 38px;

  background: ${props => props.theme.button.secondary.bg};
  box-shadow: inset 0px 0px 3px #000000;

  ${flexboxCenter}
`;

const InputWrapper = styled.div`
  width: 153px;
  height: 60px;
  border-radius: 30px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};

  ${justifyContentSpaceBetween}
  padding: 0 8px 0 16px;
`;
const Title = styled.span`
  font-size: 12px;
  letter-spacing: 1.2;
  text-align: left;
  color: ${props => props.theme.label.primary};
`;
const InputDegree = styled.input`
  width: 73px;
  height: 41px;
  border-radius: 25px;

  background: ${props => props.theme.input.bg};
  box-shadow: inset 0px 0px 6px #000000;

  text-align: center;
  font-size: 14px;
  letter-spacing: 1.4px;
  color: ${props => props.theme.label.primary};
  &::placeholder {
    color: ${props => props.theme.label.primary};
  }
`;
const SectionSelect = styled.section`
  width: 240px;
  height: 54px;

  background: ${props => props.theme.button.secondary.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 27px;

  ${flexboxCenter}
`;

const SelectHole = styled.div`
  width: 236px;
  height: 50px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 26px;

  ${flexboxCenter}
`;

const SelectTop = styled.div`
  width: 220px;
  height: 34px;
  background: ${props => props.theme.button.secondary.bg};
  border: 1px solid ${props => props.theme.status.warning.border};
  border-radius: 17px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
`;

const ArrowButton = styled.button`
  height: 100%;
  ${flexboxCenter}

  ${(p) =>
    p.isActivated ||
    css`
      cursor: not-allowed;
    `}
`;
const Img = styled.img`
  height: 80%;
`;

const KeypadWrapper = styled.div`
  width: 1024px;
  height: 800px;

  position: absolute;
  top: 30px;
  left: 8px;
  z-index: 100;

  display: flex;
  align-items: flex-start;
  justify-content: center;
  /* keypad location */
  padding-top: 20%;
  padding-left: 47%;
`;
