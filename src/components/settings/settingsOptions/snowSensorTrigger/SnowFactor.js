import { useState, useEffect, useContext, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { SettingsContext } from '../../../../context/ContextOfSettings';
import { convertCelsiusToFahrenheit } from '../../../../helpers/helpers';
import { useSettingsStore } from '../../../../store/zustand';
import { useTgsSwitchStore } from '../../../../store/zustand';
import { useUserStore } from '../../../../store/zustand';
import { flexboxCenter } from '../../../../styles/commonStyles';
import InputKeyPad from '../../../keyboard/InputKeyPad';
import InvisibleDivForEditButton from '../editAndApplyMessageBoxes/InvisibleDivForEditButton';

function SnowFactor({
  tgsTes,
  ess,
  editState,
  options,
  setOptions,
  metricImperialToggle,
  handleInputs,
}) {
  // useContext
  const {
    setEssSnowSensor,
    setTgsSnowSensor,
    setTesSnowSensor,
    tgsSnowSensor,
    tesSnowSensor,
    essSnowSensor,
  } = useContext(SettingsContext);

  // Zustand
  const settings = useTgsSwitchStore((state) => state.settings);
  const defaultTemp = useTgsSwitchStore((state) => state.snowSensor.defaultTemp);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const settingsEditButton = buttonState === 'edit';
  const mode = useSettingsStore((state) => state.interfaceMode);
  const tesSwitch = useUserStore((state) => state.isTesSwitch);
  const essSwitch = useUserStore((state) => state.isEssSwitch);
  // useState
  const [activateKeypad, setActivateKeypad] = useState(false);
  const [inputFocus, setInputFocus] = useState(null);

  // handles the keypad
  const handleDisplayKeyPad = (index) => {
    options !== index && setOptions(index);
    setActivateKeypad(true);
  };

  const changeInputHandler = (index) => {
    if (settingsEditButton) {
      handleDisplayKeyPad(index);
      setInputFocus(index);
      setOptions(index);
    }
  };
  const tempValue = useCallback(
    (index) => {
      if (index === 0) {
        if (tesSwitch) {
          return tgsSnowSensor;
        } else {
          return tesSnowSensor;
        }
      } else {
        return tesSnowSensor;
      }
    },
    [tesSwitch, tgsSnowSensor, tesSnowSensor, settings?.unit]
  );

  // handles the input field to direct each data entered  from keypad gets save at the right place in useState in useContext and it will display in the input field as you type
  // const handleInput = (index, inputNumber) => {
  //   const value = Number(inputNumber);
  //   switch (index) {
  //     case 0:
  //       setEssSnowSensor(value);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // handles the 2 input fields to direct each data entered  from keypad gets save at the right place in useState in useContext and it will display in the input field as you type
  // const handleInputs = (index, inputNumber) => {
  //   switch (index) {
  //     case 0:
  //       setTgsSnowSensor(inputNumber);
  //       break;
  //     case 1:
  //       setTesSnowSensor(inputNumber);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  useEffect(() => {
    if (defaultTemp) {
      const newValue =
        settings?.unit === 'f'
          ? Math.floor(convertCelsiusToFahrenheit(defaultTemp))
          : Math.floor(defaultTemp);
      setTgsSnowSensor(newValue);
    }
    if (settings?.electrical_snow_threshold) {
      const newValue =
        settings?.unit === 'f'
          ? Math.floor(
              convertCelsiusToFahrenheit(settings?.electrical_snow_threshold)
            )
          : Math.floor(settings?.electrical_snow_threshold);
      setTesSnowSensor(newValue);
      setEssSnowSensor(newValue);
    }
  }, [defaultTemp, settings.electrical_snow_threshold]);

  return (
    <>
      {essSwitch ? (
        <FlexWrapper>
          <WrapperTgsTesSnowSensor interfaceMode={mode}>
            <TitleContainer interfaceMode={mode}>
              <Title interfaceMode={mode}>{ess}</Title>
            </TitleContainer>

            <ValueContainer interfaceMode={mode}>
              <SmallContainer essSwitch={essSwitch} interfaceMode={mode}>
                <Temperature>
                  <Input
                    size={inputFocus}
                    index={0}
                    onFocus={(e) => (e.target.placeholder = '')}
                    interfaceMode={mode}
                    type='number'
                    placeholder='enter temperature'
                    value={essSnowSensor}
                    onChange={(e) => {
                      handleInputs(0, e.target.value);
                    }}
                    onClick={() => {
                      handleDisplayKeyPad();
                      setInputFocus(0);
                    }}
                  ></Input>
                  {`°${settings?.unit}`}
                </Temperature>
                {activateKeypad && (
                  <KeyboardWrapper>
                    <PositionAbsoluteBox index={true}>
                      <InputKeyPad
                        closeKeyPad={() => setActivateKeypad(false)}
                        handleOnSubmit={handleInputs}
                        setMainInput={handleInputs}
                        name={0}
                      />
                    </PositionAbsoluteBox>
                  </KeyboardWrapper>
                )}
              </SmallContainer>
            </ValueContainer>
          </WrapperTgsTesSnowSensor>
        </FlexWrapper>
      ) : (
        tgsTes?.map((value, index) => {
          return (
            <div key={index}>
              <FlexWrapper>
                <WrapperTgsTesSnowSensor
                  gradient={index === 0 ? true : index === 1 && false}
                  index={index}
                  tesSwitch={tesSwitch}
                  interfaceMode={mode}
                >
                  <TitleContainer
                    index={index}
                    tesSwitch={tesSwitch}
                    interfaceMode={mode}
                  >
                    <Title interfaceMode={mode}>{value}</Title>
                  </TitleContainer>

                  <ValueContainer
                    index={index}
                    tesSwitch={tesSwitch}
                    interfaceMode={mode}
                  >
                    <SmallContainer
                      index={index}
                      tesSwitch={tesSwitch}
                      interfaceMode={mode}
                    >
                      <Temperature interfaceMode={mode}>
                        {index === 0 && !tesSwitch && (
                          <Input
                            size={inputFocus}
                            interfaceMode={mode}
                            type='number'
                            onFocus={(e) => (e.target.placeholder = '')}
                            placeholder='enter temperature'
                            index={index}
                            tesSwitch={tesSwitch}
                            value={tgsSnowSensor}
                            onChange={(e) => {
                              // handleInputs(e.target.value);
                              handleInputs(index, e.target.value);
                            }}
                            onClick={() => changeInputHandler(index)}
                          ></Input>
                        )}
                        {tesSwitch && (index === 0 || index === 1) && (
                          <Input
                            size={inputFocus}
                            interfaceMode={mode}
                            type='number'
                            onFocus={(e) => (e.target.placeholder = '')}
                            placeholder='enter temperature'
                            index={index}
                            tesSwitch={tesSwitch}
                            value={tempValue(index)}
                            onChange={(e) => {
                              handleInputs(index, e.target.value);
                              // index === 0
                              //   ? handleInput(index, e.target.value);
                              //   :  handleInputs(index, e.target.value);
                            }}
                            onClick={() => changeInputHandler(index)}
                          ></Input>
                        )}
                        {`°${settings?.unit}`}
                      </Temperature>
                      {activateKeypad && options === index && (
                        <KeyboardWrapper>
                          <PositionAbsoluteBox index={options}>
                            <InputKeyPad
                              closeKeyPad={() => setActivateKeypad(false)}
                              name={inputFocus}
                              handleOnSubmit={handleInputs}
                              setMainInput={handleInputs}
                            />
                          </PositionAbsoluteBox>
                        </KeyboardWrapper>
                      )}
                    </SmallContainer>
                  </ValueContainer>
                </WrapperTgsTesSnowSensor>
              </FlexWrapper>
            </div>
          );
        })
      )}
      {!settingsEditButton && <InvisibleDivForEditButton height={'100px'} />}
    </>
  );
}

