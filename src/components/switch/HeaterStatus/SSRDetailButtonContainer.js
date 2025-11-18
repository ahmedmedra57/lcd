import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';
import SSRDetailAddButton from './SSRDetailAddButton';

const SSRDetailButtonContainer = ({ handleClick, isEditable }) => {
  const buttonNames = ['add', 'clear', 'apply'];

  return (
    <Wrapper>
      <ButtonWrapper>
        {buttonNames.map((name, index) => (
          <SSRDetailAddButton
            handleClick={handleClick}
            name={name}
            key={index}
          />
        ))}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default SSRDetailButtonContainer;

const Wrapper = styled.div`
  width: 246px;
  height: 32px;

  background: ${({ theme }) => theme.layout.main.bgGradient};
  /* box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000; */
  box-shadow: inset 0px 0 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${({ theme }) => theme.button.primary.border};
  opacity: 1;

  border-radius: 0 0 12px 16px;
  ${flexboxCenter}
  justify-content: flex-start;
  padding: 0 0.1rem;
`;
const ButtonWrapper = styled.div`
  ${flexboxCenter}
  justify-content: space-between;

  width: 222px;
  height: 28px;
  background: var(--unnamed-color-1b2b44) 0% 0% no-repeat padding-box;
  background: ${({ theme }) => theme.layout.sidebar.bgGradient};
  border-radius: 15px;
  padding: 0 0.1rem;
`;
