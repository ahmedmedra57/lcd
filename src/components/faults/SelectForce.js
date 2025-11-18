import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { forceFaultHandler } from '../../helpers/helpers';
import { useEssSwitchStore } from '../../store/essSwitchStore';
import { useFaultsStore } from '../../store/faultsStore';
import { useTimerStore } from '../../store/timerStore';

import { flexboxCenter } from '../../styles/commonStyles';

import MessageButton from '../userMessages/MessageButton';

const SelectForce = ({ title, handleClose, selectedTcNo }) => {
  const { receivedThermocoupleSetting, handleDisplayForceMessageBox, handleDisplayForceStatusBox, handleForceButtonActivated, handleForceSelection, handleMaxHeatWithTimerOn, handleTimerDescription } = useFaultsStore();
  const { handleTurnOffTheHeater } = useEssSwitchStore();
  const { handleTimer } = useTimerStore();

  const options = useMemo(() => {
    const result = [];
    const selectedThermocouple = receivedThermocoupleSetting?.find(
      (item) => item.tc_no === selectedTcNo - 1
    );
    if (Array.isArray(selectedThermocouple?.force)) {
      if (selectedThermocouple?.force.includes(1)) {
        result.push('max heat for 12 hours');
      }
      if (selectedThermocouple?.force.includes(2)) {
        result.push('max heat for 3 days');
      }
      if (selectedThermocouple?.force.includes(3)) {
        result.push('turn off all electric heater');
      }
      return result;
    }
    return [
      'max heat for 12 hours',
      'max heat for 3 days',
      'turn off all electric heater',
    ]
  }, [receivedThermocoupleSetting]);

  const [selectedOne, setSelectedOne] = useState(options[0]);

  const handleClick = (option) => {
    setSelectedOne(option);
  };

  const handleConfirm = () => {
    handleForceSelection(selectedOne);
    switch (selectedOne) {
      case options[0]: {
        // Max heat for 3 days => max heat display box
        // 1. call the timer with 72 hours
        handleTimer(72);
        // 2.display the box, timer on with time set
        handleMaxHeatWithTimerOn(selectedOne);
        // sets the description of timer at Ess or Tes for either 12 hours or 3 days
        handleTimerDescription();
        break;
      }
      case options[1]: {
        // Max heat with 12 hrs timer
        // display the box, timer on with time set
        handleTimer(12);
        // 2.display the box, timer on with time set
        handleMaxHeatWithTimerOn(selectedOne);
        break;
      }
      case options[2]: {
        // turn off all electric heater and show the message
        handleTurnOffTheHeater();
        // Display force status box
        handleDisplayForceStatusBox(true);

        break;
      }
      default: {
        break;
      }
    }
    // Common dispatch and close the selection box
    forceFaultHandler({
      tc_no: selectedTcNo - 1,
      fault_mode:
        selectedOne == 'max heat for 12 hours'
          ? 1
          : selectedOne == 'max heat for 3 days'
          ? 2
          : 3,
    });
    handleForceButtonActivated(true);
    handleClose(handleDisplayForceMessageBox(false));
  };

  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{title}</HeaderTitle>
            <Logo src='/static/images/messagebox-logo.svg' />
          </HeaderWrapper>

          <TitleWrapper>
            <Title>select force</Title>
          </TitleWrapper>

          <SelectionsWrapper>
            {options.map((option, index) => (
              <SelectionItemWrapper
                onClick={() => handleClick(option)}
                key={index}
              >
                <SelectRadioButton>
                  <SelectionIndicator
                    isSelected={selectedOne === option}
                  ></SelectionIndicator>
                </SelectRadioButton>
                <Selection>{option}</Selection>
              </SelectionItemWrapper>
            ))}
          </SelectionsWrapper>

          <ButtonWrapper>
            <MessageButton name='confirm' buttonHandler={handleConfirm} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SelectForce;

const Wrapper = styled.div`
  width: 1024px;
  height: 600px;

  position: absolute;
  top: 0px;
  left: 128px;

  background-color: ${props => props.theme.layout.overlay.bg};
  z-index: 10000;
  ${flexboxCenter};
`;

const MessageOuter = styled.div`
  width: 402px;
  height: 218px;
  background: ${props => props.theme.layout.card.bgGradientTransparent};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.bg};
  border-radius: 16px;

  ${flexboxCenter}
`;
const MessageInner = styled.div`
  width: 384px;
  height: 201px;
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.bg};
  border-radius: 9px;

  padding: var(--space3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.label.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 12%;
`;
const HeaderTitle = styled.span`
  color: ${props => props.theme.label.primary};
`;

const Logo = styled.img``;

const TitleWrapper = styled.div`
  width: 371px;
  height: 32px;
  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;

  ${flexboxCenter}
`;
const Title = styled.div`
  width: 365px;
  height: 26px;
  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 13px;

  font-size: 9px;
  letter-spacing: 1px;
  color: ${props => props.theme.label.primary};
  ${flexboxCenter}
`;

const SelectionsWrapper = styled.div`
  width: 371px;
  height: 92px;
  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: 0.25rem 0;
`;
const SelectionItemWrapper = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.2rem 0 0.3rem;
`;
const Selection = styled.div`
  font-size: 9px;
  color: ${props => props.theme.label.primary};

  width: 337px;
  height: 26px;
  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 13px;

  display: flex;
  align-items: center;
  padding-left: 0.5rem;
`;
const SelectRadioButton = styled.div`
  width: 22px;
  height: 22px;
  border: 1px solid ${props => props.theme.status.error.border};
  border-radius: 50%;

  ${flexboxCenter}
`;
const SelectionIndicator = styled.div`
  width: 14px;
  height: 14px;
  ${(p) =>
    p.isSelected &&
    css`
      background: ${props => props.theme.status.success.bg} 0% 0% no-repeat padding-box;
    `}

  border-radius: 50%;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
