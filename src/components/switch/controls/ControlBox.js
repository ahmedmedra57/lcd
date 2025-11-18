import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import {
  activateTgsSwitchStatus,
  deActivatedisplayTGSScheduleModal,
  deactivateTgsConflictMessage,
  selectTgsSwitch,
} from '../../../store/slices/tgsSwitchSlice';
import { selectUserState } from '../../../store/slices/userSlice';
import { selectFaults } from '../../../store/slices/faultsSlice';
import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';
import ConstantHeat from './optionalConstantTemp/ConstantHeat';
import HeatingSchedule from './../controls/HeatingSchedule/HeatingSchedule';
import InstantHeat from './../controls/instantHeat/InstantHeat';
import SnowSensor from './../controls/snowSensor/SnowSensor';
import WindFactor from './../controls/windFactor/WindFactor';
import ConflictMessage from '../../userMessages/ConflictMessage';
import SettingConfirmedMessage from '../../userMessages/SettingConfirmedMessage';
import DisplayBox from '../DisplayBox';
import {
  convertCelsiusToFahrenheit,
  electricalFaultsList,
  tgsUpdateSchedule,
  updateDeviceInfo,
  updateSchedule,
} from '../../../helpers/helpers';
import { selectSettingsOfEss } from '../../../store/slices/settingsOfEssSlice';
import { useLocation } from 'react-router-dom';

