import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  useFaultsStore,
  useSettingsStore,
  useTgsSwitchStore,
  useUserStore
} from "../../store/zustand";

import { flexboxCenter } from "../../styles/commonStyles";
import ApplyButtonInvisibleDiv from "../settings/settingsOptions/editAndApplyMessageBoxes/ApplyButtonInvisibleDiv";

import SidebarButton from "./SidebarButton";

const Sidebar = () => {
  const { ess, tgs } = useFaultsStore();
  const faults =
    ess.messages.length > 0 || tgs.messages.length > 0;

  const { isTesSwitch, isEssSwitch } = useUserStore();
  const { interfaceMode, buttonState } = useSettingsStore();
  const { settings, electricalFaults, gasFaults } = useTgsSwitchStore();
  const mode = interfaceMode;
  const applyState = buttonState === 'apply';
  const tesSwitch = isTesSwitch;
  const essSwitch = isEssSwitch;
  const initialState = isEssSwitch
    ? {
        ess: true,
        alarm: false,
        setting: false,
        tes: false,
        tgs: false,
      }
    : {
        ess: false,
        alarm: false,
        setting: false,
        tes: false,
        tgs: true,
      };
  const [isActivated, setIsActivated] = useState(initialState);
  const path = window.location.pathname;

  useEffect(() => {
    if (path === "/tes") {
      setIsActivated({
        ess: true,
        alarm: false,
        setting: false,
        tes: true,
        tgs: false,
      });
    } else if (path === "/alarm") {
      setIsActivated({
        ess: false,
        alarm: true,
        setting: false,
        tes: false,
        tgs: false,
      });
    } else if (path === "/setting") {
      setIsActivated({
        ess: false,
        alarm: false,
        setting: true,
        tes: false,
        tgs: false,
      });
    } else if (path === "/") {
      setIsActivated({
        ess: false,
        alarm: false,
        setting: false,
        tes: false,
        tgs: true,
      });
    }
  }, [path]);



  const essSrc = isActivated.ess
    ? mode? "/static/images/ess_light_active.svg" : "/static/images/ess-button-active.svg"
    : mode?"/static/images/ess_light.svg":"/static/images/ess-button.svg";

  const alarmFaults = isActivated.alarm
    ? mode? `/static/images/bell_light_active.svg` : `/static/images/faults-button-activated.svg`
    : mode? `/static/images/bell_light.svg` : `/static/images/faults-button-inActivated.svg`;

  const alarmNoFaults = isActivated.alarm
    ? mode? `/static/images/bell_light_active.svg` : `/static/images/alarm-button-active.svg`
    : mode? `/static/images/bell_light.svg` : `/static/images/alarm-button.svg`;

  const alarmSrc = useMemo(() => {
    if (essSwitch) {
      return ess.messages.length > 0 ? alarmFaults : alarmNoFaults;
    }
    return ess.messages.length > 0 ||
      tgs.messages.length > 0
      ? alarmFaults
      : alarmNoFaults;
  }, [settings, ess.messages, tgs.messages, isActivated, essSwitch, alarmFaults, alarmNoFaults]);

  const settingSrc = isActivated.setting
    ? mode? "/static/images/setting_light_active.svg" : "/static/images/setting-button-active.svg"
    : mode? "/static/images/setting_light.svg" : "/static/images/setting-button.svg";

  const tgsSrc = isActivated.tgs
    ? mode? "/static/images/tgs_light_active.svg" : "/static/images/tgs-button-active.svg"
    : mode? "/static/images/tgs_light.svg" : "/static/images/tgs-button.svg";

  const tesSrc = isTesSwitch
    ? isActivated.tes
      ? mode? "/static/images/tes_light_active.svg" : "/static/images/tes-button-active.svg"
      : mode? "/static/images/tes_light.svg" : "/static/images/tes-button.svg"
    : mode? "/static/images/tes_light.svg" : "/static/images/non-tes-button.svg";

  const buttonProps = essSwitch
    ? [
        [essSrc, "ess", "/tes"],
        [alarmSrc, "alarm", "/alarm", "wrapper-class"],
        [settingSrc, "setting", "/setting", "wrapper-class"],
      ]
    : [
        [tgsSrc, "tgs", "/"],
        [tesSrc, "tes", "/tes"],
        [alarmSrc, "alarm", "/alarm", "wrapper-class"],
        [settingSrc, "setting", "/setting", "wrapper-class"],
      ];

  const handleToggler = (id, wrapperClass) => {
    switch (id) {
      case "ess": {
        setIsActivated({
          ess: true,
          alarm: false,
          setting: false,
          tes: false,
          tgs: false,
        });
        break;
      }
      case "alarm": {
        setIsActivated({
          ess: false,
          alarm: true,
          setting: false,
          tes: false,
          tgs: false,
        });
        break;
      }
      case "setting": {
        setIsActivated({
          ess: false,
          alarm: false,
          setting: true,
          tes: false,
          tgs: false,
        });
        break;
      }
      case "tes": {
        setIsActivated({
          ess: false,
          alarm: false,
          setting: false,
          tes: true,
          tgs: false,
        });
        break;
      }
      case "tgs": {
        setIsActivated({
          ess: false,
          alarm: false,
          setting: false,
          tes: false,
          tgs: true,
        });
        break;
      }
      default:
        return;
    }
    if (wrapperClass) {
      const element = document.querySelector(".wrapper-class");
      if (element) {
        element.style.height = "100vh";
      }
    }
  };

  return (
    <Wrapper>
      {applyState && (
        <Div>
          <ApplyButtonInvisibleDiv />
        </Div>
      )}
      <ButtonContainerOuter>
        <ButtonContainerInner>
          {buttonProps.map((button, index) => (
            <SidebarButton
              onClickHandler={handleToggler}
              src={button[0]}
              key={index}
              id={button[1]}
              link={button[2]}
              isTesSwitch={isTesSwitch}
              wrapperClass={button[3]}
            />
          ))}
        </ButtonContainerInner>
      </ButtonContainerOuter>
    </Wrapper>
  );
};

export default Sidebar;

const Wrapper = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
`;

const Div = styled.div`
  width: 62px;
  height: 212px;
  position: absolute;
  z-index: 10;
`;

const ButtonContainerOuter = styled.div`
  width: 62px;
  height: fit-content;
  /* height: 165px; */
  padding: 0.3rem 0;

  background: ${props => props.theme.layout.sidebar.bgGradient} 0% 0%
    no-repeat padding-box;
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.sidebar.border};
  border-radius: 37px;
  opacity: 1;
  ${flexboxCenter}
`;

const ButtonContainerInner = styled.div`
  width: 50px;
  /* height: 152px; */
  height: fit-content;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 30px;
  opacity: 1;
  gap: .5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  /* justify-content: center; */
`;
