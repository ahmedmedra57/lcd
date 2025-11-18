import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
} from '../../../../../styles/commonStyles';
import { useCallback, useState } from 'react';
import SelectBox from './SelectBox';
// TODO: useSelectSystemUOSStore doesn't exist - needs to be implemented
// import { useSelectSystemUOSStore } from '../../../../../store/zustand';
import {
  useUserStore,
  useHeaterStatusStore,
  useChartStore
} from '../../../../../store/zustand';
import { useEffect } from 'react';
import { getNoLinkedBlowerDevices, getNoLinkedElectricalDevices } from '../../../../../services/systemIdentification';
import { async } from 'q';
import { SettingsContext } from '../../../../../context/ContextOfSettings';
import { useContext } from 'react';

const NewSystemIdentification = ({
  setSysIdentification,
  sysIdentification,
}) => {
  const [select, setSelect] = useState({});
  const [openSelectBox, setOpenSelectBox] = useState(false);
  const [data, setData] = useState([]);
  const [selectedUOSName, setSelectedUOSName] = useState('');
  const [selectedUOSInfo, setSelectedUOSInfo] = useState([]);
  const [selectedSwitchesInfo, setSelectedSwitchesInfo] = useState([]);
  const [openHeatLoadConfig, setOpenHeatLoadConfig] = useState(false);
  const [heatLoadConfigData, setHeatLoadConfigData] = useState([]);
  const [devices,setDevices]=useState([]);
  const [greenContour, setGreenContour] = useState(false);
  const isEssSwitch = useUserStore((state) => state.isEssSwitch);
  const { setInputData } = useContext(SettingsContext)
  const elementsOptions = useHeaterStatusStore((state) => state.description?.elementsOptions || []);
  const mode = JSON.parse(localStorage.getItem("themeMode"));

  // Zustand
  // TODO: useSelectSystemUOSStore doesn't exist - needs to be implemented
  // const allLocations = useSelectSystemUOSStore((state) => state);
  const allLocations = { locations: [] }; // Temporary placeholder
  const wifiState = useChartStore((state) => state.wifiState);
  // const handleLocationsSystemIdentification = useSelectSystemUOSStore((state) => state.handleLocationsSystemIdentification);
  const handleLocationsSystemIdentification = () => {}; // Temporary placeholder

  const getNoLinkedDevices = useCallback(() => {
    const fetchDataFunction = isEssSwitch
      ? getNoLinkedElectricalDevices
      : getNoLinkedBlowerDevices;
      fetchDataFunction().then((data)=>{
        setDevices(data.data);
    })
  },[ isEssSwitch ])
  
  useEffect(() => {
    if (wifiState) {
      getNoLinkedDevices();
    }
  }, [getNoLinkedDevices, wifiState]);
  
  useEffect(() => {
    handleLocationsSystemIdentification({
      data: devices,
      heaterSpecs: elementsOptions,
    });
  }, [devices, handleLocationsSystemIdentification, elementsOptions]);

  useEffect(() => {
    setData(allLocations.locations);
  }, [allLocations.locations]);

  // handle the assign button of select box of assign UOS Control Panel Identification
  const handleAssignButton = (select) => {
    handleSelectBox();
    setSelectedUOSInfo(allLocations.locations[select?.deviceIndex]);
    setSelectedSwitchesInfo(data[select?.deviceIndex].switchInfo);
    setSelectedUOSName(select.select.selected_device_name);
    handleHeatLoadConfigDataFormat(select);
  };

  const handleHeatLoadConfigDataFormat = (select) => {
    // creates empty arrays depending on the number of SSR Qty.
    const sortedSSRArr = Array.from(
      { length: allLocations.locations[select?.deviceIndex].numOfSSR },
      (_, i) => []
    );
    data[select?.deviceIndex].switchInfo.forEach((UOS) => {
      UOS.selectedSSR.forEach((SSR, SSRIdx) => {
        const objKey = Object.keys(SSR)[0];
        let modifiedObj = {
          ...SSR,
          switchName: UOS.switchName,
        };

        if (objKey) {
          sortedSSRArr[+objKey.slice(-1) - 1].push(modifiedObj);
        }
      });
    });
    setHeatLoadConfigData(sortedSSRArr);
  };

  // open and closes the select box of assign UOS Control Panel Identification
  const handleSelectBox = () => {
    setOpenSelectBox(!openSelectBox);
  };

  // open and closes Heat load configuration
  const handleHeatLoadConfigButton = () => {
    if (selectedUOSName) {
      setOpenHeatLoadConfig(!openHeatLoadConfig);
    }
  };

  const handleSaveButton = () => {
    if (heatLoadConfigData.length > 0) {
      setSysIdentification(true);
      setGreenContour(true);
      setInputData({selectedUOSName,selectedUOSInfo,selectedSwitchesInfo})
      setTimeout(() => {
        setGreenContour(false);
      }, 1000);
    }
  };

  return (
    <BaseLayer isFirstLayer={true}>
      <Wrapper1>
        <TitleTop>system identification</TitleTop>
        <BaseLayer>
          <Wrapper2>
            {/* select box of UOS panel */}
            <SelectUOSWrapper>
              <SelectBoxLabel>
                assign uos control panel identification
              </SelectBoxLabel>
              <InputBaseLayer>
                <InputWrapper>
                  <SelectBoxDisplay>
                    <Text>{selectedUOSName && selectedUOSName}</Text>
                  </SelectBoxDisplay>
                  <Icon
                    src={mode? 'static/images/arrow-down_light.svg':'static/images/arrow-down.svg'}
                    onClick={handleSelectBox}
                  />
                  {openSelectBox && (
                    <SelectBoxWrapper>
                      <SelectBox
                        select={select}
                        setSelect={setSelect}
                        data={data}
                        handleAssignButton={handleAssignButton}
                        handleSelectBox={handleSelectBox}
                      />
                    </SelectBoxWrapper>
                  )}
                </InputWrapper>
              </InputBaseLayer>
            </SelectUOSWrapper>

            {/* location name, civic address */}
            <SubWrapper isFirstRow={true}>
              <DisplayLabel isLocationName={true}>location name</DisplayLabel>
              <Display isFirstRow={true}>{selectedUOSInfo?.location}</Display>
              <DisplayLabel isCivicAddress={true}>civic address</DisplayLabel>
              <Display isFirstRow={true}>{selectedUOSInfo?.address}</Display>
            </SubWrapper>

            {/* Num of UOS panel, SSR Qty, Num of switches */}
            <SubWrapper isSecondRow={true}>
              <DisplayLabel isSecondRow={true}>
                number of <br />
                uos panels
              </DisplayLabel>
              <Display isSecondRow={true}>{selectedUOSInfo?.numOfUOS}</Display>
              <DisplayLabel isSecondRow={true}>
                ssr <br /> qty.
              </DisplayLabel>
              <Display isSecondRow={true}>{selectedUOSInfo?.numOfSSR}</Display>
              <DisplayLabel isSecondRow={true}>
                number of <br /> switches
              </DisplayLabel>
              <Display isSecondRow={true}>
                {selectedUOSInfo?.switchesNum}
              </Display>
            </SubWrapper>

            {/* subtitles of the info box of each switch */}
            <SubWrapper isThirdRow={true}>
              {/* all the labels */}
              <DisplayLabelWrapper>
                <DisplayLabel isUOS={true} isThirdRow={true}>
                  uos
                </DisplayLabel>
                <DisplayLabel isSwitchName={true} isThirdRow={true}>
                  switch <br /> name
                </DisplayLabel>
                <DisplayLabel isSwitchSize={true} isThirdRow={true}>
                  switch <br /> size
                </DisplayLabel>
                <DisplayLabel isSysID={true} isThirdRow={true}>
                  system i.d.
                </DisplayLabel>
                <DisplayLabel isHeatingSys={true} isThirdRow={true}>
                  heating <br /> system
                </DisplayLabel>
                <DisplayLabel isGasType={true} isThirdRow={true}>
                  gas <br /> type
                </DisplayLabel>
                <DisplayLabel isSSRQty={true} isThirdRow={true}>
                  ssr <br /> qty.
                </DisplayLabel>
                <DisplayLabel isSSRRating={true} isThirdRow={true}>
                  ssr <br /> rating
                </DisplayLabel>
                <DisplayLabel isAppli={true} isThirdRow={true}>
                  application
                </DisplayLabel>
              </DisplayLabelWrapper>

              {/* all the display info of each switch */}
              <InfoBaseLayer>
                <InfoWrapper>
                  <Flex isRow={true}>
                    <Display isUOS={true}>
                      {selectedUOSInfo && selectedUOSInfo?.deviceNo}
                    </Display>
                    <Flex isColumn={true}>
                      {selectedSwitchesInfo.length > 0 ? (
                        selectedSwitchesInfo?.map((switchData, switchIdx) => {
                          return (
                            <InfoBaseLayer isSecondLayer={true} key={switchIdx}>
                              <InfoWrapper isSecondLayer={true}>
                                <Display isSwitchName={true}>
                                  <P> {switchData.switchName}</P>
                                </Display>
                                <Display isSwitchSize={true}>
                                  {switchData.switchSize}
                                </Display>
                                <Display isSysID={true}>
                                  {switchData.sysId}
                                </Display>
                                <Display isHeatingSysAndSSRRating={true}>
                                  {switchData.heatingSys}
                                </Display>

                                <Display
                                  isGasTypeAndSSRQty={true}
                                  disabled={
                                    switchData.heatingSys === 'ess' ||
                                    switchData.heatingSys === 'tes'
                                  }
                                >
                                  {switchData.gasType}
                                </Display>
                                <Display isGasTypeAndSSRQty={true}>
                                  {switchData.selectedSSR.length}
                                </Display>
                                <Display isHeatingSysAndSSRRating={true}>
                                  {switchData.ssrRating}
                                </Display>
                                <Display isAppli={true}>
                                  {switchData.application}
                                </Display>
                              </InfoWrapper>
                            </InfoBaseLayer>
                          );
                        })
                      ) : (
                        <InfoBaseLayer isSecondLayer={true}>
                          <InfoWrapper isSecondLayer={true}>
                            <Display isSwitchName={true}></Display>
                            <Display isSwitchSize={true}></Display>
                            <Display isSysID={true}></Display>
                            <Display isHeatingSysAndSSRRating={true}></Display>
                            <Display isGasTypeAndSSRQty={true}></Display>
                            <Display isGasTypeAndSSRQty={true}></Display>
                            <Display isHeatingSysAndSSRRating={true}></Display>
                            <Display isAppli={true}></Display>
                          </InfoWrapper>
                        </InfoBaseLayer>
                      )}
                    </Flex>
                  </Flex>
                  {/* Heat Load Configuration */}
                  {openHeatLoadConfig && (
                    <>
                      <Title>heat load configuration</Title>
                      <HeatLoadConfigWrapper>
                        {heatLoadConfigData.map((SSR, SSRIdx) => {
                          const isExisting = SSR.length > 0;
                          const SSRTitle = isExisting
                            ? Object.keys(SSR[0])[0]
                            : 'ssr' + (Number(SSRIdx) + 1);

                          return (
                            <Div key={SSRIdx}>
                              {/* labels */}
                              <DisplayLabelWrapper isSecondRow={true}>
                                <DisplaySSRLabel>
                                  <SSRDisplay>{SSRTitle}</SSRDisplay>
                                  <TCWrapper>
                                    <TC>
                                      {isExisting &&
                                        SSR[0][SSRTitle].thermoCouple}
                                    </TC>
                                  </TCWrapper>
                                </DisplaySSRLabel>
                                <DisplayLabel
                                  isPartNum={true}
                                  isThirdRow={true}
                                >
                                  part number
                                </DisplayLabel>
                                <DisplayLabel
                                  isCurrent={true}
                                  isThirdRow={true}
                                >
                                  current (a)
                                </DisplayLabel>
                                <DisplayLabel
                                  isWattage={true}
                                  isThirdRow={true}
                                >
                                  wattage (w)
                                </DisplayLabel>
                                <DisplayLabel
                                  isVoltage={true}
                                  isThirdRow={true}
                                >
                                  voltage (v)
                                </DisplayLabel>
                                <DisplayLabel isLength={true} isThirdRow={true}>
                                  length (ft)
                                </DisplayLabel>
                              </DisplayLabelWrapper>
                              <SSRWrapper>
                                {SSR?.map((el, elIdx) => {
                                  return (
                                    <Div key={elIdx} noMargin={true}>
                                      {isExisting &&
                                        el[SSRTitle]?.specs?.map((spec,index) => {
                                          return (
                                            <IndivBaseLayer key={index}>
                                              <IndivWrapper>
                                                {/* switch Info */}
                                                <SSRInfoWrapper>
                                                  <Display
                                                    isSSRSwitchName={true}
                                                  >
                                                    {isExisting &&
                                                      el.switchName}
                                                  </Display>
                                                  <Display isSharedSize={true}>
                                                    <SizeBox isPartNum={true}>
                                                      {isExisting &&
                                                        spec.partNumber}
                                                    </SizeBox>
                                                  </Display>
                                                  <Display
                                                    isSharedSize={true}
                                                    isPartNum={true}
                                                  >
                                                    {isExisting &&
                                                      spec.current + ' ' + 't'}
                                                  </Display>
                                                  <Display isSharedSize={true}>
                                                    {isExisting &&
                                                      spec.wattage + ' ' + 'w'}
                                                  </Display>
                                                  <Display isSharedSize={true}>
                                                    {isExisting &&
                                                      spec.voltage + ' ' + 'v'}
                                                  </Display>
                                                  <Display isSharedSize={true}>
                                                    {isExisting &&
                                                      spec.lengths + ' ' + 'ft'}
                                                  </Display>
                                                </SSRInfoWrapper>

                                                {/* name of UOS */}
                                                <DescriptionWrapper>
                                                  <DisplayLabel
                                                    isDescription={true}
                                                  >
                                                    description
                                                  </DisplayLabel>
                                                  <Display isDescription={true}>
                                                    <Text>
                                                      {isExisting &&
                                                        `${spec.elementName} -
                                            ${spec.partNumber}/${spec.current} a/${spec.wattage} w/${spec.voltage} v/${spec.lengths} ft`}
                                                    </Text>
                                                  </Display>
                                                </DescriptionWrapper>
                                              </IndivWrapper>
                                            </IndivBaseLayer>
                                          );
                                        })}
                                    </Div>
                                  );
                                })}
                              </SSRWrapper>
                            </Div>
                          );
                        })}
                      </HeatLoadConfigWrapper>
                    </>
                  )}

                  {/* display the full name of UOS machine, the heat load button */}
                  <SubWrapper isFifthRow={true}>
                    <DisplayUOSName>{selectedUOSName}</DisplayUOSName>
                    <ButtonWrapper isHeatLoad={true}>
                      <Button
                        isHeatLoad={true}
                        onClick={handleHeatLoadConfigButton}
                      >
                        <ButtonIndent isHeatLoad={true}>
                          <ButtonTop isHeatLoad={true}>
                            {openHeatLoadConfig
                              ? 'close'
                              : 'heat load configuration'}
                          </ButtonTop>
                        </ButtonIndent>
                      </Button>
                    </ButtonWrapper>
                  </SubWrapper>
                </InfoWrapper>
              </InfoBaseLayer>
            </SubWrapper>

            {/* save button */}
            <SubWrapper isFourthRow={true}>
              <ButtonWrapper>
                <Button onClick={handleSaveButton} greenContour={greenContour}>
                  <ButtonIndent isFirstLayer={true}>
                    <ButtonTop isFirstLayer={true}>
                      <ButtonIndent>
                        <ButtonTop>save</ButtonTop>
                      </ButtonIndent>
                    </ButtonTop>
                  </ButtonIndent>
                </Button>
              </ButtonWrapper>
            </SubWrapper>
          </Wrapper2>
        </BaseLayer>
      </Wrapper1>
    </BaseLayer>
  );
};

