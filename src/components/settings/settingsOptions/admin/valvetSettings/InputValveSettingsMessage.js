import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';
import MessageButton from './MessageButton';

const InputValveSettingsMessage = ({ onClose, title, message }) => {
  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{title}</HeaderTitle>
            <Logo src='/static/images/messagebox-logo.svg' />
          </HeaderWrapper>

          <MessageWrapper>
            <Message>{message}</Message>
          </MessageWrapper>
          <ButtonWrapper>
            <MessageButton name='ok' buttonHandler={onClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default InputValveSettingsMessage;

const Wrapper = styled.div`
  width: 1024px;
  height: 600px;

  position: absolute;
  top: 0px;
  left: 128px;

  background-color: ${props => props.theme.label.muted};
  z-index: 10000;
  ${flexboxCenter};

  border: 1px solid ${props => props.theme.label.primary};
`;

const MessageOuter = styled.div`
  width: 402px;
  height: 190px;
  background: ${props => props.theme.status.neutral.bgGradientTransparent};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  opacity: 1;
  border-radius: 14px;
  ${flexboxCenter}
`;
const MessageInner = styled.div`
  width: 384px;
  height: 172px;
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 9px;
  opacity: 1;

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
  text-transform: uppercase;
`;

const Logo = styled.img``;

const MessageWrapper = styled.div`
  width: 100%;
  height: 60%;
  ${flexboxCenter}
  flex-direction: column;
`;
const Message = styled.p`
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
`;

const ButtonWrapper = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
