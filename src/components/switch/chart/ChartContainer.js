import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFaultsStore } from '../../../store/faultsStore';

import { flexboxCenter } from '../../../styles/commonStyles';
import styled, { css } from 'styled-components';

import Chart from './Chart';
import ChartInfoContainer from './ChartInfoContainer';
import ChartTitles from './ChartTitles';
import DisplayStatus from './DisplayStatus';
import Legend from './Legend';
import DisplayForceSelectionBox from '../../faults/DisplayForceSelectionBox';
import DisplayEnergyConsumption from '../DisplayEnergyConsumption';

function ChartContainer( { mode, ...rest } ) {
  const deviceType = rest?.deviceType;
  const deviceInfo = rest?.deviceInfo;
  const { receivedThermocoupleSetting, ess, tgs } = useFaultsStore();

  const navigate = useNavigate();
  const displayForce = receivedThermocoupleSetting.length > 0
                        && Array.isArray(deviceInfo.thermocouple_fault)
                        && deviceInfo.thermocouple_fault?.includes(1);
  const location = useLocation();
  // const [faultsMessages, setFaultsMessages] = useState([]);

  const essFault = ess.message.length > 0;
  const tgsFault = tgs.message.length > 0;

  const isFaults =
    rest?.deviceType === 'electrical'
      ? essFault
      : location.pathname === '/'
      ? tgsFault
      : essFault;

  useEffect(() => {
    if (rest?.deviceType === 'electrical') {
      navigate('/tes');
    } else {
      navigate('/');
    }
  }, [rest?.deviceType]);
  
  const SRC_VIDEO = mode? '/static/images/chart-video-hat_light.svg' : '/static/images/chart-video-hat.svg';
  const SRC_GRAPH = isFaults
    ? mode? '/static/images/chart-graph-hat-faults_light.svg' : '/static/images/chart-graph-hat-faults.svg'
    : mode? '/static/images/chart-graph-hat_light.svg' : '/static/images/chart-graph-hat.svg';

  // useEffect(() => {
  //   if (location.pathname === '/') {
  //     if (faultsState.tgs.message.length > 0) {
  //       const messageArr = faultsState.tgs.message.map(
  //         (message) => message.split(' - ')[0]
  //       );
  //     } else {
  //       setFaultsMessages([]);
  //     }
  //   } else {
  //     if (faultsState.ess.message.length > 0) {
  //       const messageArr = faultsState.ess.message.map(
  //         (message) => message.split(' - ')[0]
  //       );
  //       setFaultsMessages([...messageArr]);
  //     } else {
  //       setFaultsMessages([]);
  //     }
  //   }
  // }, [location.pathname]);

  const TesFaults = () => {
    const thermocoupleFaultsNumbers = useMemo(() => {
      const message = [];
      deviceInfo?.thermocouple_fault?.map((val, key) => {
        if (val) {
          message.push(key + 1);
        }
      });
      return message.join(',');
    }, [deviceInfo?.thermocouple_fault]);
    const ssrFaultsNumbers = useMemo(() => {
      const message = [];
      deviceInfo?.ssr_fault?.map((val, key) => {
        if (val) {
          message.push(key + 1);
        }
      });
      return message.join(',');
    }, [deviceInfo?.ssr_fault]);
    const overCurrentFaultsNumbers = useMemo(() => {
      const message = [];
      deviceInfo?.srr_over_current?.map((val, key) => {
        if (val) {
          message.push(key + 1);
        }
      });
      return message.join(',');
    }, [deviceInfo?.srr_over_current]);
    const showGroundFault = useMemo(() => {
      return deviceInfo?.ground_fault === 1;
    }, [deviceInfo?.ground_fault]);
    const showThermocoupleFault = useMemo(() => {
      return deviceInfo?.thermocouple_fault?.includes(1);
    }, [deviceInfo?.thermocouple_fault]);
    const showSsrFault = useMemo(() => {
      return deviceInfo?.ssr_fault?.includes(1);
    }, [deviceInfo?.ssr_fault]);
    const showOverCurrentFault = useMemo(() => {
      return deviceInfo?.srr_over_current?.includes(1);
    }, [deviceInfo?.srr_over_current]);
    return (
      <>
        <DisplayFaults redBg={showGroundFault || showThermocoupleFault ? true : false}>
          <FaultContainer>{showGroundFault && 'Ground Fault'}</FaultContainer>
          <FaultContainer>
            {showThermocoupleFault && `Thermocouple Failure`}
            <br></br>
            {showThermocoupleFault && `(${thermocoupleFaultsNumbers})`}
          </FaultContainer>
        </DisplayFaults>
        <DisplayFaults redBg={showSsrFault ? true : false}>
          <FaultContainer>
            {showSsrFault && `Ssr Fault in ssr`}
            <br></br>
            {showSsrFault && `(${ssrFaultsNumbers})`}
          </FaultContainer>
        </DisplayFaults>
        <DisplayFaults size={true} redBg={showOverCurrentFault ? true : false}>
          <FaultContainer>
            {showOverCurrentFault && `Load exceeded Fault`}
            <br></br>
            {showOverCurrentFault && `(${overCurrentFaultsNumbers})`}
          </FaultContainer>
        </DisplayFaults>
      </>
    );
  };

  const TgsFaults = () => {
    const showtimeoutFault = useMemo(() => {
      return deviceInfo?.timeout_fault === 1;
    }, [deviceInfo?.timeout_fault]);
    const showHplpFault = useMemo(() => {
      return deviceInfo?.hplp_fault === 1;
    }, [deviceInfo?.hplp_fault]);
    const showBmsFault = useMemo(() => {
      return deviceInfo?.bms_fault === 1;
    }, [deviceInfo?.bms_fault]);
    const showThermocoupleFault = useMemo(() => {
      return deviceInfo?.thermocouple_fault === 1;
    }, [deviceInfo?.thermocouple_fault]);
    return (
      <>
        <DisplayFaults redBg={showtimeoutFault || showHplpFault ? true : false}>
          <FaultContainer>{showtimeoutFault && 'Timeout Fault'}</FaultContainer>
          <FaultContainer>{showHplpFault && 'Hplp Fault'}</FaultContainer>
        </DisplayFaults>
        <DisplayFaults redBg={showBmsFault ? true : false}>
          <FaultContainer>{showBmsFault && 'Bms Fault'}</FaultContainer>
        </DisplayFaults>
        <DisplayFaults size={true} redBg={showThermocoupleFault ? true : false}>
          <FaultContainer>{showThermocoupleFault && `Thermocouple Fault`}</FaultContainer>
        </DisplayFaults>
      </>
    );
  };

  return (
    <Wrapper>
      <SectionDisplayFaults>
        {deviceType === 'electrical' ? <TesFaults /> : <TgsFaults />}
      </SectionDisplayFaults>

      <SectionHats isFaults={isFaults}>
        <FileOptionTitleWrapper>
          <FileTitle inActive={true}>video monitoring</FileTitle>
          <FileTitle>graph</FileTitle>
        </FileOptionTitleWrapper>

        <SvgImg src={SRC_VIDEO} />
        <SvgImg src={SRC_GRAPH} />
      </SectionHats>

      <SectionMainContents isFaults={isFaults}>
        <ChartTitles {...rest} />

        <SectionInfo>
          <DisplayEnergyConsumption {...rest} />
          <ChartInfoContainer />
          <DisplayForceSelectionBox visibility={rest?.deviceType === 'electrical'} />
        </SectionInfo>

        <SectionChart>
          <Chart />
        </SectionChart>

        <SectionLegend>
          <Legend />
        </SectionLegend>

        <SectionDisplayStatus>
          <DisplayStatus {...rest} />
        </SectionDisplayStatus>
        
      </SectionMainContents>
      
    </Wrapper>
  );
}
export default ChartContainer;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:8px;
`;

const SectionDisplayFaults = styled.section`
  width: 100%;
  height: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  margin-bottom: 2px;
