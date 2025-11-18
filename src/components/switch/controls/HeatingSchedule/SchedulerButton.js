import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../styles/commonStyles';

const SchedulerButton = ({ name, id, onClickHandler }) => {
  return (
    <Wrapper onClick={() => onClickHandler(id)}>
      <ButtonHole>
        <ButtonTop>
          <ButtonName>{name}</ButtonName>
        </ButtonTop>
      </ButtonHole>
    </Wrapper>
  );
};

export default SchedulerButton;

const Wrapper = styled.button`
  width: 154px;
  height: 58px;
  border-radius: 35px;
  font-weight: 600;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};

  ${flexboxCenter}
  ${(p) =>
    p.size &&
    css`
      width: 181px;
      height: 50px;
    `}
`;
const ButtonHole = styled.div`
  width: 136px;
  height: 40px;
  border-radius: 25px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 6px #000000;

  ${flexboxCenter}
  ${(p) =>
    p.size &&
    css`
      width: 166px;
      height: 36px;
    `}
`;

const ButtonTop = styled.div`
  width: 138px;
  height: 42px;
  border-radius: 25px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};

  ${flexboxCenter}
  ${(p) =>
    p.size &&
    css`
      width: 164px;
      height: 34px;
      border-radius: 25px;
    `}
`;

const ButtonName = styled.span`
  font-size: 14px;
`;
