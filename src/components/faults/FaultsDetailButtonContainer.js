import styled from 'styled-components';
import { useFaultsStore } from '../../store/zustand';
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
  const { tgs, ess } = useFaultsStore();
  const { faultsTypes } = name === 'tgs' ? tgs : ess;

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
