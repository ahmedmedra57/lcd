import { useSettingsStore } from '../../../../../store/zustand';
import { BUTTON_STATE } from '../../../../../constants/storeConstants';
import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';

function SelectGasType({ gasType, gasSelection, handleSelect, handleToggle }) {
  // zustand
  const mode = useSettingsStore((state) => state.interfaceMode);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const editState = buttonState === BUTTON_STATE.EDIT;

  return (
    <Wrapper>
      <WrapperSelection>
        <ControlContainer mode={mode}>
          {gasType.map((data, index) => {
            return (
              <ContainerOfSelections key={index}>
                <ContainerOfCircles>
                  <OutsideRingGreenCircle
                    onClick={() => {
                      editState && handleToggle(index);
                      // editState && handleSelect(index);
                    }}
                    mode={mode}
                  >
                    <InsideFilledGreenCircle
                      mode={mode}
                      color={index === gasSelection ? true : false}
                    ></InsideFilledGreenCircle>
                  </OutsideRingGreenCircle>
                </ContainerOfCircles>
                <IndividualContainer mode={mode}>
                  <Text mode={mode}>{data}</Text>
                </IndividualContainer>
              </ContainerOfSelections>
            );
          })}
        </ControlContainer>
      </WrapperSelection>
    </Wrapper>
  );
}

export default SelectGasType;

const Wrapper = styled.div`
  ${flexboxCenter}
`;

const WrapperSelection = styled.div`
  width: auto;
  height: auto;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;

  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const ControlContainer = styled.div`
  width: 252px;
  height: 63px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
`;

const ContainerOfSelections = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 1px;
`;

const ContainerOfCircles = styled.div``;

const OutsideRingGreenCircle = styled.span`
  width: 22px;
  height: 22px;
  margin-left: 4px;
  margin-top: 2px;
  border: 1.5px solid ${props => props.theme.status.success.border};
  border-radius: 50%;
  ${flexboxCenter};
  background: ${props => props.theme.button.primary.bg};
`;

const InsideFilledGreenCircle = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${(props) => theme => props.color ? props.theme.label.success : 'none'};
  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 218px;
  height: 26px;
  margin-left: 4px;
  border: 1.5px solid ${props => props.theme.layout.card.border};
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter};
`;

const Text = styled.p`
  font-size: var(--space0);
  margin-left: 10px;
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  opacity: 1;
`;
