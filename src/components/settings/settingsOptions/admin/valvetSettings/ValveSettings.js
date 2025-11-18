import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';
import { useState, useContext } from 'react';
import ValveConfirmButton from './ValveConfirmButton';
import {
  useSettingsStore,
  useSystemIdentificationStore,
  useTgsSettingsStore,
  useUserStore
} from '../../../../../store/zustand';
import InputKeyPad from '../../../../keyboard/InputKeyPad';
import { SettingsContext } from '../../../../../context/ContextOfSettings';
import { updateDeviceInfo } from '../../../../../helpers/helpers';

function ValveSettings({ setWarningMessage, setInputValue, inputValue }) {
  const data = [
    { title: 'start position:' },
    { title: 'min position:' },
    { title: 'max position:' },
  ];

  const {
    valveButtonColor,
    setValveButtonColor,
    valveButtonName,
    setValveButtonName,
  } = useContext(SettingsContext);

  // const [valveButtonColor, setValveButtonColor] = useState(false);
  const [activateKeypad, setActivateKeypad] = useState(false);
  const [inputFocus, setInputFocus] = useState(null);
  const [options, setOptions] = useState('');

  const mode = useSettingsStore((state) => state.interfaceMode);
  const editState = useSettingsStore((state) => state.buttonsOfSettings.settingsEditButton);
  const { locationName, switchName, application, switchSize, heatingSystem } = useSystemIdentificationStore((state) => state.sysIdentification);
  const gasType = useTgsSettingsStore((state) => state.gasType);
  const isEssSwitch = useUserStore((state) => state.isEssSwitch);
  const isTesSwitch = useUserStore((state) => state.isTesSwitch);

  // Ess, Tgs and TgsTes names of the machine. it will indicate which machine depending on input datas of the system identification
  const EssSwitchName =
    switchName?.length < 1
      ? 'switch'
      : `${locationName}-${switchName} ${switchSize} ${application}-${
          heatingSystem?.split(' - ')[0]
        }`;

  const tgsTesSwitchName =
    switchName?.length < 1
      ? 'switch'
      : `${locationName}-${switchName} ${switchSize} ${application}-${
          heatingSystem?.split(' - ')[0].split('-')[0]
        }/${isEssSwitch || gasType ? 'NG-' : 'LP-'}${
          heatingSystem?.split(' - ')[0].split('-')[1]
        }
         `;

  const tgsSwitchName =
    switchName?.length < 1
      ? 'switch'
      : `${locationName}-${switchName} ${switchSize} ${application}-${
          heatingSystem?.split(' - ')[0]
        } / ${isEssSwitch || gasType ? 'NG' : 'LP'}`;

  // handles the 3 input fields to direct each data entered gets save at the right place in useState at useContext
  const handleInput = (name, inputNumber) => {
    const value = Number(inputNumber);

    if (value >= 0 && value <= 100) {
      switch (name) {
        case 0:
          setInputValue(() => ({ ...inputValue, first: inputNumber }));
          break;
        case 1:
          setInputValue(() => ({ ...inputValue, second: inputNumber }));
          break;
        case 2:
          setInputValue(() => ({ ...inputValue, third: inputNumber }));
          break;
        default:
          break;
      }
    } else {
      setWarningMessage(true);
    }
  };

  // this changes the save button which the apply button depends to know if theres a change or not
  const handleSubmit = (e) => {
    e.preventDefault();
    setValveButtonColor(true);
    setValveButtonName('confirmed');
  };

  // handles the keypad
  const handleDisplayKeyPad = (index) => {
    options !== index && setOptions(index);
    setActivateKeypad(true);
  };

  // ,we-cove-03-04-05 #10 s.t.tgs

  return (
    <WrapperTitleAndSettings>
      <WrapperTitleAndSettings2>
        <WrapperTitle>
          <Title>valve settings</Title>
        </WrapperTitle>
        <WrapperMachineNameData>
          
          <MachineName>
            {!isEssSwitch && isTesSwitch
              ? tgsTesSwitchName
              : !isEssSwitch && !isTesSwitch
              ? tgsSwitchName
              : EssSwitchName}
          </MachineName>
          <WrapperData>
            <WrapperData2>
              <WrapperData3>
                <SmallTitle>gas value position</SmallTitle>
                <Form onSubmit={handleSubmit}>
                  <WrapperIndent>
                    {data.map((value, index) => {
                      return (
                        <MapDiv key={index}>
                          <DataSubtitle>{value.title}</DataSubtitle>
                          <DataContainer>
                            <DataIndent>
                              <DataInput
                                onClick={() => {
                                  setInputFocus(index);
                                  handleDisplayKeyPad(index);
                                }}
                                type='number'
                                value={
                                  index === 0
                                    ? inputValue.first
                                    : index === 1
                                    ? inputValue.second
                                    : inputValue.third
                                }
                                onChange={(e) => {
                                  editState &&
                                    handleInput(index, e.target.value);
                                }}
                              ></DataInput>
                            </DataIndent>
                            <PercentageSign>%</PercentageSign>
                          </DataContainer>
                          {activateKeypad && options === index && (
                            <KeyboardWrapper index={options}>
                              <PositionAbsoluteBox index={options}>
                                <InputKeyPad
                                  closeKeyPad={() => setActivateKeypad(false)}
                                  name={inputFocus}
                                  handleOnSubmit={handleInput}
                                />
                              </PositionAbsoluteBox>
                            </KeyboardWrapper>
                          )}
                        </MapDiv>
                      );
                    })}
                  </WrapperIndent>
                  <WrapperButton>
                    <ValveConfirmButton
                      type='submit'
                      buttonColor={valveButtonColor}
                      buttonName={valveButtonName}
                    />
                  </WrapperButton>
                </Form>
              </WrapperData3>
            </WrapperData2>
          </WrapperData>
        </WrapperMachineNameData>
      </WrapperTitleAndSettings2>
    </WrapperTitleAndSettings>
  );
}

