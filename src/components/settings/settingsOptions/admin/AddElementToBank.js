import { useEffect, useState } from 'react';
import { useSettingsStore, useHeaterStatusStore } from '../../../../store/zustand';
import { BUTTON_STATE } from '../../../../constants/storeConstants';

import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../styles/commonStyles';
import { act } from '@testing-library/react';
import InputKeyboard from '../../../keyboard/InputKeyboard';
import InputKeyPad from '../../../keyboard/InputKeyPad';
import { SettingsContext } from '../../../../context/ContextOfSettings';
import { useContext } from 'react';
import SettingConfirmedMessage from '../../../userMessages/SettingConfirmedMessage';

const AddElementToBank = () => {
  // Global states
  const unitsMeasurement = useSettingsStore((state) => state.unitsMeasurement);
  const partNumberSuggestions = useHeaterStatusStore((state) => state.description?.partNumberSuggestions);
  const lastAddedElement = useHeaterStatusStore((state) => state.description?.lastAddedElement);
  const ssrPartsDescription = useHeaterStatusStore((state) => state.description);

  // useContext
  const {
    inputElement,
    setInputElement,
    setSaveButtonColor,
    saveButtonColor,
    saveButtonName,
    setSaveButtonName,
  } = useContext(SettingsContext);

  // useState
  const [activateKeyboard, setActivateKeyboard] = useState(false);
  const [activateKeypad, setActivateKeypad] = useState(false);
  const [inputFocus, setInputFocus] = useState('name');
  const [elementToBankDuplicatedMessage, setAddElementToBankDuplicatedMessage] =
    useState(false);
  const [messageBoxForBankInputs, setMessageBoxForBankInput] = useState(false);
  // Zustand
  const mode = useSettingsStore((state) => state.interfaceMode);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const settingsEditButton = buttonState === BUTTON_STATE.EDIT;

  useEffect(() => {
    return setActivateKeypad(false), setActivateKeyboard(false);
  }, [settingsEditButton]);

  const handleInput = (name, input) => {
    let copyState = { ...inputElement };
    copyState[name] = input;
    setInputElement(copyState);
  };

  // *** Duplicate check logic ***
  // const check = ssrPartsDescription.elementsOptions.some(
  //   (option) => JSON.stringify(inputElement) === JSON.stringify(option)
  // );
  // console.log(check);
  // *** Duplicate check logic ***

  const handleSave = () => {
    if (inputElement.current === null) {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.elementName === null) {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.lengths === null) {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.partNumber === null) {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.voltage === null) {
      return setMessageBoxForBankInput(true);
    } else if (inputElement.wattage === null) {
      return setMessageBoxForBankInput(true);
    } else {
      // check duplicate
      const check = ssrPartsDescription.elementsOptions.some(
        (option) => JSON.stringify(inputElement.partNumber) === JSON.stringify(option.partNumber)
      );
      if (check) {
        // messageBox here
        setAddElementToBankDuplicatedMessage(true);
      } else {
        setSaveButtonColor(true);
        setSaveButtonName('saved');
      }
    }
    // if (unitsMeasurement) {
    // const copyObj = { ...inputElement };
    // do unit application later
    // dispatch(handleAddNewElement(inputElement));
    // } else {
    // do unit application later
    // dispatch(handleAddNewElement(inputElement));
    // }
  };

  const resetSaveBtn = () => {
    setSaveButtonColor(false);
    setSaveButtonName("save");
  };

  const handleMessageBox = () => {
    setMessageBoxForBankInput(false);
    setAddElementToBankDuplicatedMessage(false);
  };

  return (
    <Wrapper>
      <ContentWrapper>
        <InnerWrapper>
          <TitleWrapper>
            <Title>add element to bank</Title>
          </TitleWrapper>

          <SectionWrapper>
            <ElementGroupWrapper>
              <ElementNameWrapper>
                <ElementNameTop>
                  <Span>
                    element<br></br>Name :
                  </Span>
                  {settingsEditButton ? (
                    <Input
                      type='text'
                      placeholder='---------'
                      onClick={() => {
                        setInputFocus('elementName');
                        setActivateKeyboard(true);
                        setActivateKeypad(false);
                      }}
                      name='elementName'
                      onChange={(event) =>{
                        resetSaveBtn()
                        handleInput(
                          'elementName',
                          event.target.value.toUpperCase()
                        )
                      }}
                      value={inputElement.elementName}
                    />
                  ) : (
                    <FakeInput>---------</FakeInput>
                  )}
                </ElementNameTop>
              </ElementNameWrapper>

              <ElementNameWrapper>
                <ElementNameTop>
                  <Span>
                    element<br></br>Part Number :
                  </Span>
                  {settingsEditButton ? (
                    <Input
                      type='text'
                      placeholder='---------'
                      name='partNumber'
                      onClick={() => {
                        setInputFocus('partNumber');
                        setActivateKeyboard(true);
                        setActivateKeypad(false);
                      }}
                      onChange={(event) =>{
                        resetSaveBtn()
                        handleInput(
                          'partNumber',
                          event.target.value.toUpperCase()
                        )
                      }
                      }
                      value={inputElement.partNumber}
                    />
                  ) : (
                    <FakeInput>---------</FakeInput>
                  )}
                </ElementNameTop>
              </ElementNameWrapper>
            </ElementGroupWrapper>
            <DescriptionWrapperHole>
              <DescriptionWrapper>
                <Description>
                  {inputElement.elementName && inputElement.elementName}
                  {inputElement.partNumber && ` - ${inputElement.partNumber}`}
                  <br></br>
                  {inputElement.current && `${inputElement.current}`}
                  {inputElement.wattage && ` / ${inputElement.wattage}`}
                  {inputElement.voltage && ` / ${inputElement.voltage}`}
                  {inputElement.lengths && ` / ${inputElement.lengths}`}
                </Description>
              </DescriptionWrapper>
            </DescriptionWrapperHole>
          </SectionWrapper>

          <SectionWrapper>
            <SpecTitleWrapper>
              <SpecTitle>current (a)</SpecTitle>
              <SpecTitle>wattage (w)</SpecTitle>
              <SpecTitle>voltage (v)</SpecTitle>
              {/* {unitsMeasurement ? ( */}
                <SpecTitle>length (ft)</SpecTitle>
              {/* ) : ( */}
                {/* <SpecTitle>length (m)</SpecTitle> */}
              {/* )} */}
            </SpecTitleWrapper>
            <ElementSpecWrapper>
              <ElementSpecInnerWrapper>
                <Span>
                  element <br></br>specification :
                </Span>
                <SpecsGroupWrapper>
                  {settingsEditButton ? (
                    <Input
                      type='number'
                      placeholder='---------'
                      value={inputElement.current}
                      closeKeyboard={() => setActivateKeypad(false)}
                      onChange={(event) =>{
                        resetSaveBtn()
                        handleInput('current', Number(event.target.value))
                      }}
                      onClick={() => {
                        setInputFocus('current');
                        setActivateKeypad(true);
                        setActivateKeyboard(false);
                      }}
                    />
                  ) : (
                    <FakeInput>---------</FakeInput>
                  )}
                  {settingsEditButton ? (
                    <Input
                      type='number'
                      placeholder='---------'
                      value={inputElement.wattage}
                      closeKeyboard={() => setActivateKeypad(false)}
                      onChange={(event) =>{
                        resetSaveBtn()
                        handleInput('wattage', Number(event.target.value))
                      }}
                      onClick={() => {
                        setInputFocus('wattage');
                        setActivateKeypad(true);
                        setActivateKeyboard(false);
                      }}
                    />
                  ) : (
                    <FakeInput>---------</FakeInput>
                  )}
                  {settingsEditButton ? (
                    <Input
                      type='number'
                      placeholder='---------'
                      value={inputElement.voltage}
                      closeKeyboard={() => setActivateKeypad(false)}
                      onChange={(event) =>{
                        resetSaveBtn()
                        handleInput('voltage', Number(event.target.value))
                      }}
                      onClick={() => {
                        setInputFocus('voltage');
                        setActivateKeypad(true);
                        setActivateKeyboard(false);
                      }}
                    />
                  ) : (
                    <FakeInput>---------</FakeInput>
                  )}
                  {settingsEditButton ? (
                    <Input
                      type='number'
                      placeholder='---------'
                      value={inputElement.lengths}
                      closeKeyboard={() => setActivateKeypad(false)}
                      onChange={(event) =>{
                        resetSaveBtn()
                        handleInput('lengths', Number(event.target.value))
                      }}
                      onClick={() => {
                        setInputFocus('lengths');
                        setActivateKeypad(true);
                        setActivateKeyboard(false);
                      }}
                    />
                  ) : (
                    <FakeInput>---------</FakeInput>
                  )}
                </SpecsGroupWrapper>
              </ElementSpecInnerWrapper>
            </ElementSpecWrapper>
          </SectionWrapper>

          <SectionWrapper>
            <ButtonWrapper onClick={handleSave}>
              <ButtonInnerWrapper color={saveButtonColor}>
                <ButtonHole>
                  <ButtonTop color={saveButtonColor}>
                    <Span>{saveButtonName}</Span>
                  </ButtonTop>
                </ButtonHole>
              </ButtonInnerWrapper>
            </ButtonWrapper>
          </SectionWrapper>
        </InnerWrapper>
      </ContentWrapper>
      {activateKeyboard && (
        <KeyboardWrapper id={1}>
          <PositionAbsoluteBox id={1}>
            <InputKeyboard
              closeKeyboard={() => setActivateKeyboard(false)}
              handleOnSubmit={handleInput}
              name={inputFocus}
            />
          </PositionAbsoluteBox>
        </KeyboardWrapper>
      )}
      {activateKeypad && (
        <KeyboardWrapper id={2}>
          <PositionAbsoluteBox id={2}>
            <InputKeyPad
              name={inputFocus}
              closeKeyPad={() => setActivateKeypad(false)}
              handleOnSubmit={handleInput}
              // setMainInput={handleInput}
            />
          </PositionAbsoluteBox>
        </KeyboardWrapper>
      )}

      {messageBoxForBankInputs && (
        <SettingConfirmedMessage
          title={'element missing'}
          message={"please fill all the element's spec"}
          onClose={handleMessageBox}
        />
      )}
      {elementToBankDuplicatedMessage && (
        <SettingConfirmedMessage
          title={'already exists'}
          message={'this part number already exists'}
          onClose={handleMessageBox}
        />
      )}
    </Wrapper>
  );
};
export default AddElementToBank;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;
`;
const ContentWrapper = styled.div`
  width: 548px;
  height: 196px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 11px;
  ${flexboxCenter}
