import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import styled, { css } from "styled-components";

import { flexboxCenter } from "../../../styles/commonStyles";
import { updateSettingsValues } from "../../../helpers/helpers";
import {
  selectTgsSwitch,
  setSSRSettings,
} from "../../../store/slices/tgsSwitchSlice";
import { useEffect } from "react";
import { toggle } from "../../../store/slices/heaterStatusSlice";

const ToggleSWitch = ({ data, id, localHeaters, setLocalHeaters, isUpdating, setIsUpdating }) => {
  const { buttonStatus, switchName, reset, switch_system_id } = data;
  const systemData = useSelector(selectTgsSwitch);
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const { settings, ssr_setting } = systemData;
  // true || false || 'flt

  let swtName = "";

  if (settings && settings?.switch_panels && switch_system_id) {
    swtName = settings?.switch_panels.find(
      (item) => item?.system_id === switch_system_id
    )?.name;
  }

  const status = buttonStatus === "flt" ? "flt" : buttonStatus ? "on" : "off";
  const isTest = data?.test === 1 ? true : false;

  const switchIconSrc = isTest
    ? "/static/images/ssr-switch-reset.svg"
    : status === "on"
    ? "/static/images/ssr-switch-on.svg"
    : status === "off"
    ? "/static/images/ssr-switch-off.svg"
    : "/static/images/ssr-switch-flt.svg";

  // --- BACK END -----
  // --- when an adminstrator mechanically turns off the ssr, reset state becomes true
  // --- depends on reset status toggle switch status becomes off
  // --- BACK END -----

  const sendSwitchStatus = () => {
    if(isUpdating) return;

    setIsUpdating(true);
    const newValues = {
      activated_heaters: localHeaters.map((item, index) => {
        if (index === id - 1) {
          return ssr_setting[index].active === true ||
            ssr_setting[index].fault === true
            ? 0
            : 1;
        }
        return item;
      }),
    };
    updateSettingsValues(settings, newValues);

    const newList = ssr_setting.map((item, index) =>
      index === id - 1 ? { ...item, active: !buttonStatus } : item
    );
    dispatch(setSSRSettings(newList));
    dispatch(toggle("ssr" + id));

 setTimeout(()=>{
      setIsUpdating(false);
    },5000);
  };
  const switchNameSplitted = switchName?.split(" - ") || ["", ""];

  return (
    <Wrapper>
      <Flex>
        <Title size={true}>ssr{id}</Title>
        <Title>{swtName ? swtName : ""}</Title>
      </Flex>
      <SwitchButton
        disabled={status === "flt" ? true : false}
        onClick={sendSwitchStatus}
        isOff={status === "off"}
        isUpdating={isUpdating}
      >
         <ToggleWrapper>
          <TogglePart active={status === "on"}>ON</TogglePart>
          <TogglePart active={status === "off"}>OFF</TogglePart>
        </ToggleWrapper>
      </SwitchButton>
    </Wrapper>
  );
};

export default ToggleSWitch;
const Wrapper = styled.div`
  padding-top: 0.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
`;

const Title = styled.span`
  font-size: 7px;
  color: ${({ theme }) => theme.label.switch};

  max-width: 90px;
  /* max-height: 20px; */
  overflow: hidden;
  ${(p) =>
    p.size &&
    css`
      font-size: 10px;
    `}
`;

const SwitchButton = styled.button`
 margin-top: 4px;
  height: 32px;
  ${flexboxCenter}
  padding: 0;
  border: 3px solid ${({ theme, isOff }) => isOff ? theme.label.disabled : "transparent"};
  background: ${({ theme }) => theme.layout.card.bg};
  border-radius: 20px;
  transition: all 0.25s ease;

  cursor: pointer;

  ${(props) =>
    (props.disabled || props.isUpdating) &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      box-shadow: none;
      pointer-events: none;
    `}
`;
const ToggleWrapper = styled.div`
  display: flex;
  width: 70px;
  border-radius: 20px;
  overflow: hidden;
`;

const TogglePart = styled.div`
  flex: 1;
  padding: 5px 0;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: ${(p) =>
    p.children === "ON" ? "20px 0 0 20px" : "0 20px 20px 0"};

  color: ${({ theme, active, children }) => { 
    if (active && children === "ON") return theme.status.success.text;
    if (active && children === "OFF") return theme.status.error.text;
    return "#000000";
  }};


  background: ${(p) => (p.children === "ON" ? p.theme.layout.container.bg : p.theme.layout.card.bg)};


  transform: ${(p) => (p.active ? "translateY(0)" : "translateY(-2px)")};
  box-shadow: ${(p) =>
    p.active
      ? "inset 0 2px 4px rgba(0,0,0,0.6)"
      : "0 2px 6px rgba(0, 0, 0, 0.5)"};



  &:hover {
    opacity: 0.9;
  }
`;