const ControlBox = ({ ...rest }) => {
  const userState = useSelector(selectUserState);
  const { isEssSwitch, isGas } = userState;
  const unitsState = useSelector(selectSettingsOfEss);
  const mode = unitsState.interfaceMode;
  const { unitsMeasurement } = unitsState.buttonsOfSettings;
  const location = useLocation();

  const systemData = useSelector(selectTgsSwitch);
  const {
    displayConflictMessage,
    devicesConflicts,
    electricalInfo,
    gasInfo,
    settings,
  } = systemData;
  const faultsState = useSelector(selectFaults);

  const essFault = faultsState.ess.message.length > 0;
  const tgsFault = faultsState.tgs.message.length > 0;

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
    return electricalFaultsList(electricalInfo).headerFaults?.map((fault) =>
      fault.split(' ').slice(0, 2).join(' ')
    );
  }, [electricalInfo]);

  const tgsState = useSelector(selectTgsSwitch);
  const {
    instantHeat,
    fanOnly,
    snowSensor,
    optionalConstantTemp,
    heatingSchedule,
    windFactor,
  } = tgsState;

  const dispatch = useDispatch();

  const [disabledBox, setDisabledBox] = useState(false);
  const [displayModeFaultMessageBox, setDisplayModeFaultMessageBox] =
    useState(false);

  // Check if tgs is activated
  useEffect(() => {
    instantHeat.isActivated && dispatch(activateTgsSwitchStatus());
    fanOnly && dispatch(activateTgsSwitchStatus());
    // snowSensor.isReady && dispatch(activateTgsSwitchStatus());
    snowSensor.isActivated && dispatch(activateTgsSwitchStatus());
    optionalConstantTemp.isActivated && dispatch(activateTgsSwitchStatus());
    // heatingSchedule.isReady && dispatch(activateTgsSwitchStatus());
    heatingSchedule.isActivated && dispatch(activateTgsSwitchStatus());
    // windFactor.isReady && dispatch(activateTgsSwitchStatus());
    windFactor.isActivated && dispatch(activateTgsSwitchStatus());
  }, [tgsState]);

  // Conflict message handlers
  const handleCancelConflictMessage = () => {
    // change display conflict message state into false
    dispatch(deactivateTgsConflictMessage());
  };

  const handleConfirmConflictMessage = () => {
    const systemTarget =
      devicesConflicts?.systemTarget === 'gas'
        ? 'gas_command'
        : 'electrical_command';

    if (devicesConflicts?.commandTarget === 'on_switch') {
      updateDeviceInfo('on_switch', 1, systemTarget);
      updateDeviceInfo(
        'instant_temp',
        devicesConflicts?.extraData,
        systemTarget
      );
    }
    if (devicesConflicts?.commandTarget === 'on_constant') {
      updateDeviceInfo('on_constant', 1, systemTarget);
      updateDeviceInfo(
        'constant_temp',
        devicesConflicts?.extraData,
        systemTarget
      );
    }
    if (devicesConflicts?.commandTarget === 'fan') {
      updateDeviceInfo('fan', 1, systemTarget);
    }
    if (devicesConflicts?.commandTarget === 'snow_enabled') {
      updateDeviceInfo('snow_enabled', 1, systemTarget);
    }
    if (devicesConflicts?.commandTarget === 'wind') {
      updateDeviceInfo('wind', 1, systemTarget);
    }
    if (devicesConflicts?.commandTarget === 'schedule') {
      isGas
        ? tgsUpdateSchedule(devicesConflicts?.extraData)
        : updateSchedule(devicesConflicts?.extraData);
    }

    dispatch(deactivateTgsConflictMessage());
    dispatch(deActivatedisplayTGSScheduleModal());
  };

  const isThermocouple = useMemo(() => {
    return settings?.tc_mode === 1 ? true : false;
  }, [settings]);

  const onSwitch = useMemo(() => {
    return electricalInfo?.on_switch === 1;
  }, [electricalInfo?.on_switch]);

  const onConstant = useMemo(() => {
    return electricalInfo?.on_constant === 1;
  }, [electricalInfo?.on_constant]);

  const scheduleEnabled = useMemo(() => {
    return electricalInfo?.schedule_enabled === 1;
  }, [electricalInfo?.schedule_enabled]);

  const snowSensorEnabled = useMemo(() => {
    return electricalInfo?.snow_enabled === 1;
  }, [electricalInfo?.snow_enabled]);

  const snowSensorTriggered = useMemo(() => {
    return electricalInfo?.snow_trigger === 1;
  }, [electricalInfo?.snow_trigger]);

  const windFactorEnabled = useMemo(() => {
    return electricalInfo?.wind_enabled === 1;
  }, [electricalInfo?.wind_enabled]);

  const windFactorTriggered = useMemo(() => {
    return electricalInfo?.wind_trigger === 1;
  }, [electricalInfo?.wind_trigger]);
  // *************temporary variables for display boxes

  const setTemp = useMemo(() => {
    return !isThermocouple
      ? '__'
      : settings?.unit === 'f'
      ? onSwitch ||
        onConstant ||
        scheduleEnabled ||
        (snowSensorEnabled && snowSensorTriggered) ||
        (windFactorEnabled && windFactorTriggered)
        ? Math.floor(convertCelsiusToFahrenheit(electricalInfo?.threshold_temp))
        : '__'
      : onSwitch ||
        onConstant ||
        scheduleEnabled ||
        (snowSensorEnabled && snowSensorTriggered) ||
        (windFactorEnabled && windFactorTriggered)
      ? Math.floor(electricalInfo?.threshold_temp)
      : '__';
  }, [
    settings?.unit,
    electricalInfo?.threshold_temp,
    snowSensorTriggered,
    onSwitch,
    onConstant,
    scheduleEnabled,
    windFactorTriggered,
    snowSensorEnabled,
    windFactorEnabled,
  ]);

  const currTemp = useMemo(() => {
    return !isThermocouple
      ? '__'
      : settings?.unit === 'f'
      ? onSwitch ||
        onConstant ||
        scheduleEnabled ||
        (snowSensorEnabled && snowSensorTriggered) ||
        (windFactorEnabled && windFactorTriggered)
        ? Math.floor(convertCelsiusToFahrenheit(electricalInfo?.display_temp))
        : '__'
      : onSwitch ||
        onConstant ||
        scheduleEnabled ||
        (snowSensorEnabled && snowSensorTriggered) ||
        (windFactorEnabled && windFactorTriggered)
      ? Math.floor(electricalInfo?.display_temp)
      : '__';
  }, [
    settings?.unit,
    electricalInfo?.display_temp,
    snowSensorTriggered,
    onSwitch,
    onConstant,
    scheduleEnabled,
    windFactorTriggered,
    snowSensorEnabled,
    windFactorEnabled,
  ]);
  // *************temporary variables for display boxes

  const hoursOfUsage = useMemo(() => {
    return Math.floor(electricalInfo?.hours_of_usage / 3600);
  }, [electricalInfo?.hours_of_usage]);

  return (
    <Wrapper>
      <HatImg
        src={
          isFaults
            ? mode ? '/static/images/controller-hat-background-faults_light.svg' : '/static/images/controller-hat-background-faults.svg'
            : mode ? '/static/images/controller-hat-background_light.svg' : '/static/images/controller-hat-background.svg'
        }
      />
      <Title>
        {isEssSwitch ? 'ess' : 'tes'}
        -controls
      </Title>

      <SectionContent isFaults={isFaults}>
        <SectionController>
          <InstantHeat
            deviceInfo={rest?.deviceInfo}
            isDisabled={isModeFault}
            setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox}
          />
          <ConstantHeat
            isDisabled={isModeFault}
            setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox}
          />
          <HeatingSchedule
            isDisabled={isModeFault}
            setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox}
          />
          <SnowSensor
            deviceInfo={rest?.deviceInfo}
            isDisabled={isModeFault}
            setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox}
          />
          <WindFactor
            deviceInfo={rest?.deviceInfo}
            isDisabled={isModeFault}
            setDisplayModeFaultMessageBox={setDisplayModeFaultMessageBox}
          />
          <SectionDisplayBox>
            <DisplayBox
              currData={!isNaN(setTemp) ? setTemp : '__'}
              unit={unitsMeasurement ? '°F' : '°C'}
              label='set temp.'
              // option 1 (below controllers)|| 2 (below chart)
              option={1}
            />

            <DisplayBox
              currData={!isNaN(currTemp) ? currTemp : '__'}
              unit={unitsMeasurement ? '°F' : '°C'}
              label='current temp.'
              // option 1 (below controllers)|| 2 (below chart)
              option={1}
            />

            <DisplayBox
              currData={!isNaN(hoursOfUsage) ? hoursOfUsage : '__'}
              unit='Hrs'
              label='hours of usage'
              // option 1 (below controllers)|| 2 (below chart)
              option={1}
            />
          </SectionDisplayBox>
        </SectionController>
      </SectionContent>

      {displayConflictMessage && (
        <ConflictMessage
          currentSwitch={devicesConflicts?.currentSwitch}
          DesiredSwitch={devicesConflicts?.DesiredSwitch}
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
      {displayModeFaultMessageBox && (
        <SettingConfirmedMessage
          alert={true}
          onClose={() => setDisplayModeFaultMessageBox(false)}
          title={isEssSwitch ? 'ess - controls' : 'tes - controls'}
          message='SYSTEM OFF
          UNTIL RELEASE FAULT! Go to faults page to check the details'
          src={'/static/images/heater-off-alert.svg'}
        />
      )}
    </Wrapper>
  );
};

export default ControlBox;

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

const SectionContent = styled.section`
  width: 192px;
  height: 100%;

  background: ${props => props.theme.layout.switch_controls.bgGradienthorzintal};
  border: 0.5px solid ${props => props.theme.layout.switch_controls.border};
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
