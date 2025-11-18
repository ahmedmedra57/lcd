import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTgsSwitch,
  deactivateTgsConflictMessage,
  deActivatedisplayTGSScheduleModal,
} from '../../../store/slices/tgsSwitchSlice';
import {
  activateEsSwitchStatus,
  selectEssSwitch,
} from '../../../store/slices/essSwitchSlice';
import { selectFaults } from '../../../store/slices/faultsSlice';
import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';
import ConflictMessage from '../../userMessages/ConflictMessage';
import SettingConfirmedMessage from '../../userMessages/SettingConfirmedMessage';
import { convertCelsiusToFahrenheit, gasFaultsList, tgsUpdateSchedule, updateDeviceInfo, updateSchedule } from "../../../helpers/helpers";
import TgsHeatingSchedule from './HeatingSchedule/TgsHeatingSchedule';
import FanOnly from './instantHeat/FanOnly';
import DisplayBox from '../DisplayBox';
import { useLocation } from "react-router-dom";
import { selectSettingsOfEss } from "../../../store/slices/settingsOfEssSlice";
import InstantHeat from "./instantHeat/InstantHeat";
import SnowSensor from "./snowSensor/SnowSensor";
import WindFactor from "./windFactor/WindFactor";
import { selectUserState } from "../../../store/slices/userSlice";