export default NewSystemIdentification;

const BaseLayer = styled.div`
  width: auto;
  height: auto;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;

  ${({ isFirstLayer }) =>
    isFirstLayer
      ? css`
          border-radius: 11px;
          padding: 2px;
        `
      : css`
          border-radius: 8px;
          padding: 1px;
          margin-bottom: 1px;
        `}
`;

const Wrapper1 = styled.div`
  width: 544px;
  min-height: 262px;

  background: ${props => props.theme.layout.main.bgGradient};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 2px #000000;
  border: 1px solid #000000;
  border-radius: 9px;

  ${justifyContentSpaceAround}
  flex-direction: column;
  gap: 4px;
`;

const TitleTop = styled.div`
  width: 539px;
  height: 32px;
  margin-top: 6px;

  font-size: 10px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;

  ${flexboxCenter}
`;

const Wrapper2 = styled.div`
  width: 538px;
  min-height: 214px;
  padding-top: 6px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 7px;

  ${justifyContentSpaceAround}
  flex-direction: column;
`;

const SelectUOSWrapper = styled.div`
  width: 100%;
  margin-bottom: 6px;
  ${justifyContentSpaceAround}
`;

const SelectBoxLabel = styled.div`
  width: 154px;
  height: 22px;

  font-size: 10px;
  letter-spacing: 1px;
  color: ${props => props.theme.label.primary};
`;

