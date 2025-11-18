import { useState } from 'react';
import { useContext, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { SettingsContext } from '../../../../context/ContextOfSettings';
import {
  convertCelsiusToFahrenheit,
  convertFahrenheitToCelsius,
  updateDeviceInfo,
} from '../../../../helpers/helpers';
import {
  useSettingsStore,
  useTgsSettingsStore,
  useUserStore
} from '../../../../store/zustand';
import { flexboxCenter } from '../../../../styles/commonStyles';
import InputKeyPad from '../../../keyboard/InputKeyPad';
import SettingAppliedMessage from '../../../userMessages/SettingAppliedMessage';
import InvisibleDivForEditButton from '../editAndApplyMessageBoxes/InvisibleDivForEditButton';
import EditCancelApplyButtons from '../EditCancelApplyButtons';
import WindFactor from './WindFactor';
import ContainerLogin from '../../../adminPassword/ContainerLogin';

function ContainerOfWindFactor() {
  const content = [
    {
      title: 'low wind factor',
      windMiles: '15-24',
      temperatureF: '302',
      windKilo: '24-39',
      temperatureC: '150',
    },
    {
      title: 'high wind factor',
      windMiles: '38-52',
      temperatureF: '392',
      windKilo: '61-84',
      temperatureC: '200',
    },
    {
      title: 'med wind factor',
      windMiles: '25-37',
      temperatureF: '347',
      windKilo: '40-60',
      temperatureC: '175',
    },
    {
      title: 'extreme wind factor',
      windMiles: '53-62',
      temperatureF: '437',
      windKilo: '85-100',
      temperatureC: '225',
    },
  ];

  // useContext
  const { windFactor, setWindFactor } = useContext(SettingsContext);
  // const { windInputValue, setWindInputValue } = useContext(SettingsContext);
  // the 3 buttons
  const buttonsName = ['edit', 'cancel', 'apply'];
  // for invisible div
  const height = '150px';
  // useState
  const [activateKeypad, setActivateKeypad] = useState(false);
  const [options, setOptions] = useState('');
  const [inputFocus, setInputFocus] = useState(null);
  const [messageBox, setMessageBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState({});

  // Zustand
  const unitsMeasurement = useSettingsStore((state) => state.unitsMeasurement);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const settingsEditButton = buttonState === 'edit';
  const setSettingsEditButton = useSettingsStore((state) => state.setSettingsEditButton);
  const setSettingsCancelButton = useSettingsStore((state) => state.setSettingsCancelButton);
  const setResetAllSettingsButtons = useSettingsStore((state) => state.setResetAllSettingsButtons);
  const { low, med, high, extreme } = useTgsSettingsStore((state) => state.windFactorTemp);
  const setTgsSettingsApplyWindFactor = useTgsSettingsStore((state) => state.setTgsSettingsApplyWindFactor);
  const adminAccess = useUserStore((state) => state.isAdministrator);
  const setAdminAccess = useUserStore((state) => state.setAdminAccess);

  useEffect(() => {
    return function cleanup() {
      setAdminAccess(false);
    };
  }, [setAdminAccess]);

  useEffect(() => {
    if (low > 0 || med > 0 || high > 0 || extreme > 0) {
      if (unitsMeasurement) {
        setWindFactor({
          lowWind: Math.round(convertCelsiusToFahrenheit(low)),
          medWind: Math.round(convertCelsiusToFahrenheit(med)),
          highWind: Math.round(convertCelsiusToFahrenheit(high)),
          extremeWind: Math.round(convertCelsiusToFahrenheit(extreme)),
        });
      } else {
        setWindFactor({
          lowWind: Math.round(low),
          medWind: Math.round(med),
          highWind: Math.round(high),
          extremeWind: Math.round(extreme),
        });
      }
    }
  }, [unitsMeasurement, low, med, high, extreme, setWindFactor]);

  // 3 buttons(edit, cancel and apply). dispatch on click of apply button. it will sends the data to tgs tes slice which ess and tgs/tes will share the slice since they never operate at the same time so no need to seperate them into 2 slices
  const handleButtons = (value) => {
    const buttonsIndex = Number(value);
    switch (buttonsIndex) {
      case 0:
        setSettingsEditButton();
        break;
      case 1:
        setSettingsCancelButton();
        setWindFactor({
          lowWind: low > 0 ? low : '',
          medWind: med > 0 ? med : '',
          highWind: high > 0 ? high : '',
          extremeWind: extreme > 0 ? extreme : '',
        });
        break;
      case 2:
        if (
          typeof windFactor.lowWind === 'number' &&
          typeof windFactor.highWind === 'number' &&
          typeof windFactor.medWind === 'number' &&
          typeof windFactor.extremeWind === 'number'
        ) {
          setResetAllSettingsButtons();
          const data = unitsMeasurement
            ? [
                convertFahrenheitToCelsius(windFactor.lowWind, 'f'),
                convertFahrenheitToCelsius(windFactor.medWind, 'f'),
                convertFahrenheitToCelsius(windFactor.highWind, 'f'),
                convertFahrenheitToCelsius(windFactor.extremeWind, 'f'),
              ]
            : [
                windFactor.lowWind,
                windFactor.medWind,
                windFactor.highWind,
                windFactor.extremeWind,
              ];
          updateDeviceInfo('wind_threshold', data, 'setting_command');
          setTgsSettingsApplyWindFactor({ windFactor });
        }
        setMessageBox(true);
        handleWindFactorMessageBox();
        break;
      default:
        return;
    }
  };

  // handles the 3 input fields to direct each data entered gets save at the right place in useState at useContext
  const handleInput = (index, inputNumber) => {
    switch (index) {
      case 0:
        setWindFactor(() => ({ ...windFactor, lowWind: inputNumber }));
        break;
      case 1:
        setWindFactor(() => ({ ...windFactor, highWind: inputNumber }));
        break;
      case 2:
        setWindFactor(() => ({ ...windFactor, medWind: inputNumber }));
        break;
      case 3:
        setWindFactor(() => ({ ...windFactor, extremeWind: inputNumber }));
        break;
      default:
        break;
    }
  };

  const handleWindFactorMessageBox = () => {
    if (
      typeof windFactor.lowWind === 'number' &&
      typeof windFactor.highWind === 'number' &&
      typeof windFactor.medWind === 'number' &&
      typeof windFactor.extremeWind === 'number'
    ) {
      setMessageBoxContent({
        title: ['wind factor trigger'],
        content: 'settings have been applied',
      });
    } else {
      setMessageBoxContent({
        title: ['input fields incomplete'],
        content: 'please field all the input fields',
      });
    }
    return;
  };

  const handleCloseMessageBox = () => {
    setMessageBox(false);
    return;
  };

  // handles the keypad
  const handleDisplayKeyPad = (index) => {
    options !== index && setOptions(index);
    setActivateKeypad(true);
  };

  return (
    <Wrapper1>
      <Wrapper>
        {!settingsEditButton &&
          (low !== null || med !== null || high !== null || extreme) && (
            <InvisibleDivForEditButton height={height} />
          )}
        <FlexWrapper>
          {content.map((value, index) => {
            return (
              <div key={index}>
                <>
                  <WindFactor
                    contents={value}
                    index={index}
                    selectedMeasurement={unitsMeasurement}
                    handleKeypad={handleDisplayKeyPad}
                    setInputFocus={setInputFocus}
                    handleInputs={handleInput}
                  />
                </>
                {adminAccess && activateKeypad && options === index && (
                  <KeyboardWrapper index={options}>
                    {/* <PositionAbsoluteBox index={options}> */}
                    <InputKeyPad
                      closeKeyPad={() => setActivateKeypad(false)}
                      name={index}
                      handleOnSubmit={handleInput}
                      setMainInput={handleInput}
                    />
                    {/* </PositionAbsoluteBox> */}
                  </KeyboardWrapper>
                )}
              </div>
            );
          })}
        </FlexWrapper>

        {messageBox && (
          <SettingAppliedMessage
            title={'change options'}
            message={messageBoxContent}
            onClose={handleCloseMessageBox}
          />
        )}
      </Wrapper>
      <WrapperButtons>
        {adminAccess && (
          <EditCancelApplyButtons
            handleClick={handleButtons}
            buttonsName={buttonsName}
          />
        )}
      </WrapperButtons>
      {!adminAccess && (
        <LoginWrapper>
          {/* login in pop up */}
          <ContainerLogin />
        </LoginWrapper>
      )}
    </Wrapper1>
  );
}

export default ContainerOfWindFactor;

const Wrapper1 = styled.div`
  width: 596px;
  height: 383px;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const Wrapper = styled.div`
  width: 596px;
  height: auto;
  margin-left: -3px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 18px;
  opacity: 1;
  ${flexboxCenter};
  flex-direction: column;
`;

const FlexWrapper = styled.div`
  width: 596px;
  height: 212px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
`;

const KeyboardWrapper = styled.div`
  position: absolute;
  height: 100px;
  width: auto;
  z-index: 2;
  ${({ index }) =>
    index === 0
      ? css`
          position: absolute;
          top: 6rem;
          right: 19rem;
        `
      : index === 1
      ? css`
          position: absolute;
          top: 6rem;
          right: 5rem;
        `
      : index === 2
      ? css`
          position: absolute;
          top: 6rem;
          right: 0rem;
        `
      : css`
          position: absolute;
          top: 6rem;
          right: 19rem;
        `}
`;

const WrapperButtons = styled.div`
  width: 578px;
  height: auto;
  margin-left: 1rem;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const LoginWrapper = styled.div`
  width: 603px;
  height: 391px;

  position: absolute;
  top: 100px;
  left: 180px;

  z-index: 1000;
  ${flexboxCenter};
  align-items: flex-start;
`;
