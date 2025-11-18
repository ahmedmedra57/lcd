import { useLocation } from 'react-router-dom';

import { useUserStore } from '../../../store/userStore';

import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';

const ChartInfoContainer = () => {
  // Sytem title will be chaged by state from store
  const { isEssSwitch } = useUserStore();
  const location = useLocation();

  const source = isEssSwitch
    ? 'ess'
    : location.pathname === '/'
    ? 'tgs'
    : 'tes';

  const SYSTEM_TITLE =
    source === 'ess'
      ? 'ess-electric switch system'
      : source === 'tgs'
      ? 'tgs-typhoon gas system'
      : 'tes-typhoon electrical system';

  const GRAPH_GUIDE_TITLE = 'HEATER TEMPERATURE Vs TIME';

  return (
    <Wrapper>
      <InfoTitle source={source}>{SYSTEM_TITLE}</InfoTitle>
      <InfoGraph>{GRAPH_GUIDE_TITLE}</InfoGraph>
      <InfoDateWrapper></InfoDateWrapper>
    </Wrapper>
  );
};

export default ChartInfoContainer;

const Wrapper = styled.div`
  ${flexboxCenter}
  flex-direction:column;
  gap: 8px;
  /* ${(p) =>
    p.option &&
    css`
      margin-right: 38px;
    `} */
`;

const InfoTitle = styled.span`
  font-size: 12px;
  color: ${(p) => props =>
    p.source === 'ess'
      ? props.theme.label.info
      : p.source === 'tgs'
      ? props.theme.status.warning.text
      : props.theme.status.success.text};
`;
const InfoGraph = styled.span`
  color: ${props => props.theme.label.primary};
  font-size: 12px;
`;
const InfoDateWrapper = styled.div`
  ${flexboxCenter}
  justify-content: space-around;
  width: 100%;
`;
