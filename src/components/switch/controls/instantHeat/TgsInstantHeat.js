import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTgsSwitchStore, useEssSwitchStore, useSettingsStore, useUserStore } from '../../../../store/zustand';

import {
  activeHole,
  activeLayer1,
  flexboxCenter,
  layer1,
  layer90Deg,
} from '../../../../styles/commonStyles';
import styled, { css } from 'styled-components';

import InputKeyPad from '../../../keyboard/InputKeyPad';
import InputTempMessage from '../../../userMessages/InputTempMessage';
import {
  convertFahrenheitToCelsius,
  isAnotherSystemRunning,
  isTargetAlreadyRunning,
  updateDeviceInfo,
} from '../../../../helpers/helpers';

const TgsInstantHeat = () => {
  const isActivated = useTgsSwitchStore((state) => state.instantHeat.isActivated);
  const isF = useTgsSwitchStore((state) => state.instantHeat.isF);
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const settings = useTgsSwitchStore((state) => state.settings);
  const currentRunSystem = useTgsSwitchStore((state) => state.currentRunSystem);
  const tgsInstantHeat = useTgsSwitchStore((state) => state.tgsInstantHeat);
  const activateTgsConflictMessage = useTgsSwitchStore((state) => state.activateTgsConflictMessage);
  const setDevicesConflicts = useTgsSwitchStore((state) => state.setDevicesConflicts);
  const inputRef = useRef();
  const navigate = useNavigate();

  const unitsMeasurement = useSettingsStore((state) => state.unitsMeasurement);
  const isEsSwitchActivated = useEssSwitchStore((state) => state.isEsSwitchActivated);
  const isEssSwitch = useUserStore((state) => state.isEssSwitch);

  const [openKeyPad, setOpenKeyPad] = useState(false);
  const [activateMessageBox, setActivateMessageBox] = useState(false);
  const [message, setMessage] = useState(null);
  const [isJustTempRequired, setIsJustTempRequired] = useState(false);
  useEffect(() => {
    if (isEssSwitch) {
      navigate("/tes");
    }
  }, [isEssSwitch]);

  useEffect(() => {
    setOpenKeyPad(false);
  }, [isActivated]);

  useEffect(() => {
    if (gasInfo?.threshold_temp > 0) {
      if (settings?.unit) {
        inputRef.current.value = `${Math.floor(gasInfo?.threshold_temp)}°${settings?.unit}`
      } else {
        if (isF) {
          // saved unit is F but current unit is C -> formula c = (f-32) * 5/9
          inputRef.current.value = `${Math.round(
            ((Math.floor(gasInfo?.threshold_temp) - 32) * 5) / 9
          )}°${settings?.unit}`;
        } else {
          // saved unit is C but current unit is F -> formula f = c * 1.8 + 32
          inputRef.current.value = `${Math.round(
            Math.floor(gasInfo?.threshold_temp) * 1.8 + 32
          )}°${settings?.unit}`;
        }
      }
    }
  }, [gasInfo?.threshold_temp, settings?.unit]);

  const handleOnSubmit = (event) => {
    const newGasOnSwitch=gasInfo?.on_switch===1?0:1
    const temp = Number(inputRef.current.value.slice(0, -2));
    event.preventDefault();
    if (isTargetAlreadyRunning("system", gasInfo)) {
      updateDeviceInfo("on_switch", newGasOnSwitch, "gas_command");
      return;
    }
    if (isAnotherSystemRunning('electrical', currentRunSystem)) {
      // Activate Conflict Message Box
      activateTgsConflictMessage();
      setDevicesConflicts({
        currentSwitch: 'tes-typhoon electric system',
        DesiredSwitch: 'tgs-typhoon gas system',
        systemTarget: 'gas',
        commandTarget: 'on_switch',
        extraData: convertFahrenheitToCelsius(temp, settings?.unit),
      });
    } else {
      setOpenKeyPad(false);
      // if (instantHeatTemp === 0 && !instantButtonToggler) {
      if ((unitsMeasurement, unitsMeasurement)) {
        if (temp >= 0) {
          updateDeviceInfo("threshold_temp", convertFahrenheitToCelsius(temp,settings?.unit), "gas_command");
          updateDeviceInfo("on_switch", newGasOnSwitch, "gas_command");
          tgsInstantHeat({ temp, unitsMeasurement });
        } else {
          // input temp less than 77°F
          // message box
          setActivateMessageBox(true);
          setMessage([
            'in order to finalize  your instant heat, ',
            'please input your temperature',
            '( the minimum temperature is 25°C - 77°F )',
            '( the maximum temperature is 999°C - 1830°F )',
          ]);
        }
      } else {
        if (temp >= 0) {
          tgsInstantHeat({ temp, unitsMeasurement });
          inputRef.current.value = `${temp}°C`;
        } else {
          // input temp less than 77°F
          // message box
          setActivateMessageBox(true);
          setMessage([
            'in order to finalize  your instant heat, ',
            'please input your temperature',
            '( the minimum temperature is 25°C - 77°F )',
            '( the maximum temperature is 999°C - 1830°F )',
          ]);
        }
      }
      // } else {
      //   dispatch(tgsInstantHeat({ temp: 0, unitsMeasurement }));
      // }
    }
  };

  // Virtual keyboard input handler
  const handleVirtualKeyboardInput = (input) => {
    const newGasOnSwitch=gasInfo?.on_switch===1?0:1
    if (!isEsSwitchActivated) {
      const temp = Number(inputRef.current.value.slice(0, -2));
      setOpenKeyPad(false);
      // if (instantHeatTemp === 0 && !instantButtonToggler) {
      // if (unitsMeasurement) {
      if (convertFahrenheitToCelsius(temp,settings?.unit)>=25) {
        updateDeviceInfo("threshold_temp", convertFahrenheitToCelsius(temp,settings?.unit), "gas_command");
        if (isJustTempRequired !== true) {
          updateDeviceInfo("on_switch", newGasOnSwitch, "gas_command");
          setIsJustTempRequired(false);
          return;
        }
        tgsInstantHeat({ temp, unitsMeasurement });
        // inputRef.current.value = `${temp}°F`;
      } else {
        // input temp less than 77°F
        // message box
        setActivateMessageBox(true);
        setMessage([
          'in order to finalize  your instant heat, ',
          'please input your temperature',
          '( the minimum temperature is 25°C - 77°F )',
          '( the maximum temperature is 999°C - 1830°F )',
        ]);
        inputRef.current.value=`°${settings?.unit}`
      }
      // } else {
      //   if (temp >= 0) {
      //     dispatch(tgsInstantHeat({ temp, unitsMeasurement }));
      //     inputRef.current.value = `${temp}°C`;
      //   } else {
      //     // input temp less than 77°F
      //     // message box
      //     setActivateMessageBox(true);
      //     setMessage("in order to finalize  your instant heat, ");
      //     inputRef.current.value = ``;
      //   }
      // }
      // } else {
      //   dispatch(tgsInstantHeat({ temp: 0, unitsMeasurement }));
      //   inputRef.current.value = ``;
      // }
    } else {
      // Activate Conflict Message Box
      activateTgsConflictMessage();
    }
  };
  const onInputHandler = async () => {
    const newGasOnSwitch=gasInfo?.on_switch===1?0:1
    const temp = Number(inputRef.current.value.slice(0, -2));
    if (isTargetAlreadyRunning("system", gasInfo)) {
      updateDeviceInfo("on_switch", newGasOnSwitch, "gas_command");
      return;
    }
    if (isAnotherSystemRunning('electrical', currentRunSystem)) {
      // show conflict message
      activateTgsConflictMessage();
      setDevicesConflicts({
        currentSwitch: 'tes-typhoon electric system',
        DesiredSwitch: 'tgs-typhoon gas system',
        systemTarget: 'gas',
        commandTarget: 'on_switch',
        extraData: convertFahrenheitToCelsius(temp, settings?.unit),
      });
    } else {
      if (temp > 0) {
        updateDeviceInfo("on_switch", newGasOnSwitch, "gas_command");
        tgsInstantHeat(0);
      } else {
        inputRef.current.focus();
        setOpenKeyPad(true);
      }
    }
  };

  const handleKeypadClosed = () => {
    setOpenKeyPad(false);
  };

  const handleKeypadOpen = () => {
    setOpenKeyPad(true);
  };

  const unit = unitsMeasurement ? `°F` : `°C`;

  return (
    <Wrapper isActivated={gasInfo?.threshold_temp > 77 && gasInfo?.on_switch}>
      <ContentWrapper
        isActivated={gasInfo?.threshold_temp > 77 && gasInfo?.on_switch}
        onSubmit={handleOnSubmit}
      >
        <SectionInput
          isActivated={gasInfo?.threshold_temp > 77 && gasInfo?.on_switch}
          onClick={onInputHandler}
        >
          <LabelInnerWrapper
            toggler={gasInfo?.threshold_temp > 77 && gasInfo?.on_switch}
            onClick={handleOnSubmit}
          >
            <Label>
              instant <br></br> heat
            </Label>
          </LabelInnerWrapper>

          <InputDegree
            isActivated={gasInfo?.threshold_temp > 0 && gasInfo?.on_switch}
            placeholder={unit}
            type='text'
            ref={inputRef}
            disabled={gasInfo?.threshold_temp > 0 && gasInfo?.on_switch}
            onFocus={() => {
              setIsJustTempRequired(true);
              setOpenKeyPad(true);
            }}
          />
        </SectionInput>

        <ActiveButton
          onClick={handleOnSubmit}
          toggler={gasInfo?.threshold_temp > 77 && gasInfo?.on_switch}
        >
          <ActiveButtonOuterWrapper
            toggler={gasInfo?.threshold_temp > 77 && gasInfo?.on_switch}
          >
            <ActiveButtonInnerWrapper
              toggler={gasInfo?.threshold_temp > 77 && gasInfo?.on_switch}
            >
              <ButtonImage
                src={'/static/images/instant-Heat-Program -Logo.svg'}
              />
            </ActiveButtonInnerWrapper>
          </ActiveButtonOuterWrapper>
        </ActiveButton>
      </ContentWrapper>

      {/* Conditionally display keypad */}
      {openKeyPad && (
        <KeyPadWrapper onClick={() => setOpenKeyPad(false)}>
          <InputKeyPad
            handleOnSubmit={handleVirtualKeyboardInput}
            closeKeyPad={handleKeypadClosed}
            setMainInput={(input) => (inputRef.current.value = `${input}°${settings?.unit}`)}
          />
        </KeyPadWrapper>
      )}
      {activateMessageBox && (
        <InputTempMessage
          onClose={() => setActivateMessageBox(false)}
          messages={message}
          title='instant heat'
        />
      )}
    </Wrapper>
  );
};

