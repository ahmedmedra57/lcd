import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

function ConfirmButton({
  name,
  buttonColor,
  handleClick,
  editState,
  atsSelectState,
}) {
  return (
    <Wrapper
      onClick={() => {
        editState && handleClick();
      }}
    >
      <Wrapper1 color={buttonColor} isSelected={atsSelectState && !buttonColor}>
        <ButtonHole>
          <ButtonTop color={buttonColor}>
            <ButtonName>{name}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </Wrapper1>
    </Wrapper>
  );
}

export default ConfirmButton;

const Wrapper = styled.div`
  width: 93px;
  height: 34px;

  background: ${props => props.theme.layout.sidebar.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 19px;
  ${flexboxCenter}
`;

const Wrapper1 = styled.button`
  cursor: pointer;
  width: 91px;
  height: 32px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.bg};
  border-radius: 25px;
  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.info.bgGradient};
    `};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;

  ${({ isSelected }) =>
    isSelected &&
    css`
      border: 1px solid ${props => props.theme.status.error.border};
    `}
  ${flexboxCenter}
`;

const ButtonHole = styled.div`
  width: 83px;
  height: 24px;

  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 18px;
  ${flexboxCenter}
`;

const ButtonTop = styled.div`
  width: 81px;
  height: 22px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.bg};
  border-radius: 25px;
  ${({ color }) =>
    color &&
    'background: ${props => props.theme.status.info.bgGradient} '};

  ${flexboxCenter}
`;

const ButtonName = styled.span`
  font-size: var(--space1);
`;
