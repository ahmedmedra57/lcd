import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';

const ExpandButton = ({ handleOnClick, isExpanded, name, isTesSwitch }) => {
  return (
    <WrapperHole onClick={() => isTesSwitch && handleOnClick(name)} isTesSwitch={isTesSwitch}>
      <OuterWrapper isTesSwitch={isTesSwitch}>
        <InnerHole isTesSwitch={isTesSwitch}>
          <Top isTesSwitch={isTesSwitch}>
            <Title isTesSwitch={isTesSwitch}>{name}</Title>
          </Top>
        </InnerHole>
      </OuterWrapper>
    </WrapperHole>
  );
};

export default ExpandButton;

const WrapperHole = styled.button`
  width: 72px;
  height: 29px;
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 27px;
  opacity: 1;

  ${flexboxCenter}

  ${(p) =>
    p.isTesSwitch ||
    css`
      background: ${props => props.theme.button.secondary.bg} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 1px #000000;
      /* cursor: none; */
    `}
`;
const OuterWrapper = styled.div`
  width: 70px;
  height: 27px;

  background: ${props => props.theme.button.primary.bgGradient} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 25px;
  opacity: 1;

  ${flexboxCenter}
  ${(p) =>
    p.isTesSwitch ||
    css`
      background: ${props => props.theme.button.secondary.bgGradient};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid ${props => props.theme.button.secondary.border};
    `}
`;
const InnerHole = styled.div`
  width: 64px;
  height: 21px;
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 1px #000000;
  border-radius: 20px;

  ${flexboxCenter}
  ${(p) =>
    p.isTesSwitch ||
    css`
      background: ${props => props.theme.button.secondary.bg} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 1px #000000;
    `}
`;
const Top = styled.div`
  width: 62px;
  height: 19px;
  background: ${props => props.theme.button.primary.bgGradient} 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid ${props => props.theme.button.primary.border};
  border-radius: 25px;
  opacity: 1;

  ${flexboxCenter}
  ${(p) =>
    p.isTesSwitch ||
    css`
      background: ${props => props.theme.button.secondary.bgGradient};
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid ${props => props.theme.button.secondary.border};
    `}
`;

const Title = styled.span`
  font-size: 10px;
  color: ${props => props.theme.button.primary.text};

  ${(p) =>
    p.isTesSwitch ||
    css`
      color: ${props => props.theme.button.secondary.text};
    `}
`;
