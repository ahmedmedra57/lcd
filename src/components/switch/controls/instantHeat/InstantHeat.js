import { useRef, useState, useEffect, useMemo } from 'react';
import {
  activeHole,
  activeLayer1,
  disableLayer,
  flexboxCenter,
  layer1,
  readyHole,
  readyLayer,
} from '../../../../styles/commonStyles';
import InputKeyPad from '../../../keyboard/InputKeyPad';
import { useEssSwitchStore, useTgsSwitchStore, useSettingsStore, useTgsSettingsStore, useUserStore } from '../../../../store/zustand';
import {
  convertCelsiusToFahrenheit,
  convertFahrenheitToCelsius,
  isAnotherSystemRunning,
  updateDeviceInfo,
} from '../../../../helpers/helpers';
import styled, { css } from 'styled-components';
import InputTempMessage from '../../../userMessages/InputTempMessage';
import { useNavigate } from 'react-router-dom';

const InstantHeat = ({ deviceInfo, isDisabled, setDisplayModeFaultMessageBox }) => {
  // Global
  const settings = useTgsSwitchStore((state) => state.settings);
  const currentRunSystem = useTgsSwitchStore((state) => state.currentRunSystem);
  const EBP = useTgsSwitchStore((state) => state.EBP);
  const electricalInfo = useTgsSwitchStore((state) => state.electricalInfo);
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const activateTgsConflictMessage = useTgsSwitchStore((state) => state.activateTgsConflictMessage);
  const setDevicesConflicts = useTgsSwitchStore((state) => state.setDevicesConflicts);
  const unitsMeasurement = useSettingsStore((state) => state.unitsMeasurement);
  const isF = useEssSwitchStore((state) => state.instantHeat.isF);
  const instantHeat = useEssSwitchStore((state) => state.instantHeat);
  const thermocouple = useTgsSettingsStore((state) => state.thermocouple);
  const isEssSwitch = useUserStore((state) => state.isEssSwitch);
  const isGas = useUserStore((state) => state.isGas);
  const navigate = useNavigate();

  // local
  const [openKeyPad, setOpenKeyPad] = useState(false);
  const [displayMessageBox, setDisplayMessageBox] = useState(false);
  const [displayMessageBoxConfirm, setDisplayMessageBoxConfirm] = useState(false);
  const [message, setMessage] = useState([
    'in order to finalize  your heating schedule, ',
    'please input your temperature',
    '(the minimum temperature is 121°C - 250°F)',
    '( the maximum temperature is 999°C - 1830°F )',
  ]);
  const inputRef = useRef();
  const [isActivated, setIsActivated] = useState(deviceInfo?.on_switch);

  useEffect(() => {
    if (deviceInfo?.on_switch === 1) {
      setIsActivated(true);
    } else {
      setIsActivated(false);
    }
  }, [deviceInfo?.on_switch]);

  const isReady = useMemo(() => {
    return isActivated;
  }, [isActivated]);

  const isActive = useMemo(() => {
    return isActivated && deviceInfo?.mode === 'SWITCH';
  }, [isActivated, deviceInfo?.mode]);

  useEffect(() => {
    setOpenKeyPad(false);
    if (thermocouple) {
      inputRef.current.value = '';
    }
  }, [thermocouple]);

  const isThermocouple = useMemo(() => {
    return settings?.tc_mode === 1 ? true : false;
  }, [settings?.tc_mode]);

  const newTempValue = useMemo(() => {
    return settings?.unit === 'f'
      ? Math.floor(convertCelsiusToFahrenheit(deviceInfo?.instant_temp))
      : Math.floor(deviceInfo?.instant_temp);
  }, [deviceInfo?.instant_temp, settings?.unit]);

  useEffect(() => {
    if (deviceInfo?.instant_temp > 0) {
      if (settings?.unit) {
        inputRef.current.value = `${newTempValue}°${settings?.unit}`;
      } else {
        if (isF) {
          // saved unit is F but current unit is C -> formula c = (f-32) * 5/9
          inputRef.current.value = `${Math.floor(Math.floor(
            convertCelsiusToFahrenheit(deviceInfo?.instant_temp)
          ))}°${settings?.unit}`;
        } else {
          // saved unit is C but current unit is F -> formula f = c * 1.8 + 32
          inputRef.current.value = `${Math.floor(newTempValue)}°${
            settings?.unit
          }`;
        }
      }
    }
  }, [deviceInfo?.instant_temp, settings?.unit, isF, newTempValue]);

  const handleKeypadClosed = () => {
    setOpenKeyPad(false);
  };
  const handleKeypadOpen = () => {
    setOpenKeyPad(true);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (isDisabled && setDisplayModeFaultMessageBox) {
      setDisplayModeFaultMessageBox(true);
      return;
    }
    if (EBP && ((isGas && (gasInfo?.EBP === 0 || gasInfo?.EBP === null)) || (!isGas && (electricalInfo?.EBP === 0 || electricalInfo?.EBP === null)))) {
      setDisplayMessageBox(true);
      setMessage([
        `ATS SIGNAL IS TRIGGERED ON ${isEssSwitch? 'ESS' : isGas ? 'TGS' : 'TES'}, `,
        'SYSTEM IS NOW ON GENERATOR BACKUP POWER, ',
        `${isEssSwitch? 'ESS ELECTRIC HEATING ELEMENTS' 
          : isGas ? 'TGS GAZ HEATING' 
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
          'switch to typhoon gas system'
        ]);
      }
      return;
    }
    const temp = Number(inputRef.current.value.slice(0, -2));
    if (temp === 0) {
      handleKeypadOpen();
      return;
    }

    if (isActivated) {
      updateDeviceInfo('on_switch', 0, isGas ? 'gas_command' : 'electrical_command');
      setIsActivated(false);
    } else {
      if (isAnotherSystemRunning(isGas ? 'electrical' : 'gas', currentRunSystem)) {
        activateTgsConflictMessage();
        setDevicesConflicts({
          currentSwitch: isGas ? 'tes-typhoon electric system' : 'tgs-typhoon gas system',
          DesiredSwitch: isGas ? 'tgs-typhoon gas system' : 'tes-typhoon electrical system',
          systemTarget: isGas ? 'gas' : 'electrical',
          commandTarget: 'on_switch',
          extraData: convertFahrenheitToCelsius(temp, settings?.unit),
        });
        return;
      }
      updateDeviceInfo('on_switch', 1, isGas ? 'gas_command' : 'electrical_command');
      setIsActivated(true);
    }
  };

  // Virtual keyboard input handler
  const handleVirtualKeyboardInput = (t) => {
    const temp = Number(inputRef.current.value.slice(0, -2));
    if (EBP && ((isGas && (gasInfo?.EBP === 0 || gasInfo?.EBP === null)) || (!isGas && (electricalInfo?.EBP === 0 || electricalInfo?.EBP === null)))) {
      setDisplayMessageBox(true);
      setMessage([
        `ATS SIGNAL IS TRIGGERED ON ${isEssSwitch? 'ESS' : isGas ? 'TGS' : 'TES'}, `,
        'SYSTEM IS NOW ON GENERATOR BACKUP POWER, ',
        `${isEssSwitch? 'ESS ELECTRIC HEATING ELEMENTS' 
          : isGas ? 'TGS GAZ HEATING' 
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
          'switch to typhoon gas system'
        ]);
      }
      return;
    }
    if (thermocouple) {
      // working with maximum heat!
      instantHeat(newTempValue || 0);
      return;
    }
    if (isAnotherSystemRunning(isGas ? 'electrical' : 'gas', currentRunSystem)) {
      // show conflict message
      activateTgsConflictMessage();
      setDevicesConflicts({
        currentSwitch: isGas ? 'tes-typhoon electric system' : 'tgs-typhoon gas system',
        DesiredSwitch: isGas ? 'tgs-typhoon gas system' : 'tes-typhoon electrical system',
        systemTarget: isGas ? 'gas' : 'electrical',
        commandTarget: 'on_switch',
        extraData: convertFahrenheitToCelsius(temp, settings?.unit),
      });
      return;
    }
    if (convertFahrenheitToCelsius(temp, settings?.unit) >= 121 && convertFahrenheitToCelsius(temp, settings?.unit) <= 999) {
      updateDeviceInfo(
        'instant_temp',
        convertFahrenheitToCelsius(temp, settings?.unit),
        isGas ? 'gas_command' : 'electrical_command'
      );
      updateDeviceInfo('on_switch', 1, isGas ? 'gas_command' : 'electrical_command');
      setIsActivated(true);
    } else {
      setMessage([
        'in order to finalize  your instant heat, ',
        'please input your temperature',
        '(the minimum temperature is 121°C - 250°F)',
        '(the maximum temperature is 999°C - 1830°F)',
      ]);
      setDisplayMessageBox(true);
      inputRef.current.value = `${deviceInfo?.instant_temp 
        ? settings?.unit === 'f'
          ? Math.floor(convertCelsiusToFahrenheit(deviceInfo?.instant_temp))
          : Math.floor(deviceInfo?.instant_temp)
        : 0}°${
        settings?.unit
      }`;
      setIsActivated(deviceInfo?.on_switch === 1 ? true : false);
    }
  };

  return (
    <Wrapper>
      <ContentWrapper isReady={isReady} isActivated={isActive} disabled={isDisabled}>
        <SectionInput isReady={isReady} isActivated={isActive} disabled={isDisabled}>
          <LabelInnerWrapper isReady={isReady} isActivated={isActive} disabled={isDisabled} onClick={handleOnSubmit}>
            <Label>instant heat</Label>
          </LabelInnerWrapper>
          <InputDegree
            isReady={isReady}
            isActivated={isActive}
            placeholder={unitsMeasurement ? `0 °F` : `0 °C`}
            type='text'
            ref={inputRef}
            // during heater working input disabled!
            disabled={!isThermocouple || isDisabled}
            onClick={handleKeypadOpen}
          />
        </SectionInput>

        <ActiveButton isReady={isReady} isActivated={isActive} disabled={isDisabled} onClick={handleOnSubmit}>
          <ActiveButtonHole isReady={isReady} isActivated={isActive} disabled={isDisabled}>
            <ActiveButtonTop isReady={isReady} isActivated={isActive} disabled={isDisabled}>
              <ButtonImage
                src={'/static/images/instant-Heat-Program -Logo.svg'}
              />
            </ActiveButtonTop>
          </ActiveButtonHole>
        </ActiveButton>
      </ContentWrapper>

      {/* Conditionally display keypad */}
      {openKeyPad && (
        <KeyPadWrapper onClick={() => setOpenKeyPad(false)}>
          <InputKeyPad
            handleOnSubmit={handleVirtualKeyboardInput}
            closeKeyPad={handleKeypadClosed}
            setMainInput={(input) =>
              (inputRef.current.value = `${input}°${settings.unit}`)
            }
          />
        </KeyPadWrapper>
      )}
      {displayMessageBox && (
        <InputTempMessage
          onClose={() => setDisplayMessageBox(false)}
          messages={message}
          title='instant heat'
        />
      )}
      {displayMessageBoxConfirm && (
        <InputTempMessage
          onClose={() => setDisplayMessageBoxConfirm(false)}
          messages={message}
          title='instant heat'
          onConfirm={() => navigate('/')}
        />
      )}
    </Wrapper>
  );
};

