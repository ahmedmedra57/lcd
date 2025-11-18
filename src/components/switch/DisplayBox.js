import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  useSettingsStore,
  useTgsSwitchStore,
  useUserStore
} from '../../store/zustand';

import { flexboxCenter } from '../../styles/commonStyles';

const DisplayBox = ({ currData, label, unit, name, option }) => {
  const unitsMeasurement = useSettingsStore((state) => state.unitsMeasurement);

  const { isEssSwitch } = useUserStore();
  const { settings } = useTgsSwitchStore();
  const location = useLocation();

  const labelArr = label.split(' ');
  const displayLabel1 = labelArr[0];
  const displayLabel2 =
    labelArr.length > 2 ? `${labelArr[1]} ${labelArr[2]}` : labelArr[1];

  return (
    <Wrapper option={option}>
      <InnerLayer option={option}>
        <SectionDataAndUnit>
          <DataWrapper>
            <DisplayData>{currData}</DisplayData>
          </DataWrapper>

          <UnitWrapper option={option}>
            {isEssSwitch ? (
              <DisplayUnit unit={unit}>{unit}</DisplayUnit>
            ) : location.pathname !== '/' ? (
              <DisplayUnit unit={unit}>{unit}</DisplayUnit>
            ) : name === 'energyConsumption' ? (
              unitsMeasurement ? (
                <DisplayUnit>FT³/h</DisplayUnit>
              ) : (
                <DisplayUnit>M³/h</DisplayUnit>
              )
            ) : (
              <DisplayUnit unit={unit}>{unit}</DisplayUnit>
            )}
          </UnitWrapper>
        </SectionDataAndUnit>

        <SectionLabel option={option}>
          {option === 1 ? (
            <DisplayLabel>{label}</DisplayLabel>
          ) : (
            <DisplayLabel option={option}>
              {displayLabel1} <br></br>
              {displayLabel2}
            </DisplayLabel>
          )}
        </SectionLabel>
      </InnerLayer>
    </Wrapper>
  );
};

export default DisplayBox;

const Wrapper = styled.div`
  width: 226px;
  height: 100%;
  border-radius: 6px;
  gap: 8px;
  ${flexboxCenter}

  ${(p) =>
    p.option == 1 &&
    css`
      width: 180px;
      height: 100%;
    `}
`;
const InnerLayer = styled.div`
  width: 219px;
  height: 100%;
  border-radius: 4px;
  font-weight: 600;
  padding:8px;
  border: 1px solid ${props => props.theme.status.info.border};
  background: ${props => props.theme.layout.switch_controls.bgGradient} 0% 0%
    no-repeat padding-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(p) =>
    p.option == 1 &&
    css`
      width: 170px;
      height: 90%;
      padding: 8px;
    `}
`;

const SectionDataAndUnit = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;

  margin-top: -8px;
`;
const DataWrapper = styled.div`
  width: 80%;
`;

const DisplayData = styled.span`
  font-size: 38px;
  color: ${props => props.theme.status.info.text};
  letter-spacing: 3.8px;
`;

const UnitWrapper = styled.div`
  width: 20%;
  height: 100%;
  padding-top: 5px;

  ${(p) =>
    p.option === 2 &&
    css`
      width: fit-content;
    `}
`;

const DisplayUnit = styled.span`
  font-size: 24px;
  color: ${props => props.theme.status.info.text};
  padding-right: 3px;

  ${(p) =>
    p.unit === 'Hrs' &&
    css`
      font-size: 20px;
      margin-left: -15px;
    `};

  ${(p) =>
    p.unit === 'Kw/H' &&  
    css`
      font-size: 23px;
      margin-left: -23px;
      text-transform: uppercase;
    `}
`;

const SectionLabel = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-right: 2px;

  ${(p) =>
    p.option === 2 &&
    css`
      margin-top: -10px;
    `}
`;

const DisplayLabel = styled.span`
  line-height: 10px;
  text-align: right;
  font-size: 11px;
  margin-top: -8px;
  letter-spacing: 1px;
  color: ${props => props.theme.status.info.text};
  line-height: 1.1;
  ${(p) => p.option === 2 && css``}
`;
