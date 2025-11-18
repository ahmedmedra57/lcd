import { useLocation } from 'react-router-dom';
import {
  useUserStore,
  useSettingsStore,
  useTgsSwitchStore
} from '../../../store/zustand';

import styled from 'styled-components';

import DisplayBox from './../DisplayBox';

import { convertCelsiusToFahrenheit } from '../../../helpers/helpers';
import { useMemo } from 'react';

const DisplayStatus = ({ deviceInfo, deviceType }) => {
  // Add conditional statement to assignment values
  const unitsMeasurement = useSettingsStore((state) => state.unitsMeasurement);
  const { settings } = useTgsSwitchStore();
  const { isEssSwitch } = useUserStore();
  const location = useLocation();

  const onSwtich = useMemo(() => {
    return deviceInfo?.on_switch === 1;
  }, [deviceInfo?.on_switch]);

  const onConstant = useMemo(() => {
    return deviceInfo?.on_constant === 1;
  }, [deviceInfo?.on_constant]);

  const fanEnabled = useMemo(() => {
    return deviceInfo?.fan === 1;
  }, [deviceInfo?.fan]);

  const scheduleEnabled = useMemo(() => {
    return deviceInfo?.schedule_enabled === 1;
  }, [deviceInfo?.schedule_enabled]);

  const snowSensorEnabled = useMemo(() => {
    return deviceInfo?.snow_enabled === 1;
  }, [deviceInfo?.snow_enabled]);

  const snowSensorTriggered = useMemo(() => {
    return deviceInfo?.snow_trigger === 1;
  }, [deviceInfo?.snow_trigger]);

  const windFactorEnabled = useMemo(() => {
    return deviceInfo?.wind_enabled === 1;
  }, [deviceInfo?.wind_enabled]);

  const windFactorTriggered = useMemo(() => {
    return deviceInfo?.wind_trigger === 1;
  }, [deviceInfo?.wind_trigger]);

  const energyConsumption = useMemo(() => {
    return deviceType === 'gas'
      ? onSwtich || scheduleEnabled || (snowSensorEnabled && snowSensorTriggered) || (windFactorEnabled && windFactorTriggered)
        ? Math.round((settings.unit === 'c' ? deviceInfo?.gas_consumption * 0.0283168 : deviceInfo?.gas_consumption) * 10) / 10
        : '__'
      : deviceType === 'electrical' && (onSwtich || onConstant || scheduleEnabled || (snowSensorEnabled && snowSensorTriggered) || (windFactorEnabled && windFactorTriggered))
      ? Math.round(deviceInfo?.energy_consumption * 10) / 10
      : '__';
  }, [
    snowSensorTriggered,
    deviceType,
    deviceInfo?.energy_consumption,
    deviceInfo?.gas_consumption,
    onSwtich,
    onConstant,
    scheduleEnabled,
    windFactorTriggered,
    snowSensorEnabled,
    windFactorEnabled,
  ]);

  const enclosureValue = useMemo(() => {
    return settings?.unit === 'f'
      ? Math.floor(convertCelsiusToFahrenheit(deviceInfo?.enclosure_temp))
      : Math.floor(deviceInfo?.enclosure_temp);
  }, [settings?.unit, deviceInfo?.enclosure_temp]);
  
  const outsideTemp = useMemo(() => {
    return settings?.unit === 'f'
      ? Math.floor(convertCelsiusToFahrenheit(settings?.outside_temp))
      : Math.floor(settings?.outside_temp);
  }, [settings?.unit, settings?.outside_temp]);
  
  return (
    <Wrapper>
      <DisplayBox
        currData={!isNaN(energyConsumption) ? energyConsumption : '__'}
        unit={'Kw/H'}
        name='energyConsumption'
        option={2}
        label={
          isEssSwitch
            ? 'energy consumption'
            : location.pathname === '/'
            ? 'gas consumption'
            : 'energy consumption'
        }
      />
      <DisplayBox
        currData={!isNaN(enclosureValue) ? enclosureValue : '__'}
        unit={unitsMeasurement ? '°F' : '°C'}
        label='enclosure temperature'
        option={2}
      />
      <DisplayBox
        currData={!isNaN(outsideTemp) ? outsideTemp : '__'}
        unit={unitsMeasurement ? '°F' : '°C'}
        label='outside temperature'
        option={2}
      />
    </Wrapper>
  );
};

export default DisplayStatus;

const Wrapper = styled.div`
  width: 689px;
  height: 80px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 7px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 1px;
`;
