import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

const Button = ({ name, handleClick, id, editState }) => {
  return (
    <Wrapper>
      <Wrapper1
        borderColor={editState}
        index={id}
        onClick={() => handleClick(id)}
      >
        <ButtonHole>
          <ButtonTop>
            <ButtonName>{name}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </Wrapper1>
    </Wrapper>
  );
};

export default Button;

const Wrapper = styled.div`
  width: 80px;
  height: 37px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;

  border-radius: 19px;
  opacity: 1;
  ${flexboxCenter}
`;

const Wrapper1 = styled.button`
  cursor: pointer;
  height: 35px;
  width: 78px;
  border-radius: 25px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-style: solid;
  border-width: 0.5px;
  border-radius: 37px;
  background-image: ${props => props.theme.layout.header.bgGradientVertical_90degree};
  opacity: 1;
  /* box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%); */
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: ${({ borderColor, index }) => props => borderColor && index === 0 ? `1.5px solid ${props.theme.status.success.border}` : 'none'};
`;
const ButtonHole = styled.div`
  width: 70px;
  height: 27px;

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
  width: 66px;
  height: 23px;
  border-radius: 25px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.button.primary.border};

  background-image: ${props => props.theme.layout.header.bgGradientVertical_90degree};
  opacity: 1;
  /* box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%); */
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonName = styled.span`
  height: 12px;
  display: inline-block;
  font-size: 10px;
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;
