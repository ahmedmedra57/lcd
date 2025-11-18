import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

const SwitchNameRadioBox = ({
  data,
  checked,
  handleClick,
  isSelectSwitchName,
}) => {
  return (
    <Wrapper onClick={() => handleClick(data)}>
      <OptionChecker>
        <CheckedCircle
          checked={checked === data?.name ? true : false}
        ></CheckedCircle>
      </OptionChecker>
      <Label isSelectSwitchName={isSelectSwitchName}>
        {data?.name}
      </Label>
    </Wrapper>
  );
};

export default SwitchNameRadioBox;



const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  width: 76px;
  /* height: 14px; */
  height: fit-content;

  border: 1px solid ${({ theme }) => theme.layout.container.bg};
  border-radius: 9px;

  padding: 2 1px;
  margin-bottom: 1.5px;
  &:first-child {
    margin-top: 2px;
  }
  &:last-child {
    margin-bottom: 2px;
  }
  &:hover {
    background: ${({ theme }) => theme.layout.card.bg};
    box-shadow: inset 0px 0px 2px #000000;

    opacity: 1;
  }
  z-index: 100;
`;
const Label = styled.span`
  cursor: pointer;
  font-size: 6px;
  text-align: center;
  width: 70%;
  ${({ isSelectSwitchName }) =>
    isSelectSwitchName &&
    css`
      font-size: 8px;
      letter-spacing: 0.8px;
    `}
`;
const OptionChecker = styled.div`
  width: 30%;
  height: 10px;
  width: 10px;
  border: 1px solid ${({ theme }) => theme.layout.container.bg};
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const CheckedCircle = styled.div`
  border-radius: 50%;
  height: 6px;
  width: 6px;
  background-color: ${({ theme, checked }) => checked ? theme.label.success : 'none'};
`;
