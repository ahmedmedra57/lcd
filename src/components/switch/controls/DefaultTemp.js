import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { selectSettingsOfEss } from '../../../store/slices/settingsOfEssSlice';
import { selectSettingsOfTgsTes } from '../../../store/slices/settingsOfTgsTesSlice';
import { selectTgsSwitch } from '../../../store/slices/tgsSwitchSlice';
import { selectUnitsState } from '../../../store/slices/unitsSlice';
import { selectUserState } from '../../../store/slices/userSlice';
import { flexboxCenter } from '../../../styles/commonStyles';
import InputTempMessage from '../../userMessages/InputTempMessage';

const DefaultTemp = ({ defaultTemp }) => {
  const unitsState = useSelector(selectSettingsOfEss);
  const { unitsMeasurement } = unitsState.buttonsOfSettings;
  const [displayMessage, setDisplayMessage] = useState(false);

  const userState = useSelector(selectUserState);
  const { isEssSwitch } = userState;
  const settingState = useSelector(selectSettingsOfTgsTes);
  const { thermocouple } = settingState;
  const systemData = useSelector(selectTgsSwitch);
  const { settings } = systemData;
  const location = useLocation();
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (isEssSwitch) {
      thermocouple && setDisabled(true);
    } else if (location.pathname === '/') {
    } else {
      thermocouple && setDisabled(true);
    }
  });

  const handleClose = (event) => {
    event.stopPropagation();
    setDisplayMessage(false);
  };

  return (
    <Wrapper
      onClick={() => {
        if (isEssSwitch) {
          thermocouple || setDisplayMessage(true);
        } else if (location.pathname === '/') {
          setDisplayMessage(true);
        } else {
          thermocouple || setDisplayMessage(true);
        }
      }}
    >
      <Title thermocouple={disabled}>default temp.</Title>
      {unitsMeasurement ? (
        <DefaultDegree thermocouple={disabled}>
          {defaultTemp}&deg;{settings?.unit}
        </DefaultDegree>
      ) : (
        <DefaultDegree>{defaultTemp}&deg;{settings?.unit}</DefaultDegree>
      )}

      {displayMessage && (
        <InputTempMessage
          onClose={handleClose}
          title='default temperature'
          message='In order to change default temperature, you need to go the SETTING PAGE'
        />
      )}
    </Wrapper>
  );
};

export default DefaultTemp;

const Wrapper = styled.div`
  display: flex;
`;

const Title = styled.span`
  text-align: center;
  font-size: 7px;
  letter-spacing: 0.7px;

  ${(p) =>
    p.thermocouple &&
    css`
      color: ${p.theme.label.disabled};
    `}
`;

const DefaultDegree = styled.span`
  text-align: left;
  font-size: 7px;

  ${(p) =>
    p.thermocouple &&
    css`
      color: ${p.theme.label.disabled};
    `}
  margin-left:6px
`;
