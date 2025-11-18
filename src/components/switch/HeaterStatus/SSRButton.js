import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  ssrHole,
  ssrOff,
  ssrOn,
} from '../../../styles/commonStyles';
import { SSR_BUTTON, PADDING } from '../../../constants';

const SSRButton = ({ status, id, data }) => {
  const switchStatus = status === 'flt' ? 'flt' : status ? 'on' : 'off';

  const isWarn = data?.warn === 1 ? true : false;
  const isTest = data?.test === 1 ? true : false;

  return (
    <Wrapper>
      <SSRId>ssr {id}</SSRId>
      <Button>
        <Hole status={switchStatus} isWarn={isWarn} isTest={isTest}>
          <Top>
            <Title status={switchStatus}>{switchStatus}</Title>
          </Top>
        </Hole>
      </Button>
    </Wrapper>
  );
};

export default SSRButton;

const Wrapper = styled.div`
  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;

  /* Space between title and button */
  padding: ${PADDING.SMALL} 0;
`;

const SSRId = styled.span`
  font-size: ${SSR_BUTTON.TITLE_FONT_SIZE + 1}px;

  margin-bottom: ${PADDING.SMALL};
  text-align: center;
`;

const Button = styled.div`
  ${flexboxCenter}

  width: ${SSR_BUTTON.BUTTON_WIDTH}px;
  height: ${SSR_BUTTON.BUTTON_HEIGHT}px;
  border-radius: ${SSR_BUTTON.BUTTON_BORDER_RADIUS}px;

  ${ssrHole}
  ${(p) =>
    p.disabled &&
    css`
      cursor: default;
    `}
`;
const Hole = styled.div`
  ${flexboxCenter}

  width: ${SSR_BUTTON.HOLE_WIDTH}px;
  height: ${SSR_BUTTON.HOLE_HEIGHT}px;
  border-radius: ${SSR_BUTTON.HOLE_BORDER_RADIUS}px;

  ${(props) => props.status === 'on' ? ssrOn : ssrOff}
  border: ${(props) => props.isTest && `2px solid ${props.theme.label.muted}`};
  border: ${(props) => props.isWarn && `1px solid ${props.theme.status.warning.text}`};
  border: ${(props) => props.status === 'flt' && `1px solid ${props.theme.status.error.border}`};
`;
const Top = styled.div`
  ${flexboxCenter}

  width: ${SSR_BUTTON.TOP_WIDTH}px;
  height: ${SSR_BUTTON.TOP_HEIGHT}px;
  border-radius: ${SSR_BUTTON.TOP_BORDER_RADIUS}px;

  ${ssrHole}
`;
const Title = styled.span`
  ${flexboxCenter}
  font-size: ${SSR_BUTTON.TITLE_FONT_SIZE}px;

  width: ${SSR_BUTTON.TITLE_WIDTH}px;
  height: ${SSR_BUTTON.TITLE_HEIGHT}px;
  border-radius: ${SSR_BUTTON.TITLE_BORDER_RADIUS}px;

  ${(p) => p.status === 'on' ? ssrOn : ssrOff}
`;
