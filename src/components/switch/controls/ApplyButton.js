import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  DisableApplyButtonBG,
  DisableApplyButtonHole,
  activeLayer1,
  ButtonReady,
  activeHole,
} from '../../../styles/commonStyles';

const ApplyButton = ({
  buttonHandler,
  name,
  isEnable,
  isActivated,
  isReady,
}) => {
  return (
    <ButtonWrapper
      isEnable={isEnable}
      onClick={() => buttonHandler()}
      isActivated={isActivated}
      isReady={isReady}
    >
      <ButtonHole isEnable={isEnable} isActivated={isActivated}>
        <ButtonTop
          isEnable={isEnable}
          isActivated={isActivated}
          isReady={isReady}
        >
          <ButtonName isEnable={isEnable}>{name}</ButtonName>
        </ButtonTop>
      </ButtonHole>
    </ButtonWrapper>
  );
};

export default ApplyButton;

const ButtonWrapper = styled.button`
  cursor: pointer;
  height: 30px;
  width: 126px;
  border-radius: 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  ${(p) =>
    p.isEnable
      ? css`
          border-style: solid;
          border-width: 0.5px;
          border-color: ${props => props.theme.button.primary.border};
          border-radius: 37px;
          background: ${props => props.theme.layout.main.bgGradient};
          opacity: 1;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 14%);
          box-shadow: 0 0 2px rgba(0, 0, 0, 100%);
        `
      : css`
          ${DisableApplyButtonBG}
        `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer1};
    `}

    ${(p) =>
    p.isReady &&
    css`
      ${ButtonReady}
    `}
`;
const ButtonHole = styled.div`
  width: 118px;
  height: 22px;

  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(p) =>
    p.isEnable
      ? css`
          background: ${props => props.theme.layout.card.bg};
          border-color: ${props => props.theme.layout.card.border};
          box-shadow: inset 0 0 6px #000000;
        `
      : css`
          ${DisableApplyButtonHole}
        `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeHole};
    `}
`;

const ButtonTop = styled.div`
  width: 114px;
  height: 18px;
  border-radius: 25px;

  border: 0.5px solid ${props => props.theme.button.primary.border};
  background: ${props => props.theme.layout.main.bgGradient};

  box-shadow: 0 0 2px rgba(0, 0, 0, 100%);

  ${(p) =>
    p.isEnable ||
    css`
      ${DisableApplyButtonBG}
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer1};
    `}

  ${(p) =>
    p.isReady &&
    css`
      ${ButtonReady}
    `}

  background: ${props => props.theme.status.info.bgGradient};
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};

  ${flexboxCenter}
`;

const ButtonName = styled.span`
  display: inline-block;
  font-size: 12px;
  text-align: center;
  color: ${(p) => p.isEnable ? p.theme.label.primary : p.theme.label.disabled};
`;
