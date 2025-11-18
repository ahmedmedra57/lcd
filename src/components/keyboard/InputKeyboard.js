import React, { useRef, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import './inputKeyboard.css';

import styled from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';

const InputKeyboard = ({
  input,
  setInput,
  handleSubmit,
  handleOnSubmit,
  column,
  name,
  closeKeyboard,
  handleCreateSwitches,
}) => {
  const [layout, setLayout] = useState('default');
  const keyboard = useRef();

  const onChange = (input) => {
    if (column >= 0) {
      handleOnSubmit(column, input);
    } else if (name === 'password') {
      setInput(input);
    } else {
      if (name) {
        handleOnSubmit(name, input);
        // closeKeyboard();
      } else {
        handleOnSubmit(input);
        // closeKeyboard();
      }
    }
  };

  const onKeyPress = (button) => {
    if (button === '{enter}') {
      if (column >= 0) {
      } else if (name === 'password') {
        handleSubmit();
      } else if (name === 'numOfSwitches') {
        handleCreateSwitches();
        // closeKeyboard();
      }
    } else if (button === '{shift}') {
      const layoutName = layout === 'default' ? 'shift' : 'default';
      setLayout(layoutName);
    } else if (button === '{escape}') {
      closeKeyboard();
    }
    if (button === '{enter}') {
      closeKeyboard();
    }
    if (button === '{backspace}') {
      // handleOnSubmit(name, '');
    }
  };

  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        layoutName={layout}
        onChange={onChange}
        onKeyPress={(button) => onKeyPress(button)}
        theme={'hg-theme-default hg-layout-default myTheme'}
        display={{
          '{escape}': 'x',
          '{backspace}': '⌫',
          '{enter}': '↵',
          '{shift}': '⇧',
          '{shift}': '⇧',
          '{space}': '   ',
        }}
        layout={{
          default: [
            '0 1 2 3 4 5 6 7 8 9 - {backspace} {escape}',
            'q w e r t y u i o p \\',
            'a s d f g h j k l {enter}',
            '{shift} z x c v b n m . / {shift}',
            '{space}',
          ],
          shift: [
            '0 1 2 3 4 5 6 7 8 9 - {backspace} {escape}',
            'Q W E R T Y U I O P \\',
            'A S D F G H J K L {enter}',
            '{shift} Z X C V B N M . / {shift}',
            '{space}',
          ],
        }}
        buttonTheme={[
          {
            class: 'hg-red',
            // buttons: '{escape}',
          },
        ]}
      />
    </Wrapper>
  );
};

export default InputKeyboard;

const Wrapper = styled.div`
  width: 600px;
  text-transform: none;
  background-color: ${props => props.theme.layout.container.bgTransparent};
`;
