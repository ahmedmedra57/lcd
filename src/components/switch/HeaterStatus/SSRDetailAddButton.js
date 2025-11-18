import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

const SSRDetailAddButton = ({ name, handleClick }) => {
  const handleOnClick = () => {
    handleClick(name);
  };
  return (
    <Wrapper onClick={handleOnClick}>
      <ButtonHole>
        <ButtonTop>
          <ButtonName>{name}</ButtonName>
        </ButtonTop>
      </ButtonHole>
    </Wrapper>
  );
};

export default SSRDetailAddButton;

const Wrapper = styled.button`
  cursor: pointer;

  width: 71px;
  height: 26px;
  border-radius: 25px;

  background: ${({ theme }) => theme.layout.main.bgGradientVertical} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${({ theme }) => theme.layout.container.bg};

  opacity: 1;

  ${flexboxCenter}
`;
const ButtonHole = styled.div`
  width: 62px;
  height: 18px;

  border-radius: 18px;
  ${flexboxCenter}

  background: ${({ theme }) => theme.layout.card.bg};
  border-color: ${({ theme }) => theme.layout.card.border};
  box-shadow: inset 0 0 6px #000000;
  opacity: 1;
  padding: 0;
`;

const ButtonTop = styled.div`
  width: 60px;
  height: 16px;
  border-radius: 25px;

  border-style: solid;
  border-width: 0.5px;
  border-color: ${({ theme }) => theme.layout.container.bg};

  background-image: ${({ theme }) => theme.layout.main.bgGradient};
  opacity: 1;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);

  ${flexboxCenter}
`;

const ButtonName = styled.span`
  font-size: 7px;
`;

//
const TempAndButton = styled.div`
  width: 272px;
  height: 36px;
  background: var(--unnamed-color-233a54) 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px var(--unnamed-color-000000);
  background: ${({ theme }) => theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 27px;
  opacity: 1;

  ${flexboxCenter}
  justify-content: space-between;
  padding: 0 3px;
`;
