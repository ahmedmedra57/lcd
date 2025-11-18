import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../styles/commonStyles';

const RadioBoxButton = ({
  title,
  isLastChild,
  handleRadioBoxButton,
  idx,
  isSelectButton,
}) => {
  return (
    <Wrapper isLastChild={isLastChild}>
      <Button
        onClick={() => {
          handleRadioBoxButton(idx, isSelectButton);
        }}
      >
        <ButtonHole>
          <ButtonTop>
            <ButtonTitle>{title}</ButtonTitle>
          </ButtonTop>
        </ButtonHole>
      </Button>
    </Wrapper>
  );
};

export default RadioBoxButton;

const Wrapper = styled.div`
  width: 82px;
  height: 24px;
  margin-bottom: 2px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 27px;
  ${flexboxCenter}
`;

const Button = styled.button`
  width: 80px;
  height: 22px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.text};
  border-radius: 25px;
  ${flexboxCenter}
`;

const ButtonHole = styled.div`
  width: 74px;
  height: 16px;

  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 20px;
  ${flexboxCenter}
`;

const ButtonTop = styled.div`
  width: 72px;
  height: 14px;

  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.text};
  border-radius: 25px;
  ${flexboxCenter}
`;

const ButtonTitle = styled.p`
  font-size: 8px;
  letter-spacing: 0.8px;
`;