export default TgsInstantHeat;

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

  ${(props) =>
    props.isActivated
      ? css`
          ${activeLayer1}
        `
      : css`
          background: ${props => props.theme.layout.main.bgGradientVertical};
          box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
          border: 0.5px solid ${props => props.theme.button.primary.border};
        `}

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
    p.isActivated &&
    css`
      ${activeHole}
    `}
`;

const ActiveButton = styled.button`
  width: 77px;
  height: 77px;
  border-radius: 50%;

  ${flexboxCenter}
  background: #1b2b44 0% 0%;
  box-shadow: inset 0px 0px 1px #000000;

  ${(props) =>
    props.isActivated &&
    css`
      ${activeHole}
    `}
`;

const ActiveButtonOuterWrapper = styled.div`
  height: 74px;
  width: 74px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  background: ${props => props.theme.layout.switch_controls.bg};
  box-shadow: ${props => props.theme.layout.switch_controls.shadow};
  border: 0.5px solid ${props => props.theme.button.primary.border};

  ${(props) =>
    props.toggler &&
    css`
      ${activeLayer1}
    `}
`;
const ActiveButtonInnerWrapper = styled.div`
  height: 63px;
  width: 63px;
  border-radius: 50%;

  ${flexboxCenter}
  ${layer1}

  ${(props) =>
    props.toggler &&
    css`
      ${activeHole}
    `}
`;

const ButtonImage = styled.img`
  height: 100%;
  margin-left: 3px;
`;

const KeyPadWrapper = styled.div`
  width: 1024px;
  height: 600px;
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
