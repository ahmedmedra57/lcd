import { useState } from 'react';
import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSettingsOfEss,
  setSettingsOptionsUnits,
  setSettingsOptionsWindFactor,
  setSettingsOptionsSnowFactor,
  setSettingsOptionsForceAndCommand,
  setSettingsOptionsAdmin,
} from '../../../store/slices/settingsOfEssSlice';

function AllTheSelectionsOfSettingsOptions({
  settingsData,

  setSettingsState,
}) {
  const dispatch = useDispatch();
  const state = useSelector(selectSettingsOfEss);
  const mode = state.interfaceMode;

  const [options, setOptions] = useState(0);

  const handleSelect = (value) => options !== value && setOptions(value);

  switch (options) {
    case 0: {
      dispatch(setSettingsOptionsUnits());
      break;
    }
    case 1: {
      dispatch(setSettingsOptionsWindFactor());
      break;
    }
    case 2: {
      dispatch(setSettingsOptionsSnowFactor());
      break;
    }
    case 3: {
      dispatch(setSettingsOptionsForceAndCommand());
      break;
    }
    case 4: {
      dispatch(setSettingsOptionsAdmin());
      break;
    }
    default:
      return;
  }
  return (
    <Wrapper mode={mode}>
      <SubWrapper>
        {settingsData.map((data, index) => {
          return (
            <ContainerOfEachSelectMeasurement key={index}>
              <SelectBox
                mode={mode}
                onClick={() => {
                  handleSelect(index);
                  setSettingsState(data);
                }}
                color={options === index ? true : false}
              ></SelectBox>
              <ContainerOfEachOptions
                onClick={() => {
                  setSettingsState(data);
                  handleSelect(index);
                }}
                color={options === index ? true : false}
              >
                <P>{data}</P>
              </ContainerOfEachOptions>
            </ContainerOfEachSelectMeasurement>
          );
        })}
      </SubWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 272px;
  height: 136px;
  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 8px;
  opacity: 1;
  ${flexboxCenter};
  justify-content: space-evenly;
  flex-direction: column;
`;
const SubWrapper = styled.div`
  width: 270px;
  height: 136px;
  margin-left: -1px;
  margin-right: -2px;
  ${flexboxCenter};
  justify-content: space-evenly;
  flex-direction: column;
`;

const ContainerOfEachSelectMeasurement = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const SelectBox = styled.div`
  cursor: pointer;
  width: 36px;
  height: 20px;
  margin-left: 1px;
  background: ${(props) =>
    props.color ? props.theme.status.success.text : props.theme.chart.grid};
  border: 1px solid #427293;
  opacity: 1;
`;

const ContainerOfEachOptions = styled.div`
  cursor: pointer;
  width: 215px;
  height: 22px;
  margin-left: 8px;
  background: ${props => props.theme.layout.card.bgGradient};
  border: ${({ color }) => props => color ? `1.5px solid ${props.theme.status.success.text}` : `1.5px solid ${props.theme.chart.grid}`};
  border-radius: 6px;
  opacity: 1;
  display: flex;
  align-items: center;
`;

const P = styled.p`
  font-size: var(--space1);
  text-align: center;
  margin-left: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;

export default AllTheSelectionsOfSettingsOptions;
