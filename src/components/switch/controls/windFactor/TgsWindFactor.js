import { useTgsSwitchStore } from '../../../../store/zustand';
import { useEssSwitchStore } from '../../../../store/zustand';

import {
  flexboxCenter,
  activeLayer1,
  readyLayer,
  readyHole,
  activeHole,
} from '../../../../styles/commonStyles';
import styled, { css } from 'styled-components';
import { updateDeviceInfo } from '../../../../helpers/helpers';
import { useMemo } from 'react';

const TgsWindFactor = () => {
  // off || ready || activated
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const tgsWindFactor = useTgsSwitchStore((state) => state.tgsWindFactor);
  const activateTgsConflictMessage = useTgsSwitchStore((state) => state.activateTgsConflictMessage);

  const isEsSwitchActivated = useEssSwitchStore((state) => state.isEsSwitchActivated);

  const isReady = useMemo(() => {
    return gasInfo?.wind_enabled === 1
  }, [gasInfo?.wind_enabled]);

  const isActive = useMemo(() => {
    return gasInfo?.wind_trigger === 1 && gasInfo?.wind_enabled === 1 && gasInfo?.mode === "WIND"
  }, [gasInfo?.wind_trigger, gasInfo?.wind_enabled, gasInfo?.mode]);

  const handleWindFactor = () => {
    if (!isEsSwitchActivated) {
      tgsWindFactor();
      if (isReady === true) {
        updateDeviceInfo('wind', 0, 'gas_command');
      } else {
        updateDeviceInfo('wind', 1, 'gas_command');
      }
    } else {
      // Activate Conflict Message Box
      activateTgsConflictMessage();
    }
  };

  return (
    <Wrapper>
      <ContentWrapper
        isReady={isReady}
        isActivated={isReady && isActive}
        onClick={handleWindFactor}
      >
        <Title>wind factor</Title>

        <ButtonWrapper isReady={isReady} isActivated={isReady && isActive}>
          <ButtonHole isReady={isReady} isActivated={isReady && isActive}>
            <ButtonTop isReady={isReady} isActivated={isReady && isActive}>
              <Img src={'/static/images/wind-Factor-Program-Logo.svg'} />
            </ButtonTop>
          </ButtonHole>
        </ButtonWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default TgsWindFactor;

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

 background: ${props => props.theme.layout.switch_controls.bg};
  box-shadow: ${props => props.theme.layout.switch_controls.shadow};
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 43px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 2px 0 14px;

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer1};
    `}

  ${(p) =>
    p.isReady &&
    css`
      ${readyLayer}
    `}
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
`;

const ButtonHole = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.layout.card.bg};
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
`;

const Title = styled.span`
  font-size: 13px;
  letter-spacing: 1.4px;
  text-align: center;
`;
const Img = styled.img`
  height: 90%;
`;
