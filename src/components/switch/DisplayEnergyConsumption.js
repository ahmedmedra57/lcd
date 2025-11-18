import { useLocation } from 'react-router-dom';

import {
  useEssSwitchStore,
  useSettingsStore,
  useTgsSwitchStore,
  useUserStore
} from '../../store/zustand';

import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';

const DisplayEnergyConsumption = ({ deviceType, deviceInfo }) => {
  const ssState = useEssSwitchStore();
  const gsState = useTgsSwitchStore();
  const { isEssSwitch } = useUserStore();
  const unitsMeasurement = useSettingsStore((state) => state.unitsMeasurement);
  const location = useLocation();

  // const energyConsumption = isEssSwitch
  //   ? ssState.energyConsumption
  //   : location.pathname === '/'
  //   ? gsState.energyConsumption
  //   : ssState.energyConsumption;

  const title = isEssSwitch
    ? 'energy'
    : location.pathname === '/'
    ? 'gas'
    : 'energy';
  const energyConsumption =
    deviceType === 'gas'
      ? Math.round((unitsMeasurement ? deviceInfo?.gas_reading : deviceInfo?.gas_reading * 0.0283168) * 10) / 10
      : deviceType === 'electrical' && deviceInfo?.energy_reading;
  return (
    <Wrapper>
      <SectionContent>
        <SectionLogo>
          <EnergyLogo src={'/static/images/energy-consumption-logo.svg'} />
        </SectionLogo>
        <SectionInfo>
          <Title>
            total {title} <br></br>consumption
          </Title>
          <EnergyConsumption>
            {!isNaN(energyConsumption) ? energyConsumption : ''}{' '}
            {isEssSwitch ? (
              <EnergyConsumption option={true}>kw</EnergyConsumption>
            ) : location.pathname !== '/' ? (
              <EnergyConsumption option={true}>Kw</EnergyConsumption>
            ) : unitsMeasurement ? (
              <EnergyConsumption>FT³</EnergyConsumption>
            ) : (
              <EnergyConsumption>M³</EnergyConsumption>
            )}
          </EnergyConsumption>
        </SectionInfo>
      </SectionContent>
    </Wrapper>
  );
};

export default DisplayEnergyConsumption;

const Wrapper = styled.div`
  width: 189px;
  height: 53px;
  border-radius: 6px;


  ${flexboxCenter}/* position: absolute;
  top: -0.7rem;
  left: 0.2rem; */
`;

const SectionContent = styled.section`
  width: 183px;
  height: 47px;

  border: 1px solid ${props => props.theme.status.info.border};
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionInfo = styled.section`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: 4px 0 0 0;
`;

const Title = styled.span`
  width: 100%;
  font-size: 10px;
  color: ${props => props.theme.status.info.text};
  line-height: 90%;
  text-align: center;
  margin-bottom: -2px;
`;

const EnergyConsumption = styled.span`
  width: 100%;
  font-size: 21px;
  color: ${props => props.theme.status.info.text};
  letter-spacing: 2.1px;
  text-align: center;

  ${(p) =>
    p.option &&
    css`
      text-transform: uppercase;
    `}
`;

const SectionLogo = styled.section`
  height: 100%;
  width: 30%;
  ${flexboxCenter}
`;
const EnergyLogo = styled.img`
  width: 70%;
`;