export default SnowFactor;


const FlexWrapper = styled.div`
  width: 286px;
  height: 94px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

const WrapperTgsTesSnowSensor = styled.div`
  width: 286px;
  height: 94px;
  opacity: 1;

  box-sizing: border-box;
  border: 0.5px solid ${props => props.theme.button.primary.bg};
  border-radius: 12px;

    background: ${({ gradient }) =>
      props => props.theme.layout.main.bgGradientVertical};
          ${(p) =>
            p.tesSwitch ||
            (p.index === 1 &&
              css`
                background: ${props => props.theme.layout.main.bgGradientVertical};
              `)}

          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
          box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
  /* background: -webkit-linear-gradient(
    ${({ gradient }) => (gradient ? 180 : 360)}deg,
    rgb(0, 0, 0) 0%,
    rgb(35, 58, 84) 100%
  );
  ${(p) =>
    p.tesSwitch ||
    (p.index === 1 &&
      css`
        background: ${props => props.theme.webkitGradients.vertical};
      `)} */

  opacity: 1;
  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;
`;

const TitleContainer = styled.div`
  width: 278px;
  height: 32px;

  background: ${props => props.theme.layout.card.bg};
          ${(p) =>
            p.tesSwitch ||
            (p.index === 1 &&
              css`
                background: ${props => props.theme.input.disabled};
              `)};

  box-shadow: inset 0px 0px 3px #000000;

  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const Title = styled.p`
  font-size: var(--font-size7);
  text-transform: uppercase;

  color: ${props => props.theme.label.primary};
`;

const ValueContainer = styled.div`
  width: 278px;
  height: 42px;

  background: ${props => props.theme.layout.card.bg};
          ${(p) =>
            p.tesSwitch ||
            (p.index === 1 &&
              css`
                background: ${props => props.theme.input.disabled};
              `)};

  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 21px;
  opacity: 1;
  ${flexboxCenter};
`;

const SmallContainer = styled.div`
  width: 269px;
  height: 32px;

  border: ${({ tesSwitch, index }) =>
    tesSwitch
      ? '1px solid #142033'
      : tesSwitch || (index === 1 && '1px solid #808080')};
  ${({ essSwitch }) => essSwitch && 'border: 1px solid #142033'};

  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const Temperature = styled.span`
  font-size: var(--space2);
  margin-right: var(--font-size6);
  text-transform: uppercase;
`;

const KeyboardWrapper = styled.div`
  height: 100px;
`;

const PositionAbsoluteBox = styled.div`
  ${({ index }) =>
    index === 0
      ? css`
          position: absolute;
          top: 10rem;
          right: 21rem;
        `
      : index === 1
      ? css`
          position: absolute;
          top: 10rem;
          right: 3rem;
        `
      : css`
          position: absolute;
          top: 10rem;
          right: 21rem;
        `}
`;

const Input = styled.input`
  width: auto;
  height: auto;

  ${({ size, index }) =>
    size === 0 && index === 0
      ? css`
          width: 25px;
        `
      : size === 1 &&
        index === 1 &&
        css`
          width: 25px;
        `}

  font-size: var(--space0);

  background-color: ${({ tesSwitch, index }) => props =>
            tesSwitch
              ? props.theme.layout.card.bg
              : (!tesSwitch && index === 1 && props.theme.chart.background) || props.theme.layout.card.bg};

  border-radius: 21px;
  opacity: 1;
  text-transform: uppercase;

  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
