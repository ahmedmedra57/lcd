import styled from 'styled-components';

function GasTypeConfirmButton({ handleButton, buttonColor, buttonName }) {
  return (
    <Wrapper>
      <Wrapper1
        onClick={() => {
          handleButton();
        }}
        color={buttonColor}
      >
        <ButtonHole>
          <ButtonTop color={buttonColor}>
            <ButtonName>{buttonName}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </Wrapper1>
    </Wrapper>
  );
}

export default GasTypeConfirmButton;

const Wrapper = styled.div`
  width: 120px;
  height: 36px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 26px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper1 = styled.button`
  cursor: pointer;
  width: 118px;
  height: 34px;
  border-radius: 25px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};
  border-radius: 37px;
  background-image: ${props => props.theme.layout.header.bgGradientVertical_90degree};
  ${({ color }) =>
    color &&
    `background: ${props => props.theme.status.info.bgGradient};`};
  opacity: 1;

  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonHole = styled.div`
  width: 112px;
  height: 28px;

  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${props => props.theme.layout.card.bg};
  border-color: ${props => props.theme.layout.card.border};
  box-shadow: inset 0 0 6px #000000;
  opacity: 1;
  padding: 0;
`;

const ButtonTop = styled.div`
  width: 108px;
  height: 24px;
  border-radius: 20px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};

  background-image: ${props => props.theme.layout.header.bgGradientVertical_90degree};
  ${({ color }) =>
    color &&
    `background: ${props => props.theme.status.info.bgGradient};`};
  opacity: 1;

  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonName = styled.span`
  /* height: 12px; */
  display: inline-block;
  font-size: var(--space1);
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;
