import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Switch from "./components/switch/Switch";
import Settings from "./components/settings/Settings";
import Faults from "./components/faults/Faults";
import { useSettingsStore, useTgsSwitchStore, useUserStore } from "./store/zustand";
import { useEffect, useMemo } from "react";
import MainLoadingPage from "./components/loading/MainLoadingPage";
import { calculatedTime } from "./helpers/helpers";
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import GlobalStyle from "./styles/GlobalStyles";
import { TIMEOUTS } from "./constants";

const MainPage = () => {
  // Zustand stores
  const isEssSwitch = useUserStore((state) => state.isEssSwitch);
  const isGas = useUserStore((state) => state.isGas);
  const handleTesSwitch = useUserStore((state) => state.handleTesSwitch);
  const mode = useSettingsStore((state) => state.interfaceMode);
  const gasInfo = useTgsSwitchStore((state) => state.gasInfo);
  const electricalInfo = useTgsSwitchStore((state) => state.electricalInfo);
  const settings = useTgsSwitchStore((state) => state.settings);

  const LoadingTime = useMemo(() => {
    return isGas
      ? calculatedTime(gasInfo.estimated_time, gasInfo.init_time)
      : 0;
  }, [gasInfo.estimated_time, gasInfo.init_time, isGas]);

  // Auto-reload application every 12 hours to ensure fresh data and prevent memory leaks
  setTimeout(() => {
    window.location.reload();
  }, TIMEOUTS.APP_AUTO_RELOAD);

  // Handle system configuration changes
  const systemConfiguration = JSON.stringify(settings?.system_configuration);
  useEffect(() => {
    handleTesSwitch(systemConfiguration?.includes("TES") ? true : false);
  }, [systemConfiguration, handleTesSwitch]);

  return (
    <ThemeProvider theme={mode ? lightTheme : darkTheme}>
      <GlobalStyle />
      <Wrapper>
        <Header />
        <Title
          src={
            mode
              ? "/static/images/blueUmbrellaName.svg"
              : "/static/images/embrellaTitle-sm.svg"
          }
        />

        <BrowserRouter>
          <MainContentsWrapper>
            {LoadingTime ? (
              <MainLoadingPage isTgs={isGas} />
            ) : (
              <>
                <Sidebar />
                <Routes>
                  {isEssSwitch ? (
                    <>
                      <Route
                        path="/tes"
                        element={
                          <Switch
                            deviceInfo={electricalInfo}
                            deviceType="electrical"
                          />
                        }
                      />
                      <Route path="/" element={<Navigate to="/tes" replace />} />
                    </>
                  ) : (
                    <>
                      <Route
                        path="/"
                        element={<Switch deviceInfo={gasInfo} deviceType="gas" />}
                      />
                      <Route
                        path="/tes"
                        element={
                          <Switch
                            deviceInfo={electricalInfo}
                            deviceType="electrical"
                          />
                        }
                      />
                    </>
                  )}
                  <Route path="/alarm" element={<Faults />} />
                  <Route path="/setting" element={<Settings />} />
                </Routes>
              </>
            )}
          </MainContentsWrapper>
        </BrowserRouter>

        <Footer />
      </Wrapper>
    </ThemeProvider>
  );
};

export default MainPage;

const Wrapper = styled.section`
  box-sizing: border-box;
  width: 1024px;
  height: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  @media (min-height: 1024px) and (min-width: 1024px) {
    transform: scale(1.8, 1.6);
  }

  background: ${props => props.theme.layout.switch_controls.mainbg};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.main.border};

  padding: var(--space4) var(--space0);
  position: relative;
`;

const Title = styled.img`
  margin-bottom: var(--space3);
`;

const MainContentsWrapper = styled.section`
  background: transparent;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  margin-bottom: var(--space3);
`;