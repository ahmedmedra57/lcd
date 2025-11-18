import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';
import { useContext, useEffect, useState } from 'react';
import { useSettingsStore, useUserStore, useTgsSwitchStore } from '../../../../../store/zustand';
import { BUTTON_STATE } from '../../../../../constants/storeConstants';
import RadioBox from '../RadioBox';
import TcConfirmButton from '../TcConfirmButton';
import { SettingsContext } from '../../../../../context/ContextOfSettings';

function OutsideTemperature({
  handleChecked,
  onConfirmHandler,
  displayOptions,
  isClicked,
  select,
  checked,
  essOutsideTempName,
  tgsTesOutsideTempName,
  burningChamberTempName,
  selectTcState,
  checkedBoxes
}) {
  const tempMeasurementSelection = ['internet', 'thermocouple'];


  // useContext
  const { temperatureSelection, setTemperatureSelection } =
    useContext(SettingsContext);

  //  useState
  const [activeSelect, setActiveSelect] = useState(false);
  const [zIndex, setZIndex] = useState(false);
  const [selectBoxCss, setSelectBoxCss] = useState(false);
  const [activeIndex,setActiveIndex]=useState(0);

  // zustand
  const mode = useSettingsStore((state) => state.interfaceMode);
  const whiteTriangle = mode? './static/images/whiteTriangle_light.svg':'./static/images/whiteTriangle.svg';
  const greyTriangle = mode? './static/images/greyTriangle_light.svg':'./static/images/greyTriangle.svg';
  const essSwitch = useUserStore((state) => state.isEssSwitch);
  const settings = useTgsSwitchStore((state) => state.settings);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const editState = buttonState === BUTTON_STATE.EDIT;

  const essOutsideTemp = selectTcState.essOutsideTemp.select;
  const tgsTesOutsideTemp = selectTcState.tgsTesOutsideTemp.select;
  const burningChamber = selectTcState.burningChamberTemp.select;

  // set backs the last selection of outside temperature
  useEffect(() => {
    setTemperatureSelection(temperatureSelection);
    // if (temperatureSelection === 1) {
    //   setActiveSelect(true);
    // } else {
    //   setActiveSelect(false);
    // }
  }, []);

  useEffect(() => {
    setActiveIndex(settings?.outside_temp_ch === "internet" ? 0 : 1);
    setActiveSelect(settings?.outside_temp_ch === "internet" ? false : true)
  }, [settings?.outside_temp_ch]);

  // handles enable or disable the select t/c dropdown of outside temperature
  // handles the toggle of outside temperature: internet or thermocouple
  const handleToggle = (index) => {
    if (index === 1) {
      setActiveSelect(true);
    } else {
      setActiveSelect(false);
    }

    if (index !== temperatureSelection) return setTemperatureSelection(index);
  };

  return (
    <Wrapper>
      <SubTitleWrapper>
        <SubTitleWrapper2>
          <SubTitle>{'outside temperature'}</SubTitle>
        </SubTitleWrapper2>
      </SubTitleWrapper>
      <ControlContainer mode={mode}>
        {tempMeasurementSelection.map((data, index) => {
          return (
            <ContainerOfSelections key={index}>
              {/* the green circles for internet and thermocouple */}
              <ContainerOfCircles>
                <OutsideRingGreenCircle
                  // sets the selection of internet or thermocouple and also enable or disable dropdown
                  onClick={() => {
                    editState && handleToggle(index);
                    setActiveIndex(index)
                    handleChecked(data,'outside_temp_ch')
                  }}
                  mode={mode}
                >
                  <InsideFilledGreenCircle
                    mode={mode}
                    color={index === activeIndex ? true : false}
                  ></InsideFilledGreenCircle>
                </OutsideRingGreenCircle>
              </ContainerOfCircles>
              <IndividualContainer mode={mode}>
                <Text mode={mode}>{data}</Text>
              </IndividualContainer>
            </ContainerOfSelections>
          );
        })}
      </ControlContainer>

      <SelectionShadowWrapper>
        <SelectionWrapper
          color={activeSelect}
          zIndex={zIndex}
          boxBorder={selectBoxCss}
        >
          <WrapperTitleAndImg>
            <SelectionIndentWrapper color={activeSelect}>
              {/* check if there's a selection of tc. if not, it will display 'select t/c' by default */}
              <Selection color={activeSelect}>
                {checkedBoxes.outsideTemp}
                {/* {!activeSelect && 'select t/c'}
                {!activeSelect || (essSwitch && essOutsideTemp)}
                {!activeSelect || (!essSwitch && tgsTesOutsideTemp)} */}
              </Selection>
            </SelectionIndentWrapper>
            {/* enable or disable the triangle image. onClick it will dropdown if its enabled. logic for tgs + tes and ess */}
            <Img
              src={`${activeSelect ? whiteTriangle : greyTriangle}`}
              onClick={() =>
                activeSelect && essSwitch
                  ? (displayOptions(essOutsideTempName),
                    setZIndex(false),
                    setSelectBoxCss(!selectBoxCss))
                  : activeSelect &&
                    (displayOptions(tgsTesOutsideTempName),
                    setZIndex(false),
                    setSelectBoxCss(!selectBoxCss))
              }
            />
          </WrapperTitleAndImg>
          {(activeSelect && isClicked.essOutsideTemp) ||
          (activeSelect && isClicked.tgsTesOutsideTemp) ? (
            <WrapperSelectAndConfirmButton>
              {/* dropbox */}
              <SelectWrapper>
                {select.map((option) => (
                  <RadioBox
                    data={`${option?.data}`}
                    checked={checkedBoxes.outsideTemp}
                    onHandler={(value)=>handleChecked(value,'outside_temp_ch')}
                    key={option}
                    disabled={option?.disabled}
                  />
                ))}
              </SelectWrapper>
              <WrapperButton onClick={() => setSelectBoxCss(!selectBoxCss)}>
                {/* confirm button. it closes the dropbox onClick */}
                <TcConfirmButton
                  onConfirm={onConfirmHandler}
                  essOutsideTemp={essOutsideTempName}
                  tgsTesOutsideTemp={tgsTesOutsideTempName}
                />
              </WrapperButton>
            </WrapperSelectAndConfirmButton>
          ) : (
            ''
          )}
        </SelectionWrapper>
      </SelectionShadowWrapper>

      {/* burning chamber */}
      {!essSwitch && (
        <SubTitleSelectionWrapper>
          <SubTitleWrapper>
            <SubTitleWrapper2>
              <SubTitle>burning chamber current temp.</SubTitle>
            </SubTitleWrapper2>
          </SubTitleWrapper>
          <SelectionShadowWrapper>
            <SelectionWrapper1 zIndex={zIndex} boxBorder={selectBoxCss}>
              <WrapperTitleAndImg>
                <SelectionIndentWrapper1>
                  <Selection1>{!essSwitch && checkedBoxes?.burningChamberCurrentTemp}</Selection1>
                </SelectionIndentWrapper1>
                {/* img triangle for burning chamber. onClick the dropdown will appear */}
                <Img
                  src={'./static/images/whiteTriangle.svg'}
                  onClick={() =>
                    editState &&
                    (displayOptions(burningChamberTempName),
                    setZIndex(true),
                    setSelectBoxCss(!selectBoxCss))
                  }
                />
              </WrapperTitleAndImg>
              {isClicked.burningChamberTemp && (
                <WrapperSelectAndConfirmButton>
                  {/* dropbox */}
                  <SelectWrapper>
                    {select.map((option) => (
                      <RadioBox
                        data={`${option?.data}`}
                        checked={checked}
                        onHandler={(value)=>handleChecked(value,'burner_temp_ch')}
                        key={option}
                        disabled={option?.disabled}
                      />
                    ))}
                  </SelectWrapper>
                  <WrapperButton onClick={() => setSelectBoxCss(!selectBoxCss)}>
                    {/* confirm button. it closes the dropbox onClick */}
                    <TcConfirmButton
                      onConfirm={onConfirmHandler}
                      burningChamberTemp={burningChamberTempName}
                    />
                  </WrapperButton>
                </WrapperSelectAndConfirmButton>
              )}
            </SelectionWrapper1>
          </SelectionShadowWrapper>
        </SubTitleSelectionWrapper>
      )}
    </Wrapper>
  );
}

