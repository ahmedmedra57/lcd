import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

const SwitchNameButton = ({ handleClick, name }) => {
  return (
    <WrapperHole onClick={() => handleClick(name)}>
      <ButtonOuterWrapper>
        <ButtonHole>
          <ButtonTop>
            <ButtonName>{name}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </ButtonOuterWrapper>
    </WrapperHole>
  );
};

export default SwitchNameButton;

const WrapperHole = styled.div`
  width: 80px;
  height: 22px;

  border-radius: 18px;
  background: ${({ theme }) => theme.layout.card.bg};
  border-color: ${({ theme }) => theme.layout.card.border};
  box-shadow: inset 0 0 6px #000000;
  opacity: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.1rem;
`;

const ButtonOuterWrapper = styled.button`
  cursor: pointer;
  width: 78px;
  height: 20px;

  border-radius: 25px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${({ theme }) => theme.layout.container.bg};
  opacity: 1;
`;

const ButtonHole = styled.div`
  width: 72px;
  height: 14px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.layout.sidebar.bgGradientDark};
  box-shadow: inset 0px 0px 1px #000000;
  opacity: 1;
`;

const ButtonTop = styled.div`
  width: 70px;
  height: 12px;
  border-radius: 25px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${({ theme }) => theme.layout.container.bg};

  background: ${({ theme }) => theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${({ theme }) => theme.layout.container.bg};
  border-radius: 25px;
  opacity: 1;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonName = styled.span`
  font-size: 7px;
  text-align: center;
`;

