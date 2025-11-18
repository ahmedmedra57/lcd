import { useEffect, useMemo } from 'react';
import { useTgsSwitchStore } from '../../../../store/zustand';

import {
  activeHole,
  activeLayer1,
  readyHole,
  readyLayer,
  flexboxCenter,
} from '../../../../styles/commonStyles';
import styled, { css } from 'styled-components';

import {
  convertCelsiusToFahrenheit,
  isAnotherSystemRunning,
  isTargetAlreadyRunning,
  updateDeviceInfo,
} from '../../../../helpers/helpers';
import { useUserStore } from '../../../../store/zustand';

const TgsSnowSensor = () => {
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const settings = useTgsSwitchStore((state) => state.settings);
  const currentRunSystem = useTgsSwitchStore((state) => state.currentRunSystem);
  const activateTgsConflictMessage = useTgsSwitchStore((state) => state.activateTgsConflictMessage);
  const setDevicesConflicts = useTgsSwitchStore((state) => state.setDevicesConflicts);

  const isGas = useUserStore((state) => state.isGas);

  const IMG_SRC = '/static/images/snow-Sensor-Program-Logo.svg';

  const isReady = useMemo(() => {
    return gasInfo?.snow_enabled === 1;
  }, [gasInfo?.snow_enabled]);

  const isActive = useMemo(() => {
    return gasInfo?.snow_trigger === 1;
  }, [gasInfo?.snow_trigger]);

  const handleSnowSensor = () => {
    const newValue = (isReady === true) ? 0 : 1;
    if (isTargetAlreadyRunning('snowSensor', gasInfo)) {
      updateDeviceInfo('snow_enabled', newValue, 'gas_command');
      return;
    }
    if (isGas) {
      updateDeviceInfo('snow_enabled', newValue, 'gas_command');
      return;
    }
    if (isAnotherSystemRunning('electrical', currentRunSystem)) {
      activateTgsConflictMessage();
      setDevicesConflicts({
        currentSwitch: 'tes-typhoon electric system',
        DesiredSwitch: 'tgs-typhoon gas system',
        systemTarget: 'gas',
        commandTarget: 'snow_enabled',
      });
      return;
    }
    updateDeviceInfo('snow_enabled', newValue, 'gas_command');
  };

  const defaultTemp = useMemo(() => {
    return settings?.unit === 'f'
      ? Math.floor(convertCelsiusToFahrenheit(settings?.blower_snow_threshold))
      : Math.floor(settings?.blower_snow_threshold);
  }, [settings?.blower_snow_threshold, settings?.unit]);
  
  return (
    <Wrapper>
      <ContentWrapper
        isReady={isReady}
        isActivated={isReady && isActive}
        onClick={handleSnowSensor}
      >
        <SectionTitle>
          <Title>snow sensor</Title>
          <Title option={true}>
            default temp. {Math.floor(defaultTemp)} {`°${settings?.unit}`}
          </Title>
        </SectionTitle>

        <ButtonWrapper isReady={isReady} isActivated={isReady && isActive}>
          <ButtonHole isReady={isReady} isActivated={isReady && isActive}>
            <ButtonTop isReady={isReady} isActivated={isReady && isActive}>
              <ButtonImage src={IMG_SRC} />
            </ButtonTop>
          </ButtonHole>
        </ButtonWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default TgsSnowSensor;

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
`;

const ButtonImage = styled.img`
  height: 90%;
`;
