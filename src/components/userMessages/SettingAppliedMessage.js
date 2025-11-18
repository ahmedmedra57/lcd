import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';
import MessageButton from './MessageButton';

const SettingAppliedMessage = ({ onClose, title, message }) => {
  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{title}</HeaderTitle>
            <Logo src='/static/images/messagebox-logo.svg' />
          </HeaderWrapper>

          <MessageWrapper>
            {message.title?.map((value, index) => {
              return (
                <div key={index}>
                  <MessageTitle>{value}</MessageTitle>
                  <MessageDescription>{message.content}</MessageDescription>
                </div>
              );
            })}
          </MessageWrapper>

          <ButtonWrapper>
            <MessageButton name='ok' buttonHandler={onClose} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SettingAppliedMessage;

const Wrapper = styled.div`
  width: 1024px;
  height: 600px;

  position: fixed;
  top: 0;
  left: 0;

  background-color: ${props => props.theme.layout.overlay.bg};
  z-index: 1000;
  ${flexboxCenter};
`;

const MessageOuter = styled.div`
  width: 402px;
  height: auto;
  padding-top: 8px;
  padding-bottom: 8px;
  background: ${props => props.theme.layout.card.bgGradientTransparent};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.border};

  border-radius: 14px;
  ${flexboxCenter}
`;
const MessageInner = styled.div`
  width: 384px;
  height: auto;

  /* padding-top: 11px;
  padding-bottom: 11px; */
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
  margin-top: -4px;
  border-bottom: 1px solid ${props => props.theme.label.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;
`;
const HeaderTitle = styled.span`
  color: ${props => props.theme.label.primary};
`;

const Logo = styled.img``;

const MessageWrapper = styled.div`
  width: 100%;
  height: auto;
  margin-top: 14px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AlertLogo = styled.img``;

const MessageTitle = styled.p`
  font-size: 12px;
  margin-top: 6px;
  text-align: center;
  color: ${props => props.theme.label.success};
`;

const MessageDescription = styled.p`
  font-size: 12px;
  text-align: center;
  color: ${props => props.theme.label.primary};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
