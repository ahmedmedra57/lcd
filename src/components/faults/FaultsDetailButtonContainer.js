import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectFaults } from '../../store/slices/faultsSlice';
import FaultsDetailButton from './FaultsDetailButton';
import { useMemo } from 'react';

const FaultsDetailButtonContainer = ({
  handleButtonClick,
  column,
  name,
  faultContents,
}) => {
  const buttonNames = useMemo(
    () => (name === 'tgs' ? ['reset', 'attend'] : ['force', 'reset', 'attend']),
    [name]
  );
  const faultsState = useSelector(selectFaults);
  const { faultsTypes } = name === 'tgs' ? faultsState.tgs : faultsState.ess;

  // logic for detecting faults type
  const data = faultContents.split(' ');
  const faultsNumber = faultsTypes.indexOf(data[0] + ' ' + data[1]);

  return (
    <Wrapper>
      {buttonNames.map((title, index) => (
        <FaultsDetailButton
          name={name}
          title={title}
          faultsNumber={faultsNumber}
          handleButtonClick={handleButtonClick}
          column={column}
          key={`${index}${column}`}
          buttonNum={index}
          faultContents={faultContents}
        />
      ))}
    </Wrapper>
  );
};

export default FaultsDetailButtonContainer;

const Wrapper = styled.div`
  display: flex;
`;
