import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFaults } from '../../store/slices/faultsSlice';
import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';
import { countdownTimer } from '../../helpers/helpers';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';

const DisplayForceSelectionBox = ({ visibility }) => {
  const faultsState = useSelector(selectFaults);
  const { electricalInfo } = useSelector(selectTgsSwitch)
  const { receivedThermocoupleSetting: thermocoupleSetting } = faultsState;
  const [countdown, setCountdown] = useState(null);
  const [faultsDetails, setFaultsDetails] = useState([]);
  const [faultsWithoutSystemOff, setFaultsWithoutSystemOff] = useState([]);
  const [displaySelectedForce, setDisplaySelectedForce] = useState();
  const [displayForceIndex, setDisplayForceIndex] = useState(0);
  const [openHoverBox, setOpenHoverBox] = useState(false);

  const faultsMode = [
    `max heat 12 hours`,
    'max heat for 3 days',
    'change and replace t/c',
  ];

  const thermocouple_fault = Array.isArray(electricalInfo?.thermocouple_fault) 
    ? electricalInfo?.thermocouple_fault.join('')
    : [];

  const receivedThermocoupleSetting = useMemo(() => {
    return thermocoupleSetting.filter((fault) => {
      if (thermocouple_fault && thermocouple_fault.length > 0) {
        return Number(thermocouple_fault[fault.tc_no]) === 1;
      }
    }) || [];
  }, [thermocouple_fault, thermocoupleSetting]);

  useEffect(() => {
    setFaultsWithoutSystemOff(receivedThermocoupleSetting.filter((fault) => fault.fault_mode !== 3));
    setFaultsDetails(() => {
      const newFaultsDetails = receivedThermocoupleSetting.map((fault) => {
        return `T/C-${fault.tc_no > 8 ? `0${fault.tc_no + 1}` : fault.tc_no + 1}:
          ${fault.ssr?.map((item) => ` SSR${item + 1}`)} 
          ${fault.fault_mode !== 3 ? countdownTimer(fault.count_down_time) : ''} 
          ${fault.fault_mode === 1 ? 'MAX HEAT 12 HOURS' : fault.fault_mode === 2 ? 'MAX HEAT 72 HOURS' : 'SYSTEM OFF CHANGE & REPLACE T/C'}`;
      });
      return newFaultsDetails;
    });
  }, [receivedThermocoupleSetting]);

  useEffect(() => {
    setDisplaySelectedForce(faultsMode[faultsWithoutSystemOff[displayForceIndex]?.fault_mode - 1]);
    setCountdown(faultsWithoutSystemOff[displayForceIndex]?.count_down_time);

    let setTimer;
    clearInterval(setTimer);
    const timer = () => {
      clearInterval(setTimer);
      setTimer = setInterval(() => {
        setCountdown((prev) => prev > 0 ? prev - 1 : 0);
      }, 1000);
    };

    faultsWithoutSystemOff[displayForceIndex]?.paused !== 1 && timer();
    return () => {
      clearInterval(setTimer);
    };
  }, [faultsWithoutSystemOff, displayForceIndex]);

  const handleDisplayNextForce = () => {
    if (displayForceIndex < faultsWithoutSystemOff.length - 1) {
      setDisplayForceIndex((prev) => prev + 1);
    } else {
      setDisplayForceIndex(0);
    }
  };

  return (
    <Wrapper
      visibility={visibility && receivedThermocoupleSetting.length !== 0}
      onMouseEnter={() => setOpenHoverBox(true)}
      onMouseLeave={() => setOpenHoverBox(false)}
    >
      <InnerHole>
        {displaySelectedForce === 'change and replace t/c' ? (
          <>
            <MainContent isOptional={true}>system off</MainContent>
            <SubContent isOptional={true}>change & replace t/c</SubContent>
          </>
        ) : (
          <>
            <MainAndArrowWrapper>
              <MainContent>
                {countdown ? countdownTimer(countdown) : '00:00:00'}
              </MainContent>
              {faultsWithoutSystemOff.length > 1 && (
                <ArrowButton
                  src='/static/images/faults-arrow-button.svg'
                  onClick={handleDisplayNextForce}
                />
              )}
            </MainAndArrowWrapper>
            <SubContent>
              {displaySelectedForce === 'max heat for 3 days'
                ? `max heat 3 days`
                : displaySelectedForce === `max heat 12 hours` 
                ? `max heat 12 hours`
                : ''}
            </SubContent>
          </>
        )}
      </InnerHole>
      {openHoverBox && (
        <FaultsHoverBox>
          {faultsDetails.map((details) => (
            <FaultHoverDetail key={Math.random() * 1000}>
              {details}
            </FaultHoverDetail>
          ))}
        </FaultsHoverBox>
      )}
    </Wrapper>
  );
};
export default DisplayForceSelectionBox;

const Wrapper = styled.div`
  width: 189px;
  height: 53px;

  background: ${props => props.theme.button.primary.bgGradient};
  box-shadow: 0px 0px 2px #000000;
  border-radius: 6px;

  ${flexboxCenter} /* position: absolute;
  top: -0.7rem;
  right: 0rem; */

  ${(p) =>
    p.visibility ||
    css`
      visibility: hidden;
    `};

  position: relative;
`;
const InnerHole = styled.div`
  width: 183px;
  height: 47px;

  background: ${props => props.theme.layout.main.bgGradientReverse};
  border: 1px solid ${props => props.theme.status.warning.border};
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MainAndArrowWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  ${(p) =>
    p.isOptional &&
    css`
      margin-top: 3px;
      margin-bottom: 2px;
    `}
`;
const ArrowButton = styled.img`
  cursor: pointer;
`;
const MainContent = styled.span`
  font-size: 26px;
  letter-spacing: 2px;
  color: ${props => props.theme.status.warning.border};

  text-align: left;

  ${(p) =>
    p.isOptional &&
    css`
      font-size: 19px;
    `}
`;

const SubContent = styled.span`
  color: ${props => props.theme.status.warning.border};
  font-size: 12px;
  letter-spacing: 1.2px;
  margin-top: -6px;

  /* border: 1px solid ${props => props.theme.status.info.lighter}; */
  ${(p) =>
    p.isOptional &&
    css`
      font-size: 10px;
      margin-top: -2px;
    `}
`;

const FaultsHoverBox = styled.div`
  width: 483px;
  height: auto;

  background: ${props => props.theme.layout.card.bgGradient};
  border: 2px solid ${props => props.theme.layout.card.border};

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  padding: 2px 2px;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const FaultHoverDetail = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: left;
  color: ${props => props.theme.label.primary};
`;
