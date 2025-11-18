import { css } from 'styled-components';

export const flexboxCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

export const justifyContentSpaceEvenly = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
`;

export const justifyContentSpaceBetween = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

export const justifyContentSpaceAround = css`
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
`;

export const alignItemsFlexStart = css`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
`;

export const flexDirectionColumn = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const layer1 = css`
  background: ${props => props.theme.layout.card.bg};
  border-color: ${props => props.theme.layout.card.border};
  box-shadow: ${props => props.theme.layout.card.shadow};
`;

export const layer90Deg = css`
  border-style: solid;
  border-width: 0.5px;
  border-color: transparent;
  border-radius: 37px;
  background-image: ${props => props.theme.layout.header.bgGradientVertical_90degree};
  opacity: 1;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
`;

export const activeLayer1 = css`
  background: ${props => props.theme.status.success.bgGradient};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.card.border};
`;

export const activeHole = css`
  background: ${props => props.theme.status.success.bg};
  box-shadow: ${props => props.theme.layout.card.shadow};
`;

export const readyLayer = css`
  background: ${props => props.theme.status.info.bg};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.card.border};
`;

export const disableLayer = css`
  background: ${props => props.theme.status.neutral.bgGradient};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.status.neutral.border};
`;

export const readyHole = css`
  background: ${props => props.theme.input.background};
  box-shadow: ${props => props.theme.layout.card.shadow};
`;

export const marginBottom = css`
  margin-bottom: 5px;
`;

export const ssrHole = css`
  background: ${props => props.theme.layout.sidebar.bgDark};
  box-shadow: ${props => props.theme.layout.card.shadow};
`;

export const ssrOn = css`
  background: ${props => props.theme.status.success.bgGradientBox};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 25px;
`;

export const ssrOff = css`
  background: ${props => props.theme.status.neutral.bgGradient};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.card.border};
`;

export const ControllerDisabledBackground = css`
  background: ${props => props.theme.status.neutral.bgGradient};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.card.border};
  border-radius: 4px;
`;

export const ControllerEnabledBackground = css`
  background: ${props => props.theme.layout.main.bgGradient};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.layout.main.border};
  background-image: ${props => props.theme.layout.header.bgGradientVertical_180degree};
  border-radius: 4px;
`;

export const DisableApplyButtonBG = css`
  background: ${props => props.theme.status.neutral.bgGradient};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.status.neutral.border};
`;

export const DisableApplyButtonHole = css`
  background: ${props => props.theme.input.disabled};
  box-shadow: ${props => props.theme.layout.card.shadow};
`;

export const ItemBackground = css`
  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 12px;
`;

export const ItemBackgroundDisable = css`
  background: ${props => props.theme.input.disabled};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 12px;
`;

export const ButtonReady = css`
  background: ${props => props.theme.status.info.bgGradientBox};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.status.info.border};
`;

/*background of layer 2 when colors transition from left to right*/
export const layer2HorizontalGradient = css`
  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.layout.card.border};
  background: ${props => props.theme.layout.main.bgGradient};
  box-shadow: ${props => props.theme.layout.main.shadow};
`;

/*background of layer 2 when colors transition from top to bottom*/
export const layer2VerticalGradient = css`
  border-style: solid;
  border-width: 0.5px;
  border-color: ${props => props.theme.layout.card.border};
  background: ${props => props.theme.layout.main.bgGradientVertical};
  box-shadow: ${props => props.theme.layout.main.shadow};
`;

/* background of whole box included layer 1 and 2 to be green  when activated*/
export const activeLayer = css`
  background: ${props => props.theme.status.success.bgGradientBox};
  box-shadow: ${props => props.theme.layout.main.shadow};
  border: 0.5px solid ${props => props.theme.status.success.border};
`;
