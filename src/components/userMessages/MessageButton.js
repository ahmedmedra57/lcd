import styled from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';

const MessageButton = ({ name, buttonHandler }) => {
  return (
    <WrapperHole onClick={(e) => buttonHandler(e)}>
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

  ${flexboxCenter}

  margin-left: 0.3rem;
`;
const ButtonOuter = styled.div`
  width: 72px;
  height: 25px;
  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.border};
  border-radius: 25px;

  ${flexboxCenter}
`;
const ButtonInnerHole = styled.div`
  width: 64px;
  height: 17px;
  background: ${props => props.theme.layout.sidebar.bgGradientDark};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 18px;

  ${flexboxCenter}
`;
const ButtonTop = styled.div`
  width: 62px;
  height: 15px;
  background: ${props => props.theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.border};
  border-radius: 25px;

  ${flexboxCenter}
`;
const Title = styled.span`
  font-size: 8px;
  color: ${props => props.theme.label.primary};
`;
