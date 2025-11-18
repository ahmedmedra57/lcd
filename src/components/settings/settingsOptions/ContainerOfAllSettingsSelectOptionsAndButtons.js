import styled from 'styled-components';
import { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { flexboxCenter } from '../../../styles/commonStyles';
import TitleOfSettingsOptions from './TitleOfSettingsOptions';
import AllTheSelectionsOfSettingsOptions from './AllTheSelectionsOfSettingsOptions';
import {
  selectSettingsOfEss,
  setSettingsEditButton,
  setSettingsCancelButton,
  setSettingsApplyUnitsButton,
  setSettingsApplyWindFactorTriggerButton,
  setSettingsApplySnowSensorTriggerButton,
  setSettingsApplyForceCommandButton,
  setEditButtonToFalse,
  setCancelButtonToFalse,
  setApplyButtonToFalse,
  setApplyButtonToTrue,
} from '../../../store/slices/settingsOfEssSlice';
import {
  setTgsSettingsEditButton,
  setTgsSettingsCancelButton,
  setTgsSettingsApplyUnitsButton,
  setTgsSettingsApplySnowSensorButton,
  setTgsSettingsApplyForceAndCommandButton,
  setTgsSettingsApplyAdminButton,
} from '../../../store/slices/settingsOfTgsSlice';
import {
  setTgsTesSettingsEditButton,
  setTgsTesSettingsCancelButton,
  setTgsTesSettingsApplyUnitsButton,
  setTgsTesSettingsApplySnowSensorButton,
  setTgsTesSettingsApplyForceAndCommandButton,
  setTgsTesSettingsApplyAdminButton,
} from '../../../store/slices/settingsOfTgsTesSlice';
import EditCancelApplyButtons from './EditCancelApplyButtons';
import {
  handleTesSwitch,
  selectUserState,
} from '../../../store/slices/userSlice';
import { SettingsContext } from '../../../context/ContextOfSettings';
import { handleSnowSensorDefaultTemp } from '../../../store/slices/essSwitchSlice';
import { selectForceAndCommand } from '../../../store/slices/forceAndCommandSlice';
import { handleTgsSnowSensorDefaultTemp } from '../../../store/slices/tgsSwitchSlice';
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

  // redux
  const dispatch = useDispatch();
  const state = useSelector(selectSettingsOfEss);
  const mode = state.interfaceMode;
  const applyState = state.buttonsOfSettings.settingsApplyButton;
  const essTesState = useSelector(selectUserState);
  const essState = essTesState.isEssSwitch;
  const tesState = essTesState.isTesSwitch;
  const forceCommandState = useSelector(selectForceAndCommand);
  const essHeaterTemp = forceCommandState.essHeaterTemp;
  const essEncloseTemp = forceCommandState.essEncloseTemp;
  const essOutsideTemp = forceCommandState.essOutsideTemp;
  const tgsTesOutsideTemp = forceCommandState.tgsTesOutsideTemp;
  const burningChamberTemp = forceCommandState.burningChamberTemp;
  const tgsHeaterTemp = forceCommandState.tgsHeaterTemp;
  const tgsTesEncloseTemp = forceCommandState.tgsTesEncloseTemp;
  const tesHeaterTemp = forceCommandState.tesHeaterTemp;

  

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
