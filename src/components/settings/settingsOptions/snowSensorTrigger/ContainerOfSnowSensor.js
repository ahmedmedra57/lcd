import styled, { css } from 'styled-components';
import { useEffect, useMemo, useState, useContext } from 'react';
import { flexboxCenter } from '../../../../styles/commonStyles';
import SnowFactor from './SnowFactor';
import {
  useSettingsStore,
  useUserStore,
  useTgsSettingsStore,
  useTgsSwitchStore
} from '../../../../store/zustand';
import { SettingsContext } from '../../../../context/ContextOfSettings';
import InvisibleDivForEditButton from '../editAndApplyMessageBoxes/InvisibleDivForEditButton';
import EditCancelApplyButtons from '../EditCancelApplyButtons';
import SettingAppliedMessage from '../../../userMessages/SettingAppliedMessage';
import { convertFahrenheitToCelsius,convertCelsiusToFahrenheit, updateSnowSensorSettingstempreture, updateSettingsValue } from '../../../../helpers/helpers';

function ContainerOfSnowSensor() {
  const ess = ['ess-snow sensor trigger'];
  const temp = ['350'];

  const buttonsName = ['edit', 'cancel', 'apply'];

  // useContext

  const {
    essSnowSensor,
    setEssSnowSensor,
    tgsSnowSensor,
    setTgsSnowSensor,
    tesSnowSensor,
    setTesSnowSensor,
    metricImperialToggle,
  } = useContext(SettingsContext);

  // useState
  const [messageBox, setMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({});
  const [isTempWarning, setIsTempWarning] = useState(false);
  const [tempWarningContent, setTempWarningContent] = useState({});
  const [options, setOptions] = useState('');

  // Zustand
  const settings = useTgsSwitchStore((state) => state.settings);
  const tesSwitch = useUserStore((state) => state.isTesSwitch);
  const essSwitch = useUserStore((state) => state.isEssSwitch);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const editState = buttonState === 'edit';
  const mode = useSettingsStore((state) => state.interfaceMode);
  const settingsEditButton = buttonState === 'edit';
  const unitsState = useSettingsStore((state) => state.unitsMeasurement);
  const { essTemp, isFEss } = useSettingsStore((state) => state.snowSensorTemp);
  const { tgsTemp, tesTemp, isFTgsTes, tgsTempOnly, isFTgs } = useTgsSettingsStore((state) => state.snowSensorTemp);
  const setResetAllSettingsButtons = useSettingsStore((state) => state.setResetAllSettingsButtons);
  const setSettingsEditButton = useSettingsStore((state) => state.setSettingsEditButton);
  const setSettingsCancelButton = useSettingsStore((state) => state.setSettingsCancelButton);
  const setSettingsApplySnowSensorTriggerButton = useSettingsStore((state) => state.setSettingsApplySnowSensorTriggerButton);
  const setTgsSettingsApplySnowSensorButton = useTgsSettingsStore((state) => state.setTgsSettingsApplySnowSensorButton);
  // sets back previous data entered in the input fields either in imperial or metric. if it was metric before and user changes the units, the input(s) will be converted.
  useEffect(() => {
    setResetAllSettingsButtons();
    if (essSwitch) {
      if (essTemp > 0) {
        if (unitsState === isFEss) {
          setEssSnowSensor(essTemp);
        } else {
          if (isFEss) {
            // saved unit is F but current unit is C -> formula c = (f-32) * 5/9
            setEssSnowSensor(`${Math.round(((essTemp - 32) * 5) / 9)}`);
          } else {
            // saved unit is C but current unit is F -> formula f = c * 1.8 + 32
            setEssSnowSensor(`${Math.round(essTemp * 1.8 + 32)}`);
          }
        }
      }
    } else if (!tesSwitch) {
      if (tgsTempOnly > 0) {
        if (unitsState === isFTgs) {
          setTgsSnowSensor(tgsTempOnly);
        } else {
          if (isFTgs) {
            // saved unit is F but current unit is C -> formula c = (f-32) * 5/9
            setTgsSnowSensor(`${Math.round(((tgsTempOnly - 32) * 5) / 9)}`);
          } else {
            // saved unit is C but current unit is F -> formula f = c * 1.8 + 32
            setTgsSnowSensor(`${Math.round(tgsTempOnly * 1.8 + 32)}`);
          }
        }
      }
    } else {
      if (tesTemp > 0 && tgsTemp > 0) {
        if (unitsState === isFTgsTes) {
          setTesSnowSensor(tesTemp);
          setTgsSnowSensor(tgsTemp);
        } else {
          if (isFTgsTes) {
            // saved unit is F but current unit is C -> formula c = (f-32) * 5/9
            setTesSnowSensor(`${Math.round(((tesTemp - 32) * 5) / 9)}`);
            setTgsSnowSensor(`${Math.round(((tgsTemp - 32) * 5) / 9)}`);
          } else {
            // saved unit is C but current unit is F -> formula f = c * 1.8 + 32
            setTesSnowSensor(`${Math.round(tesTemp * 1.8 + 32)}`);
            setTgsSnowSensor(`${Math.round(tgsTemp * 1.8 + 32)}`);
          }
        }
      }
    }
  }, []);
  const validateMinAndMaxTemp=(val)=>{
    const value =settings.unit === 'f' ? val:convertCelsiusToFahrenheit(val);
    return value<=250||value>=1830
  }
  // handles the 2 input fields to direct each data entered  from keypad gets save at the right place in useState in useContext and it will display in the input field as you type
  const handleInputs = (index, inputNumber) => {
    switch (index) {
      case 0:
        if (essSwitch) {
          setEssSnowSensor(inputNumber);
        } else {
          if(essSwitch){
            setTesSnowSensor(inputNumber);  
          }else{
            setTgsSnowSensor(inputNumber);
          }
        }
        break;
      case 1:
        setTesSnowSensor(inputNumber);
        break;
      default:
        break;
    }
  };
  
  const tempValue=(val,unit)=>{
    return convertFahrenheitToCelsius(val,unit)
  }

  // 3 buttons(edit, cancel and apply).dispatch the input fields for Ess into ess slice when apply button is clicked
  const handleEssButtons = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        setSettingsEditButton();
        break;
      case 1:
        setSettingsCancelButton();
        setEssSnowSensor(settings?.electrical_snow_threshold || '');
        break;
      case 2:
        if (typeof essSnowSensor === 'number') {
          if(validateMinAndMaxTemp(essSnowSensor)){
            setIsTempWarning(true)
            setTempWarningContent({
              title: ['ess temp value error'],
              content: contentMessage(),
            });
            setEssSnowSensor(settings?.electrical_snow_threshold || '');
            return;
          }
          updateSettingsValue(settings, "electrical_snow_threshold", tempValue(essSnowSensor,settings?.unit))
          setSettingsApplySnowSensorTriggerButton({
            essSnowSensor,
            isF: unitsState,
          });
          setResetAllSettingsButtons();
        }
        setMessageBox(true);
        handleSnowSensorMessageBox();

        break;
      default:
        return;
    }
  };

  const contentMessage=()=>{
    return settings.unit==='f'?'Temperature just between 250°F - 1830°F':'Temperature just between 121°C - 999°C'
  }

  // 3 buttons(edit, cancel and apply). Dispatch the input fields for tgs tes or tgs only into tgs tes slice when apply button is clicked

  const handleTgsTesButtons = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        setSettingsEditButton();
        break;
      case 1:
        setSettingsCancelButton();
        setTesSnowSensor(settings?.electrical_snow_threshold || '');
        setTgsSnowSensor(settings?.blower_snow_threshold || '');
        break;
      case 2:
        if(tgsSnowSensor){
          // send tgs snow sensor data
          if(validateMinAndMaxTemp(tgsSnowSensor)){
            setIsTempWarning(true)
            setTempWarningContent({
              title: ['tgs temp value error'],
              content: contentMessage(),
            });
            setTgsSnowSensor(settings?.blower_snow_threshold || '');
            return;
          }
          updateSnowSensorSettingstempreture(settings,"blower_snow_threshold","electrical_snow_threshold",tempValue(tgsSnowSensor,settings?.unit),tempValue(tesSnowSensor,settings?.unit))
        }
        if(tesSnowSensor){
          // send tes snow sensor data
          if(validateMinAndMaxTemp(tesSnowSensor)){
            setIsTempWarning(true)
            setTempWarningContent({
              title: ['tes temp value error'],
              content: contentMessage(),
            });
            setTesSnowSensor(settings?.electrical_snow_threshold || '');
            return;
          }
          updateSnowSensorSettingstempreture(settings,"blower_snow_threshold","electrical_snow_threshold",tempValue(tgsSnowSensor,settings?.unit),tempValue(tesSnowSensor,settings?.unit))
        }
        if(tgsSnowSensor||tesSnowSensor){
          setResetAllSettingsButtons();
          setTgsSettingsApplySnowSensorButton({
            tgsSnowSensor,
            tesSnowSensor,
            isF: unitsState,
          });
        setMessageBox(true);
        handleSnowSensorMessageBox();
        }

        break;
      default:
        return;
    }
  };

  const handleTgsButtons = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        setSettingsEditButton();
        break;
      case 1:
        setSettingsCancelButton();
        setTesSnowSensor('');
        setTgsSnowSensor('');
        break;
      case 2:
        if (typeof tgsSnowSensor === 'number') {
          setResetAllSettingsButtons();
          setTgsSettingsApplySnowSensorButton({
            tgsSnowSensor,
            isF: unitsState,
          });
        }
        setMessageBox(true);
        handleSnowSensorMessageBox();

        break;
      default:
        return;
    }
  };

  const handleSnowSensorMessageBox = () => {
    if (
      typeof tgsSnowSensor === 'number' &&
      typeof tesSnowSensor === 'number'
    ) {
      setMessageBoxContent({
        title: ['snow sensor trigger'],
        content: 'settings have been applied',
      });
    } else if (
      typeof essSnowSensor === 'number' ||
      typeof tgsSnowSensor === 'number'
    ) {
      setMessageBoxContent({
        title: ['snow sensor trigger'],
        content: 'settings have been applied',
      });
    } else {
      setMessageBoxContent({
        title: ['input fields incomplete'],
        content: 'please field all the input fields',
      });
    }
    return;
  };

  const handleCloseMessageBox = () => {
    setMessageBox(false);
    return;
  };
  const handleCloseTempWarning = () => {
    setIsTempWarning(false);
    return;
  };
  const tgsTes = useMemo(()=>{
    return essSwitch?['ess-snow sensor trigger']:['tgs-snow sensor trigger', 'tes-snow sensor trigger']
  },[essSwitch]);
  return (
    <Wrapper2>
      <Wrapper essSwitch={essSwitch}>
        {essSwitch && !settingsEditButton && essSnowSensor !== null && (
          <InvisibleDiv>
            <InvisibleDivForEditButton height={'100px'} />
          </InvisibleDiv>
        )}
        {!essSwitch &&
          !settingsEditButton &&
          tgsSnowSensor !== null &&
          tesSnowSensor !== null && (
            <InvisibleDiv>
              <InvisibleDivForEditButton height={'100px'} />
            </InvisibleDiv>
          )}
        {!essSwitch &&
          !tesSwitch &&
          !settingsEditButton &&
          tgsSnowSensor !== null && (
            <InvisibleDiv>
              <InvisibleDivForEditButton height={'100px'} />
            </InvisibleDiv>
          )}

        <Wrapper1 essSwitch={essSwitch}>
          <SnowFactor
            tgsTes={tgsTes}
            ess={ess}
            temp={temp}
            tesSwitch={tesSwitch}
            essSwitch={essSwitch}
            editState={editState}
            options={options}
            setOptions={setOptions}
            metricImperialToggle={unitsState}
            handleInputs={handleInputs}
          />
        </Wrapper1>
        {messageBox && (
          <SettingAppliedMessage
            title={'change options'}
            message={messageBoxContent}
            onClose={handleCloseMessageBox}
          />
        )}
        {isTempWarning && (
          <SettingAppliedMessage
            title={'Tempreture Warning'}
            message={tempWarningContent}
            onClose={handleCloseTempWarning}
          />
        )}
      </Wrapper>
      <WrapperButtons position={essSwitch}>
        <EditCancelApplyButtons
          handleClick={
            essSwitch
              ? handleEssButtons
              : tesSwitch
              ? handleTgsTesButtons
              : handleTgsButtons
          }
          buttonsName={buttonsName}
        />
      </WrapperButtons>
    </Wrapper2>
  );
}

export default ContainerOfSnowSensor;

const InvisibleDiv = styled.div`
  z-index: 1000000;
`;

const Wrapper2 = styled.div`
  width: 596px;
  height: 383px;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const Wrapper = styled.div`
  width: 596px;
  height: 106px;
  margin-right: 3px;
  ${flexboxCenter};
  ${({ essSwitch }) =>
    essSwitch
      ? css`
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        `
      : css`
          justify-content: flex-start;
        `};
  flex-direction: column;
  margin-left: -3px;
`;

const Wrapper1 = styled.div`
  width: 596px;
  height: 106px;
  padding-top: 4px;
  padding-bottom: 4px;

  ${({ essSwitch }) => essSwitch && 'width: auto'};
  ${({ essSwitch }) => essSwitch && 'padding-left: 6px'};
  ${({ essSwitch }) => essSwitch && 'padding-right: 6px'};

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 18px;
  opacity: 1;
  ${flexboxCenter};
  justify-content: space-around;
`;

const WrapperButtons = styled.div`
  width: auto;
  height: auto;

  display: flex;
  ${({ position }) =>
    position
      ? css`
          justify-content: flex-start;
          margin-left: 1rem;
        `
      : css`
          justify-content: flex-end;
        `};

  align-items: center;
`;
