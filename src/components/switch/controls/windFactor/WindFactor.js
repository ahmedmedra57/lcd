import { useTgsSwitchStore } from '../../../../store/zustand';
import {
  flexboxCenter,
  activeLayer1,
  activeHole,
  readyLayer,
  readyHole,
  disableLayer,
} from '../../../../styles/commonStyles';
import styled, { css } from 'styled-components';
import { isAnotherSystemRunning, updateDeviceInfo } from '../../../../helpers/helpers';
import { useMemo, useState } from 'react';
import { useUserStore } from '../../../../store/zustand';
import InputTempMessage from '../../../userMessages/InputTempMessage';
import { useNavigate } from 'react-router-dom';

const WindFactor = ({ deviceInfo, isDisabled, setDisplayModeFaultMessageBox }) => {
  const navigate = useNavigate();
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

  const isReady = useMemo(() => {
    return deviceInfo?.wind_enabled === 1;
  }, [deviceInfo?.wind_enabled]);

  const isActive = useMemo(() => {
    return deviceInfo?.wind_trigger === 1 && deviceInfo?.wind_enabled === 1 && deviceInfo?.mode === "WIND";
  }, [deviceInfo?.wind_trigger, deviceInfo?.wind_enabled, deviceInfo?.mode]);

  const handleWindFactor = () => {
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
        commandTarget: 'wind',
      });
      return;
    }
    const newValue = (isReady === true) ? 0 : 1;
    updateDeviceInfo('wind', newValue, isGas ? 'gas_command' : 'electrical_command');
  };

  return (
    <Wrapper>
      <ContentWrapper
        isReady={isReady}
        isActivated={isActive}
        isDisabled={isDisabled}
        onClick={handleWindFactor}
      >
        <Title>wind factor</Title>
        <ButtonWrapper isReady={isReady} isActivated={isActive} disabled={isDisabled}>
         <ButtonHole isReady={isReady} isActivated={isActive} disabled={isDisabled}>
            <ButtonTop isReady={isReady} isActivated={isActive} disabled={isDisabled}>
              <Img src={'/static/images/wind-Factor-Program-Logo.svg'} />
            </ButtonTop> 
          </ButtonHole>
        </ButtonWrapper>
      </ContentWrapper>
      {displayMessageBox && (
        <InputTempMessage
          onClose={() => setDisplayMessageBox(false)}
          title='wind factor'
          messages={message}
        />
      )}
      {displayMessageBoxConfirm && (
        <InputTempMessage
          onClose={() => setDisplayMessageBoxConfirm(false)}
          messages={message}
          title='wind factor'
          onConfirm={() => navigate('/')}
        />
      )}
    </Wrapper>
  );
};

export default WindFactor;

const Wrapper = styled.div`
  width: 182px;
  height: 40px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border-radius: 44px;

  ${flexboxCenter}
`;

const ContentWrapper = styled.button`
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

  padding: 0 2px 0 14px;

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

const ButtonWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;

  ${flexboxCenter}
  background: ${props => props.theme.layout.card.bg} 0% 0%;
  box-shadow: ${props => props.theme.layout.main.shadow};

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

const Title = styled.span`
  font-size: 13px;
  letter-spacing: 1.4px;
  text-align: center;
`;
const Img = styled.img`
  height: 90%;
`;