export default ValveSettings;

const WrapperTitleAndSettings = styled.div`
  width: 548px;
  height: 135px;
  /* UI Properties */
  background: var(--unnamed-color-1b2b44) 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 2px var(--unnamed-color-000000);
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;
  opacity: 1;
  ${flexboxCenter}
`;
const WrapperTitleAndSettings2 = styled.div`
  width: 542px;
  height: 129px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: 0px 0px 2px #000000;
  box-shadow: inset 1px 1px 2px rgb(255, 255, 255, 0.1);
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 9px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const WrapperTitle = styled.div`
  width: 535px;
  height: 32px;

  background: ${props => props.theme.gradients.card};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 24px;
  opacity: 1;
  ${flexboxCenter}
`;

const Title = styled.p`
  text-align: center;
  font-size: var(--space0);
  letter-spacing: 1.2px;
  color: ${props => props.theme.label.primary};
  text-transform: uppercase;
  opacity: 1;
`;

const WrapperMachineNameData = styled.div`
  width: 535px;
  height: 77px;

  background: ${props => props.theme.gradients.card};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 6px 6px 26px 26px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

const MachineSerialNumberBackground = styled.img`
  position: absolute;
  left: -1.2%;
  top: -5%;
`;

const MachineName = styled.p`
  font-size: var(--space0);
  letter-spacing: 1.2px;
  color: ${props => props.theme.label.primary};
  text-transform: uppercase;
  opacity: 1;
  position: absolute;
  left: 1%;
  top: 7%;
`;

const WrapperData = styled.div`
  width: 530px;
  height: 50px;
  margin-bottom: 2px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: 0px 0px 2px #00000029;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 0px 25px 25px 25px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperData2 = styled.div`
  width: 519px;
  height: 40px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 24px;
  opacity: 1;
  ${flexboxCenter}
`;
const WrapperData3 = styled.div`
  width: 515px;
  height: 36px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 33px;
  opacity: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const SmallTitle = styled.p`
  width: 70px;
  text-align: center;
  font-size: var(--space2);
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
  text-transform: uppercase;
  opacity: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
`;

const WrapperIndent = styled.div`
  width: 358px;
  height: 30px;

  background: ${props => props.theme.gradients.card};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 24px;
  opacity: 1;
  ${flexboxCenter}
`;

const MapDiv = styled.div`
  height: 100%;
  width: 100%;
  padding-right: 1px;

  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const DataSubtitle = styled.p`
  width: 58px;
  height: auto;
  text-align: center;
  font-size: var(--space2);
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
  text-transform: uppercase;
  opacity: 1;
  &:first-child {
    padding-left: 2px;
  }
`;

const DataContainer = styled.div`
  width: 60px;
  height: 28px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 15px;
  opacity: 1;
  ${flexboxCenter}
`;

const DataIndent = styled.div`
  width: 33px;
  height: 20px;
  margin-left: -4px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 18px 6px 6px 18px;
  opacity: 1;
  ${flexboxCenter}
`;

const DataInput = styled.input`
  width: 29px;
  height: 18px;
  border-radius: 15px;
  font-size: var(--space1);
  letter-spacing: 1px;
  background-color: transparent;
  opacity: 1;

  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PercentageSign = styled.p`
  margin-left: 6px;
  font-size: var(--space2);
`;

const WrapperButton = styled.div`
  margin-left: 6px;
`;

const KeyboardWrapper = styled.div`
  height: 100px;
  z-index: 100;
`;

const PositionAbsoluteBox = styled.div`
  ${({ index }) =>
    index === 0
      ? css`
          position: absolute;
          top: 5rem;
          right: 16rem;
        `
      : index === 1
      ? css`
          position: absolute;
          top: 5rem;
          right: 8rem;
        `
      : css`
          position: absolute;
          top: 5rem;
          right: 1rem;
        `}
  z-index:100;
`;
