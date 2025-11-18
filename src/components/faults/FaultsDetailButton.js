import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { selectFaults } from '../../store/slices/faultsSlice';
import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';
import { countdownTimer } from '../../helpers/helpers';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';

const FaultsDetailButton = ({
  name,
  title,
  handleButtonClick,
  column,
  faultsNumber,
  buttonNum,
  faultContents,
}) => {
  const faultsState = useSelector(selectFaults);
  const { receivedThermocoupleSetting } = faultsState;
  const { isForceButtonClicked } = faultsState.ess;
  const { attendButtonClicked } = name === 'tgs' ? faultsState.tgs : faultsState.ess;
  const { ssr_setting } = useSelector(selectTgsSwitch);
  const titleFault = faultContents.split(' ').slice(0,2).join(' ');

  const [countdown, setCountdown] = useState(null);
  const [activeForceButton, setActiveForceButton] = useState();
  const [resetBtnActivated, setResetBtnActivated] = useState(false);

  const ssrFault = useMemo(() => {
    const idSsrFault = (titleFault === 'SSR FAULT' || titleFault === 'SSR LOAD') ? faultContents.split(' ')[2] : null;
    return ssr_setting.find((item) => item.No === idSsrFault - 1)
  }, [ssr_setting])

  useEffect(() => {
    // faults number 2 means that there is a fault in the thermocouple
    if (faultsNumber === 2) {
      const thermocoupleNumber = faultContents.split(' ')[2];
      const currentThermocouple = receivedThermocoupleSetting.find(item => item.tc_no === Number(thermocoupleNumber - 1));
      setActiveForceButton(currentThermocouple);
    }
  }, [faultsNumber, faultContents, receivedThermocoupleSetting]);
  
  useEffect(() => {
    setCountdown(activeForceButton?.count_down_time);

    let setTimer;
    clearInterval(setTimer);
    const timer = () => {
      clearInterval(setTimer);
      setTimer = setInterval(() => {
        setCountdown((prev) => prev > 0 ? prev - 1 : 0);
      }, 1000);
    };

    activeForceButton?.paused !== 1 && timer();
    return () => {
      clearInterval(setTimer);
    };
  }, [activeForceButton]);

  // Make some buttons invisible depending on ess, tes fault types
  const inVisible =
    name !== 'tgs' && buttonNum == 0 && faultsNumber !== 2 ? true : false;

  // ***************for styling in force button **************
  const forceBtnClicked = isForceButtonClicked && title === 'force';
  const forceBtnActivated = activeForceButton && title === 'force';
  // ******************************************
  const disable = title === 'reset' && (titleFault === "BMS FAULT!" || titleFault === "GROUND FAULT" || ssrFault?.reset === 0);
  // ******************************************

  // ***************for styling in reset button **************
  const attendBtnClicked =
    attendButtonClicked.faultsIdx === faultsNumber && title === 'attend';
  // ******************************************

  const forceTypeTitle =
    activeForceButton?.fault_mode === 3 ? 'system off' : 'remaining';
  
  return (
    <WrapperHole
      onClick={() => handleButtonClick(name, title, column, faultsNumber, setResetBtnActivated)}
      inVisible={inVisible}
      disable={disable}
      forceBtnClicked={forceBtnClicked}
      attendBtnClicked={attendBtnClicked}
      forceBtnActivated={forceBtnActivated}
    >
      <ButtonInner
        disable={disable}
        forceBtnActivated={forceBtnActivated}
        resetBtnActivated={resetBtnActivated}
      >
        <ButtonInnerHole
          disable={disable}
          forceBtnActivated={forceBtnActivated}
          resetBtnActivated={resetBtnActivated}
        >
          <ButtonTop
            disable={disable}
            forceBtnActivated={forceBtnActivated}
            resetBtnActivated={resetBtnActivated}
          >
            <Title
              forceBtnActivated={forceBtnActivated}
              resetBtnActivated={resetBtnActivated}
            >
              {title}
            </Title>
            {forceBtnActivated && (
              <ForceTop>
                {forceTypeTitle === 'system off' ? (
                  <ForceTitle>{forceTypeTitle}</ForceTitle>
                ) : (
                  <ForceTitle>
                    {forceTypeTitle}
                    {countdown ? ` ${countdownTimer(countdown)}` : ' 00:00:00'}
                  </ForceTitle>
                )}
              </ForceTop>
            )}
          </ButtonTop>
        </ButtonInnerHole>
      </ButtonInner>
    </WrapperHole>
  );
};

