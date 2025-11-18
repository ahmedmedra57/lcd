import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';
import { selectSettingsOfEss } from '../../../../../store/slices/settingsOfEssSlice';
import ConfirmButton from '../../ConfirmButton';
import { useContext } from 'react';
import { SettingsContext } from '../../../../../context/ContextOfSettings';
import { selectUserState } from '../../../../../store/slices/userSlice';

function SystemConfiguration() {
  const tgsTesDescription = [
    'tgs-typhoon gas system',
    'tes-typhoon electric system',
  ];

  // redux
  const state = useSelector(selectSettingsOfEss);
  const mode = state.interfaceMode;
  const editState = state.buttonsOfSettings.settingsEditButton;
  const userState = useSelector(selectUserState);
  const tesState = userState.isTesSwitch;

  // useContext
  const {
    sysConfiguration,
    setSysConfiguration,
    configurationButtonName,
    setConfigurationButtonName,
    optionsSysConfiguration,
    setOptionsSysConfiguration,
  } = useContext(SettingsContext);

  // toggles the green circle and button name
  const handleSelect = (index) => {
    if (index === 0) return;
    if (index === 1) setOptionsSysConfiguration(prev => !prev);
    setConfigurationButtonName('save');
    setSysConfiguration(false);
  };
  // handles save button to activate or deactivate the use of Tes system depending on customer need and change button name.
  const handleActivationOfTes = () => {
    setSysConfiguration(true);
    setConfigurationButtonName('saved');
    return;
  };

  return (
    <Wrapper>
      <Wrapper2>
        <Wrapper3>
          <WrapperTitle>
            <Title>system configuration</Title>
          </WrapperTitle>

          <WrapperSelection>
            <ControlContainer mode={mode}>
              {tgsTesDescription.map((data, index) => {
                return (
                  <ContainerOfSelections key={index}>
                    <ContainerOfCircles>
                      <OutsideRingGreenCircle
                        onClick={() => {
                          editState && handleSelect(index);
                        }}
                        mode={mode}
                      >
                        <InsideFilledGreenCircle
                          mode={mode}
                          color={index}
                          options={optionsSysConfiguration}
                          savedSelection={tesState}
                        ></InsideFilledGreenCircle>
                      </OutsideRingGreenCircle>
                    </ContainerOfCircles>
                    <IndividualContainer mode={mode}>
                      <Text mode={mode}>
                        {index === 0 && (
                          <img
                            src={'./static/images/blueTgsButtonWithoutButtonHole.svg'}
                          />
                        )}
                        {index === 1 && (
                          <img
                            src={'./static/images/blueTesButtonWithoutButtonHole.svg'}
                          />
                        )}
                        {data}
                      </Text>
                    </IndividualContainer>
                  </ContainerOfSelections>
                );
              })}
            </ControlContainer>
          </WrapperSelection>
          <WrapperButton
          // onClick={() => {
          //   handleActivationOfTes();
          // }}
          >
            <ConfirmButton
              name={configurationButtonName}
              buttonColor={sysConfiguration}
              handleClick={handleActivationOfTes}
              editState={editState}
            />
          </WrapperButton>
        </Wrapper3>
      </Wrapper2>
    </Wrapper>
  );
}

export default SystemConfiguration;

const Wrapper = styled.div`
  width: 270px;
  height: 168px;
  margin-top: 5px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;
  opacity: 1;
  ${flexboxCenter}
`;

const Wrapper2 = styled.div`
  width: 264px;
  height: 162px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: 0px 0px 2px #000000;
  box-shadow: inset 1px 1px 2px rgb(255, 255, 255, 0.1);
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 9px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const Wrapper3 = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
`;

const WrapperTitle = styled.div`
  width: 252px;
  height: 32px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperTitle2 = styled.div`
  width: 246px;
  height: 26px;

  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 13px;
  opacity: 1;
  ${flexboxCenter}
`;

const Title = styled.p`
  width: auto;
  height: auto;
  margin-bottom: 1px;

  display: inline-block;
  text-align: center;
  font-size: var(--space2);
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;

const WrapperSelection = styled.div`
  width: 252px;
  height: 74px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const ControlContainer = styled.div`
  width: 252px;
  height: 74px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 18px;
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

const ContainerOfCircles = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

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

const InsideFilledGreenCircle = styled.span`
  width: 14px;
  height: 14px;

  background-color: ${({ color }) => props => color === 0 && props.theme.label.success};

  ${({ options }) => props =>
    options ? `background-color:${props.theme.label.success}` : 'background-color:none'};

  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 218px;
  height: 32px;
  margin-left: 4px;
  border: 1.5px solid ${props => props.theme.layout.card.border};
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter};
`;

const Text = styled.span`
  width: 218px;
  font-size: 7px;

  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  opacity: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const WrapperButton = styled.div`
  width: 252px;
  height: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