export default OutsideTemperature;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SubTitleWrapper = styled.div`
  width: 252px;
  height: 32px;

  background: ${props => props.theme.layout.card.bg};
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
  letter-spacing: 1px;
`;

const ControlContainer = styled.div`
  width: 252px;
  height: 62px;
  margin-top: 4px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
`;

const ContainerOfSelections = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 1px;
`;

const ContainerOfCircles = styled.div``;

const OutsideRingGreenCircle = styled.span`
  cursor: pointer;
  width: 22px;
  height: 22px;
  margin-left: 4px;
  margin-top: 2px;
  border: 1.5px solid ${props => props.theme.status.success.border};
  border-radius: 50%;
  ${flexboxCenter};
  background: ${props => props.theme.layout.sidebar.bg};
`;

const InsideFilledGreenCircle = styled.div`
  cursor: pointer;
  width: 14px;
  height: 14px;
  background: ${(props) => props.color ? props.theme.status.success.text: ''};
  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 218px;
  height: 26px;
  margin-left: 4px;
  border: 1.5px solid ${props => props.theme.layout.card.border};
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter};
`;

const Text = styled.p`
  font-size: var(--space2);
  margin-left: 10px;
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  opacity: 1;
`;

const SelectionShadowWrapper = styled.div`
  width: 252px;
  height: 51px;
  margin-top: 4px;

  background: ${props => props.theme.layout.sidebar.bgDark};
  border-radius: 26px;
  opacity: 1;
  ${flexboxCenter}
