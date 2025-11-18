/**
 * MIGRATED TO ZUSTAND
 *
 * BEFORE (Redux):
 * - Imported 5 separate action creators (lines 5-11 in original)
 * - Used switch statement with 5 cases to dispatch actions
 * - Each action manually toggled 5 booleans
 *
 * AFTER (Zustand):
 * - Single import of store and constants
 * - Single action call with enum value
 * - Much cleaner and more maintainable
 */

import { useState } from 'react';
import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';
import { useSettingsStore, SETTINGS_OPTIONS } from '../../../store/zustand';

// Mapping for array indices to enum values
const OPTIONS_MAP = [
  SETTINGS_OPTIONS.UNITS,
  SETTINGS_OPTIONS.WIND_FACTOR,
  SETTINGS_OPTIONS.SNOW_FACTOR,
  SETTINGS_OPTIONS.FORCE_AND_COMMAND,
  SETTINGS_OPTIONS.ADMIN,
];

function AllTheSelectionsOfSettingsOptions({ settingsData, setSettingsState }) {
  // Zustand: Get state and actions
  const interfaceMode = useSettingsStore((state) => state.interfaceMode);
  const currentOption = useSettingsStore((state) => state.currentOption);
  const setCurrentOption = useSettingsStore((state) => state.setCurrentOption);

  const [options, setOptions] = useState(0);

  const handleSelect = (value) => {
    if (options !== value) {
      setOptions(value);
      // BEFORE: 5 separate dispatch calls in switch statement
      // AFTER: Single action with enum value
      setCurrentOption(OPTIONS_MAP[value]);
    }
  };

  return (
    <Wrapper mode={interfaceMode}>
      <SubWrapper>
        {settingsData.map((data, index) => {
          // Check if this option is currently selected
          const isSelected = OPTIONS_MAP[index] === currentOption;

          return (
            <ContainerOfEachSelectMeasurement key={index}>
              <SelectBox
                mode={interfaceMode}
                onClick={() => {
                  handleSelect(index);
                  setSettingsState(data);
                }}
                color={isSelected}
              />
              <ContainerOfEachOptions
                onClick={() => {
                  setSettingsState(data);
                  handleSelect(index);
                }}
                color={isSelected}
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
  background: ${props => props.theme.button.primary.bg};
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
  background: ${(props) => theme =>
    props.color ? `${theme.label.success} 0% 0% no-repeat padding-box` : theme.chart.grid};
  border: 1px solid ${props => props.theme.layout.card.border};
  opacity: 1;
`;

const ContainerOfEachOptions = styled.div`
  cursor: pointer;
  width: 215px;
  height: 22px;
  margin-left: 8px;
  background: ${props => props.theme.layout.card.bgGradient};
  border: ${({ color }) => props => color ? `1.5px solid ${props.theme.status.error.border}` : `1.5px solid ${props.theme.label.success}`};
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
