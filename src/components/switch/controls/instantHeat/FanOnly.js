import { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { isAnotherSystemRunning, updateDeviceInfo } from '../../../../helpers/helpers';
import { useTgsSwitchStore } from '../../../../store/zustand';
import {
  activeHole,
  activeLayer1,
  disableLayer,
  flexboxCenter,
} from '../../../../styles/commonStyles';
import InputTempMessage from '../../../userMessages/InputTempMessage';

const FanOnly = ({ isDisabled }) => {
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const currentRunSystem = useTgsSwitchStore((state) => state.currentRunSystem);
  const EBP = useTgsSwitchStore((state) => state.EBP);
  const fanOnlyToggler = useTgsSwitchStore((state) => state.fanOnlyToggler);
  const [displayMessageBox, setDisplayMessageBox] = useState(false);
  const [message, setMessage] = useState(['']);

  const isFanOnlyActive = useMemo(() => {
    return gasInfo?.fan === 1;
  }, [gasInfo?.fan]);

  const handleFanToggler = () => {
    if (EBP && (gasInfo?.EBP === 0 || gasInfo?.EBP === null)) {
      setDisplayMessageBox(true);
      setMessage([
        'ATS SIGNAL IS TRIGGERED ON TGS, ',
        'SYSTEM IS NOW ON GENERATOR BACKUP POWER, ',
        'TGS GAZ HEATING WILL NOT START UNTIL GRID POWER IS REESTABLISHED',
      ]);
      return;
    }
    const newValue = gasInfo?.fan === 1 ? 0 : 1;
    updateDeviceInfo('fan', newValue, 'gas_command');
    fanOnlyToggler();
  };
  
  return (
    <Wrapper>
      <ContentWrapper isActivated={isFanOnlyActive} disabled={isDisabled} onClick={handleFanToggler}>
        <Title>fan Only</Title>
        <Button isActivated={isFanOnlyActive} disabled={isDisabled}>
          <ButtonHole isActivated={isFanOnlyActive} disabled={isDisabled}>
            <ButtonTop isActivated={isFanOnlyActive} disabled={isDisabled}>
              <Img src={'/static/images/fan-only-icon.svg'} />
            </ButtonTop>
          </ButtonHole>
        </Button>
      </ContentWrapper>
      {displayMessageBox && (
        <InputTempMessage
          onClose={() => setDisplayMessageBox(false)}
          title={'fan only'}
          messages={message}
        />
      )}
    </Wrapper>
  );
};

export default FanOnly;

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

  padding: 0 2px 0 38px;

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer1};
    `}
  ${(p) => p.disabled && css`${disableLayer}`}
`;

const Button = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;

  ${flexboxCenter}
  background: #1b2b44 0% 0%;
  box-shadow: inset 0px 0px 1px #000000;

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
    p.isActivated &&
    css`
      ${activeHole};
    `}
  ${(p) => p.disabled && css`${disableLayer}`}
`;

const Img = styled.img`
  height: 70%;
`;

const Title = styled.span`
  font-size: 13px;
  letter-spacing: 1.4px;
  text-align: center;
`;
