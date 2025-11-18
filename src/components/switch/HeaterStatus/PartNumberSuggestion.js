import styled from 'styled-components';
import { flexboxCenter, ItemBackground } from '../../../styles/commonStyles';

const PartNumberSuggestion = ({
  matchedSuggestion,
  isSelected,
  handleSelect,
  column,
  handleClose,
}) => {
  // let index = matchedSuggestion;

  // console.log(matchedSuggestion);

  const handleOnClick = () => {
    handleSelect(column, matchedSuggestion);
    handleClose();
  };

  return (
    <Wrapper isSelected={isSelected} onClick={handleOnClick}>
      <Prediction>{matchedSuggestion}</Prediction>
    </Wrapper>
  );
};

export default PartNumberSuggestion;

const Wrapper = styled.li`
  width: 206px;
  height: 29px;

  ${ItemBackground};
  background-color: ${(p) => p.isSelected && `hsla(50deg, 100%, 80%,0.25)`};
  &:hover {
    background-color: hsla(50deg, 100%, 80%, 0.25);
  }

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.2rem 0;
`;
const Prediction = styled.div`
  font-size: 12px;
  letter-spacing: 1.2px;
  text-align: center;
  ${flexboxCenter}
`;
