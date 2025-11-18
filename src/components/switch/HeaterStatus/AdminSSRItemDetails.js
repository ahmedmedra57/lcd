import { useEffect, useMemo, useRef, useState } from 'react';
import { useHeaterStatusStore, useSettingsStore, useUserStore, useTgsSwitchStore } from '../../../store/zustand';

import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  ItemBackground,
  ItemBackgroundDisable,
} from '../../../styles/commonStyles';

import InputKeyboard from '../../keyboard/InputKeyboard';

import SettingConfirmedMessage from '../../userMessages/SettingConfirmedMessage';
import PartNumberSuggestion from './PartNumberSuggestion';
import SettingButton from './SettingButton';
import SSRDetailButtonContainer from './SSRDetailButtonContainer';
import { updateHeaterSSr } from '../../../helpers/helpers';

const AdminSSRItemDetails = ({
  isEnable,
  isFault,
  option,
  data,
  isSettingOpen,
  setIsSettingOpen,
  handleButtonClick,
  id,
}) => {
  const { elementBank: { partNumberSuggestions, elementsOptions }, updateSSRSpecs } = useHeaterStatusStore();
  const { specs } = data;

  const initialInputState = useMemo(() => {
    return [
      {
        partNumber: specs[0]?.partNumber || '',
      },
      {
        partNumber: specs[1]?.partNumber || '',
      },
      {
        partNumber: specs[2]?.partNumber || '',
      }
    ]
  }, [specs]);

  const initialInputId = [null, null];
  const initialKeypadState = false;

  const [inputDetails, setInputDetails] = useState(initialInputState);
  const [elementSpec, setElementSpec] = useState([specs[0] || {}, specs[1] || {}, specs[2] || {}]);
  const [activateKeyboard, setActivateKeyboard] = useState(initialKeypadState);
  const [hiddenNumber, setHiddenNumber] = useState(Math.min(specs.length, 3));

  const [inputId, setInputId] = useState(initialInputId);
  const [description, setDescription] = useState(['', '', '']);

  // ******************* to deal with input value conditionally *********************
  const [isEditable, setIsEditable] = useState(true);
  // ******************* to deal with input value conditionally *********************

  const [activateMessageBox, setActivateMessageBox] = useState(false);
  const [message, setMessage] = useState(null);
  const { ssrSettings: ssr_setting, setSSRSettings } = useTgsSwitchStore();
  const { setAdminAccess } = useUserStore();
  const { unitsMeasurement } = useSettingsStore();

  useEffect(() => {
    if (inputDetails[0].partNumber !== '') {
      // 1. find index with partNumber in ssr
      const elementIdx = partNumberSuggestions.indexOf(
        inputDetails[0].partNumber
      );
      if (elementIdx >= 0) {
        // 2. Save element specs with idx from elementsOptions
        setElementSpec([elementsOptions[elementIdx], {}, {}]);
      } else {
        setElementSpec([{}, {}, {}]);
      }
    } else {
      setElementSpec([{}, {}, {}]);
    }
  }, [inputDetails[0].partNumber]);

  useEffect(() => {
    if (inputDetails[1].partNumber !== '') {
      // 1. find index with partNumber in ssr
      const elementIdx = partNumberSuggestions.indexOf(
        inputDetails[1].partNumber
      );

      if (elementIdx >= 0) {
        // 2. Save element specs with idx from elementsOptions
        setElementSpec([elementSpec[0], elementsOptions[elementIdx], {}]);
      }
    }
  }, [inputDetails[1].partNumber]);

  useEffect(() => {
    if (inputDetails[2].partNumber !== '') {
      // 1. find index with partNumber in ssr
      const elementIdx = partNumberSuggestions.indexOf(
        inputDetails[2].partNumber
      );

      if (elementIdx >= 0) {
        // 2. Save element specs with idx from elementsOptions
        setElementSpec([
          elementSpec[0],
          elementSpec[1],
          elementsOptions[elementIdx],
        ]);
      }
    }
  }, [inputDetails[2].partNumber]);

  const handleSendMessage = async (idx) => {
    if (elementSpec[idx].current) {
      const elementData = elementSpec.filter((el) => Object.keys(el).length !== 0);
      updateSSRSpecs(`ssr${id}`, elementData);
    for (const el of elementData) {
  const oldEl = initialInputState[elementData.indexOf(el)];
  if (el.partNumber && (!oldEl || oldEl.partNumber !== el.partNumber)) {
    await updateHeaterSSr({
      ssr_setting: {
        add: {
          ssr_no: id - 1,
          partNumber: el.partNumber,
        },
      },
    });
  }
}


    
    for (const oldEl of initialInputState) {
  const newEl = elementData[initialInputState.indexOf(oldEl)];
  if (oldEl.partNumber && (!newEl || newEl.partNumber !== oldEl.partNumber)) {
    await updateHeaterSSr({
      ssr_setting: {
        delete: {
          ssr_no: id - 1,
          partNumber: oldEl.partNumber,
        },
      },
    });
  }
}

      setMessage(null);
      setActivateMessageBox(true);
    } else {
      if (initialInputState.filter(el => el.partNumber !== '').length !== 0) {
        updateSSRSpecs(`ssr${id}`, []);
        initialInputState.filter((element) => element.partNumber !== '').map(el => {
          updateHeaterSSr({
            ssr_setting: {
              delete: {
                ssr_no: id - 1,
                partNumber: el.partNumber,
              }
            }
          })
        })
        setMessage(null);
        setActivateMessageBox(true);
      } else {
        setMessage('element not found! please check again the input specifications');
        setActivateMessageBox(true);
      }
    }
  };

  // add, clear, apply button handler
  const handleClick = (name) => {
    if (name === 'add') {
      if (hiddenNumber >= 3) {
        return;
      }
      
      switch (hiddenNumber) {
        case 1: {
          setHiddenNumber(2);
          break;
        }
        case 2: {
          setHiddenNumber(3);
          break;
        }
        default: {
          return;
        }
      }
    } else if (name === 'clear') {
      switch (hiddenNumber) {
        case 3: {
          setHiddenNumber(2);
          setElementSpec([elementSpec[0], elementSpec[1], {}]);
          setInputDetails([
            inputDetails[0],
            inputDetails[1],
            { partNumber: '' },
          ]);
          break;
        }
        case 2: {
          setHiddenNumber(1);
          setElementSpec([elementSpec[0], {}, {}]);
          setInputDetails([
            inputDetails[0],
            { partNumber: '' },
            { partNumber: '' },
          ]);
          setDescription([description[0]]);
          break;
        }
        case 1: {
          setHiddenNumber(1);
          setInputDetails([{ partNumber: '' }, { partNumber: '' }, { partNumber: '' }]);
          setElementSpec([{}, {}, {}]);
          break;
        }
        default: {
          setHiddenNumber(3);
          break;
        }
      }
    } else if (name === 'apply') {
      // name === 'apply' do Dispatch
      switch (hiddenNumber) {
        case 1: {
          handleSendMessage(0);
          break;
        }
        case 2: {
          handleSendMessage(1);
          break;
        }
        default: {
          handleSendMessage(2);
          break;
        }
      }
      const newList = ssr_setting.map((item, index) => {
        const heaters = elementSpec.map((el) => !item.Heaters.includes(el.partNumber) && el.partNumber || null)
                          .filter((el) => el !== null)
        return index === id - 1 ? { ...item, Heaters: [...item.Heaters, ...heaters] } : item
      });
      setSSRSettings(newList);
    }
  };

  // Activate keypad with input ID
  const handleActivateKeypad = (index) => {
    // 1. set index and name
    setInputId([index]);
    // 2. Activate Keyboard
    setActivateKeyboard(true);
  };

  // For keyboard input
  const handleSetInput = (index, input) => {
    // 1. Copy current inputDetails state
    const newInput = [...inputDetails];
    // 2. update new Input into requested index and name
    newInput[index].partNumber = input.toUpperCase();
    setInputDetails(newInput);
    setInputPartNumber(input.toUpperCase());
  };

  // ********************************auto complete*****************************
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0);
  const [inputPartNumber, setInputPartNumber] = useState('');
  const [displaySuggestions, setDisplaySuggestions] = useState(false);

  let filteredSuggestions = partNumberSuggestions.filter((suggestion) =>
    suggestion.includes(inputPartNumber)
  );

  useEffect(() => {
    filteredSuggestions.length >= 1 && inputPartNumber.length >= 2
      ? setDisplaySuggestions(true)
      : setDisplaySuggestions(false);
  }, [filteredSuggestions, inputPartNumber]);

  const handleSelect = (index, suggestion) => {
    const newInput = [...inputDetails];
    newInput[inputId[0]].partNumber = suggestion;
    setInputDetails(newInput);
    setActivateKeyboard(false);
  };

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case 'Escape': {
        setInputPartNumber('');
        break;
      }
      case 'Enter': {
        handleSelect(index, filteredSuggestions[selectedSuggestionIdx]);
        setInputPartNumber('');
        setSelectedSuggestionIdx(-1);
        setDisplaySuggestions(false);
        break;
      }
      case 'ArrowUp': {
        selectedSuggestionIdx <= -1
          ? setSelectedSuggestionIdx(-1)
          : setSelectedSuggestionIdx(selectedSuggestionIdx - 1);
        break;
      }
      case 'ArrowDown': {
        selectedSuggestionIdx >= filteredSuggestions.length
          ? setSelectedSuggestionIdx(filteredSuggestions.length - 1)
          : setSelectedSuggestionIdx(selectedSuggestionIdx + 1);
        break;
      }
      default: {
        break;
      }
    }
  };

  // ********************************auto complete*****************************

  const isWarn = data?.warn === 1 ? true : false;

  return (
    <Wrapper>
      <ContentWrapper isEnable={isEnable} isFault={isFault} isWarn={isWarn}>
        {elementSpec.map((element, index) => (
          <>
            <ItemWrapper key={index} column={index} hiddenNumber={hiddenNumber}>
              <ItemPartNumber isEnable={isEnable}>
                <ItemPartNumberInput
                  type='text'
                  isEnable={isEnable}
                  placeholder='Input P / N'
                  onClick={() => {
                    handleActivateKeypad(index);
                  }}
                  onChange={(event) => {
                    handleSetInput(index, event.target.value);
                    setSelectedSuggestionIdx(-1);
                  }}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  value={inputDetails[index].partNumber}
                />
              </ItemPartNumber>
              {displaySuggestions && (
                <AutoCompleteWrapper
                  onMouseMove={() => setSelectedSuggestionIdx(-1)}
                >
                  <AutoCompleteInnerWrapper>
                    {filteredSuggestions.map((suggestion, idx) => {
                      let isSelected =
                        filteredSuggestions.indexOf(suggestion) ===
                        selectedSuggestionIdx
                          ? true
                          : false;

                      return (
                        <PartNumberSuggestion
                          key={idx}
                          column={index}
                          matchedSuggestion={suggestion}
                          isSelected={isSelected}
                          handleSelect={handleSelect}
                          handleClose={() => {
                            setDisplaySuggestions(false);
                            setInputPartNumber('');
                          }}
                        />
                      );
                    })}
                  </AutoCompleteInnerWrapper>
                </AutoCompleteWrapper>
              )}

              <ItemOuterWrapper isEnable={isEnable}>
                <ItemData>
                  {element.current ? element.current : '----'}
                </ItemData>
              </ItemOuterWrapper>

              <ItemOuterWrapper isEnable={isEnable}>
                <ItemData>
                  {element.wattage ? element.wattage : '----'}
                </ItemData>
              </ItemOuterWrapper>

              <ItemOuterWrapper isEnable={isEnable}>
                <ItemData>
                  {element.voltage ? element.voltage : '----'}
                </ItemData>
              </ItemOuterWrapper>

              <ItemOuterWrapper isEnable={isEnable}>
                <ItemData>
                  {element.lengths ? element.lengths : '----'}
                </ItemData>
              </ItemOuterWrapper>

              <DescriptionAndButtonWrapper>
                <ItemDescription isEnable={isEnable}>
                  <ItemDataDescription isDescription={true} isEnable={isEnable}>
                    {inputDetails[index].partNumber.length > 5
                      ? `${element.elementName} - ${element.partNumber} / ${element.current}a / ${element.wattage}w / ${element.voltage}v / ${element.lengths}m - ${element.lengths}ft`
                      : 'element not found'}
                  </ItemDataDescription>
                </ItemDescription>

                <SettingButton
                  isSettingOpen={isSettingOpen}
                  setIsSettingOpen={setIsSettingOpen}
                  handleButtonClick={handleButtonClick}
                  id={option}
                  column={index + 1}
                  // when ssr status is fault button will be disable
                />
              </DescriptionAndButtonWrapper>
            </ItemWrapper>
          </>
        ))}
      </ContentWrapper>

      {activateKeyboard && (
        <KeyboardWrapper positionTop={hiddenNumber}>
          <InputKeyboard
            closeKeyboard={() => setActivateKeyboard(false)}
            handleOnSubmit={handleSetInput}
            column={inputId[0]}
            name={inputId[1]}
          />
        </KeyboardWrapper>
      )}

      <SSRDetailButtonContainer
        handleClick={handleClick}
        isEditable={isEditable}
      />
      {activateMessageBox && (
        <SettingConfirmedMessage
          onClose={() => {
            setActivateMessageBox(false);
            if (!message) {
              setIsSettingOpen(false);
              setAdminAccess(false);
            }
          }}
          title='ssr details settings'
          message={message ? message : 'selections confirmed'}
        />
      )}
    </Wrapper>
  );
};
export default AdminSSRItemDetails;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  /* For layout */
  height: 106px;
