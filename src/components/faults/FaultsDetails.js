import styled from 'styled-components';
import FaultsDetailButtonContainer from './FaultsDetailButtonContainer';

const FaultsDetails = ({ faultContents, column, handleButtonClick, name }) => {
  return (
    <Wrapper>
      <FaultInfoWrapper>
        <FaultsText>{faultContents}</FaultsText>
      </FaultInfoWrapper>
      <ButtonWrapper>
        <FaultsDetailButtonContainer
          handleButtonClick={handleButtonClick}
          column={column}
          name={name}
          faultContents={faultContents}
        />
      </ButtonWrapper>
    </Wrapper>
  );
};
export default FaultsDetails;

const Wrapper = styled.div`
  /* Layout Properties */

  width: 863px;
  height: 34px;
  /* UI Properties */

  border: 2px solid #ff0000;
  border-radius: 17px;
  margin-bottom: 0.5rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 0.1rem;
  padding-left: 0.5rem;
`;

const FaultInfoWrapper = styled.div`
  height: 100%;
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const FaultsText = styled.span`
  text-align: left;
  font-size: 12px;
  color: #ff0000;
`;

const ButtonWrapper = styled.div`
  /* width: 30%; */
  /* border: 1px solid transparent; */
`;