`;
const InnerWrapper = styled.div`
  width: 544px;
  height: 192px;

  background: ${props => props.theme.layout.main.bgGradient};
  box-shadow: 0px 0px 2px #000000;
  box-shadow: inset 1px 1px 2px rgb(255, 255, 255, 0.1);
  border: 0.5px solid ${props => props.theme.button.primary.text};
  border-radius: 9px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.15rem 0;
`;
const TitleWrapper = styled.div`
  width: 539px;
  height: 32px;
  margin-top: 4px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  ${flexboxCenter}
`;

const Title = styled.div`
  ${flexboxCenter}

  width: 533px;
  height: 26px;

  border-radius: 13px;
  text-transform: uppercase;
  font-size: 10px;
`;
const SectionWrapper = styled.div`
  width: 539px;
  display: flex;
  &:nth-child(2) {
    height: 60px;
    justify-content: space-between;
    align-items: center;
  }
  &:nth-child(3) {
    flex-direction: column;
  }
  &:nth-child(4) {
    justify-content: flex-end;
  }
`;
const ElementGroupWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ElementNameWrapper = styled.div`
  width: 214px;
  height: 26px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 13px;

  ${flexboxCenter}
`;
const ElementNameTop = styled.div`
  width: 212px;
  height: 24px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.text};
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-left: 0.5rem;
`;

const Span = styled.span`
  font-size: 8px;
  text-transform: uppercase;
