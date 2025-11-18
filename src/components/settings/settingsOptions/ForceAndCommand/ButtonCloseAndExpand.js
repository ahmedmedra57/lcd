import styled, { css } from 'styled-components';

const ButtonCloseAndExpand = ({ name, tesSwitchFalse, color }) => {
  return (
    <Wrapper tesSwitchFalse={tesSwitchFalse} color={color}>
      <ButtonHole tesSwitchFalse={tesSwitchFalse} color={color}>
        <ButtonTop tesSwitchFalse={tesSwitchFalse} color={color}>
          <ButtonName tesSwitchFalse={tesSwitchFalse} color={color}>
            {name}
          </ButtonName>
        </ButtonTop>
      </ButtonHole>
    </Wrapper>
  );
};

export default ButtonCloseAndExpand;

const Wrapper = styled.button`
  cursor: pointer;
  width: 64px;
  height: 22px;
  border-radius: 25px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};
  border-radius: 37px;

  background: ${({ tesSwitchFalse }) =>
    tesSwitchFalse
      ? props => props.theme.status.neutral.bgGradient
      : props => props.theme.layout.main.bgGradientVertical};
  opacity: 1;
  box-shadow: ${({ tesSwitchFalse }) =>
    tesSwitchFalse
      ? '0 0 2px #3B3B3B'
      : 'inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000'};

  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.warning.bgGradient};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 1px solid #000000;
    `};
`;

const ButtonHole = styled.div`
  width: 59px;
  height: 17px;

  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ tesSwitchFalse }) => props => tesSwitchFalse ? props.theme.input.disabled : props.theme.layout.card.bg};
  border-color: ${props => props.theme.layout.card.border};

  box-shadow: ${({ tesSwitchFalse }) =>
    tesSwitchFalse ? 'inset 0 0 6px #3B3B3B' : 'inset 0 0 6px #000000'};
  opacity: 1;
  padding: 0;

  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.warning.text};
      box-shadow: inset 0px 0px 1px #000000;
    `};
`;

const ButtonTop = styled.div`
  width: 56px;
  height: 14px;
  border-radius: 25px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};

  background: ${({ tesSwitchFalse }) =>
    tesSwitchFalse
      ? props => props.theme.status.neutral.bgGradient
      : props => props.theme.layout.main.bgGradientVertical};
  opacity: 1;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.warning.bgGradient};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 1px solid #000000;
    `};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonName = styled.span`
  display: inline-block;
  font-size: var(--space2);
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
  ${({ color }) =>
    color &&
    css`
      color: ${props => props.theme.layout.card.bg};
    `};
`;
