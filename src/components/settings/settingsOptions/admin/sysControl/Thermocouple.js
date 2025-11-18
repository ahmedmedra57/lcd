import { useSettingsStore } from '../../../../../store/zustand';
import { BUTTON_STATE } from '../../../../../constants/storeConstants';
import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';

function Thermocouple({
  handleLeftSwitch,
  toggleLeftEnableDisable,
  changeButtonColor,
}) {
  // zustand
  const buttonState = useSettingsStore((state) => state.buttonState);
  const editState = buttonState === BUTTON_STATE.EDIT;

  return (
    <WrapperLeftSwitch>
      <WrapperLeftSwitch2>
        <WrapperThermocouple>
          <Title>track temperature control t/c</Title>
        </WrapperThermocouple>
        <NoThermocoupleWrapper>
          <WrapperSubTitle>
            <Title>
              No thermocouple temperature control (will run on full power)
            </Title>
          </WrapperSubTitle>
        </NoThermocoupleWrapper>
        {/* <ImageWrapper> */}

        <WrapperButtonHole>
          <WrapperButton
            onClick={() => {
              editState && handleLeftSwitch();
            }}
            borderColor={editState}
            color={changeButtonColor}
          >
            <ButtonHole>
              <ButtonTop color={changeButtonColor}>
                <ButtonName>
                  {changeButtonColor ? 'applied' : 'apply'}
                </ButtonName>
              </ButtonTop>
            </ButtonHole>
          </WrapperButton>
        </WrapperButtonHole>
      </WrapperLeftSwitch2>
    </WrapperLeftSwitch>
  );
}

export default Thermocouple;

const WrapperLeftSwitch = styled.div`
  width: 270px;
  height: 145px;
  margin-top: 5px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 12px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperLeftSwitch2 = styled.div`
  width: 264px;
  height: 139px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: 0px 0px 2px #000000;
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 9px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const WrapperThermocouple = styled.div`
  width: 253px;
  height: 32px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 24px;
  opacity: 1;
  ${flexboxCenter}
`;

const Title = styled.p`
  font-size: var(--space2);
  text-align: center;
  letter-spacing: 0.9px;
  color: ${props => props.theme.label.primary};
  text-transform: uppercase;
`;

const NoThermocoupleWrapper = styled.div`
  width: 253px;
  height: 44px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 24px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperSubTitle = styled.div`
  width: 168px;
  height: 29px;
`;

// const ImageWrapper = styled.div`
//   width: 124px;
//   height: 28px;
// `;

// const Img = styled.img`
//   width: 100%;
//   height: 100%;
// `;

const WrapperButtonHole = styled.div`
  width: 121px;
  height: 37px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 26px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WrapperButton = styled.button`
  cursor: pointer;
  height: 35px;
  width: 119px;
  border-radius: 25px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};
  border-radius: 37px;
  background: ${props => props.theme.layout.main.bgGradient};
  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.info.bgGradient};
    `};
  opacity: 1;

  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: ${({ borderColor, index }) => props => borderColor && index === 0 ? `1.5px solid ${props.theme.status.error.border}` : 'none'};
  ${flexboxCenter};
`;
const ButtonHole = styled.div`
  width: 113px;
  height: 29px;

  border-radius: 22px;

  background: ${props => props.theme.layout.card.bg};
  border-color: ${props => props.theme.layout.card.border};
  box-shadow: inset 0 0 6px #000000;
  opacity: 1;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonTop = styled.div`
  width: 109px;
  height: 25px;
  margin-bottom: 0.5px;
  border-radius: 20px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};

  background: ${props => props.theme.layout.main.bgGradient};
  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.info.bgGradient};
    `};
  opacity: 1;

  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonName = styled.span`
  height: 12px;
  display: inline-block;
  font-size: 10px;
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;
