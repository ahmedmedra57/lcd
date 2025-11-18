import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectSettingsOfEss } from '../../../store/slices/settingsOfEssSlice';

function TitleOfAllSettings() {
  const state = useSelector(selectSettingsOfEss);
  const {
    settingsOptionsUnits,
    settingsOptionsWindFactor,
    settingsOptionsSnowFactor,
    settingsOptionsForceAndCommand,
  } = state.allSettingsOptions;

  const settingsTitles = settingsOptionsUnits
    ? 'units settings'
    : settingsOptionsWindFactor
    ? 'wind factor trigger'
    : settingsOptionsSnowFactor
    ? 'snow sensor trigger'
    : settingsOptionsForceAndCommand
    ? 'force & commands'
    : 'administration settings';

  return (
    <>
      <Container>
        <SettingTitle>
          SETTINGS//SETTINGS OPTIONS//
          <Span>{settingsTitles}</Span>
        </SettingTitle>
        <ContainerOptions>
          <UnitSettings>
            {settingsTitles}
            <Dots>
              .................................................................................................
            </Dots>
          </UnitSettings>
        </ContainerOptions>
        <Img src={'/static/images/logoBrighter.svg'} />
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 884px;
  height: 52px;

  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 6px;
  padding-top: 6px;
  border-radius: 6px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: ${props => props.theme.layout.card.shadow};
  opacity: 1;
`;

const SettingTitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.label.secondary};
  letter-spacing: 1.4px;
`;

const ContainerOptions = styled.div`
  height: 23px;
  width: 822px;
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Span = styled.span`
  color: ${props => props.theme.status.success.text};
  font-size: var(--font-size3);
  text-transform: uppercase;
`;

const UnitSettings = styled.p`
  font-size: var(--font-size6);
  color: ${props => props.theme.label.secondary};
  letter-spacing: 2px;
  border-bottom: 1px solid ${props => props.theme.label.primary};
  margin-top: -2px;
  margin-right: 13px;
  padding-bottom: 0.5px;
  text-transform: uppercase;
`;

const Dots = styled.span`
  letter-spacing: 4px;
`;

const Img = styled.img`
  height: 34px;
  width: 36px;
  position: absolute;
  top: 13%;
  left: 94.5%;
`;

export default TitleOfAllSettings;
