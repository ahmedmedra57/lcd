import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';
import MessageButton from './MessageButton';

const ConflictMessage = ({
  handleCancel,
  handleConfirm,

  currentSwitch,
  DesiredSwitch,
}) => {
  const currSwitch =
    currentSwitch === 'tes-typhoon electric system' ? 'tes' : 'tgs';
  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>
              {DesiredSwitch} and {currSwitch} conflict
            </HeaderTitle>
            <Logo src='/static/images/messagebox-logo.svg' />
          </HeaderWrapper>

          <MessageWrapper>
            <InnerWrapper>
              <Title id={1}>{currentSwitch}</Title>
              <Message>
                is currently <u>in operation</u>
              </Message>
            </InnerWrapper>
            <InnerWrapper>
              <Title id={2}>tgs & tes systems</Title>
              <Message>
                do not operate <u>simultaneously</u>
              </Message>
            </InnerWrapper>
            <InnerWrapper>
              <Message>
                you are about to <u>turn off</u> <br></br>
                <Strong>{currSwitch}</Strong> and switchover to
              </Message>
              <Title id={3}>{DesiredSwitch}</Title>
            </InnerWrapper>
          </MessageWrapper>
          <ButtonWrapper>
            <MessageButton name='cancel' buttonHandler={handleCancel} />
            <MessageButton name='confirm' buttonHandler={handleConfirm} />
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default ConflictMessage;

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
  height: 293px;
  background: ${props => props.theme.layout.card.bgGradientTransparent};
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid ${props => props.theme.layout.sidebar.border};

  border-radius: 14px;
  ${flexboxCenter}
`;
const MessageInner = styled.div`
  width: 384px;
  height: 275px;
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
  height: 8%;
`;
const HeaderTitle = styled.span`
  color: ${props => props.theme.label.primary};
`;

const Logo = styled.img`
  width: 18px;
  height: 18px;
`;

const MessageWrapper = styled.div`
  width: 358px;
  height: 181px;
  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;
`;

const InnerWrapper = styled.div`
  ${flexboxCenter}
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.label.primary};

  ${(p) =>
    p.id === 1 &&
    css`
      color: ${props => props.theme.status.warning.text};
    `}
  ${(p) =>
    p.id === 2 &&
    css`
      color: ${props => props.theme.status.error.text};
    `}
    ${(p) =>
    p.id === 3 &&
    css`
      color: ${props => props.theme.status.success.text};
    `}
`;

const Strong = styled.span`
  font-size: 16px;
  color: ${props => props.theme.label.primary};
`;
const Message = styled.p`
  font-size: 12px;
  text-align: center;
  color: ${props => props.theme.label.primary};
`;

const ButtonWrapper = styled.div`
  height: 15%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
