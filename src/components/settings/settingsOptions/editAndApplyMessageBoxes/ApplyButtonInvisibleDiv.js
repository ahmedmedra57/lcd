import { useState } from 'react';
import { useSettingsStore } from '../../../../store/zustand';
import { BUTTON_STATE } from '../../../../constants/storeConstants';
import styled from 'styled-components';
import SettingClearOkMessage from './SettingClearOkMessage';

function ApplyButtonInvisibleDiv() {
  // zustand
  const buttonState = useSettingsStore((state) => state.buttonState);
  const clearState = buttonState === BUTTON_STATE.IDLE;
  const setSettingsCancelButton = useSettingsStore((state) => state.setSettingsCancelButton);

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
    return setSettingsCancelButton(), setDisplay(false);
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
