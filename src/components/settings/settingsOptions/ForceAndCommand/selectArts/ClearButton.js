import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';

const ClearButton = ({ handleClear }) => {
  return (
    <Wrapper onClick={() => handleClear()}>
      <Button>
        <ButtonHole>
          <ButtonTop>
            <ButtonTitle>clear</ButtonTitle>
          </ButtonTop>
        </ButtonHole>
      </Button>
    </Wrapper>
  );
};

export default ClearButton;

const Wrapper = styled.div`
  cursor: pointer;
  width: 93px;
  height: 34px;

  background: ${props => props.theme.layout.sidebar.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 19px;
  ${flexboxCenter}
`;

const Button = styled.button`
  width: 91px;
  height: 32px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 25px;
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
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 25px;
  ${flexboxCenter}
`;

const ButtonTitle = styled.p`
  font-size: 10px;
`;
