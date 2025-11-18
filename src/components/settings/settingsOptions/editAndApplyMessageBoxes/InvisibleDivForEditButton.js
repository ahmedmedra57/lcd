import { useState } from 'react';
import styled from 'styled-components';
import SettingConfirmedMessage from '../../../userMessages/SettingConfirmedMessage';

function InvisibleDivForEditButton({ height }) {
  const [display, setDisplay] = useState(false);

  const handleMessage = (event) => {
    event.stopPropagation();
    return setDisplay(true);
  };

  const closeMessageBox = (event) => {
    event.stopPropagation();
    return setDisplay(false);
  };

  const editTitle = 'settings options';
  const editMessage = 'please select edit to allow changes';

  return (
    <Div onClick={(e) => handleMessage(e)} height={height}>
      {display && (
        <SettingConfirmedMessage
          onClose={closeMessageBox}
          title={editTitle}
          message={editMessage}
          enableButton={display}
        />
      )}
    </Div>
  );
}

const Div = styled.div`
  height: ${({ height }) => height};
  width: 592px;
  background: transparent;
  position: absolute;

  z-index: 100;
`;

export default InvisibleDivForEditButton;
