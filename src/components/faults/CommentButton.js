import { AiFillEdit } from 'react-icons/ai';
import styled from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';

const CommentButton = ({ name, handleButtonClick }) => {
  return (
    <Wrapper onClick={() => handleButtonClick()}>
      <Inner>
        <Top>
          <Title>{name}</Title>
        </Top>
      </Inner>
    </Wrapper>
  );
};
export default CommentButton;

const Wrapper = styled.button`
  width: 72px;
  height: 25px;

  background: ${props => props.theme.button.primary.bgGradient} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 25px;

  ${flexboxCenter}
`;
const Inner = styled.div`
  ${flexboxCenter}

  width: 64px;
  height: 17px;

  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 18px;
`;
const Top = styled.div`
  width: 62px;
  height: 15px;

  background: ${props => props.theme.button.primary.bgGradient} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 25px;

  ${flexboxCenter}
`;
const Title = styled.span`
  font-size: 8px;
  color: ${props => props.theme.button.primary.text};
`;
