import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

const HoverMessageBox = ({ message }) => {
  return (
    <Wrapper>
      <Message>{message}</Message>
    </Wrapper>
  );
};

export default HoverMessageBox;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 2px #000000;
  opacity: 1;
  padding: 0.2rem;
  width: fit-content;
  ${flexboxCenter}
`;
const Message = styled.span`
  /* Layout Properties */

  width: 150px;
  text-align: center;
  /* UI Properties */
  font-size: 8px;
  color: ${({ theme }) => theme.label.primary};
  line-height: 90%;
`;
