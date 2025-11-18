import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectSettingsOfEss } from '../../../../../store/slices/settingsOfEssSlice';
import { flexboxCenter } from '../../../../../styles/commonStyles';
import SaveButton from './SaveButton';
import { updateDeviceInfo } from '../../../../../helpers/helpers';

function ForceGasElectricSystem({
  handleRightSwitch,
  toggleRightEnableDisable,
  handleSave,
  buttonColor,
}) {
  const state = useSelector(selectSettingsOfEss);
  const editState = state.buttonsOfSettings.settingsEditButton;

  useEffect(() => {
    handleSave(false);
  }, []);

  const handleSaveButton = () => {
    handleSave(true);
  };

  return (
    <WrapperRightSwitch>
      <WrapperRightSwitch2>
        <WrapperForce>
          <WrapperTitle>
            <Title>
              Force - gas & electric system simultaneously on for 15 minutes
            </Title>
          </WrapperTitle>
        </WrapperForce>
        <ImageAndButtonWrapper>
          <Img
            src={toggleRightEnableDisable}
            onClick={() => {
              editState && handleRightSwitch();
            }}
          />
          <SaveButton
            name={buttonColor ? 'activated' : 'activate'}
            // onClick={() => {
            //   editState && handleSave(true);
            // }}
            editState={editState}
            handleClick={handleSaveButton}
            buttonColor={buttonColor}
          />
        </ImageAndButtonWrapper>
      </WrapperRightSwitch2>
    </WrapperRightSwitch>
  );
}

export default ForceGasElectricSystem;

const WrapperRightSwitch = styled.div`
  width: 270px;
  height: 88px;
  margin-top: 5px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 12px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperRightSwitch2 = styled.div`
  width: 264px;
  height: 82px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: 0px 0px 2px #000000;
  box-shadow: inset 1px 1px 2px rgb(255, 255, 255, 0.1);
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 9px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const WrapperForce = styled.div`
  width: 253px;
  height: 32px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 24px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperTitle = styled.div`
  width: 206px;
  height: 20px;
  ${flexboxCenter}
`;

const Title = styled.p`
  width: auto;
  height: auto;
  font-size: var(--space2);
  text-align: center;
  letter-spacing: 0.9px;
  color: ${props => props.theme.label.primary};
  text-transform: uppercase;
`;

const ImageAndButtonWrapper = styled.div`
  width: 264px;
  height: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const Img = styled.img`
  width: 124px;
  height: 100%;
`;
