import styled from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';
import MessageButton from './MessageButton';

const InputTempMessage = ({ onClose, title, messages, onConfirm }) => {
  const isConfirm = !!onConfirm;

  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{title}</HeaderTitle>
            <Logo src='/static/images/messagebox-logo.svg' />
          </HeaderWrapper>

          <MessageWrapper>
            {messages.map((message, index) => (
              <Message key={index}>{message}</Message>
            ))}
          </MessageWrapper>
          <ButtonWrapper>
            <MessageButton name={isConfirm ? 'cancel' : 'ok'} buttonHandler={onClose} />
            {isConfirm && <MessageButton name='confirm' buttonHandler={onConfirm} />}
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default InputTempMessage;

const Wrapper = styled.div`
  width: 1024px;
  height: 600px;

  position: fixed;
  top: 0;
  left: 0;

  background-color: ${props => props.theme.layout.overlay.bg};
  z-index: 100;
  ${flexboxCenter};
`;

const MessageOuter = styled.div`
  width: 402px;
  height: 190px;
  background: ${props => props.theme.layout.card.bgGradientTransparent};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.border};

  border-radius: 14px;
  ${flexboxCenter}
`;
const MessageInner = styled.div`
  width: 384px;
  height: 172px;
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.border};
  border-radius: 9px;

  padding: var(--space2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const HeaderWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.label.primary};
  display: flex;
  justify-content: space-between;
  height: 15%;
`;
const HeaderTitle = styled.span`
  color: ${props => props.theme.label.primary};
`;

const Logo = styled.img``;

const MessageWrapper = styled.div`
  width: 100%;
  height: 60%;
  ${flexboxCenter}
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Message = styled.p`
  font-size: 12px;
  text-align: center;
  color: ${props => props.theme.label.primary};
`;

const ButtonWrapper = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