export default InstantHeat;

const Wrapper = styled.li`
  ${flexboxCenter}

  width: 182px;
  height: 88px;
  box-shadow: inset 0px 0px 2px var(--unnamed-color-000000);
  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 21px 44px 44px 21px;
`;

const ContentWrapper = styled.form`
  width: 180px;
  height: 86px;
  border-radius: 20px 43px 43px 20px;
  font-weight: 600;

  background: ${props => props.theme.layout.switch_controls.bg};
  box-shadow: ${props => props.theme.layout.switch_controls.shadow};
  border: 0.5px solid ${props => props.theme.button.primary.border};

  ${(p) =>
    p.isReady &&
    css`
      ${readyLayer}
    `}

  ${(props) =>
    props.isActivated &&
    css`
      ${activeLayer1}
    `}
  
  ${(p) => p.disabled && css`${disableLayer}`}

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0px 5px 0px 4px;
`;

const SectionInput = styled.section`
  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 0 4px 0;

  height: 100%;

  cursor: pointer;
`;

const LabelInnerWrapper = styled.div`
  ${flexboxCenter}
`;

const Label = styled.span`
  font-size: 14px;
  text-align: center;
  letter-spacing: 1.4px;
  line-height: 0.9;
  cursor: pointer;
`;

const InputDegree = styled.input`
  height: 31px;
  width: 91px;
  border-radius: 26px;

  box-shadow: 0 0 3px black;
  font-size: 14px;

  ::placeholder {
    ${(p) =>
      p.disabled
        ? css`
            color: ${props => props.theme.label.disabled};
          `
        : css`
            color: ${props => props.theme.label.primary};
          `}

    text-align: center;
  }

  ${layer1}

  ${(p) =>
    p.isReady &&
    css`
      background: ${props => props.theme.layout.sidebar.background};
      box-shadow: ${props => props.theme.layout.card.shadow}
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeHole}
    `}

  ${(p) => p.disabled && css`${disableLayer}`}
`;