`;

const SelectionWrapper = styled.div`
  width: 248px;
  height: auto;
  padding-top: 4px;
  padding-bottom: ${({ boxBorder }) => (boxBorder ? css`2px` : css`4px`)};

  background:  ${props => props.color? props.theme.layout.card.bgGradient : props.theme.status.neutral.bgGradient};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: ${({ boxBorder }) =>
    boxBorder ? css`24px 24px 20px 20px` : css`24px`};

  opacity: 1;
  ${flexboxCenter}
  flex-direction: column;
  ${({ zIndex }) =>
    !zIndex &&
    css`
      z-index: 2;
    `}
`;

const WrapperTitleAndImg = styled.div`
  display: flex;
  flex-direction: row;
`;

const SelectionIndentWrapper = styled.div`
  width: 196px;
  height: 38px;
  margin-right: 8px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 22px;
  opacity: 1;
  ${flexboxCenter}
`;

const Selection = styled.p`
  font-size: var(--space1);
  text-transform: uppercase;
  color: ${({ color }) => props => color ? props.theme.label.secondary : props.theme.label.disabled};
`;

const Img = styled.img`
  cursor: pointer;
  margin-top: 6px;
  margin-right: 5px;
  color: #808080 0% 0% no-repeat padding-box;
`;

const SubTitleSelectionWrapper = styled.div`
  margin-top: 1.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const SelectionWrapper1 = styled.div`
  width: 248px;
  height: auto;
  padding-top: 4px;
  padding-bottom: ${({ boxBorder }) => (boxBorder ? css`2px` : css`4px`)};

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: ${({ boxBorder }) =>
    boxBorder ? css`24px 24px 20px 20px` : css`24px`};
  opacity: 1;
  ${flexboxCenter}
  flex-direction: column;
`;
const SelectionIndentWrapper1 = styled.div`
  width: 196px;
  height: 38px;
  margin-right: 8px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 22px;
  opacity: 1;
  ${flexboxCenter}
`;

const Selection1 = styled.p`
  font-size: var(--space1);
  text-transform: uppercase;
`;

const WrapperSelectAndConfirmButton = styled.div`
  margin-top: 2px;
  margin-bottom: 2px;
`;

const SelectWrapper = styled.div`
  width: 239px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 11px;
  opacity: 1;

  ${flexboxCenter}
  flex-direction: column;
  /* space between options and button */
  margin-bottom: 0.2rem;
  /* z-index: 100; */
`;

const WrapperButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: flex-end;

  /* margin-top: 2px; */
`;
