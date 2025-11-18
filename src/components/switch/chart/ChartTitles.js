import React,{useMemo} from "react";
import { useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { electricalFaultsList, gasFaultsList } from "../../../helpers/helpers";
import useChartStore from "../../../store/zustand/chartStore";
import useFaultsStore from "../../../store/zustand/faultsStore";
import useTgsSwitchStore from "../../../store/zustand/tgsSwitchStore";
import useUserStore from "../../../store/zustand/userStore";
import { flexboxCenter } from "../../../styles/commonStyles";

const electrical = "electrical";
const gas = "gas";

function ChartTitles({ deviceInfo, deviceType }) {
  const { gpState, ebpState, wifiState } = useChartStore();
  const mode = JSON.parse(localStorage.getItem("themeMode"));
  const { ess, tgs } = useFaultsStore();
  const { isEssSwitch } = useUserStore();
  const { settings } = useTgsSwitchStore();
  const location = useLocation();

  const essFaults = ess.messages.length > 0;
  const tgsFaults = tgs.messages.length > 0;
  const alarmSrc = useMemo(() => {
    // if (essFaults) {
    //   return location.pathname === "/";
    // }
    if (deviceType === electrical) {
      return electricalFaultsList(deviceInfo)?.headerFaults?.length
        ? "/static/images/alarm-activated.svg"
        : mode? "/static/images/alarm-inactivated_light.svg" : "/static/images/alarm-inactivated.svg";
    } else if (deviceType === gas) {
      return gasFaultsList(deviceInfo)?.headerFaults?.length
        ? "/static/images/alarm-activated.svg"
        : mode? "/static/images/alarm-inactivated_light.svg" : "/static/images/alarm-inactivated.svg";
    }
  }, [deviceType, deviceInfo]);
  return (
    <Wrapper>
      <Title>SWITCH GENERATED TELEMETRY </Title>

      <ItemsWrapperUl>
        <GpEbpWrapper>
          <ItemTitle isActivated={!settings?.EBP || settings?.EBP === 0}>GP</ItemTitle>
          <BatteryImage
            src={
              !settings?.EBP
                ? mode? "/static/images/battery-activated_light.svg" : "/static/images/battery-activated.svg"
                : mode? "/static/images/battery-inactivated_light.svg" : "/static/images/battery-inactivated.svg"
            }
          />
        </GpEbpWrapper>

        <GpEbpWrapper>
          <ItemEbpTitle isActivated={settings?.EBP || settings?.EBP === 1}>EBP</ItemEbpTitle>
          <BatteryImage
            src={
              settings?.EBP
                ? "/static/images/battery-activated-orange.svg"
                : mode? "/static/images/battery-inactivated_light.svg" : "/static/images/battery-inactivated.svg"
            }
          />
        </GpEbpWrapper>

        <WifiAlertIconsWrapper>
          <Img
            src={
              wifiState
                ? mode? "/static/images/wifi-activated_light.svg" : "/static/images/wifi-activated.svg"
                : mode? "/static/images/wifi-inactivated_light.svg" : "/static/images/wifi-inactivated.svg"
            }
          />
        </WifiAlertIconsWrapper>
        <WifiAlertIconsWrapper>
          <Img faluts={true} src={alarmSrc} />
        </WifiAlertIconsWrapper>
      </ItemsWrapperUl>
    </Wrapper>
  );
}

export default ChartTitles;

const Wrapper = styled.div`
  width: 100%;
  height: 22px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 16px;

  ${flexboxCenter}
  justify-content: space-between;

  padding-right: 0.15rem;
  padding-left: 0.5rem;
`;

const Title = styled.span`
  font-size: 14px;
  text-align: start;

  border-bottom: 1px solid ${props => props.theme.label.primary};
  width: 72%;
  margin-right: var(--space3);
`;

const ItemsWrapperUl = styled.ul`
  ${flexboxCenter}
  justify-content: space-between;
  padding: 0 0.05rem;

  width: 187px;
  height: 18px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 18px;
`;

const GpEbpWrapper = styled.li`
  width: 56px;
  height: 16px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 8px;

  ${flexboxCenter}
  justify-content: space-evenly;
`;

const ItemTitle = styled.span`
  color: ${(p) => props => p.isActivated ? props.theme.status.success.text : props.theme.label.disabled};
  font-size: 11px;
`;

const ItemEbpTitle = styled.span`
  color: ${(p) => props => p.isActivated ? props.theme.status.warning.text : props.theme.label.disabled};
  font-size: 11px;
`;

const BatteryImage = styled.img``;

const WifiAlertIconsWrapper = styled.li`
  width: 27px;
  height: 16px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 8px;
  ${flexboxCenter}
`;

const Img = styled.img`
  ${(p) =>
    p.faults &&
    css`
      margin-left: 0.17rem;
    `}
`;
