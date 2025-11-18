import { useEffect, useRef, useState } from "react";
import { useSettingsStore, useTgsSwitchStore, useTgsSettingsStore, useUserStore } from "../../../store/zustand";
import {
  flexboxCenter,
  DisableApplyButtonBG,
  DisableApplyButtonHole,
  activeLayer1,
  activeInput,
  ButtonReady,
  activeHole,
} from '../../../styles/commonStyles';

import styled, { css } from "styled-components";

import InputKeyPad from "../../keyboard/InputKeyPad";
import InputTempMessage from "../../userMessages/InputTempMessage";
import { useLocation } from "react-router-dom";

const TempAndButton = ({
  isEnable,
  buttonHandler,
  isActivated,
  isReady,
  title,
  currTemp,
  isAble,
  isF,
}) => {
  const inputRef = useRef();

  // Local state displaying the keypad
  const [openKeyPad, setOpenKeyPad] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [message, setMessage] = useState(null);
  const [temp, setTemp] = useState(false);
  const settings = useTgsSwitchStore((state) => state.settings);
  const unitsMeasurement = useSettingsStore((state) => state.unitsMeasurement);
  const thermocouple = useTgsSettingsStore((state) => state.thermocouple);
  const isEssSwitch = useUserStore((state) => state.isEssSwitch);
  const location = useLocation();

  const [maxHeat, setMaxHeat] = useState(false);
  const [messageBoxTitle, setMessageBoxTitle] = useState(null);

  useEffect(() => {
    if (title === "scheduler") {
      setMessageBoxTitle("heating schedule program");
    } else {
      setMessageBoxTitle("optional constant temp");
    }

    if (isEssSwitch) {
      thermocouple && setMaxHeat(true);
    } else if (location.pathname !== "/") {
      thermocouple && setMaxHeat(true);
    } else {
      setMaxHeat(false);
    }
  }, []);

  // Display the saved temp into the input box
  useEffect(() => {
    if (!isEnable) {
      inputRef.current.value = "";
    } else {
      if (currTemp > 0) {
        if (unitsMeasurement == isF) {
          unitsMeasurement
            ? (inputRef.current.value = `${currTemp}${settings?.unit}`)
            : (inputRef.current.value = `${currTemp}${settings?.unit}`);
        } else {
          if (isF) {
            // saved unit is F but current unit is C -> formula c = (f-32) * 5/9
            inputRef.current.value = `${Math.round(
              ((currTemp - 32) * 5) / 9
            )}${settings?.unit}`;
          } else {
            // saved unit is C but current unit is F -> formula f = c * 1.8 + 32
            inputRef.current.value = `${Math.round(currTemp * 1.8 + 32)}${settings?.unit}`;
          }
        }
      }
    }
  }, [currTemp]);

  // Button handler
  const handleSubmit = (event) => {
    event.preventDefault();
    setOpenKeyPad(false);
    // Check the user input and show the user message

    if (inputRef.current.value.length === 0) {
      setMessage(`in order to finalize your ${messageBoxTitle} program,`);
      setTemp(true);
      setAlertMessage(true);
    } else {
      if (title === "scheduler") {
        // scheduler logic
        if (maxHeat) {
          // if (!isAble.date)
          buttonHandler(0);
          inputRef.current.value = "";
        } else {
          // scheduler logic
          if (currTemp === 0 && !isReady) {
            // turn on logic
            const t = Number(inputRef.current.value.slice(0, -2));
            if (unitsMeasurement) {
              if (t >= 77) {
                buttonHandler(t);
                inputRef.current.value = `${t}${settings?.unit}`;
              } else {
                // minimum temp warning
                setMessage("minimum temperature is 25°C / 77°F");
                setTemp(false);
                setAlertMessage(true);
                inputRef.current.value = "";
              }
            } else {
              if (t >= 25) {
                buttonHandler(t);
                inputRef.current.value = `${t}${settings?.unit}`;
              } else {
                // minimum temp warning
                setMessage("minimum temperature is 25°C / 77°F");
                setTemp(false);
                setAlertMessage(true);
                inputRef.current.value = "";
              }
            }
          } else {
            // turn off logic
            buttonHandler(0);
            inputRef.current.value = "";
          }
        }
      } else {
        // optional constant heating logic
        if (currTemp === 0 && !isActivated) {
          const t = Number(inputRef.current.value.slice(0, -2));
          // turn on Logic
          if (unitsMeasurement) {
            if (t > 249) {
              // overheat warning message
              setMessage("Maximum temperature is 120°C / 248°F");
              setTemp(false);
              setAlertMessage(true);
              inputRef.current.value = "";
            } else if (t < 77) {
              // minimum heat warning
              setMessage("minimum temperature is 25°C / 77°F");
              setTemp(false);
              setAlertMessage(true);
              inputRef.current.value = "";
            } else {
              // normal logic
              buttonHandler(t);
              inputRef.current.value = `${t}${settings?.unit}`;
            }
          } else {
            if (t > 120) {
              // overheat warning message
              setMessage("Maximum temperature is 120°C / 248°F");
              setTemp(false);
              setAlertMessage(true);
              inputRef.current.value = "";
            } else if (t < 25) {
              // minimum heat warning
              setMessage("minimum temperature is 25°C / 77°F");
              setTemp(false);
              setAlertMessage(true);
              inputRef.current.value = "";
            } else {
              // normal logic
              buttonHandler(t);
              inputRef.current.value = `${t}${settings?.unit}`;
            }
          }
        } else {
          // turn off logic
          buttonHandler(0);
          inputRef.current.value = "";
        }
      }
    }
  };

  const handleSchedulerSet = () => {
    setMessage("Please set schedule first");
    setTemp(false);
    setAlertMessage(true);
  };
  // Handlers for keypad
  const onInputHandler = () => {
    if (title === "scheduler") {
      !isEnable || isActivated || isReady || isAble.date
        ? setOpenKeyPad(true)
        : handleSchedulerSet();
    } else {
      !isEnable || isActivated || isReady || setOpenKeyPad(true);
    }
  };

  // Virtual keyboard input handler
  const handleVirtualKeyboardInput = (input) => {
    setOpenKeyPad(false);
    // Check the user input and show the user message

    if (inputRef.current.value.length === 0) {
      setMessage(`in order to finalize your ${messageBoxTitle} program,`);
      setTemp(true);
      setAlertMessage(true);
    } else {
      if (title === "scheduler") {
        // scheduler logic
        if (maxHeat) {
          // if (!isAble.date)
          buttonHandler(0);
          inputRef.current.value = "";
        } else {
          // scheduler logic
          if (currTemp === 0 && !isReady) {
            // turn on logic
            const t = Number(inputRef.current.value.slice(0, -2));
            if (unitsMeasurement) {
              if (t >= 77) {
                buttonHandler(t);
                inputRef.current.value = `${t}${settings?.unit}`;
              } else {
                // minimum temp warning
                setMessage("minimum temperature is 25°C / 77°F");
                setTemp(false);
                setAlertMessage(true);
                inputRef.current.value = "";
              }
            } else {
              if (t >= 25) {
                buttonHandler(t);
                inputRef.current.value = `${t}${settings?.unit}`;
              } else {
                // minimum temp warning
                setMessage("minimum temperature is 25°C / 77°F");
                setTemp(false);
                setAlertMessage(true);
                inputRef.current.value = "";
              }
            }
          } else {
            // turn off logic
            buttonHandler(0);
            inputRef.current.value = "";
          }
        }
      } else {
        // optional constant heating logic
        if (currTemp === 0 && !isActivated) {
          const t = Number(inputRef.current.value.slice(0, -2));
          // turn on Logic
          if (unitsMeasurement) {
            if (t > 249) {
              // overheat warning message
              setMessage("Maximum temperature is 120°C / 248°F");
              setTemp(false);
              setAlertMessage(true);
              inputRef.current.value = "";
            } else if (t < 77) {
              // minimum heat warning
              setMessage("minimum temperature is 25°C / 77°F");
              setTemp(false);
              setAlertMessage(true);
              inputRef.current.value = "";
            } else {
              // normal logic
              buttonHandler(t);
              inputRef.current.value = `${t}${settings?.unit}`;
            }
          } else {
            if (t > 120) {
              // overheat warning message
              setMessage("Maximum temperature is 120°C / 248°F");
              setTemp(false);
              setAlertMessage(true);
              inputRef.current.value = "";
            } else if (t < 25) {
              // minimum heat warning
              setMessage("minimum temperature is 25°C / 77°F");
              setTemp(false);
              setAlertMessage(true);
              inputRef.current.value = "";
            } else {
              // normal logic
              buttonHandler(t);
              inputRef.current.value = `${t}${settings?.unit}`;
            }
          }
        } else {
          // turn off logic
          buttonHandler(0);
          inputRef.current.value = "";
        }
      }
    }
  };

  // Display Message box
  const handleHideMessage = () => {
    setAlertMessage(false);
    inputRef.current.focus();
  };

  const unit = settings?.unit;

  return (
    <Wrapper isEnable={isEnable} onSubmit={handleSubmit}>
      <InputAndLabelWrapper
        isEnable={isEnable}
        onClick={() => maxHeat || onInputHandler()}
      >
        <Label isEnable={isEnable}> input temp.</Label>
        <InputWrapper isEnable={isEnable}>
          <InputDegree
            ref={inputRef}
            isEnable={isEnable}
            type="text"
            placeholder={unit}
            maxHeat={maxHeat}
            // onChange={handleCheck}
            disabled={isReady || isActivated || !isEnable || maxHeat}
          />
        </InputWrapper>
      </InputAndLabelWrapper>

      <ButtonWrapper
        isEnable={isEnable}
        isActivated={isActivated}
        isReady={isReady}
        disabled={!isEnable}
      >
        <ButtonHole isEnable={isEnable} isActivated={isActivated}>
          <ButtonTop
            isEnable={isEnable}
            isActivated={isActivated}
            isReady={isReady}
          >
            <ButtonName isEnable={isEnable}>
              {isReady ? "ready" : isActivated ? "activated" : "apply"}
            </ButtonName>
          </ButtonTop>
        </ButtonHole>
      </ButtonWrapper>

      {openKeyPad && (
        <KeyPadWrapper onClick={() => setOpenKeyPad(false)}>
          <InputKeyPad
            handleOnSubmit={handleVirtualKeyboardInput}
            setMainInput={(input) => (inputRef.current.value = input)}
            closeKeyPad={() => setOpenKeyPad(false)}
          />
        </KeyPadWrapper>
      )}
      {alertMessage && (
        <InputTempMessage
          onClose={handleHideMessage}
          title={messageBoxTitle}
          message={message}
          temp={temp}
        />
      )}
    </Wrapper>
  );
};