`;
const ContentWrapper = styled.ul`
  width: 692px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 0.2rem;
  padding: 0.2rem;
  border-radius: 12px;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  ${(p) =>
    p.isEnable
      ? css`
          background: ${props => props.theme.layout.main.bgGradientVertical} 0% 0% no-repeat
            padding-box;
          box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
        `
      : css`
          background: ${props => props.theme.layout.container.bgGradient};
          box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
        `}

  border: ${(p) => props => p.isWarn && `1px solid ${props.theme.status.warning.border}`};
  border: ${(p) => props => p.isFault ? `1px solid ${props.theme.label.error}` : ''};
`;

const ItemWrapper = styled.div`
  ${flexboxCenter}
  justify-content: space-between;
  padding: 0 0.1rem;

  &:first-child {
    ${(p) =>
      p.hiddenNumber === 1 ||
      css`
        margin-bottom: 0.2rem;
      `}
  }
  &:nth-child(2) {
    ${(p) =>
      p.hiddenNumber === 2 ||
      css`
        margin-bottom: 0.2rem;
      `}

    ${(p) =>
      p.column < p.hiddenNumber ||
      css`
        display: none;
      `}
  }
  &:last-child {
    ${(p) =>
      p.column < p.hiddenNumber ||
      css`
        display: none;
      `}
  }
