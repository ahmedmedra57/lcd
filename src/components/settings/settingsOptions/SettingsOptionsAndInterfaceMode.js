import styled from 'styled-components';
import Interface from '../interfaceMode/Interface';
import ContainerOfAllSettingsSelectOptionsAndButtons from './ContainerOfAllSettingsSelectOptionsAndButtons';
import { flexboxCenter } from '../../../styles/commonStyles';

function SettingsOptionsAndInterfaceMode() {
  return (
    <Wrapper>
      <ContainerOfAllSettingsSelectOptionsAndButtons />
      <Interface />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 284px;
  height: 100%;
  margin-bottom: 5px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 6px;
  opacity: 1;
  ${flexboxCenter};
  flex-direction: column;
`;

export default SettingsOptionsAndInterfaceMode;
