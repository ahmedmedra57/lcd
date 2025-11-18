import styled from 'styled-components';
import { flexboxCenter } from '../../../../../src/styles/commonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { selectSettingsOfEss } from '../../../../store/slices/settingsOfEssSlice';

function ImperialMetricMeasurementReader({
  value,
  index,
  metricImperialToggle,
  handleClick,
  unitsMeasurement,
}) {
  const { title, temp, energy, measure, gas, backgroundColor } = value;
  const is360 = backgroundColor === '360';
  const state = useSelector(selectSettingsOfEss);
  const mode = state.interfaceMode;

  const { settingsEditButton } = state.buttonsOfSettings;

  return (
    <div>
      <Wrapper>
        <Wrapper2 backgroundColor={backgroundColor} mode={mode}>
          <ContainerOfTitle mode={mode}>
            <OutsideRingGreenCircle
              onClick={() => settingsEditButton && handleClick(index)}
            >
              <InsideFilledGreenCircle
                color={index === metricImperialToggle ? true : false}
              ></InsideFilledGreenCircle>
            </OutsideRingGreenCircle>

            <Span mode={mode}>{title}</Span>
          </ContainerOfTitle>
          <ContainerOfMeasurements mode={mode}>
            <MeasurementsContainer>
              <Container>
                <Measurements mode={mode}>TEMP:</Measurements>
                <IndividualContainer>
                  <MeasureUnits mode={mode}>{temp}</MeasureUnits>
                </IndividualContainer>
              </Container>
              <Container>
                <Measurements mode={mode}>ENERGY:</Measurements>
                <IndividualContainer>
                  <MeasureUnits mode={mode}>{energy}</MeasureUnits>
                </IndividualContainer>
              </Container>
              <Container>
                <Measurements mode={mode}>MEASURE:</Measurements>
                <IndividualContainer>
                  <MeasureUnits mode={mode}>{measure}</MeasureUnits>
                </IndividualContainer>
              </Container>
              <Container>
                <Measurements mode={mode}>
                  GAS <br></br>CONSUMP:
                </Measurements>
                <IndividualContainer>
                  <MeasureUnits mode={mode}>{gas}</MeasureUnits>
                </IndividualContainer>
              </Container>
            </MeasurementsContainer>
          </ContainerOfMeasurements>
        </Wrapper2>
      </Wrapper>
    </div>
  );
}

export default ImperialMetricMeasurementReader;

const Wrapper = styled.div`
  width: 286px;
  height: 218px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter};
`;

const Wrapper2 = styled.div`
  width: 284px;
  height: 216px;

  border-radius: 15px;
  opacity: 1;

  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;

  box-sizing: border-box;

  border: 0.5px solid ${props => props.theme.layout.card.border};
  background-image: ${(props) => props.backgroundColor === '360' ? props.theme.layout.header.bgGradientVertical_360degree : props.theme.layout.header.bgGradientVertical_180degree};
  box-shadow: ${props => props.theme.layout.main.shadow};
`;

const ContainerOfTitle = styled.div`
  width: 274px;
  height: 30px;
  box-shadow: ${props => props.theme.layout.card.shadow};
  background: ${props => props.theme.layout.card.bg};
  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 16px;
  opacity: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const OutsideRingGreenCircle = styled.span`
  cursor: pointer;
  width: 22px;
  height: 22px;
  margin-left: 4px;
  border: 1.5px solid ${props => props.theme.status.success.border};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.layout.main.bg};
`;

const InsideFilledGreenCircle = styled.div`
  cursor: pointer;
  width: 14px;
  height: 14px;
  background-color: ${(props) => theme => props.color ?  props.theme.status.success.text : 'none'};
  border-radius: 50%;
`;

const Span = styled.span`
  margin-left: 6px;
  font-size: var(--font-size3);
  color: ${props => props.theme.label.primary};
`;

const ContainerOfMeasurements = styled.div`
  width: 274px;
  height: 170px;
  background: ${props => props.theme.layout.card.bg};
  border: none;

  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 12px;
  opacity: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const MeasurementsContainer = styled.div`
  width: 274px;
  height: 158px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  margin-left: 10px;
  margin-right: 4px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Measurements = styled.p`
  font-size: var(--space0);
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 2px;
  color: ${props => props.theme.label.primary};
`;

const IndividualContainer = styled.div`
  width: 169px;
  height: 30px;
  border: 1.5px solid ${props => props.theme.layout.card.border};
  border-radius: 16px;
  opacity: 1;
  display: flex;
  align-items: center;
`;

const MeasureUnits = styled.p`
  font-size: var(--space0);
  margin-left: 8px;
  color: ${props => props.theme.label.primary};
`;
