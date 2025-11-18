import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';
import RadioBox from '../RadioBox';
import TcConfirmButton from '../TcConfirmButton';
import { useSettingsStore, useTgsSwitchStore, useUserStore } from '../../../../../store/zustand';
import { BUTTON_STATE } from '../../../../../constants/storeConstants';
import { useState, useCallback } from 'react';

let types = {
  '0': "blower_temp_ch",
  '1': "display_temp_ch",
  '2': "enclosure_temp_ch",
};

function CurrentEncloseAndBurningTemp({
  data,
  essSwitch,
  tesSwitch,
  handleChecked,
  onConfirmHandler,
  displayOptions,
  isClicked,
  select,
  checked,
  essEncloseTempName,
  essHeaterTempName,
  tgsHeaterTempName,
  tesHeaterTempName,
  tgsTesEncloseTempName,
  selectTcState,
  checkedBoxes
}) {
  // useState
  const [zIndex, setZIndex] = useState();
  const [selectBoxCss, setSelectBoxCss] = useState(false)
  const isEssSwitch = useUserStore((state) => state.isEssSwitch);
  // zustand
  const buttonState = useSettingsStore((state) => state.buttonState);
  const editState = buttonState === BUTTON_STATE.EDIT;
  const settings = useTgsSwitchStore((state) => state.settings);
  // redux state for radioBox Selection
  const tgsTesEncloseTemp = selectTcState.tgsTesEncloseTemp.select;
  const tgsTesOutsideTemp = selectTcState.tgsTesOutsideTemp.select;
  // const burningChamber = selectTcState.burningChamber.select;
  const tgsHeaterTemp = selectTcState.tgsHeaterTemp.select;
  const tesHeaterTemp = selectTcState.tesHeaterTemp.select;
  // const essOutsideTemp = selectTcState.essOutSideTemp.select;
  const essHeaterTemp = selectTcState.essHeaterTemp.select;
  const essEncloseTemp = selectTcState.essEncloseTemp.select;
  const mode = JSON.parse(localStorage.getItem("themeMode"));
  const checkedValue = useCallback((index) => {
    // add validation if device type is switches from settings
    if (isEssSwitch) {
      return index === 0
        ? checkedBoxes?.currentTESHeaterTemp
        : index === 1 && checkedBoxes?.enclosureTemp;
    }
    return tesSwitch && index === 0
      ? checkedBoxes?.currentTGSHeaterTemp
      : tesSwitch && index === 1
      ? checkedBoxes?.currentTESHeaterTemp
      : tesSwitch && index === 2 && checkedBoxes?.enclosureTemp;
  }, [settings, tesSwitch, checkedBoxes, checked, isEssSwitch]);
   
  const type = useCallback(
    (index) => {
      if (isEssSwitch) {
        return types[index+1];
      }
      return types[index];
    },
    [types,isEssSwitch]
  );

  return (
    <FlexWrapper>
      {data.map((value, index) => {
        return (
          <SubTitleSelectionWrapper key={index}>
            <SubTitleWrapper
              tesSwitch={tesSwitch}
              essSwitch={essSwitch}
              index={index}
            >
              <SubTitleWrapper2
                tesSwitch={tesSwitch}
                essSwitch={essSwitch}
                index={index}
              >
                <SubTitle
                  essSwitch={essSwitch}
                  color={index}
                  tesSwitch={tesSwitch}
                >
                  {value.title}
                </SubTitle>
              </SubTitleWrapper2>
            </SubTitleWrapper>

            <SelectionShadowWrapper
              tesSwitch={tesSwitch}
              essSwitch={essSwitch}
              index={index}
            >
              <SelectionWrapper
                tesSwitch={tesSwitch}
                essSwitch={essSwitch}
                index={index}
                zIndex={zIndex}
                boxCss={selectBoxCss}
              >
                <WrapperTitleAndImg>
                  <SelectionIndentWrapper
                    tesSwitch={tesSwitch}
                    essSwitch={essSwitch}
                    index={index}
                  >
                    <Selection
                      tesSwitch={tesSwitch}
                      essSwitch={essSwitch}
                      index={index}
                    >
                      {/* the subTitle of each tc element such as heater and enclosure */}
                      {checkedValue(index)}
                    </Selection>
                  </SelectionIndentWrapper>
                  {/* white triangle. onClick it will display the dropdown for one of the heaters or enclose */}
                  {essSwitch ? (
                    <Img
                      src= {mode? './static/images/whiteTriangle_light.svg':'./static/images/whiteTriangle.svg'}
                      onClick={(e) =>
                        editState &&
                        (index === 0
                          ? (displayOptions(essHeaterTempName, e),
                            setZIndex(index),
                            setSelectBoxCss(!selectBoxCss))
                          : (displayOptions(essEncloseTempName, e),
                            setZIndex(index),
                            setSelectBoxCss(!selectBoxCss)))
                      }
                    />
                  ) : !tesSwitch && index === 1 ? (
                    <Img src={mode? './static/images/greyTriangle_light.svg':'./static/images/greyTriangle.svg'} />
                  ) : (
                    <Img
                      src={mode? './static/images/whiteTriangle_light.svg':'./static/images/whiteTriangle.svg'}
                      onClick={(e) =>
                        editState &&
                        (index === 0
                          ? (displayOptions(tgsHeaterTempName, e),
                            setZIndex(index),
                            setSelectBoxCss(!selectBoxCss))
                          : index === 1
                          ? (displayOptions(tesHeaterTempName, e),
                            setZIndex(index),
                            setSelectBoxCss(!selectBoxCss))
                          : index === 2 &&
                            (displayOptions(tgsTesEncloseTempName, e),
                            setZIndex(index),
                            setSelectBoxCss(!selectBoxCss)))
                      }
                    />
                  )}
                </WrapperTitleAndImg>
                {(isClicked.essHeaterTemp && index === 0) ||
                (isClicked.tgsHeaterTemp && index === 0) ? (
                  <WrapperSelectAndConfirmButton>
                    <SelectWrapper>
                      {/* dropdown selections for either Ess heater or Tgs heater */}
                      {select.map((option) => (
                        <RadioBox
                          data={`${option.data}`}
                          checked={checked}
                          onHandler={(value)=>handleChecked(value,type(index))}
                          key={option}
                          disabled={option.disabled}
                        />
                      ))}
                    </SelectWrapper>
                    <WrapperButton
                      onClick={() => setSelectBoxCss(!selectBoxCss)}
                    >
                      <TcConfirmButton
                        onConfirm={onConfirmHandler}
                        essHeaterTemp={essHeaterTempName}
                        tgsHeaterTemp={tgsHeaterTempName}
                      />
                    </WrapperButton>
                  </WrapperSelectAndConfirmButton>
                ) : (
                  ''
                )}
                {(isClicked.essEncloseTemp && index === 1) ||
                (isClicked.tesHeaterTemp && index === 1) ? (
                  <WrapperSelectAndConfirmButton>
                    {/* dropdown selections either for either Ess enclose temp or tes heater */}
                    <SelectWrapper>
                      {select.map((option) => (
                        <RadioBox
                          data={`${option.data}`}
                          checked={checked}
                          onHandler={(value)=>handleChecked(value,type(index))}
                          key={option}
                          disabled={option.disabled}
                        />
                      ))}
                    </SelectWrapper>
                    <WrapperButton
                      onClick={() => setSelectBoxCss(!selectBoxCss)}
                    >
                      <TcConfirmButton
                        onConfirm={onConfirmHandler}
                        essEncloseTemp={essEncloseTempName}
                        tesHeaterTemp={tesHeaterTempName}
                      />
                    </WrapperButton>
                  </WrapperSelectAndConfirmButton>
                ) : (
                  ''
                )}
                {isClicked.tgsTesEncloseTemp && index === 2 && (
                  <WrapperSelectAndConfirmButton>
                    {/* dropdown selections for Tgs and Tes Heater or Tgs Heater*/}
                    <SelectWrapper>
                      {select.map((option) => (
                        <RadioBox
                          data={`${option.data}`}
                          checked={checked}
                          onHandler={(value)=>handleChecked(value,type(index))}
                          key={option}
                          disabled={option.disabled}
                        />
                      ))}
                    </SelectWrapper>
                    <WrapperButton
                      onClick={() => setSelectBoxCss(!selectBoxCss)}
                    >
                      {/* onClick, it will close the dropdown */}
                      <TcConfirmButton
                        onConfirm={onConfirmHandler}
                        tgsTesEncloseTemp={tgsTesEncloseTempName}
                      />
                    </WrapperButton>
                  </WrapperSelectAndConfirmButton>
                )}
              </SelectionWrapper>
            </SelectionShadowWrapper>
          </SubTitleSelectionWrapper>
        );
      })}
    </FlexWrapper>
  );
}

