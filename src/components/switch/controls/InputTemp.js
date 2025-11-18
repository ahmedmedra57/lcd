import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { selectSettingsOfEss } from '../../../store/slices/settingsOfEssSlice';
import { selectUnitsState } from '../../../store/slices/unitsSlice';
import {
  flexboxCenter,
  DisableApplyButtonBG,
  DisableApplyButtonHole,
} from '../../../styles/commonStyles';

const InputTemp = ({ isEnable, setTemp }) => {
  const unitsState = useSelector(selectSettingsOfEss);
  const { unitsMeasurement } = unitsState.buttonsOfSettings;

  const handleOnChange = (event) => {
    const value = event.target.value;
    setTemp(value);
    unitsMeasurement
      ? (event.target.value = `${value}\u00b0F`)
      : (event.target.value = `${value}\u00b0C`);
  };

  return (
    <InputWrapper isEnable={isEnable}>
      <Label isEnable={isEnable}> input temp.</Label>
      <InputWrapper isEnable={isEnable}>
        <InputDegree
          isEnable={isEnable}
          type='text'
          placeholder={unitsMeasurement ? '0&deg;F' : '0&deg;C'}
          onChange={handleOnChange}
        />
      </InputWrapper>
    </InputWrapper>
  );
};

export default InputTemp;

const Label = styled.label`
  height: 10px;
  width: 66px;
  font-size: 8px;
  text-align: center;
  color: ${(p) => p.isEnable ? p.theme.label.primary : p.theme.label.disabled};
`;

const InputWrapper = styled.div`
  height: 22px;
  width: 126px;
  border-radius: 25px;
  ${flexboxCenter}

  ${(p) =>
    p.isEnable
      ? css`
          border: 0.5 solid rgb(0, 0, 0);
          background-image: ${props => props.theme.layout.main.bgGradient};

          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
          box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
        `
      : css`
          ${DisableApplyButtonBG}
        `}
`;
const InputDegree = styled.input`
  height: 14px;
  width: 118px;
  border-radius: 20px;
  font-size: 10px;

  ${(p) =>
    p.isEnable
      ? css`
          background: ${props => props.theme.layout.card.bg};
          border-color: ${props => props.theme.layout.card.border};
          box-shadow: inset 0 0 6px #000000;
        `
      : css`
          ${DisableApplyButtonHole}
        `}

  ::placeholder {
    color: ${(p) => p.isEnable ? p.theme.label.primary : p.theme.label.disabled};
    text-align: center;
    font-size: 10px;
  }
`;