const InputBaseLayer = styled.div`
  width: 366px;
  height: 24px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 12px;

  ${flexboxCenter}
`;

const InputWrapper = styled.div`
  width: 364px;
  height: 22px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 12px;

  ${justifyContentSpaceAround}

  position:relative;
`;

const SelectBoxDisplay = styled.div`
  width: 341px;
  height: 18px;
  margin-left: 1px;

  font-size: 8px;
  letter-spacing: 0.8px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 10px;

  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    display: none;
  }

  ${flexboxCenter}
`;

const Text = styled.div`
  width: 94%;
  text-align: center;
  white-space: nowrap;
`;

const Icon = styled.img`
  cursor: pointer;
  margin-top: 2px;
  margin-right: 1px;
`;

const SelectBoxWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
`;

const SubWrapper = styled.div`
  width: 100%;
  margin-bottom: 6px;

  ${({ isFirstRow, isSecondRow, isThirdRow, isFourthRow, isFifthRow }) =>
    isFirstRow
      ? css`
          ${justifyContentSpaceAround}
        `
      : isSecondRow
      ? css`
          display: flex;
          justify-content: flex-start;
          align-items: center;
        `
      : isThirdRow
      ? css`
          ${flexboxCenter}
          flex-direction: column;
        `
      : isFourthRow
      ? css`
          width: 99%;
          margin-bottom: 4px;

          display: flex;
          justify-content: flex-end;
          align-items: center;
        `
      : isFifthRow &&
        css`
          width: 100%;
          margin-top: 8px;
          margin-bottom: 4px;
          ${justifyContentSpaceAround};
        `}
