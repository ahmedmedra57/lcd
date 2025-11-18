import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';

function ButtonForceStop({ handleClick, name, color }) {
  return (
    <Wrapper onClick={() => handleClick()} color={color}>
      <Wrapper1 color={color}>
        <ButtonHole color={color}>
          <ButtonTop color={color}>
            <ButtonName color={color}>{name}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </Wrapper1>
    </Wrapper>
  );
}

export default ButtonForceStop;

const Wrapper = styled.div`
  width: 90px;
  height: 28px;

  background: ${props => props.theme.button.secondary.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 19px;

  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.layout.container.bgDark};
      box-shadow: inset 0px 0px 1px #000000;
    `}

  opacity: 1;
  ${flexboxCenter}
`;

const Wrapper1 = styled.button`
  cursor: pointer;
  width: 88px;
  height: 26px;
  border-radius: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.input.border};
  border-radius: 37px;
  background-image: ${props => props.theme.layout.main.bgGradient};
  opacity: 1;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
  border: ${({ borderColor, index }) => props => borderColor && index === 0 ? `1.5px solid ${props.theme.status.error.border}` : 'none'};

  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.neutral.bgGradient};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 1px solid #000000;
    `}
`;
const ButtonHole = styled.div`
  width: 82px;
  height: 20px;
  padding: 0;

  border-radius: 20px;
  background: ${props => props.theme.layout.card.bg};
  border-color: ${props => props.theme.layout.card.border};
  box-shadow: inset 0 0 6px #000000;

  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.layout.container.bgDark};
      box-shadow: inset 0px 0px 1px #000000;
    `}

  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonTop = styled.div`
  width: 80px;
  height: 18px;
  border-radius: 25px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.input.border};

  background-image: ${props => props.theme.layout.main.bgGradient};
  opacity: 1;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);

  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.neutral.bgGradient};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 1px solid #000000;
    `}

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonName = styled.span`
  height: 12px;
  display: inline-block;
  font-size: var(--space2);
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};

  ${({ color }) =>
    color &&
    css`
      color: ${props => props.theme.label.disabled};
    `}

  opacity: 1;
`;
