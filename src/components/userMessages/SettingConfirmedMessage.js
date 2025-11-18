import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';
import MessageButton from './MessageButton';

const SettingConfirmedMessage = ({ onClose, title, message, alert, warm, src }) => {
  return (
    <Wrapper>
      <MessageOuter alert={alert} warm={warm}>
        <MessageInner>
          <HeaderWrapper alert={alert} warm={warm}>
            <HeaderTitle alert={alert} warm={warm}>{title}</HeaderTitle>
            <Logo src={warm ? '/static/images/messagebox-logo-warm.svg' : '/static/images/messagebox-logo.svg'} />
          </HeaderWrapper>
          {alert ? (
            <MessageWrapper>
              <AlertLogo src={src} />
              <Message alert={alert}>{message}</Message>
            </MessageWrapper>
          ) : warm ? (
            <MessageWrapper>
              <AlertLogo src={src} />
              <div>
                {message?.map((item, index) => <Message key={index} warm={warm}>{item}</Message>)}
              </div>
            </MessageWrapper>
          ) : (
            <MessageWrapper>
              <Message>{message}</Message>
            </MessageWrapper>
          )}

          <ButtonWrapper>
            <MessageButton name='ok' buttonHandler={onClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SettingConfirmedMessage;

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
  z-index: 100;
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
  align-items: center;
  height: 15%;

  ${(p) =>
    p.alert &&
    css`
      border-bottom: 1px solid ${props => props.theme.status.error.border};
    `}
  ${(p) =>
    p.warm &&
    css`
      border-bottom: 1px solid ${props => props.theme.status.warning.text};
    `}
`;
const HeaderTitle = styled.span`
  color: ${props => props.theme.label.primary};

  ${(p) =>
    p.alert &&
    css`
      color: ${props => props.theme.status.error.text};
    `}
  ${(p) =>
    p.warm &&
    css`
      color: ${props => props.theme.status.warning.text};
    `}
`;

const Logo = styled.img``;

const MessageWrapper = styled.div`
  width: 80%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${(p) => p.alert && css``}
`;

const AlertLogo = styled.img``;

const Message = styled.p`
  font-size: 12px;
  text-align: center;
  color: ${props => props.theme.label.primary};

  ${(p) =>
    p.alert &&
    css`
      width: 80%;
      color: ${props => props.theme.status.error.text};
      text-align: center;
    `}
  ${(p) =>
    p.warm &&
    css`
      width: 100%;
      color: ${props => props.theme.status.warning.text};
      text-align: center;
      font-size: 14px;
    `}
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
