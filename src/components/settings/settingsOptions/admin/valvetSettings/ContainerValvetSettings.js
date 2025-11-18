import styled from 'styled-components';
import ValveSettings from './ValveSettings';
import SelectGasType from '../selectGasType/ContainerSelectGasType';
import { useEffect, useState } from 'react';
import InputValveSettingsMessage from './InputValveSettingsMessage';
import { useSelector } from 'react-redux';
import { selectSettingsOfTgsTes } from '../../../../../store/slices/settingsOfTgsTesSlice';
import { useContext } from 'react';
import { SettingsContext } from '../../../../../context/ContextOfSettings';

function ContainerValveSettings() {
  const title = 'warning';
  const message = 'please input a number between 0 and 100';

  const initialState = { first: '', second: '', third: '' };

  const { inputValue, setInputValue } = useContext(SettingsContext);
  const [warningMessage, setWarningMessage] = useState(false);

  // redux from settingsTesTgs
  const { valveInputs } = useSelector(selectSettingsOfTgsTes);

  // sets back the previous entered data
  useEffect(() => {
    setInputValue({
      first: valveInputs.start,
      second: valveInputs.min,
      third: valveInputs.max,
    });
  }, [valveInputs]);

  const onClose = () => {
    setInputValue(initialState);
    setWarningMessage(false);
  };

  return (
    <Wrapper>
      <WrapperValveSettings>
        <ValveSettings
          setWarningMessage={setWarningMessage}
          inputValue={inputValue}
          setInputValue={setInputValue}
          initialState={initialState}
        />
      </WrapperValveSettings>
      <WrapperSelectGasType>
        <SelectGasType />
      </WrapperSelectGasType>
      {warningMessage && (
        <>
          <InputValveSettingsMessage
            title={title}
            onClose={onClose}
            message={message}
          />
        </>
      )}
    </Wrapper>
  );
}

export default ContainerValveSettings;

const Wrapper = styled.div`
  width: 554px;
  height: auto;
  margin-top: 2px;
  margin-bottom: 10px;
  margin-left: 2px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;

  border-radius: 13px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
`;

const WrapperValveSettings = styled.div`
  margin-left: 3px;
  margin-top: 3px;
`;

const WrapperSelectGasType = styled.div`
  margin-left: 3px;
  margin-top: 3px;
  margin-bottom: 3px;
`;
