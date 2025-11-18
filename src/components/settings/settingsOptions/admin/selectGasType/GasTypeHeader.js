import styled from 'styled-components';
import { flexboxCenter } from '../../../../../styles/commonStyles';

function GasTypeHeader() {
  return (
    <div>
      <WrapperTitle>
        {/* <WrapperTitle2> */}
        <Title>select gas type</Title>
        {/* </WrapperTitle2> */}
      </WrapperTitle>
    </div>
  );
}

export default GasTypeHeader;

const WrapperTitle = styled.div`
  width: 252px;
  height: 32px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const WrapperTitle2 = styled.div`
  width: 246px;
  height: 26px;

  border: 1px solid var(--unnamed-color-142033);
  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 13px;
  opacity: 1;
  ${flexboxCenter}
`;

const Title = styled.p`
  width: auto;
  height: auto;

  text-align: center;
  font-size: var(--space0);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;
