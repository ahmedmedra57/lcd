import { useUserStore } from "../../store/userStore";
import { useLocation } from "react-router-dom";

import styled, { css } from "styled-components";
import { flexboxCenter } from "../../styles/commonStyles";

import ControlBox from "./controls/ControlBox";
import ChartContainer from "./chart/ChartContainer";
import HeaterStatus from "./HeaterStatus/HeaterStatus";
import TgsControlBox from "./controls/tgsControlBox";
import { useEffect } from "react";
import LoadingRouter from "../loading/LoadingRouter";
import { useChartStore } from "../../store/chartStore";

const Switch = ({ ...rest }) => {
  const { isEssSwitch, isInhand, isGas, setIsGas, setIsInhand } = useUserStore();
  const { wifiState } = useChartStore();
  const mode = JSON.parse(localStorage.getItem("themeMode"));
  const location = useLocation();
  useEffect(() => {
    setIsGas(rest.deviceType === "gas" ? true : false);
    setIsInhand(!rest.deviceInfo.inhand ? false : true);
  }, [rest.deviceType, rest.deviceInfo.inhand, setIsGas, setIsInhand]);

  // only display Heater status ' in ESS Switch '
  const isActivated = isEssSwitch ? true : false;
  const displayHeaterStatus = isEssSwitch
    ? true
    : location.pathname === "/"
    ? false
    : true;

  return (
    <Wrapper
      isActivated={isActivated}
      margin={isEssSwitch ? false : location.pathname === `/` ? true : false}
    >
      {/* <DisplayEnergyConsumption /> */}

      <SectionContents>
        <MainSection>
          {isGas && !isInhand && (
            <RouterConnectionError>
              <LoadingRouter isCenterPosition={true} />
            </RouterConnectionError>
          )}
          {isEssSwitch ? (
            <ControlBox {...rest} />
          ) : location.pathname === "/" ? (
            <TgsControlBox {...rest} />
          ) : (
            <ControlBox {...rest} />
          )}
          <ChartContainer mode={mode} {...rest} />
        </MainSection>
        {displayHeaterStatus && (
          <SubSection>
            <HeaterStatus />
          </SubSection>
        )}
      </SectionContents>
      
    </Wrapper>
  );
};

export default Switch;

const Wrapper = styled.div`
  width: 901px;
  height: 100%;
  box-shadow: ${props => props.theme.layout.card.shadow};
  background: ${props => props.theme.layout.card.bg};

  border-radius: 11px 0px 13px 13px;
  margin-bottom: 16px;

  ${flexboxCenter}

  position: relative;

  ${(p) =>
    p.margin ||
    css`
      padding-bottom: 0.2rem;
    `}
`;

const SectionContents = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

const MainSection = styled.section`
  width: 100%;
  height: 100%;
  ${flexboxCenter}
  justify-content: space-between;
  align-items: center;

  padding: 0 2px;
`;

const RouterConnectionError = styled.div`
  width: 101%;
  height: 100%;

  border-radius: 12px;
  border: 8px solid ${props => props.theme.status.warning.text};

  background-color: ${props => props.theme.layout.overlay.bg};

  position: absolute;
  left: 0;
  top: 0;

  z-index: 2;
`;

const SubSection = styled.section`
  ${flexboxCenter}
`;