export default CurrentEncloseAndBurningTemp;

const FlexWrapper = styled.div`
  /* width: 562px;
  height: 238px; */
  width: auto;
  height: auto;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

const SubTitleSelectionWrapper = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const SubTitleWrapper = styled.div`
  width: 252px;
  height: 32px;

  background: ${({ tesSwitch, index }) => props => !tesSwitch && index === 1 ? props.theme.input.disabled : props.theme.layout.card.bg};
  background: ${({ essSwitch }) => props => essSwitch && props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const SubTitleWrapper2 = styled.div`
  width: 246px;
  height: 26px;

  border-radius: 13px;
  opacity: 1;

  ${flexboxCenter}
`;

const SubTitle = styled.div`
  font-size: var(--space2);
  text-transform: uppercase;
  color: ${({ color, essSwitch, tesSwitch }) => props =>
    !essSwitch
      ? color === 0
        ? props.theme.status.warning.text
        : !tesSwitch && color === 1
        ? props.theme.label.secondary
        : color === 1
        ? props.theme.label.success
        : props.theme.label.secondary
      : color === 0
      ? props.theme.label.info
      : props.theme.label.secondary};
  letter-spacing: 1px;
`;

const WrapperTitleAndImg = styled.div`
  display: flex;
  flex-direction: row;
`;

const SelectionShadowWrapper = styled.div`
  width: 252px;
  height: 51px;
  margin-top: 4px;

  background: ${props => props.theme.layout.sidebar.bgDark};

  border-radius: 31px;
  opacity: 1;
  ${flexboxCenter}
`;

const SelectionWrapper = styled.div`
  width: 248px;
  height: auto;
  padding-top: 4px;
  padding-bottom: 4px;

  background: ${({ tesSwitch, index }) =>
    tesSwitch
      ? props => props.theme.layout.main.bgGradientVertical
      : index === 1
      ? props => props.theme.status.neutral.bgGradient
      : props => props.theme.layout.main.bgGradientVertical};
  background: ${({ essSwitch }) => props =>
    essSwitch && props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: ${({ boxCss }) =>
    boxCss ? css`24px 24px 18px 18px` : css`24px`};
  opacity: 1;

  ${flexboxCenter}
  justify-content: space-around;
  flex-direction: column;
  ${({ zIndex, index }) =>
    zIndex === index &&
    css`
      z-index: 2;
    `};
`;
const SelectionIndentWrapper = styled.div`
  width: 196px;
  height: 38px;
  margin-right: 10px;

  background: ${({ tesSwitch, index }) => props =>
    tesSwitch ? props.theme.layout.card.bg : index === 1 && props.theme.input.disabled};
  background: ${({ essSwitch }) => props => essSwitch && props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 22px;
  opacity: 1;
  ${flexboxCenter}/* z-index: 20; */
`;

const Selection = styled.p`
  font-size: var(--space1);
  text-transform: uppercase;
  color: ${({ tesSwitch, index }) => props => tesSwitch ? props.theme.label.secondary : index === 1 && props.theme.label.disabled};
  color: ${({ essSwitch }) => props => essSwitch && props.theme.label.secondary};
`;

const Img = styled.img`
  cursor: pointer;
  margin-top: 6px;
  margin-right: 4px;
`;

const WrapperSelectAndConfirmButton = styled.div`
  margin-top: 2px;
`;

const SelectWrapper = styled.div`
  width: 239px;

  background: ${props => props.theme.layout.sidebar.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 11px;
  opacity: 1;

  ${flexboxCenter}
  flex-direction: column;
  /* space between options and button */
  margin-bottom: 0.2rem;
`;

const WrapperButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;
