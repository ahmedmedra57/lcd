import { useState } from 'react';
import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';
import ForceGasElectricSystem from './ForceGasElectricSystem';
import Thermocouple from './Thermocouple';

function Control() {
  const enableSwitch = './static/images/greenEnableSwitch.png';
  const disableSwitch = './static/images/redDisableSwitch.png';
  const notActiveSwitch = './static/images/greyEnableDisableSwitch.png';

  const [toggleLeftEnableDisable, setToggleLeftEnableDisable] =
    useState(enableSwitch);
  const [toggleRightEnableDisable, setToggleRightEnableDisable] =
    useState(enableSwitch);

  const handleLeftSwitch = () => {
    if (toggleLeftEnableDisable === enableSwitch) {
      return setToggleLeftEnableDisable(disableSwitch);
    } else setToggleLeftEnableDisable(enableSwitch);
  };

  const handleRightSwitch = () => {
    if (toggleRightEnableDisable === enableSwitch) {
      return setToggleRightEnableDisable(disableSwitch);
    } else setToggleRightEnableDisable(enableSwitch);
  };

  return (
    <Wrapper>
      <Thermocouple
        toggleLeftEnableDisable={toggleLeftEnableDisable}
        handleLeftSwitch={handleLeftSwitch}
      />
      <ForceGasElectricSystem
        handleRightSwitch={handleRightSwitch}
        toggleRightEnableDisable={toggleRightEnableDisable}
      />
    </Wrapper>
  );
}

export default Control;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  /* background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 13px; */
  opacity: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