`;

const DisplayLabelWrapper = styled.div`
  width: 100%;

  position: relative;

  ${({ isSecondRow }) =>
    isSecondRow
      ? css`
          height: 22px;
        `
      : css`
          height: 26px;
        `}
`;

const DisplayLabel = styled.div`
  width: fit-content;

  font-size: 10px;
  letter-spacing: 1px;
  color: ${props => props.theme.label.primary};

  ${({ isLocationName, isCivicAddress }) =>
    isLocationName
      ? css`
          width: 66px;
          height: 22px;
        `
      : isCivicAddress &&
        css`
          width: 63px;
          height: 22px;
        `}

  ${({ isThirdRow, isSecondRow }) =>
    isThirdRow
      ? css`
          font-size: 8px;
          letter-spacing: 0.8px;
          text-align: center;

          position: absolute;
        `
      : isSecondRow &&
        css`
          margin-right: 4px;
          margin-left: 10px;
          &:first-child {
            margin-left: 4px;
          }
        `};

  ${({
    isUOS,
    isSwitchName,
    isSwitchSize,
    isSysID,
    isHeatingSys,
    isGasType,
    isSSRQty,
    isSSRRating,
    isAppli,
    isPartNum,
    isCurrent,
    isWattage,
    isVoltage,
    isLength,
    isDescription,
  }) =>
    isUOS
      ? css`
          top: 4px;
          left: 12px;
        `
      : isSwitchName
      ? css`
          top: 0px;
          left: 50px;
        `
      : isSwitchSize
      ? css`
          top: 0px;
          left: 104px;
        `
      : isSysID
      ? css`
          top: 4px;
          left: 180px;
        `
      : isHeatingSys
      ? css`
          top: 0px;
          left: 282px;
        `
      : isGasType
      ? css`
          top: 0px;
          left: 336px;
        `
      : isSSRQty
      ? css`
          top: 0px;
          left: 376px;
        `
      : isSSRRating
      ? css`
          top: 0px;
          left: 412px;
        `
      : isAppli
      ? css`
          top: 4px;
          left: 460px;
        `
      : isPartNum
      ? css`
          font-size: 8px;
          letter-spacing: 0.8px;

          top: 5px;
          left: 120px;
        `
      : isCurrent
      ? css`
          font-size: 8px;
          letter-spacing: 0.8px;

          top: 5px;
          left: 204px;
        `
      : isWattage
      ? css`
          font-size: 8px;
          letter-spacing: 0.8px;

          top: 5px;
          left: 282px;
        `
      : isVoltage
      ? css`
          font-size: 8px;
          letter-spacing: 0.8px;

          top: 5px;
          left: 364px;
        `
      : isLength
      ? css`
          font-size: 8px;
          letter-spacing: 0.8px;

          top: 5px;
          left: 450px;
        `
      : isDescription &&
        css`
          margin-left: 22px;

          font-size: 8px;
          letter-spacing: 0.8px;
          color: ${props => props.theme.label.primary};
        `}
