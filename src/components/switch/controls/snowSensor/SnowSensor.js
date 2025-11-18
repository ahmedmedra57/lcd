import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  convertCelsiusToFahrenheit,
  isAnotherSystemRunning,
  updateDeviceInfo,
} from '../../../../helpers/helpers';
import { useTgsSwitchStore, useUserStore } from '../../../../store/zustand';
import {
  activeHole,
  activeLayer1,
  disableLayer,
  flexboxCenter,
  readyHole,
  readyLayer,
} from '../../../../styles/commonStyles';
import InputTempMessage from '../../../userMessages/InputTempMessage';
import { useNavigate } from 'react-router-dom';

const SnowSensor = ({ deviceInfo, isDisabled, setDisplayModeFaultMessageBox }) => {
  const navigate = useNavigate();
  const settings = useTgsSwitchStore((state) => state.settings);
  const currentRunSystem = useTgsSwitchStore((state) => state.currentRunSystem);
  const EBP = useTgsSwitchStore((state) => state.EBP);
  const electricalInfo = useTgsSwitchStore((state) => state.electricalInfo);
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const activateTgsConflictMessage = useTgsSwitchStore((state) => state.activateTgsConflictMessage);
  const setDevicesConflicts = useTgsSwitchStore((state) => state.setDevicesConflicts);

  const isEssSwitch = useUserStore((state) => state.isEssSwitch);
  const isGas = useUserStore((state) => state.isGas);
  const [displayMessageBox, setDisplayMessageBox] = useState(false);
  const [displayMessageBoxConfirm, setDisplayMessageBoxConfirm] = useState(false);
  const [message, setMessage] = useState(['']);

  const IMG_SRC = '/static/images/snow-Sensor-Program-Logo.svg';

  const isReady = useMemo(() => {
    return deviceInfo?.snow_enabled === 1;
  }, [deviceInfo?.snow_enabled]);

  const isActive = useMemo(() => {
    return deviceInfo?.snow_trigger === 1 && deviceInfo?.snow_enabled === 1 && deviceInfo?.mode === "SNOW";
  }, [deviceInfo?.snow_trigger, deviceInfo?.snow_enabled, deviceInfo?.mode]);

  const handleSnowSensor = () => {
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
    if (isAnotherSystemRunning(isGas ? 'electrical' : 'gas', currentRunSystem)) {
      activateTgsConflictMessage();
      setDevicesConflicts({
        currentSwitch: isGas ? 'tes-typhoon electric system' : 'tgs-typhoon gas system',
        DesiredSwitch: isGas ? 'tgs-typhoon gas system' : 'tes-typhoon electrical system',
        systemTarget: isGas ? 'gas' : 'electrical',
        commandTarget: 'snow_enabled',
      });
      return;
    }
    const newValue = (isReady === true) ? 0 : 1;
    updateDeviceInfo('snow_enabled', newValue, isGas ? 'gas_command' : 'electrical_command');
  };

  const defaultTemp = useMemo(() => {
    const temp = isGas ? settings?.blower_snow_threshold : settings?.electrical_snow_threshold;
    return settings?.unit === 'f'
      ? Math.floor(convertCelsiusToFahrenheit(temp))
      : Math.floor(temp);
  }, [settings?.electrical_snow_threshold, settings?.blower_snow_threshold, settings?.unit, isGas]);

  return (
    <Wrapper>
      <ContentWrapper
        isReady={isReady}
        isActivated={isReady && isActive}
        isDisabled={isDisabled}
        onClick={handleSnowSensor}
      >
        <SectionTitle>
          <Title>snow sensor</Title>
          <Title option={true}>
            default temp. {defaultTemp} {`°${settings?.unit}`}
          </Title>
        </SectionTitle>

        <ButtonWrapper isReady={isReady} isActivated={isReady && isActive} disabled={isDisabled}>
          <ButtonHole isReady={isReady} isActivated={isReady && isActive} disabled={isDisabled}>
            <ButtonTop isReady={isReady} isActivated={isReady && isActive} disabled={isDisabled}>
              <ButtonImage src={IMG_SRC} />
            </ButtonTop>
          </ButtonHole>
        </ButtonWrapper>
      </ContentWrapper>
      {displayMessageBox && (
        <InputTempMessage
          onClose={() => setDisplayMessageBox(false)}
          title={'snow sensor'}
          messages={message}
        />
      )}
      {displayMessageBoxConfirm && (
        <InputTempMessage
          onClose={() => setDisplayMessageBoxConfirm(false)}
          messages={message}
          title={'snow sensor'}
          onConfirm={() => navigate('/')}
        />
      )}
    </Wrapper>
  );
};

export default SnowSensor;

const Wrapper = styled.div`
  width: 182px;
  height: 40px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 44px;

  ${flexboxCenter}
`;

const ContentWrapper = styled.button`
  width: 180px;
  height: 38px;
  border-radius: 43px;
  font-weight: 600;
  background: ${props => props.theme.layout.switch_controls.bg};
  box-shadow: ${props => props.theme.layout.switch_controls.shadow};
  border: 0.5px solid ${props => props.theme.button.primary.border};

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 2px 0 11px;

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

const SectionTitle = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.span`
  width: 100%;
  font-size: 13px;
  letter-spacing: 1.3px;
  text-align: center;

  ${(p) =>
    p.option &&
    css`
      font-size: 8px;
      letter-spacing: 0.8px;
    `}
`;

const ButtonWrapper = styled.div`
  border-radius: 50%;
  ${flexboxCenter}

  width: 32px;
  height: 32px;

  background: ${props => props.theme.button.primary.bg};
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
  ${(p) => p.disabled && css`${disableLayer}`}
`;

const ButtonHole = styled.div`
  border-radius: 50%;
  ${flexboxCenter}

  width: 30px;
  height: 30px;

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
  border-radius: 50%;
  ${flexboxCenter}

  width: 24px;
  height: 24px;

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