`;
const ItemPartNumber = styled.li`
  width: 90px;
  height: 100%;
  ${ItemBackground}

  ${flexboxCenter}

   ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;

const ItemOuterWrapper = styled.li`
  ${flexboxCenter}

  width: 93px;
  height: 100%;
  ${ItemBackground}

  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;

const ItemDescription = styled.li`
  ${flexboxCenter}

  width: 162px;
  height: 100%;
  gap: 0.3rem;

  ${ItemBackground}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `};
`;

const ItemPartNumberInput = styled.input`
  font-size: 8px;
  text-align: center;
  padding: 0.5rem;

  width: 90px;
  /* letter-spacing: px; */

  background-color: transparent;
  &::placeholder {
    color: ${props => props.theme.label.secondary};
    color: ${(p) => p.isEnable || `#808080;`};
  }
`;

const ItemData = styled.div`
  font-size: 10px;
  text-align: center;
  width: 90px;

  background-color: transparent;
  &::placeholder {
    color: ${props => props.theme.label.secondary};
    color: ${(p) => p.isEnable || `#808080;`};
  }
`;

const ItemDataDescription = styled.span`
  font-size: 6px;
  text-align: center;

  width: 90%;
  letter-spacing: -0.2px;

  /* ${(p) =>
    p.isDescription &&
    css`
      font-size: 6px;
    `} */
  color: ${(p) => p.isEnable || `#808080;`};

  /* Layout for radio box with parents box */
  margin-right: 0.4rem;
`;

const DescriptionAndButtonWrapper = styled.div`
  width: 184px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const KeyboardWrapper = styled.div`
  z-index: 100;

  position: absolute;
  ${(p) =>
    p.positionTop === 1
      ? css`
          top: 3rem;
          right: -0.2rem;
        `
      : p.positionTop === 2
      ? css`
          top: 4.5rem;
          right: 0rem;
        `
      : css`
          top: 5.7rem;
          right: 0rem;
        `}
`;

const AutoCompleteWrapper = styled.ul`
  width: 221px;
  padding: 0.2rem;
  text-align: left;

  position: absolute;
  top: 2.7rem;
  left: -7rem;
  z-index: 1000;

  ${flexboxCenter}

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 20px;
`;

const AutoCompleteInnerWrapper = styled.div`
  width: 209px;
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