const TgsControlBox = ({ ...rest }) => {
  const userState = useSelector(selectUserState);
  const { isGas } = userState;
  const state = useSelector(selectTgsSwitch);
  const { displayConflictMessage, devicesConflicts, gasInfo, electricalInfo, settings, gasFaults } =
    state;

  const faultsState = useSelector(selectFaults);
  const unitsState = useSelector(selectSettingsOfEss);
  const mode = unitsState.interfaceMode;

  const { unitsMeasurement } = unitsState.buttonsOfSettings;
  const location = useLocation();

  const essFault =
    faultsState.ess.message.length > 0;
  const tgsFault =
    faultsState.tgs.message.length > 0;

  const isFaults =
    rest?.deviceType === 'electrical'
      ? essFault
      : location.pathname === '/'
      ? tgsFault
      : essFault;

  const isModeFault = useMemo(() => {
    return rest.deviceInfo?.mode === 'FAULT';
  }, [rest.deviceInfo?.mode]);
  
  const faultMessage = useMemo(() => {
    return gasFaultsList(gasInfo).headerFaults?.map((fault) => fault.split(' ').slice(0, 2).join(' '));
  }, [gasInfo]);

  const esState = useSelector(selectEssSwitch);
  const {
    instantHeat,
    snowSensor,
    optionalConstantTemp,
    heatingSchedule,
    windFactor,
  } = esState;

  const dispatch = useDispatch();

  const [disabledBox, setDisabledBox] = useState(false);
  const [displayFaultsMessageBox, setDisplayFaultsMessageBox] = useState(false);
  const [displayModeFaultMessageBox, setDisplayModeFaultMessageBox] = useState(false);

  // Check if es is activated
  useEffect(() => {
    instantHeat.isActivated && dispatch(activateEsSwitchStatus());
    // snowSensor.isReady && dispatch(activateEsSwitchStatus());
    snowSensor.isActivated && dispatch(activateEsSwitchStatus());
    optionalConstantTemp.apply && dispatch(activateEsSwitchStatus());
    // heatingSchedule.isReady && dispatch(activateEsSwitchStatus());
    heatingSchedule.isActivated && dispatch(activateEsSwitchStatus());
    // windFactor.isReady && dispatch(activateEsSwitchStatus());
    windFactor.isActivated && dispatch(activateEsSwitchStatus());
  }, [esState]);

  // Conflict message handlers
  const handleCancelConflictMessage = () => {
    // change display conflict message state into false
    dispatch(deactivateTgsConflictMessage());
  };

  const handleConfirmConflictMessage = () => {
    const systemTarget = devicesConflicts?.systemTarget === 'gas' ? 'gas_command' : 'electrical_command';

    if (devicesConflicts?.commandTarget === 'on_switch') {
      updateDeviceInfo('on_switch', 1, systemTarget);
      updateDeviceInfo('instant_temp', devicesConflicts?.extraData, systemTarget);
    } 
    if (devicesConflicts?.commandTarget === 'on_constant') {
      updateDeviceInfo('on_constant', 1, systemTarget);
      updateDeviceInfo('constant_temp', devicesConflicts?.extraData, systemTarget);
    } 
    if (devicesConflicts?.commandTarget === 'fan') {
      updateDeviceInfo('fan', 1, systemTarget);
    } 
    if (devicesConflicts?.commandTarget === 'snow_enabled') {
      updateDeviceInfo('snow_enabled', 1, systemTarget);
    } 
    if (devicesConflicts?.commandTarget === 'wind'  ) {
      updateDeviceInfo('wind', 1, systemTarget);
    }
    if (devicesConflicts?.commandTarget === 'schedule') {
      isGas ? tgsUpdateSchedule(devicesConflicts?.extraData) : updateSchedule(devicesConflicts?.extraData);
    }
    
    dispatch(deactivateTgsConflictMessage());
    dispatch(deActivatedisplayTGSScheduleModal());

  };
  
  const isThermocouple = useMemo(() => {
    return settings?.tc_mode === 1 ? true : false;
  }, [settings]);

  const onSwitch = useMemo(() => {
    return gasInfo?.on_switch === 1;
  }, [gasInfo?.on_switch]);

  const fanEnabled = useMemo(() => {
    return gasInfo?.fan === 1;
  }, [gasInfo?.fan]);

  const scheduleEnabled = useMemo(() => {
    return gasInfo?.schedule_enabled === 1;
  }, [gasInfo?.schedule_enabled]);

  const snowSensorEnabled = useMemo(() => {
    return gasInfo?.snow_enabled === 1;
  }, [gasInfo?.snow_enabled]);

  const snowSensorTriggered = useMemo(() => {
    return gasInfo?.snow_trigger === 1;
  }, [gasInfo?.snow_trigger]);

  const windFactorEnabled = useMemo(() => {
    return gasInfo?.wind_enabled === 1;
  }, [gasInfo?.wind_enabled]);

  const windFactorTriggered = useMemo(() => {
    return gasInfo?.wind_trigger === 1;
  }, [gasInfo?.wind_trigger]);

  // *************temporary variables for display boxes
  const setTemp = useMemo(() => {
    return !isThermocouple ? '__' : settings?.unit === 'f'
      ? onSwitch || scheduleEnabled || (snowSensorEnabled && snowSensorTriggered) || (windFactorEnabled && windFactorTriggered)
        ? Math.floor(convertCelsiusToFahrenheit(gasInfo?.threshold_temp))
        : '__'
      : onSwitch || scheduleEnabled || (snowSensorEnabled && snowSensorTriggered) || (windFactorEnabled && windFactorTriggered)
      ? Math.floor(gasInfo?.threshold_temp)
      : '__';
  }, [
    settings?.unit,
    gasInfo?.threshold_temp,
    snowSensorTriggered,
    onSwitch,
    scheduleEnabled,
    windFactorTriggered,
    snowSensorEnabled,
    windFactorEnabled,
  ]);

  const currTemp = useMemo(() => {
    return !isThermocouple ? '__' : settings?.unit === 'f'
      ? onSwitch || scheduleEnabled || (snowSensorEnabled && snowSensorTriggered) || (windFactorEnabled && windFactorTriggered)
        ? Math.floor(convertCelsiusToFahrenheit(gasInfo?.display_temp))
        : '__'
      : onSwitch || scheduleEnabled || (snowSensorEnabled && snowSensorTriggered) || (windFactorEnabled && windFactorTriggered)
      ? Math.floor(gasInfo?.display_temp)
      : '__';
  }, [
    settings?.unit,
    gasInfo?.display_temp,
    snowSensorTriggered,
    onSwitch,
    scheduleEnabled,
    windFactorTriggered,
    snowSensorEnabled,
    windFactorEnabled,
  ]);

  const hoursOfUsage = useMemo(() => {
    return Math.floor(gasInfo?.hours_of_usage / 3600);
  }, [gasInfo?.hours_of_usage]);
  // *************temporary variables for display boxes
  
  return (
    <Wrapper>
      <HatImg
        src={
          isFaults
            ? mode ? '/static/images/controller-hat-background-faults_light.svg' : '/static/images/controller-hat-background-faults.svg'
            : mode ? '/static/images/controller-hat-background_light.svg' : '/static/images/controller-hat-background.svg'
        }
      />
      <Title>tgs-controls</Title>

      <ContentWrapper isFaults={isFaults}>
        <SectionController>
          <InstantHeat deviceInfo={rest?.deviceInfo} isDisabled={isModeFault} setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox} />
          <FanOnly />
          <TgsHeatingSchedule isDisabled={isModeFault} setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox} />
          <SnowSensor deviceInfo={rest?.deviceInfo} isDisabled={isModeFault} setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox} />
          <WindFactor deviceInfo={rest?.deviceInfo} isDisabled={isModeFault} setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox} />
          <SectionDisplayBox>
            <DisplayBox
              currData={!isNaN(setTemp) ? setTemp : '__'}
              unit={unitsMeasurement ? '°F' : '°C'}
              label='set temp.'
              option={1}
            />

            <DisplayBox
              currData={!isNaN(currTemp) ? currTemp : '__'}
              unit={unitsMeasurement ? '°F' : '°C'}
              label='current temp.'
              option={1}
            />

            <DisplayBox
              currData={!isNaN(hoursOfUsage) ? hoursOfUsage : '__'}
              unit='Hrs'
              label='hours of usage'
              option={1}
            />
          </SectionDisplayBox>
        </SectionController>
      </ContentWrapper>

      {displayConflictMessage && (
        <ConflictMessage
          currentSwitch={devicesConflicts.currentSwitch}
          DesiredSwitch={devicesConflicts.DesiredSwitch}
          handleCancel={handleCancelConflictMessage}
          handleConfirm={handleConfirmConflictMessage}
        />
      )}

      {disabledBox && (
        <DisabledWholePage
          onClick={() => {
            setDisplayModeFaultMessageBox(isModeFault);
          }}
        ></DisabledWholePage>
      )}

      {displayFaultsMessageBox && (
        <SettingConfirmedMessage
          alert={true}
          onClose={() => setDisplayFaultsMessageBox(false)}
          title='faults'
          message='SYSTEM OFF
          UNTIL RELEASE FAULT! Go to faults page to check the details'
          src={'/static/images/heater-off-alert.svg'}
        />
      )}
      {displayModeFaultMessageBox && (
        <SettingConfirmedMessage
          alert={true}
          onClose={() => setDisplayModeFaultMessageBox(false)}
          title={'tgs - controls'}
          message='SYSTEM OFF
          UNTIL RELEASE FAULT! Go to faults page to check the details'
          src={'/static/images/heater-off-alert.svg'}
        />
      )}
    </Wrapper>
  );
};

export default TgsControlBox;

const Wrapper = styled.div`
  width: 192px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const HatImg = styled.img`
  position: relative;
`;

const ContentWrapper = styled.div`
  width: 192px;
  height: 100%;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  border: 0.5px solid ${props => props.theme.layout.main.border};
  border-radius: 0px 8px 10px 10px;

  ${flexboxCenter}

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid ${props => props.theme.status.error.border};
    `}
`;

const Title = styled.span`
  position: absolute;
  top: 7px;
  left: 8px;
  font-size: 14px;
  letter-spacing: 1.4px;
`;

const SectionController = styled.section`
  height: 100%;
  /* Layout Properties */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`;
const SectionDisplayBox = styled.div`
  width: 184px;
  height: 254px;
  border: 1px solid ${props => props.theme.status.info.border};
  border-radius: 8px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

`;

const DisabledWholePage = styled.div`
  width: 100vw;
  height: 600px;

  position: absolute;
  top: 0rem;
  left: 0rem;
`;

const InvisibleController = styled.div`
  width: 182px;
  height: 49px;
  visibility: hidden;
`;