`;

const Display = styled.div`
  font-size: 8px;
  letter-spacing: 0.8px;
  ${flexboxCenter}

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;

  ${({ isFirstRow, isSecondRow }) =>
    isFirstRow
      ? css`
          width: 185px;
          height: 24px;

          box-shadow: inset 0px 0px 6px #000000;
        `
      : isSecondRow &&
        css`
          width: 34px;
          height: 24px;

          box-shadow: inset 0px 0px 6px #000000;
        `}

  ${({
    isUOS,
    isSwitchName,
    isSwitchSize,
    isSysID,
    isGasTypeAndSSRQty,
    isHeatingSysAndSSRRating,
    isAppli,
    isSSRSwitchName,
    isSharedSize,
    isDescription,
  }) =>
    isUOS
      ? css`
          width: 28px;
          height: 18px;
          margin-top: 4px;
        `
      : isSwitchName
      ? css`
          width: 60px;
          height: 18px;
          margin-left: 1px;
        `
      : isSwitchSize
      ? css`
          width: 42px;
          height: 18px;
        `
      : isSysID
      ? css`
          width: 128px;
          height: 18px;
        `
      : isHeatingSysAndSSRRating
      ? css`
          width: 54px;
          height: 18px;
        `
      : isGasTypeAndSSRQty
      ? css`
          width: 34px;
          height: 18px;
        `
      : isAppli
      ? css`
          width: 65px;
          height: 18px;
          margin-right: 1px;
        `
      : isSSRSwitchName
      ? css`
          width: 106px;
          height: 20px;
        `
      : isSharedSize
      ? css`
          width: 76px;
          height: 20px;
          ${({ isPartNum }) =>
            isPartNum &&
            css`
              color: ${props => props.theme.label.success};
            `}
        `
      : isDescription &&
        css`
          width: 402px;
          height: 20px;

          margin-left: 20px;
        `}

        ${({ disabled }) =>
    disabled &&
    css`
      background: ${props => props.theme.layout.container.bgDark};
    `}

    overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const P = styled.div`
  max-height: 10px;
  max-width: 54px;

  white-space: nowrap;
`;

