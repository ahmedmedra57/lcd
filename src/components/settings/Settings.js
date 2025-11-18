import styled from 'styled-components';

import { flexboxCenter } from '../../styles/commonStyles';
import Titles from './headings/Titles';
import SettingsOptionsAndInterfaceMode from './settingsOptions/SettingsOptionsAndInterfaceMode';
import { useSelector } from 'react-redux';
import { selectSettingsOfEss } from '../../store/slices/settingsOfEssSlice';
import TitleOfAllSettings from './headings/TitleOfAllSettings';
import ContainerOfMetricImperialAndMeasurementTitle from './settingsOptions/units/ContainerOfMetricImperialAndMeasurementTitle';
import ContainerOfWindFactor from './settingsOptions/windFactorTrigger/ContainerOfWindFactor';
import ContainerOfSnowSensor from './settingsOptions/snowSensorTrigger/ContainerOfSnowSensor';
import ContainerOfForceAndCommand from './settingsOptions/ForceAndCommand/ContainerOfForceAndCommand';
import ContainerOfAdmin from './settingsOptions/admin/ContainerOfAdmin';
import TitleOfSelectUnitsOfMeasurement from './settingsOptions/units/TitleOfSelectUnitsOfMeasurement';
import SettingsProvider from '../../context/ContextOfSettings';

const Settings = () => {
  const state = useSelector(selectSettingsOfEss);
  const mode = state.interfaceMode;
  const {
    settingsOptionsUnits,
    settingsOptionsWindFactor,
    settingsOptionsSnowFactor,
    settingsOptionsForceAndCommand,
  } = state.allSettingsOptions;

  const flexStart = true;

  return (
    <>
      <SettingsProvider>
        <TitleMainSectionContainer>
          <TitleContainer>
            <Titles name='settings' />
          </TitleContainer>
          <MainSectionContainer>
            <MainSection mode={mode}>
              <ContainerUnitsSettings>
                <TitleOfAllSettings />
              </ContainerUnitsSettings>
              <WrapperSettingsModeAndSelect flexStart={flexStart}>
                <SettingsOptionsAndInterfaceMode />
                {settingsOptionsUnits ? (
                  <WrapperAllSettings>
                    <ContainerOfMetricImperialAndMeasurementTitle />
                  </WrapperAllSettings>
                ) : settingsOptionsWindFactor ? (
                  <WrapperAllSettings>
                    <ContainerOfWindFactor />
                  </WrapperAllSettings>
                ) : settingsOptionsSnowFactor ? (
                  <WrapperAllSettings>
                    {' '}
                    <ContainerOfSnowSensor />
                  </WrapperAllSettings>
                ) : settingsOptionsForceAndCommand ? (
                  <WrapperAllSettings>
                    <ContainerOfForceAndCommand />
                  </WrapperAllSettings>
                ) : (
                  <WrapperAllSettings>
                    <ContainerOfAdmin />
                  </WrapperAllSettings>
                )}
              </WrapperSettingsModeAndSelect>
            </MainSection>
          </MainSectionContainer>
        </TitleMainSectionContainer>
      </SettingsProvider>
    </>
  );
};

export default Settings;

const TitleMainSectionContainer = styled.div`
  height: 100%;
  width: 901px;
`;

const TitleContainer = styled.div`
  width: 901px;
  height: 22px;
`;

const MainSectionContainer = styled.div`
  width: 902px;
  height: 100%;
  margin-top: 8px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  opacity: 1;
  ${flexboxCenter};
`;

const MainSection = styled.div`
  width: 898px;
  height: 100%;
  margin-top: 2px;
  margin-bottom: 2px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 10px;
  opacity: 1;
`;

const ContainerUnitsSettings = styled.div`
  ${flexboxCenter}
  margin-top:5px;
`;

const WrapperSettingsModeAndSelect = styled.div`
  display: flex;
  justify-content: ${({ flexStart }) =>
    flexStart ? 'flex-start' : 'space-evenly'};
  align-items: flex-start;
  margin-top: 4px;
  margin-left: 5px;
`;

const WrapperAllSettings = styled.div`
  margin-left: 8px;
`;
