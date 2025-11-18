import { useSettingsStore } from '../../../../../store/zustand';
import { BUTTON_STATE } from '../../../../../constants/storeConstants';
import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';

function SelectBox({
  essGpEbp,
  mode,
  handleToggle,
  gpEbpPowering,
  tgsGpEbp,
  tesGpEbp,
  propIndex,
  essSwitch,
}) {
  // zustand
  const buttonState = useSettingsStore((state) => state.buttonState);
  const editState = buttonState === BUTTON_STATE.EDIT;

  return (
    <div>
      {essSwitch
        ? essGpEbp?.map((data, index) => {
            return (
              <EachContainerOfSelection key={index}>
                <ContainerDarkLight>
                  <ContainerImages>
                    <OutsideRingGreenCircle
                      onClick={() => {
                        editState && handleToggle(index);
                      }}
                      mode={mode}
                    >
                      <InsideFilledGreenCircle
                        mode={mode}
                        color={index === gpEbpPowering ? true : false}
                      ></InsideFilledGreenCircle>
                    </OutsideRingGreenCircle>
                  </ContainerImages>
                  <IndividualContainer mode={mode}>
                    <Description mode={mode}>{data}</Description>
                  </IndividualContainer>
                </ContainerDarkLight>
              </EachContainerOfSelection>
            );
          })
        : propIndex === 0
        ? tgsGpEbp?.map((data, index) => {
            return (
              <EachContainerOfSelection key={index}>
                <ContainerDarkLight>
                  <ContainerImages>
                    <OutsideRingGreenCircle
                      onClick={() => {
                        editState && handleToggle(index);
                      }}
                      mode={mode}
                    >
                      <InsideFilledGreenCircle
                        mode={mode}
                        color={index === gpEbpPowering ? true : false}
                      ></InsideFilledGreenCircle>
                    </OutsideRingGreenCircle>
                  </ContainerImages>
                  <IndividualContainer mode={mode}>
                    <Description mode={mode}>{data}</Description>
                  </IndividualContainer>
                </ContainerDarkLight>
              </EachContainerOfSelection>
            );
          })
        : tesGpEbp?.map((data, index) => {
            return (
              <EachContainerOfSelection key={index}>
                <ContainerDarkLight>
                  <ContainerImages>
                    <OutsideRingGreenCircle
                      onClick={() => {
                        editState && handleToggle(index);
                      }}
                      mode={mode}
                    >
                      <InsideFilledGreenCircle
                        mode={mode}
                        color={index === gpEbpPowering ? true : false}
                      ></InsideFilledGreenCircle>
                    </OutsideRingGreenCircle>
                  </ContainerImages>
                  <IndividualContainer mode={mode}>
                    <Description mode={mode}>{data}</Description>
                  </IndividualContainer>
                </ContainerDarkLight>
              </EachContainerOfSelection>
            );
          })}
    </div>
  );
}

export default SelectBox;

const EachContainerOfSelection = styled.div`
  width: 259px;
  height: 38px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 19px;
  opacity: 1;
  display: flex;
  justify-content: space-evenly;
  justify-content: center;
`;

const ContainerDarkLight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-left: -1px;
`;

const ContainerImages = styled.div``;

const OutsideRingGreenCircle = styled.span`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  margin-top: 2px;
  border: 1.5px solid ${props => props.theme.status.success.border};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.layout.sidebar.bg};
`;

const InsideFilledGreenCircle = styled.div`
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-color: ${(props) => theme => props.color ? props.theme.label.success : 'none'};
  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 224px;
  height: 34px;
  margin-left: 4px;
  border: 1.5px solid ${props => props.theme.layout.card.border};
  border-radius: 18px;
  opacity: 1;
  ${flexboxCenter}
`;

const Description = styled.p`
  font-size: var(--space2);
  margin-left: 10px;
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  opacity: 1;
  max-width: 28ch;
  line-height: 7px;
  text-align: center;
`;
