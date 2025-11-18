import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles'
import CurrentEncloseAndBurningTemp from './CurrentEncloseAndBurningTemp';
import OutsideTemperature from './OutsideTemperature';
import { useUserStore, useForceAndCommandStore, useTgsSwitchStore } from '../../../../../store/zustand';
import { useState, useMemo, useEffect } from 'react';

function SelectTc({ ess, tgs, checkedBoxes, setCheckedBoxes }) {
  const tesSwitch = useUserStore((state) => state.isTesSwitch);
  const selectTcState = useForceAndCommandStore((state) => state);
  const essSwitch = useUserStore((state) => state.isEssSwitch);
  const settings = useTgsSwitchStore((state) => state.settings);
  const setEssTcTemp = useForceAndCommandStore((state) => state.setEssTcTemp);
  const setTgsTesTcTemp = useForceAndCommandStore((state) => state.setTgsTesTcTemp);

  const essData = [
    { title: `current ${ess} heater temperature`, selection: 'select t/c' },
    { title: 'enclosure temperature', selection: 'select t/c' },
  ];

  const tgsData = useMemo(()=>{
    if(essSwitch){
      return [
        { title: `current ${ess} heater temperature`, selection: 'select t/c' },
        { title: 'enclosure temperature', selection: 'select t/c' },
      ]
    }
    return [
      { title: `current ${tgs[0]} heater temperature`, selection: 'select t/c' },
      { title: `current ${tgs[1]} heater temperature`, selection: 'select t/c' },
      { title: 'enclosure temperature', selection: 'select t/c' },
    ]
  },[essSwitch, tgs]);

  const select = [
    'tc-01',
    'tc-02',
    'tc-03',
    'tc-04',
    'tc-05',
    'tc-06',
    'tc-07',
    'tc-08',
    'tc-09',
    'tc-10',
    'tc-11',
  ];
  const newSelectList=useMemo(()=>{
    if(settings?.active_thermocouples){
      return settings?.active_thermocouples?.map((item,index)=>{
        return {
          disabled:item===0,
          data:select[index]
        }
      })
    }
    return select.map(item=>{
      return {
        disabled:false,
        data:item
      }
    })
  },[settings?.active_thermocouples]);

  const [isClicked, setIsClicked] = useState({
    essOutsideTemp: false,
    essHeaterTemp: false,
    essEncloseTemp: false,
    tgsTesOutsideTemp: false,
    burningChamberTemp: false,
    tgsHeaterTemp: false,
    tesHeaterTemp: false,
    tgsTesEncloseTemp: false,
  });
  const [checked, setChecked] = useState(select[0]);

  const types={
    burner_temp_ch:'burningChamberCurrentTemp',
    blower_temp_ch:'currentTGSHeaterTemp',
    display_temp_ch:'currentTESHeaterTemp',
    enclosure_temp_ch:'enclosureTemp',
    outside_temp_ch:'outsideTemp',
  }
  // functions for current enclose and burning temp
  const handleChecked = (elem, type) => {
    setChecked(elem)
    setCheckedBoxes({
      ...checkedBoxes,
      [types[type]]: elem,
    });
  };
  // the function saves the selected data of each dropdown to local state above
  const displayOptions = (data) => {
    if (essSwitch) {
      if (data === 'essOutsideTemp') {
        return setIsClicked((prevState) => ({
          ...isClicked,
          essOutsideTemp: !prevState[data],
        }));
      } else if (data === 'essHeaterTemp') {
        return setIsClicked((prevState) => ({
          ...isClicked,
          essHeaterTemp: !prevState[data],
        }));
      } else if (data === 'essEncloseTemp')
        return setIsClicked((prevState) => ({
          ...isClicked,
          essEncloseTemp: !prevState[data],
        }));
    } else {
      if (data === 'tgsTesOutsideTemp') {
        return setIsClicked((prevState) => ({
          ...isClicked,
          tgsTesOutsideTemp: !prevState[data],
        }));
      } else if (data === 'burningChamberTemp') {
        return setIsClicked((prevState) => ({
          ...isClicked,
          burningChamberTemp: !prevState[data],
        }));
      } else if (data === 'tgsHeaterTemp') {
        return setIsClicked((prevState) => ({
          ...isClicked,
          tgsHeaterTemp: !prevState[data],
        }));
      } else if (data === 'tesHeaterTemp') {
        return setIsClicked((prevState) => ({
          ...isClicked,
          tesHeaterTemp: !prevState[data],
        }));
      } else if (data === 'tgsTesEncloseTemp') {
        return setIsClicked((prevState) => ({
          ...isClicked,
          tgsTesEncloseTemp: !prevState[data],
        }));
      }
    }
  };

  // this will dispatch the local state above of saved selections and send it to force and command store. the setState setIsClicked will handle the closure of dropdown
  const onConfirmCurrentEssHeaterTempHandler = (id) => {
    essSwitch
      ? setEssTcTemp({ id: id, data: checked })
      : setTgsTesTcTemp({ id: id, data: checked });

    setIsClicked(() => ({
      essOutsideTemp: false,
      essHeaterTemp: false,
      essEncloseTemp: false,
      tgsTesOutsideTemp: false,
      burningChamberTemp: false,
      tgsHeaterTemp: false,
      tesHeaterTemp: false,
      tgsTesEncloseTemp: false,
    }));
  };

  return (
    // <WrapperTelemetry>
    <WrapperTelemetry1>
      <WrapperTelemetry2>
        <TitleWrapper>
          <P>select t/c telemetry</P>
        </TitleWrapper>
        <Wrapper>
          <OutsideTemperature
            handleChecked={handleChecked}
            checkedBoxes={checkedBoxes}
            onConfirmHandler={onConfirmCurrentEssHeaterTempHandler}
            displayOptions={displayOptions}
            isClicked={isClicked}
            select={newSelectList}
            checked={checked}
            essOutsideTempName={'essOutsideTemp'}
            tgsTesOutsideTempName={'tgsTesOutsideTemp'}
            burningChamberTempName={'burningChamberTemp'}
            essSwitch={essSwitch}
            selectTcState={selectTcState}
          />
          <CurrentEncloseAndBurningTemp
            data={essSwitch ? essData : tgsData}
            essSwitch={essSwitch}
            tesSwitch={tesSwitch}
            handleChecked={handleChecked}
            checkedBoxes={checkedBoxes}
            onConfirmHandler={onConfirmCurrentEssHeaterTempHandler}
            displayOptions={displayOptions}
            isClicked={isClicked}
            select={newSelectList}
            checked={checked}
            essHeaterTempName={'essHeaterTemp'}
            essEncloseTempName={'essEncloseTemp'}
            tgsHeaterTempName={'tgsHeaterTemp'}
            tesHeaterTempName={'tesHeaterTemp'}
            tgsTesEncloseTempName={'tgsTesEncloseTemp'}
            selectTcState={selectTcState}
          />
        </Wrapper>
      </WrapperTelemetry2>
    </WrapperTelemetry1>
    // </WrapperTelemetry>
  );
}

export default SelectTc;

const WrapperTelemetry = styled.div`
  width: 552px;
  height: auto;
  margin: 2px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperTelemetry1 = styled.div`
  width: 548px;
  height: auto;
  margin: 2px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 10px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperTelemetry2 = styled.div`
  width: 544px;
  height: auto;
  margin: 2px;

  background: ${props => props.theme.layout.container.bgDark};
  box-shadow: inset 1px 1px 2px rgb(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 8px;
  opacity: 1;
  ${flexboxCenter}
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const P = styled.p`
  font-size: var(--font-size7);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: ${props => props.theme.label.primary};
`;

const TitleWrapper = styled.div`
  width: 532px;
  height: 32px;
  margin-top: 4px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 24px;
  opacity: 1;
  ${flexboxCenter}
`;

const Wrapper = styled.div`
  width: 546px;
  height: 234px;
  height: auto;
  margin: 2px 0 2px 0;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: baseline;
`;

const WrapperButton = styled.div`
  width: 130px;
  height: 46px;
  margin-top: 10px;
  margin-bottom: 10px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 38px;
  opacity: 1;
  ${flexboxCenter}
`;