`;

const FaultContainer = styled.div`
  text-align: center;
  height: 100%;
  color: ${props => props.theme.label.contrast};
`;
const DisplayFaults = styled.div`
  width: 230px;
  height: 28px;

  background: ${props => props.theme.layout.switch_controls.bg};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.switch_controls.border};

  font-size: 10px;
  color: ${props => props.theme.label.contrast};
  ${flexboxCenter}

  ${(p) =>
    p.redBg &&
    css`
      background: ${props => props.theme.status.error.bgGradient};
      box-shadow: ${props => props.theme.layout.main.shadow};
      border: 0.5px solid ${props => props.theme.status.error.border};
    `}
`;

const SectionHats = styled.section`
  width: 100%;
  
  position: relative;
  display: flex;
  justify-content: flex-end;
`;
const SvgImg = styled.img`
  margin-left: 10px;
`;

const FileOptionTitleWrapper = styled.div`
  ${flexboxCenter}
  justify-content: space-between;
  width: 20.5rem;
  position: absolute;
  top: 0 px;
  right: 55px;
  z-index: 100;
`;
const FileTitle = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;
  cursor: pointer;
  align-self: center;
  transition: all 100ms ease-in;
  color: ${props => props.theme.label.primary};
  :hover {
    transform: scale(103%);
  }
`;

const SectionMainContents = styled.section`
  width: 100%;
  height: 100%;

  background: ${props => props.theme.layout.card.bgGradientVertical};
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 12px 0px 12px 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid ${props => props.theme.status.error.border};
    `}

  padding: 4px 3px 3px 3px;
`;

const SectionInfo = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* align - right chart line / left title line*/
  padding: 0 10px 0 7px;

  /* position: relative; */
`;

const SectionChart = styled.section`
  width: 100%;
  height: 254px;
  margin-top: -8px;
`;

const SectionLegend = styled.section`
  width: 100%;
  ${flexboxCenter}
  padding: 0 5px;
  margin-top: -8px;
`;

const SectionDisplayStatus = styled.section`
  width: 100%;
  
  margin-bottom: 8px;
`;
