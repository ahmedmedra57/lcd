import styled from "styled-components";

const ButtonSelect = () => {
  return (
    <Wrapper onClick={() => {}}>
      <ButtonHole>
        <ButtonTop>
          <ButtonName>select</ButtonName>
        </ButtonTop>
      </ButtonHole>
    </Wrapper>
  );
};

export default ButtonSelect;

const Wrapper = styled.button`
  cursor: pointer;
  width: 128px;
  height: 44px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};
  border-radius: 37px;
  background: ${props => props.theme.layout.main.bgGradient};
  opacity: 1;
  box-shadow: ${props => props.theme.layout.main.shadow};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ButtonHole = styled.div`
  width: 120px;
  height: 32px;

  border-radius: 20px;
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
  width: 110px;
  height: 28px;
  border-radius: 25px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};

  background: ${props => props.theme.layout.main.bgGradient};
  opacity: 1;
  box-shadow: ${props => props.theme.layout.main.shadow};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonName = styled.span`
  display: inline-block;
  font-size: var(--font-size7);
  text-transform: uppercase;
  font-family: "Orbitron", sans-serif;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;