`;
const Input = styled.input`
  width: 99px;
  height: 20px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;
  font-size: 8px;
  text-transform: uppercase;

  &::placeholder {
    text-transform: uppercase;
    color: ${props => props.theme.label.caption};
  }
`;

const FakeInput = styled.div`
  width: 99px;
  height: 20px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;
  font-size: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.label.caption};
`;
const DescriptionWrapperHole = styled.div`
  ${flexboxCenter};
  width: 317px;
  height: 60px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 13px;
`;
const DescriptionWrapper = styled.div`
  ${flexboxCenter};
  width: 315px;
  height: 58px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.text};
  border-radius: 12px;
`;
const Description = styled.div`
  width: 311px;
  height: 54px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 10px;

  font-size: 10px;
  text-transform: uppercase;
  ${flexboxCenter};
  text-align: center;
`;
const SpecTitleWrapper = styled.div`
  margin-left: 2rem;
  width: 100%;
`;
const SpecTitle = styled.span`
  font-size: 8px;
  text-transform: uppercase;

  &:first-child {
    margin-left: 6.3rem;
  }
  &:nth-child(2) {
    margin-left: 2.8rem;
  }
  &:nth-child(3) {
    margin-left: 2.8rem;
  }
  &:nth-child(4) {
    margin-left: 3.2rem;
  }
`;
const ElementSpecWrapper = styled.div`
  ${flexboxCenter}

  width: 537px;
  height: 26px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 20px;
`;
const ElementSpecInnerWrapper = styled.div`
  width: 535px;
  height: 24px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.text};
  border-radius: 13px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.5rem;
  padding-right: 0.1rem;
`;

const SpecsGroupWrapper = styled.div`
  height: 100%;
  width: 422px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonWrapper = styled.button`
  ${flexboxCenter}
  width: 104px;
  height: 28px;
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 27px;
`;
const ButtonInnerWrapper = styled.div`
  ${flexboxCenter}

  width: 102px;
  height: 26px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.text};
  border-radius: 26px;
  ${({ color }) =>
    color &&
    'background: ${props => props.theme.status.info.bgGradient};'};
`;
const ButtonHole = styled.div`
  ${flexboxCenter}

  width: 94px;
  height: 18px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 22px;
`;
const ButtonTop = styled.div`
  ${flexboxCenter}

  width: 90px;
  height: 14px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.text};
  border-radius: 20px;
  ${({ color }) =>
    color &&
    'background: ${props => props.theme.status.info.bgGradient};'};
`;

const KeyboardWrapper = styled.div`
  ${(p) =>
    p.id == 1
      ? css`
          height: 100px;
        `
      : css`
          height: 0px;
        `}
  z-index:100;
`;

const PositionAbsoluteBox = styled.div`
  ${(p) =>
    p.id == 1
      ? css`
          position: absolute;
          top: 7rem;
          right: 0rem;
        `
      : css`
          position: absolute;
          top: -10rem;
          left: 40%;
        `}
  z-index:100;
`;
