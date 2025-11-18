import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { changeSwitchName } from "../../../store/slices/heaterStatusSlice";
import { flexboxCenter } from "../../../styles/commonStyles";
import InputKeyboard from "../../keyboard/InputKeyboard";
import SwitchNameButton from "./SwitchNameButton";
import SwitchNameRadioBox from "./SwitchNameRadioBox";
import { switchNameSelect } from "../../../store/slices/constantData";
import { updateHeaterSSr } from "../../../helpers/helpers";

const SwitchNameSelector = ({ id, data, switchNamesList }) => {
  // id is the column number to identify the column e.g 1 === first column
  const dispatch = useDispatch();
  const switchSystemName = switchNamesList?.find((item) => item?.switch_system_id === data?.switch_system_id)

  const [isClicked, setIsClicked] = useState(false);
  const [switchSysId, setSwitchSysId] = useState(switchSystemName?.system_id);
  const [switchName, setSwitchName] = useState(
    switchSystemName?.name || ""
  );
  //!!! eg:for backend switchNamesList data format =[
  // '#15 - twr a blower 1',
  // '#10 - twr a blower 2',
  // '#25 - twr a blower 3',
  // '#20 - twr a blower 4',
  // ]
  const [switchNameSelection, setSwitchNameSelection] =
    useState(switchNamesList);

  // // Handler to change Checked state
  // const handleChecker = (elem) => {
  //   setChecked(elem);
  // };

  // Display select box

  // // Select box button handler
  // const handleSelectOptionClick = (name) => {
  //   if (name === 'clear') {
  //     setChecked(null);
  //   } else {
  //     setIsClicked(!isClicked);
  //   }
  // };

  // // Onchange handler for later
  // const handleInputOnChange = (input) => {
  //   setSwitchNameInput(input);
  // };

  // // Switch name input handler
  // const handleKeyboardInput = () => {
  //   setActivateKeyboard(false);
  // };
  // const handleInput = () => {
  //   // Activate Keyboard
  //   setActivateKeyboard(true);
  //   setIsClicked(false);
  //   // Clear Input
  //   setSwitchNameInput('');
  // };

  const handleDispatchSwitchName = () => {
    // dispatch with switchInputName and checked states WITH ID

    dispatch(
      changeSwitchName({
        id: `ssr${id}`,
        name: switchName || '',
      })
    );
    switchName &&
      updateHeaterSSr({
        ssr_setting: {
          ssr_no: id - 1,
          // name: switchName,
          switch_system_id: switchSysId,
        },
      });
  };

  const displaySelectOptions = () => {
    setIsClicked((prev) => !prev);
  };

  // Handler to change Checked state
  const handleRadioBoxSelection = (elem) => {
    setSwitchName(elem?.name);
    setSwitchSysId(elem?.system_id);
  };

  // Handle select button
  const handleSelect = () => {
    setIsClicked((prev) => !prev);
    handleDispatchSwitchName();
  };

  return (
    <Wrapper>
      <SelectBoxWrapperHole isClicked={isClicked}>
        <SelectBoxInnerWrapper isClicked={isClicked}>
          <SelectedTitleAndArrowWrapper isClicked={isClicked}>
            <SelectedTitle>
              <Title>{switchName ? switchName : "select switch"}</Title>
            </SelectedTitle>

            <ArrowWrapper onClick={() => displaySelectOptions()}>
              <Arrow src="/static/images/selector.svg" />
            </ArrowWrapper>
          </SelectedTitleAndArrowWrapper>

          {isClicked && (
            <>
              {switchNameSelection?.map((name) => {
                return (
                  <SelectWrapper key={name?.system_id}>
                    <SwitchNameRadioBox
                      // id={0}
                      data={name}
                      checked={switchName}
                      handleClick={handleRadioBoxSelection}
                      isSelectSwitchName={name?.name === switchName}
                    />
                  </SelectWrapper>
                );
              })}
              <SwitchNameButton name="select" handleClick={handleSelect} />
            </>
          )}
        </SelectBoxInnerWrapper>
      </SelectBoxWrapperHole>
    </Wrapper>
  );
};

