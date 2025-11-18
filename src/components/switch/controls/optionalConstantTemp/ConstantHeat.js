import { useTgsSwitchStore, useEssSwitchStore, useTgsSettingsStore, useSettingsStore, useUserStore } from '../../../../store/zustand';

import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  activeLayer1,
  activeHole,
  readyLayer,
  readyHole,
  disableLayer,
} from '../../../../styles/commonStyles';
import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import InputKeyPad from '../../../keyboard/InputKeyPad';
import InputTempMessage from '../../../userMessages/InputTempMessage';
import {
  convertCelsiusToFahrenheit,
  convertFahrenheitToCelsius,
  isAnotherSystemRunning,
  updateDeviceInfo,
} from '../../../../helpers/helpers';
import { useNavigate } from 'react-router-dom';

const ConstantHeat = ({ isDisabled, setDisplayModeFaultMessageBox }) => {
  // Global states
  const thermocouple = useTgsSettingsStore((state) => state.thermocouple);
  const unitsMeasurement = useSettingsStore((state) => state.buttonsOfSettings.unitsMeasurement);
  const isTgsSwitchActivated = useTgsSwitchStore((state) => state.isTgsSwitchActivated);
  const settings = useTgsSwitchStore((state) => state.settings);
  const electricalInfo = useTgsSwitchStore((state) => state.electricalInfo);
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const currentRunSystem = useTgsSwitchStore((state) => state.currentRunSystem);
  const EBP = useTgsSwitchStore((state) => state.EBP);
  const activateTgsConflictMessage = useTgsSwitchStore((state) => state.activateTgsConflictMessage);
  const setDevicesConflicts = useTgsSwitchStore((state) => state.setDevicesConflicts);
  const isEssSwitch = useUserStore((state) => state.isEssSwitch);
  const isGas = useUserStore((state) => state.isGas);
  const constantTemp = useEssSwitchStore((state) => state.constantTemp);
  const activateEsConflictMessage = useEssSwitchStore((state) => state.activateEsConflictMessage);

  // Local states
  const navigate = useNavigate();
  const [isThermocoupleTrue, setIsThermocoupleTrue] = useState(true);
  const [displayKeypad, setDisplayKeypad] = useState(false);
  const [tempInput, setTempInput] = useState('');
  const [displayMessageBox, setDisplayMessageBox] = useState(false);
  const [displayMessageBoxConfirm, setDisplayMessageBoxConfirm] = useState(false);
  const [message, setMessage] = useState([
    'in order to finalize your program, ',
    'please input your temperature',
    '(the minimum temperature is 25°C - 77°F)',
    '(the maximum temperature is 120°C - 248°F)',
  ]);
  const [isActivated, setIsActivated] = useState(electricalInfo?.on_constant);

  useEffect(() => {
    if (electricalInfo?.on_constant === 1) {
      setIsActivated(true);
    } else {
      setIsActivated(false);
    }
  }, [electricalInfo?.on_constant]);

  const isReady = useMemo(() => {
    return isActivated;
  }, [isActivated]);

  const isActive = useMemo(() => {
    return isActivated && electricalInfo?.mode === 'CONSTANT';
  }, [isActivated, electricalInfo?.mode]);

  useEffect(() => {
    thermocouple ? setIsThermocoupleTrue(true) : setIsThermocoupleTrue(false);
  }, [thermocouple]);

  useEffect(() => {
    if (settings?.unit === 'f') {
      setTempInput(`${Math.floor(convertCelsiusToFahrenheit(electricalInfo?.constant_temp)) || 0} °F`);
    } else {
      setTempInput(`${Math.floor(electricalInfo?.constant_temp) || 0} °C`);
    }
  }, [electricalInfo?.constant_temp, settings?.unit]);

  const isThermocouple = useMemo(() => {
    return settings?.tc_mode === 1 ? true : false;
  }, [settings]);

  const handleSetTempInput = (temp) => {
    if (unitsMeasurement) {
      setTempInput(`${temp} °F`);
    } else {
      setTempInput(`${temp} °C`);
    }
  };

  const handleOnClick = () => {
    if (isDisabled && setDisplayModeFaultMessageBox) {
      setDisplayModeFaultMessageBox(true);
      return;
    }
    if (EBP && (electricalInfo?.EBP === 0 || electricalInfo?.EBP === null)) {
      setDisplayMessageBox(true);
      setMessage([
        `ATS SIGNAL IS TRIGGERED ON ${isEssSwitch? 'ESS' : 'TES'}, `,
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
    const temp = Number(tempInput.slice(0, -2));
    if (temp === 0) {
      setDisplayKeypad(true);
      return;
    }

    if (isActivated) {
      updateDeviceInfo('on_constant', 0, 'electrical_command');
      setIsActivated(false);
    } else {
      if (isAnotherSystemRunning('gas', currentRunSystem)) {
        activateTgsConflictMessage();
        setDevicesConflicts({
          currentSwitch: 'tgs-typhoon gas system',
          DesiredSwitch: 'tes-typhoon electrical system',
          systemTarget: 'electrical',
          commandTarget: 'on_constant',
          extraData: convertFahrenheitToCelsius(temp, settings?.unit),
        });
        return;
      }
      updateDeviceInfo('on_constant', 1, 'electrical_command');
      setIsActivated(true);
    }
  };

  const handleVirtualKeyboardInput = () => {
    const temp = Number(tempInput.slice(0, -2));
    if (EBP && (electricalInfo?.EBP === 0 || electricalInfo?.EBP === null)) {
      setDisplayMessageBox(true);
      setMessage([
        `ATS SIGNAL IS TRIGGERED ON ${isEssSwitch? 'ESS' : 'TES'}, `,
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
    if (isAnotherSystemRunning('gas', currentRunSystem)) {
      activateTgsConflictMessage();
      setDevicesConflicts({
        currentSwitch: 'tgs-typhoon gas system',
        DesiredSwitch: 'tes-typhoon electrical system',
        systemTarget: 'electrical',
        commandTarget: 'on_constant',
        extraData: convertFahrenheitToCelsius(temp, settings?.unit),
      });
      return;
    }
    if (!isThermocoupleTrue) {
      if (unitsMeasurement) {
        if (temp >= 77 && temp < 249) {
          handleDispatch(temp);
          handleSetTempInput(temp);
          updateDeviceInfo(
            'constant_temp',
            convertFahrenheitToCelsius(temp, settings?.unit),
            'electrical_command'
          );
          updateDeviceInfo('on_constant', 1, 'electrical_command');
          setIsActivated(true);
        } else {
          // message
          handleMessageBox(2);
          handleSetTempInput(electricalInfo?.constant_temp 
            ? Math.floor(convertCelsiusToFahrenheit(electricalInfo?.constant_temp))
            : 0
          );
          setIsActivated(electricalInfo?.on_constant === 1 ? true : false);
        }
      } else {
        if (temp >= 25 && temp < 121) {
          handleDispatch(temp);
          handleSetTempInput(temp);
          updateDeviceInfo(
            'constant_temp',
            convertFahrenheitToCelsius(temp, settings?.unit),
            'electrical_command'
          );
          updateDeviceInfo('on_constant', 1, 'electrical_command');
          setIsActivated(true);
        } else {
          // message
          handleMessageBox(2);
          handleSetTempInput(electricalInfo?.constant_temp 
            ? Math.floor(electricalInfo?.constant_temp) 
            : 0
          );
          setIsActivated(electricalInfo?.on_constant === 1 ? true : false);
        }
      }
    } else {
      handleDispatch(0);
      updateDeviceInfo('on_constant', 0, 'electrical_command');
      setIsActivated(false);
    }
  };

  // message box handler
  const handleMessageBox = (option) => {
    // 1 === conflict message
    // 2 === check input
    // 3 === instant heat working
    if (option === 1) {
      activateEsConflictMessage();
    } else if (option === 2) {
      setDisplayMessageBox(true);
    } else {
    }
  };

  // dispatch handler
  const handleDispatch = (temp) => {
    if (!isTgsSwitchActivated) {
      constantTemp({ temp, unitsMeasurement });
    } else {
      handleMessageBox(1);
    }
  };

  return (
    <Wrapper>
      <ContentWrapper isReady={isReady} isActivated={isActive} isDisabled={!isThermocouple || isDisabled}>
        <TitleWrapperButton onClick={handleOnClick}>
          <Title>
            optional<br></br>constant<br></br>temp.
          </Title>
        </TitleWrapperButton>

        <InputWrapper onClick={() => setDisplayKeypad(!isDisabled)}>
          <InputDegree
            type='text'
            placeholder={unitsMeasurement ? '0 °F' : '0 °C'}
            value={tempInput}
            isReady={isReady}
            isActivated={isActive}
            onChange={(e) =>
              setTempInput(
                `${e.target.value} ${unitsMeasurement ? '°F' : '°C'}`
              )
            }
            disabled={!isThermocouple || isDisabled}
          />
        </InputWrapper>

        <ButtonWrapper isReady={isReady} isActivated={isActive} disabled={isDisabled} onClick={handleOnClick}>
          <ButtonHole isReady={isReady} isActivated={isActive} disabled={!isThermocouple || isDisabled}>
            <ButtonTop isReady={isReady} isActivated={isActive} disabled={!isThermocouple || isDisabled}>
              <ButtonImage
                src={'/static/images/optional-Constant-Temperature-Logo.svg'}
              />
            </ButtonTop>
          </ButtonHole>
        </ButtonWrapper>
      </ContentWrapper>

      {displayKeypad && isThermocouple && (
        <KeyPadWrapper onClick={() => setDisplayKeypad(false)}>
          <InputKeyPad
            handleOnSubmit={handleVirtualKeyboardInput}
            closeKeyPad={() => setDisplayKeypad(false)}
            setMainInput={(input) =>
              setTempInput(`${input} ${unitsMeasurement ? '°F' : '°C'}`)
            }
          />
        </KeyPadWrapper>
      )}
      {displayMessageBox && (
        <InputTempMessage
          onClose={() => setDisplayMessageBox(false)}
          title={'optional constant temp.'}
          messages={message}
        />
      )}
      {displayMessageBoxConfirm && (
        <InputTempMessage
          onClose={() => setDisplayMessageBoxConfirm(false)}
          messages={message}
          title={'optional constant temp.'}
          onConfirm={() => navigate('/')}
        />
      )}
    </Wrapper>
  );
};

export default ConstantHeat;

const Wrapper = styled.div`
  width: 182px;
  height: 40px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 44px;

  ${flexboxCenter}
`;

const ContentWrapper = styled.div`
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

  padding: 0 2px 0 10px;

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

const InputWrapper = styled.div`
  height: 100%;
  ${flexboxCenter}
`;
const InputDegree = styled.input`
  width: 59px;
  height: 21px;
  font-size: 14px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border-radius: 26px;

  ::placeholder {
    ${(p) => p.disabled && css`${disableLayer}`}

    text-align: center;
  }

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

  &::placeholder {
    color: ${props => props.theme.label.secondary};
  }
`;
const TitleWrapperButton = styled.button`
  ${flexboxCenter}
`;
const Title = styled.span`
  font-size: 10px;
  text-align: left;
  line-height: 98%;
`;

const ButtonWrapper = styled.button`
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

  ${flexboxCenter}

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;

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
const ButtonImage = styled.img`
  height: 90%;
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
