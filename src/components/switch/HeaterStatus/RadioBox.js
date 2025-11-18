import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

const RadioBox = ({ data, checked, onHandler, disabled = false }) => {
  return (
    <Wrapper
      onClick={(e) => !disabled && onHandler(data, e)}
      disabled={disabled}
    >
      <OptionChecker>
        <CheckedCircle
          checked={checked === data ? true : false}
        ></CheckedCircle>
      </OptionChecker>
      <Label disabled={disabled}>{data}</Label>
    </Wrapper>
  );
};

export default RadioBox;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  width: 80px;
  height: 20px;
  border: 1px solid ${({ theme }) => theme.layout.card.border};
  border-radius: 16px;

  padding: 0 0.1rem;
  margin-bottom: 0.2rem;
  &:first-child {
    margin-top: 0.05rem;
  }
  &:last-child {
    margin-bottom: 0.05rem;
  }
  &:hover {
    background: ${({ theme }) => theme.layout.card.bgGradient};
    box-shadow: inset 0px 0px 2px #000000;

    opacity: 1;
  }
  z-index: 100;
  cursor: ${(props) => (props.disabled === true ? 'not-allowed' : 'pointer')};
`;
const Label = styled.span`
  cursor: pointer;
  font-size: 10px;
  text-align: center;
  width: 70%;
  letter-spacing: 0.8px;
  /* border: 1px solid ${({ theme }) => theme.label.primary}; */
  z-index: 100;
  cursor: ${(props) => (props.disabled === true ? 'not-allowed' : 'pointer')};
`;
const OptionChecker = styled.div`
  ${flexboxCenter}
  width: 30%;
  height: 14px;
  width: 14px;
  border: 1px solid ${({ theme }) => theme.status.success.border};
  border-radius: 50%;
  z-index: 100;
`;
const CheckedCircle = styled.div`
  border-radius: 50%;
  height: 6px;
  width: 6px;
  background-color: ${({ theme, checked }) => checked ? theme.label.success : 'none'};
  z-index: 100;
`;