export default SwitchNameSelector;

{
  /* <TitleOuterHole>
        <TitleTop>switch nomenclature</TitleTop>
      </TitleOuterHole>

      <ContentsWrapper>
        <InputSwitchName
          type='text'
          placeholder='switch name'
          onClick={handleInput}
          value={switchNameInput}
          onChange={(event) => handleInputOnChange(event.target.value)}
        />

        <SelectBoxWrapperHole isClicked={isClicked}>
          <SelectBoxInnerWrapper isClicked={isClicked}>
            <SelectedTitleAndArrowWrapper isClicked={isClicked}>
              <SelectedTitle>
                <Title>{checked ? checked : 's.t size'}</Title>
              </SelectedTitle>

              <ArrowWrapper onClick={displaySelectOptions}>
                <Arrow src='/static/images/switch-name-select-button.svg' />
              </ArrowWrapper>
            </SelectedTitleAndArrowWrapper>

            {isClicked && (
              <>
                <SelectWrapper>
                  {switchNameSelect.map((option, index) => (
                    <SwitchNameRadioBox
                      data={option}
                      checked={checked}
                      handleClick={handleChecker}
                      key={index}
                    />
                  ))}
                </SelectWrapper>
                <SwitchNameButton
                  name='clear'
                  handleClick={handleSelectOptionClick}
                />
                <SwitchNameButton
                  name='apply'
                  handleClick={handleSelectOptionClick}
                />
              </>
            )}
          </SelectBoxInnerWrapper>
        </SelectBoxWrapperHole>
        <ButtonOuterHole onClick={handleDispatchSwitchName}>
          <ButtonOuter>
            <ButtonHole>
              <ButtonTop>apply</ButtonTop>
            </ButtonHole>
          </ButtonOuter>
        </ButtonOuterHole>
      </ContentsWrapper>
      {activateKeyboard && (
        <KeyboardWrapper>
          <InputKeyboard
            handleOnSubmit={handleInputOnChange}
            closeKeyboard={() => setActivateKeyboard(false)}
          />
        </KeyboardWrapper>
      )} */
}

const Wrapper = styled.div`
  width: 183px;
  height: auto;
`;

const SelectBoxWrapperHole = styled.div`
  width: 88px;
  height: 26px;
  background: ${({ theme }) => theme.layout.card.bg};

  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const SelectBoxInnerWrapper = styled.div`
  width: 86px;
  /* min-height: 22px; */
  height: 24px;

  ${(p) =>
    p.isClicked &&
    css`
      height: auto;
    `};

  background: ${({ theme }) => theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${({ theme }) => theme.layout.container.bg};
  border-radius: 14px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  position: ${(p) => (p.isClicked ? "absolute" : "none")};
  padding-bottom: ${(p) => (p.isClicked ? "1.5px" : "0")};
  z-index: ${(p) => (p.isClicked ? "9" : "0")};
  top: ${(p) => (p.isClicked ? "1px" : "none")};
  left: ${(p) => (p.isClicked ? "0.5px" : "none")};
`;

const SelectedTitleAndArrowWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;

  /* padding: 0 1.5px; */

  margin: ${(p) => (p.isClicked ? "1.5px " : "0")};
  margin-left: ${(p) => (p.isClicked ? "3px " : "0")};
`;

const SelectedTitle = styled.div`
  width: 64px;
  height: 20px;
  background: ${({ theme }) => theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.span`
  width: 90%;
  font-size: 8px;
  letter-spacing: 0.8px;
  text-align: center;
`;

const ArrowWrapper = styled.button`
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1.5px;
  cursor: pointer;
`;
const Arrow = styled.img`
  width: 15px;
  height: 14px;
  /* height: 100%; */
`;

const SelectWrapper = styled.div`
  width: 80px;
  height: 18px;
  height: auto;
  background: ${({ theme }) => theme.layout.card.bg};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 8px;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

  /* space between options and button */
  margin-bottom: 1px;
  z-index: 10;
`;