export default TempAndButton;

const Wrapper = styled.form`
  width: 272px;
  height: 34px;
  border-radius: 27px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-left: 5px;
  padding-right: 3px;
  box-sizing: border-box;

  ${(p) =>
    p.isEnable
      ? css`
          background: ${props => props.theme.layout.card.bg};
          border-color: ${props => props.theme.layout.card.border};
          box-shadow: inset 0 0 6px #000000;
          opacity: 1;
        `
      : css`
          background: ${props => props.theme.layout.container.bgDark} 0% 0% no-repeat padding-box;
          box-shadow: inset 0px 0px 3px #000000;

          opacity: 1;
        `}
`;

const InputAndLabelWrapper = styled.div`
  height: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const Label = styled.label`
  height: 10px;
  width: 66px;
  font-size: 8px;

  text-align: center;
  color: ${(p) => p.isEnable ? p.theme.label.primary : p.theme.label.disabled};
`;

const InputWrapper = styled.div`
  height: 22px;
  width: 126px;
  border-radius: 25px;
  ${flexboxCenter}

  ${(p) =>
    p.isEnable
      ? css`
          border: 0.5 solid rgb(0, 0, 0);
          background-image: ${props => props.theme.layout.main.bgGradient};
          box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
        `
      : css`
          ${DisableApplyButtonBG}
        `}
