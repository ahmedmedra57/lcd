import styled from 'styled-components';
import { useSettingsStore } from '../../../store/zustand';

function Titles({ name }) {
  const mode = useSettingsStore((state) => state.interfaceMode);

  return (
    <>
      <TitleContainer mode={mode}>
        <Title mode={mode}>{name}</Title>
      </TitleContainer>
    </>
  );
}
const TitleContainer = styled.div`
  width: 901px;
  height: 22px;

  background: ${props => props.theme.layout.card.bg};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 16px;
  opacity: 1;
`;
const Title = styled.p`
  padding-top: 2px;
  margin-left: 12px;
  margin-right: 12px;
  text-align: left;
  font-family: normal normal 800 12px/12px Orbitron;
  font-size: 12px;
  border-bottom: 1px solid ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  color: ${props => props.theme.label.primary};
  text-transform: uppercase;
`;

export default Titles;