const InfoBaseLayer = styled.div`
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 13px;

  ${({ isSecondLayer }) =>
    isSecondLayer
      ? css`
          width: 493px;
          height: 26px;
          margin-bottom: 2px;
        `
      : css`
          width: 531px;
          min-height: 36px;
        `}

  ${flexboxCenter}
`;

const InfoWrapper = styled.div`
  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 12px;

  ${({ isSecondLayer }) =>
    isSecondLayer
      ? css`
          width: 491px;
          height: 24px;

          ${justifyContentSpaceEvenly}
        `
      : css`
          width: 529px;
          min-height: 34px;
          padding-top: 2px;
          padding-bottom: 2px;

          ${justifyContentSpaceAround}
          flex-direction: column;
        `}
`;

const ButtonWrapper = styled.div`
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 18px;

  ${({ isHeatLoad }) =>
    isHeatLoad
      ? css`
          width: 221px;
          height: 29px;
        `
      : css`
          width: 132px;
          height: 35px;
        `}

  ${flexboxCenter}
`;

const Button = styled.button`
  width: 130px;
  height: 33px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 17px;
  ${flexboxCenter}

  ${({ isHeatLoad }) =>
    isHeatLoad
      ? css`
          width: 219px;
          height: 27px;
        `
      : css`
          width: 130px;
          height: 33px;
        `}

        ${({ greenContour }) =>
    greenContour &&
    css`
      border-color: ${props => props.theme.label.success};
    `}
`;