`;
const InputDegree = styled.input`
  height: 14px;
  width: 118px;
  border-radius: 20px;
  font-size: 10px;

  ${(p) =>
    p.isEnable
      ? css`
          background: ${props => props.theme.layout.card.bg};
          border-color: ${props => props.theme.layout.card.border};
          box-shadow: inset 0 0 6px #000000;
          opacity: 1;
        `
      : css`
          ${DisableApplyButtonHole}
        `}

  ${(p) =>
    p.maxHeat &&
    css`
      background-color: ${props => props.theme.layout.card.border};
    `}

  ::placeholder {
    color: ${(p) => p.isEnable ? p.theme.label.primary : p.theme.label.disabled};

    ${(p) =>
      p.maxHeat &&
      css`
        color: ${p.theme.label.disabled};
      `}
    text-align: center;
    font-size: 10px;
  }
`;

const ButtonWrapper = styled.button`
  cursor: ${(p) => (p.isEnable ? `pointer` : "default")};
  height: 30px;
  width: 126px;
  border-radius: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.input.border};
  border-radius: 37px;
  background-image: ${props => props.theme.layout.main.bgGradient};
  opacity: 1;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);

  ${(p) =>
    p.isReady &&
    css`
      ${ButtonReady}
    `}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer1};
    `}


    ${(p) =>
    p.isEnable ||
    css`
      ${DisableApplyButtonBG}
    `}
`;
const ButtonHole = styled.div`
  width: 118px;
  height: 22px;

  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${props => props.theme.layout.card.bg};
  border-color: ${props => props.theme.layout.card.border};
  box-shadow: inset 0 0 6px #000000;
  opacity: 1;

  ${(p) =>
    p.isActivated &&
    css`
      ${activeHole};
    `}

  ${(p) =>
    p.isEnable ||
    css`
      ${DisableApplyButtonHole}
    `}
`;

const ButtonTop = styled.div`
  width: 114px;
  height: 18px;
  border-radius: 25px;
  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.input.border};

  background-image: ${props => props.theme.layout.main.bgGradient};
  opacity: 1;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);

  ${(p) =>
    p.isReady &&
    css`
      ${ButtonReady}
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer1};
    `}

  ${flexboxCenter};

  ${(p) =>
    p.isEnable ||
    css`
      ${DisableApplyButtonBG}
    `}
`;

const ButtonName = styled.span`
  display: inline-block;
  font-size: 10px;

  font-family: "Orbitron", sans-serif;
  text-align: center;
  color: ${(p) => p.isEnable ? p.theme.label.primary : p.theme.label.disabled};
`;

const KeyPadWrapper = styled.div`
  width: 1024px;
  height: 600px;
  position: fixed;
  top: 0rem;
  left: 0rem;

  z-index: 100;
  border: 1px solid transparent;

  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 245px;
`;
