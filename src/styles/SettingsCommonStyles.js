/*Dark Mode*/
import { css } from 'styled-components';

export const settingsTitlesLayer = css`
  width: 901px;
  height: 22px;
  /* UI Properties */
  background: var(--unnamed-color-233a54) 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px var(--unnamed-color-000000);
  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
`;

/*Edit, Cancel and Apply Buttons*/