const ButtonIndent = styled.div`
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 1px #000000;
  ${flexboxCenter}

  ${({ isFirstLayer, isHeatLoad }) =>
    isFirstLayer
      ? css`
          width: 126px;
          height: 29px;
          border-radius: 15px;
        `
      : isHeatLoad
      ? css`
          width: 213px;
          height: 21px;
          border-radius: 20px;
        `
      : css`
          width: 118px;
          height: 21px;
          border-radius: 20px;
        `}
`;

const ButtonTop = styled.div`
  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 25px;
  font-size: 10px;
  letter-spacing: 1px;
  color: ${props => props.theme.label.primary};

  ${flexboxCenter}

  ${({ isFirstLayer, isHeatLoad }) =>
    isFirstLayer
      ? css`
          width: 124px;
          height: 27px;
          /* ${flexboxCenter} */
        `
      : isHeatLoad
      ? css`
          width: 211px;
          height: 19px;
        `
      : css`
          width: 116px;
          height: 19px;
        `}
`;

const Flex = styled.div`
  ${({ isColumn, isRow }) =>
    isColumn
      ? css`
          display: flex;
          flex-direction: column;
        `
      : isRow &&
        css`
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
        `}
`;

const Title = styled.div`
  width: 100%;
  font-size: 10px;
  letter-spacing: 1px;

  ::before,
  ::after {
    background-color: ${props => props.theme.label.primary};
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 30%;
  }
  ::before {
    right: 0.5em;
    margin-left: 2%;
  }

  ::after {
    left: 0.5em;
  }
`;

const HeatLoadConfigWrapper = styled.div`
  width: 100%;
`;

const DisplaySSRLabel = styled.div`
  width: 111px;
  height: 20px;

  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;

  ${justifyContentSpaceBetween}

  position:absolute;
  top: 0;
  left: 4px;
`;

const SSRDisplay = styled.p`
  margin-left: 12%;

  font-size: 8px;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
`;

const TCWrapper = styled.div`
  width: 60px;
  height: 18px;
  margin-right: 1px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 12px;

  ${flexboxCenter}
`;

const TC = styled.div`
  width: 56px;
  height: 14px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;

  font-size: 8px;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};

  ${flexboxCenter}
`;

const SSRInfoWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceAround}
`;

const SizeBox = styled.div`
  width: 57px;
  height: 18px;

  text-align: center;
`;

const DescriptionWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceAround}
`;

const DisplayUOSName = styled.div`
  width: 287px;
  height: 29px;
  padding-left: 16px;

  font-size: 8px;
  letter-spacing: 0.8px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 15px;

  overflow-x: auto;
  overflow-y: auto;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    display: none;
  }

  ${flexboxCenter}
`;

const Div = styled.div`
  width: 100%;

  ${flexboxCenter}
  flex-direction: column;

  ${({ noMargin }) =>
    !noMargin &&
    css`
      margin-top: 4px;
    `}
`;

const SSRWrapper = styled.div`
  width: 524px;
  min-height: 54px;
  padding-top: 1px;
  padding-bottom: 1px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 15px;

  ${justifyContentSpaceAround}
  flex-direction: column;
  gap: 4px;
`;

const IndivBaseLayer = styled.div`
  width: 520px;
  height: 50px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 13px;

  ${flexboxCenter}
`;

const IndivWrapper = styled.div`
  width: 518px;
  height: 48px;

  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.container.bg};
  border-radius: 12px;

  ${justifyContentSpaceAround}
  flex-direction: column;
`;
