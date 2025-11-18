import { useSystemIdentificationStore } from '../store/systemIdentificationStore';

import styled from 'styled-components';
import {
  flexboxCenter,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';

import DateAndWeather from './DateAndWeather';
import { useTgsTesSettingsStore } from '../store/tgsTesSettingsStore';
import { useUserStore } from '../store/userStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTgsSwitchStore } from '../store/tgsSwitchStore';

const Header = () => {
  const { sysIdentification } = useSystemIdentificationStore();
  const { isEssSwitch, isTesSwitch } = useUserStore();
  const { gasType } = useTgsTesSettingsStore();
  const { interfaceMode } = useSettingsStore();
  const { settings } = useTgsSwitchStore();
  const mode = interfaceMode;
  const sysState = sysIdentification;

  

  const machineId = `id : ${settings?.id || ''}`;

  return (
    <OutsideWrapper>
      <DateAndWeather />
      <HeaderHole>
        <HeaderTop>
          <HeaderDisplayWrapper>
            <MachineData>
              {/* {!isEssSwitch && isTesSwitch
                ? tgsTesSwitchName
                : !isEssSwitch && !isTesSwitch
                ? tgsSwitchName
                : EssSwitchName} */}
              {settings?.zone_name} - {settings?.device_name}
            </MachineData>
          </HeaderDisplayWrapper>
          <Logo src={'/static/images/Umbrella-logo.png'} alt='Logo Image' />
          <HeaderDisplayWrapper>
            <MachineData>{machineId}</MachineData>
          </HeaderDisplayWrapper>
        </HeaderTop>
      </HeaderHole>
    </OutsideWrapper>
  );
};

export default Header;

const OutsideWrapper = styled.header`
  width: 100%;
  margin-bottom: var(--space3);
  ${flexboxCenter}
  flex-direction: column;
`;
const HeaderHole = styled.div`
  width: 1002px;
  height: 52px;
  border-radius: 39px;
  background: ${props => props.theme.layout.sidebar.bg};
  box-shadow: inset 0px 1px 1px #000000;
  ${flexboxCenter};
`;

const HeaderTop = styled.div`
  height: 50px;
  width: 1000px;
  border-radius: 25px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.main.border};
  ${justifyContentSpaceBetween}
  padding: 0 0.5%;
`;

const HeaderDisplayWrapper = styled.div`
  height: 40px;
  width: 389px;
  border-radius: 20px;
  background: ${props => props.theme.layout.header.bg};
  box-shadow: inset 0px 0px 6px #000000;
  ${flexboxCenter}
`;
const Logo = styled.img`
  height: 42px;
  width: 42px;
`;

const MachineData = styled.span`
  width: 91%;
  font-size: 14px;
  text-align: center;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    overflow: visible;
  }
`;
