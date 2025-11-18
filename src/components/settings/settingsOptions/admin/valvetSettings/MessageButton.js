import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';
import { useSettingsStore } from '../../../../../store/zustand';
import { BUTTON_STATE } from '../../../../../constants/storeConstants';

const MessageButton = ({ name, buttonHandler }) => {
  const mode = useSettingsStore((state) => state.interfaceMode);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const editState = buttonState === BUTTON_STATE.EDIT;

  return (
    <WrapperHole onClick={editState && buttonHandler}>
      <ButtonOuter>
        <ButtonInnerHole>
          <ButtonTop>
            <Title>{name}</Title>
          </ButtonTop>
        </ButtonInnerHole>
      </ButtonOuter>
    </WrapperHole>
  );
};
export default MessageButton;

const WrapperHole = styled.button`
  width: 74px;
  height: 27px;
  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 18px;
  opacity: 1;

  ${flexboxCenter}

  margin-left: 0.3rem;
`;
const ButtonOuter = styled.div`
  width: 72px;
  height: 25px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 25px;
  opacity: 1;
  ${flexboxCenter}
`;
const ButtonInnerHole = styled.div`
  width: 64px;
  height: 17px;
  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 18px;
  opacity: 1;
  ${flexboxCenter}
`;
const ButtonTop = styled.div`
  width: 62px;
  height: 15px;
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 25px;
  opacity: 1;
  ${flexboxCenter}
`;
const Title = styled.span`
  text-transform: uppercase;
  font-size: 8px;
`;
