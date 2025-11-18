import styled from 'styled-components';
import { useContext, useState } from 'react';
import {
  useSettingsStore,
  useTgsSettingsStore,
  useUserStore,
  useForceAndCommandStore,
  useEssSwitchStore,
  useTgsSwitchStore
} from '../../../store/zustand';
import { flexboxCenter } from '../../../styles/commonStyles';
import TitleOfSettingsOptions from './TitleOfSettingsOptions';
import AllTheSelectionsOfSettingsOptions from './AllTheSelectionsOfSettingsOptions';
import EditCancelApplyButtons from './EditCancelApplyButtons';
import { SettingsContext } from '../../../context/ContextOfSettings';
import ApplyButtonInvisibleDiv from './editAndApplyMessageBoxes/ApplyButtonInvisibleDiv';

function ContainerOfAllSettingsSelectOptionsAndButtons() {
  const settingsData = [
    'units',
    'wind factor trigger',
    'snow sensor trigger',
    'force & commands',
    'admin.',
  ];
  // useContext
  const {
    settingState,
    essSnowSensorInput,
    tgsSnowSensorInput,
    tesSnowSensorInput,
    selectUnitsState,
    metricImperialToggle,
    savedSelection,
  } = useContext(SettingsContext);

  // useState
  const buttonsName = ['edit', 'cancel', 'apply'];
  const [settingsState, setSettingsState] = useState('units');

  // zustand
  const mode = useSettingsStore((state) => state.interfaceMode);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const applyState = buttonState === 'apply';
  const essState = useUserStore((state) => state.isEssSwitch);
  const tesState = useUserStore((state) => state.isTesSwitch);
  const essHeaterTemp = useForceAndCommandStore((state) => state.essHeaterTemp);
  const essEncloseTemp = useForceAndCommandStore((state) => state.essEncloseTemp);
  const essOutsideTemp = useForceAndCommandStore((state) => state.essOutsideTemp);
  const tgsTesOutsideTemp = useForceAndCommandStore((state) => state.tgsTesOutsideTemp);
  const burningChamberTemp = useForceAndCommandStore((state) => state.burningChamberTemp);
  const tgsHeaterTemp = useForceAndCommandStore((state) => state.tgsHeaterTemp);
  const tgsTesEncloseTemp = useForceAndCommandStore((state) => state.tgsTesEncloseTemp);
  const tesHeaterTemp = useForceAndCommandStore((state) => state.tesHeaterTemp);

  

  return (
    <Wrapper mode={mode}>
      <WrapperTitle>
        <TitleOfSettingsOptions />
      </WrapperTitle>
      <>
        {applyState && (
          <Div>
            <ApplyButtonInvisibleDiv />
          </Div>
        )}
        <AllTheSelectionsOfSettingsOptions
          settingsData={settingsData}
          setSettingsState={setSettingsState}
        />
      </>
    </Wrapper>
  );
}
export default ContainerOfAllSettingsSelectOptionsAndButtons;

const Wrapper = styled.div`
  width: 280px;
  height: 100%;

  border-radius: 4px;
  opacity: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  row-gap: 6px;

  box-sizing: border-box;

  border: 0.5px solid ${props => props.theme.button.primary.border};
  background: ${props => props.theme.layout.card.bgGradient};
  opacity: 1;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
`;

const WrapperTitle = styled.div`
  margin-top: 6px;
`;

const Div = styled.div`
  height: 100%;
  width: 270px;
  position: absolute;
`;
