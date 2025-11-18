import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  selectSettingsOfEss,
  setSettingsCancelButton,
  setSettingsClearButton,
  setSettingsEditButton,
} from '../../../../store/slices/settingsOfEssSlice';
import SettingClearOkMessage from './SettingClearOkMessage';

function ApplyButtonInvisibleDiv() {
  // redux
  const dispatch = useDispatch();
  const state = useSelector(selectSettingsOfEss);
  const clearState = state.buttonsOfSettings.settingsClearButton;

  const [display, setDisplay] = useState(false);

  const handleMessage = (event) => {
    event.stopPropagation();
    return setDisplay(true);
  };

  const closeMessageBox = (event) => {
    event.stopPropagation();
    return setDisplay(false);
  };

  const clearMessageBox = (event) => {
    event.stopPropagation();
    return dispatch(setSettingsCancelButton()), setDisplay(false);
  };

  const applyTitle = 'settings options';
  const applyMessage =
    'please confirm your selected changes by pressing apply or clear to cancel changes';

  return (
    <Div onClick={(e) => handleMessage(e)}>
      {display && (
        <SettingClearOkMessage
          onClose={closeMessageBox}
          onClear={clearMessageBox}
          title={applyTitle}
          message={applyMessage}
          enableButton={display}
        />
      )}
    </Div>
  );
}

export default ApplyButtonInvisibleDiv;

const Div = styled.div`
  height: 100%;
  width: 100%;
  background-color: "transparent";
`;