export default FaultsDetailButton;

const WrapperHole = styled.button`
  ${flexboxCenter};

  width: 88px;
  height: 28px;

  background: ${props => props.theme.layout.sidebar.bg};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 27px;

  margin-left: 0.2rem;
  ${(p) =>
    p.inVisible &&
    css`
      display: none;
    `}
  ${(p) =>
    p.inVisible &&
    css`
      display: none;
    `}

    ${(p) =>
    p.disable &&
    css`
      pointer-events: none;
    `}

    ${(p) =>
    p.forceBtnClicked &&
    css`
    `}

    ${(p) =>
    p.attendBtnClicked &&
    css`
    `}

    ${(p) =>
    p.forceBtnActivated &&
    css`
      width: 183px;
      height: 28px;
    `}
`;
const ButtonInner = styled.div`
  ${flexboxCenter};

  width: 86px;
  height: 26px;

  border: 0.5px solid ${props => props.theme.button.primary.border};
  background: ${props => props.theme.button.primary.bgGradient} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px;
  border-radius: 25px;

  ${(p) =>
    p.disable &&
    css`
      background: ${props => props.theme.button.secondary.bgGradient};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid ${props => props.theme.button.secondary.border};
    `}

  ${(p) =>
    p.forceBtnActivated &&
    css`
      width: 181px;
      height: 26px;
      background: ${props => props.theme.status.warning.bgGradientCard};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid ${props => props.theme.status.warning.border};
    `}

    ${(p) =>
    p.resetBtnActivated &&
    css`
      background: ${props => props.theme.status.warning.bgGradientCard};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid ${props => props.theme.status.warning.border};
    `}
`;
const ButtonInnerHole = styled.div`
  ${flexboxCenter};

  width: 80px;
  height: 20px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 20px;
  ${(p) =>
    p.disable &&
    css`
      background: ${props => props.theme.button.secondary.bg} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 1px #000000;
    `}

  ${(p) =>
    p.forceBtnActivated &&
    css`
      width: 175px;
      height: 20px;
      background: ${props => props.theme.status.warning.bg} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 1px #000000;
    `}

    ${(p) =>
    p.resetBtnActivated &&
    css`
      background: ${props => props.theme.status.warning.bg} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 1px #000000;
    `}
`;
const ButtonTop = styled.div`
  ${flexboxCenter};

  width: 78px;
  height: 18px;

  background: ${props => props.theme.button.primary.bgGradient} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 25px;

  ${(p) =>
    p.disable &&
    css`
      background: ${props => props.theme.button.secondary.bgGradient};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid ${props => props.theme.button.secondary.border};
    `}

  ${(p) =>
    p.forceBtnActivated &&
    css`
      width: 173px;
      height: 18px;
      background: ${props => props.theme.status.warning.bgGradientCard};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid ${props => props.theme.status.warning.border};
      justify-content: space-between;
      padding: 0 0.05rem 0 0.2rem;
    `}


    ${(p) =>
    p.resetBtnActivated &&
    css`
      background: ${props => props.theme.status.warning.bgGradientCard};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid ${props => props.theme.status.warning.border};
    `}
`;

const Title = styled.span`
  font-size: 10px;
  text-align: center;
  color: ${props => props.theme.button.primary.text};

  ${(p) =>
    p.forceBtnActivated &&
    css`
      color: ${props => props.theme.layout.card.bg};
    `}

  ${(p) =>
    p.resetBtnActivated &&
    css`
      color: ${props => props.theme.layout.card.bg};
    `}
`;

const ForceTop = styled.div`
  width: 127px;
  height: 14px;
  background: ${props => props.theme.status.warning.text};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const ForceTitle = styled.span`
  color: ${props => props.theme.layout.card.bg};
  font-size: 9px;
`;
