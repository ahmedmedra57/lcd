import { useContext } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { SettingsContext } from '../../../../context/ContextOfSettings';
import { selectSettingsOfEss } from '../../../../store/slices/settingsOfEssSlice';
import { flexboxCenter } from '../../../../styles/commonStyles';

function WindFactor({
  contents,
  index,
  selectedMeasurement,
  handleKeypad,
  setInputFocus,
  handleInputs,
}) {
  const { windFactor } = useContext(SettingsContext);
  // redux
  const settingsEssState = useSelector(selectSettingsOfEss);
  const mode = settingsEssState.interfaceMode;

  const inputValue =
    index === 0
      ? windFactor.lowWind
      : index === 1
      ? windFactor.highWind
      : index === 2
      ? windFactor.medWind
      : windFactor.extremeWind;

  return (
    <ContainerWindFactors
      gradient={index === 0 ? true : index === 1 ? true : false}
      interfaceMode={mode}
    >
      <TitleContainer interfaceMode={mode}>
        <Title interfaceMode={mode}>{contents.title}</Title>
      </TitleContainer>

      <ValueContainer interfaceMode={mode}>
        <SmallContainer interfaceMode={mode}>
          <Wind interfaceMode={mode}>
            {selectedMeasurement ? contents.windMiles : contents.windKilo}{' '}
            {selectedMeasurement ? 'miles/h' : 'kilometers/h'}
          </Wind>
          <Temperature interfaceMode={mode}>
            <Input
              interfaceMode={mode}
              type='number'
              placeholder='temp'
              value={inputValue}
              onClick={() => {
                handleKeypad(index);
                setInputFocus(index);
              }}
              onChange={(e) => handleInputs(index, e.target.value)}
            ></Input>
            <Wind1 interfaceMode={mode}>
              {selectedMeasurement ? '°f' : '°c'}
            </Wind1>
          </Temperature>
        </SmallContainer>
      </ValueContainer>
    </ContainerWindFactors>
  );
}

export default WindFactor;


const ContainerWindFactors = styled.div`
  width: 286px;
  height: 94px;
  opacity: 1;

  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;
  box-sizing: border-box;
  border: 0.5px solid ${props => props.theme.button.primary.bg};
  border-radius: 12px;

 background: ${props => props.gradient ? props.theme.layout.header.bgGradientVertical_180degree : props.theme.layout.header.bgGradientVertical_360degree};

          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
          box-shadow: 0 0 2px rgba(0, 0, 0, 100%);

  opacity: 1;
`;

const TitleContainer = styled.div`
  width: 278px;
  height: 32px;

  background: ${props => props.theme.layout.card.bg};
          border: none;

  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const Title = styled.p`
  font-size: var(--font-size7);
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
`;

const ValueContainer = styled.div`
  width: 278px;
  height: 42px;

  background: ${props => props.theme.layout.card.bg};

  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 21px;
  opacity: 1;
  ${flexboxCenter};
`;

const SmallContainer = styled.div`
  width: 268px;
  height: 32px;
  border: 1px solid ${props => props.theme.label.tertiary};
  border-radius: 17px;
  opacity: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Wind = styled.span`
  font-size: var(--space0);
  margin-left: var(--font-size6);
  color: ${props => props.theme.label.primary};
`;

const Temperature = styled.span`
  font-size: var(--space2);
  margin-right: var(--font-size6);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: baseline;
`;

const Input = styled.input`
  width: 40px;
  height: 15px;
  margin-right: 4px;

  background-color: ${props => props.theme.layout.card.bg};

  font-size: var(--space0);

  /* border-radius: 21px; */
  opacity: 1;
  text-transform: uppercase;

  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Wind1 = styled.span`
  width: auto;
  height: 15px;
  font-size: var(--space2);

  color: ${props => props.theme.label.primary};
`;