const ActiveButton = styled.button`
  width: 77px;
  height: 77px;
  border-radius: 50%;
  background: #1b2b44 0% 0%;
  box-shadow: inset 0px 0px 1px #000000;
  ${flexboxCenter}/* ${(p) =>
    p.isActivated &&
    css`
      ${activeHole}
    `} */
  ${(p) => p.disabled && css`${disableLayer}`}
`;

const ActiveButtonHole = styled.div`
  height: 74px;
  width: 74px;
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

  ${(props) =>
    props.isActivated &&
    css`
      ${activeLayer1}
    `}
  
  ${(p) => p.disabled && css`${disableLayer}`}
`;
const ActiveButtonTop = styled.div`
  height: 63px;
  width: 63px;
  border-radius: 50%;

  ${flexboxCenter}
  ${layer1}

  ${(p) =>
    p.isReady &&
    css`
      background: ${props => props.theme.layout.sidebar.background};
      box-shadow: ${props => props.theme.layout.card.shadow}
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeHole}
    `}

  ${(p) => p.disabled && css`${disableLayer}`}
`;

const ButtonImage = styled.img`
  height: 100%;
  margin-left: 3px;
`;

const KeyPadWrapper = styled.div`
  width: 1024px;
  height: 800px;
  position: fixed;
  top: 0rem;
  left: 0rem;

  z-index: 100;

  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 140px;
  padding-right: 200px;
`;
