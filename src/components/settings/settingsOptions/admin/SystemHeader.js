import { useState } from 'react';
import { useSettingsStore } from '../../../../store/zustand';
import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../../../styles/commonStyles';
import ButtonCloseAndExpand from '../ForceAndCommand/ButtonCloseAndExpand';

function SystemHeader({
  toggleButtonColor,
  // handleCloseExpandButton,
  name,
  index,
  handleSelect,
  options,
  adminAccess,
  tesSwitch,
  essSwitch,
}) {
  const tesSwitchFalse = !tesSwitch && index === 1 && !essSwitch;

  const mode = useSettingsStore((state) => state.interfaceMode);

  return (
    <Wrapper
      tesSwitchFalse={tesSwitchFalse}
      mode={mode}
      index={index}
      options={options}
      color={essSwitch ? index === 2 : index === 3}
    >
      <ButtonHole>
        <Img
          src={
            !tesSwitch && index === 1 && !essSwitch
              ? '/static/images/fault-without-tes.svg'
              : toggleButtonColor
          }
          width={'43px'}
          height={'43px'}
          onClick={() => {
            return adminAccess && essSwitch
              ? handleSelect(index)
              : adminAccess && !tesSwitch && index === 1
              ? ''
              : adminAccess && handleSelect(index);
          }}
        />
      </ButtonHole>
      <Span color={essSwitch ? index === 2 : index === 3}></Span>
      <ContainerTitle
        tesSwitchFalse={tesSwitchFalse}
        color={essSwitch ? index === 2 : index === 3}
      >
        <P
          tesSwitchFalse={tesSwitchFalse}
          color={essSwitch ? index === 2 : index === 3}
        >
          {name}
        </P>
      </ContainerTitle>

      <ContainerButton
        onClick={() => {
          return adminAccess && essSwitch
            ? handleSelect(index)
            : adminAccess && !tesSwitch && index === 1
            ? ''
            : adminAccess && handleSelect(index);
        }}
        tesSwitchFalse={tesSwitchFalse}
        color={essSwitch ? index === 2 : index === 3}
      >
        {essSwitch ? (
          <ButtonCloseAndExpand
            name={options === index ? 'close' : 'expand'}
            color={essSwitch ? index === 2 : index === 3}
          />
        ) : (
          <ButtonCloseAndExpand
            name={
              adminAccess
                ? options === index
                  ? 'close'
                  : 'expand'
                : index === 0
                ? 'expand'
                : index === 1
                ? 'expand'
                : 'close'
            }
            tesSwitchFalse={tesSwitchFalse}
            color={essSwitch ? index === 2 : index === 3}
          />
        )}
      </ContainerButton>
    </Wrapper>
  );
}

export default SystemHeader;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  background: ${({ tesSwitchFalse, mode }) =>
    tesSwitchFalse
      ? props => props.theme.status.neutral.bgGradient
      : mode
      ? props => props.theme.layout.main.bgGradientVertical
      : props => props.theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0px 2px rgb(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.label.tertiary};

  background: ${({ color }) =>
    color &&
    css`
      ${props => props.theme.status.warning.bgGradient}
    `};
  box-shadow: ${({ color }) =>
    color === 2 && css`inset 0px 0px 2px #ffffff5e, 0px 0px 2px #000000`};

  ${({ color }) =>
    color &&
    css`
      border: 0.5px solid ${props => props.theme.button.primary.text};
    `}
  border-radius: 27px;
  opacity: 1;
  ${flexboxCenter};
  justify-content: space-evenly;
`;

const ButtonHole = styled.div`
  ${flexboxCenter};
`;

const Img = styled.img`
  margin-left: 5px;
  cursor: pointer;
`;

const Span = styled.span`
  content: '';
  flex: 1;
  border-bottom: solid 2px ${props => props.theme.label.primary};
  ${({ color }) =>
    color &&
    css`
      border-bottom: 2px solid ${props => props.theme.layout.card.border};
    `}
  margin: auto 0.25em;
`;

const ContainerTitle = styled.div`
  width: 194px;
  height: 36px;
  margin-right: 4px;
  margin-left: 2px;

  background: ${({ tesSwitchFalse }) => props => tesSwitchFalse ? props.theme.input.disabled : props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 4px #000000;
  border: ${({ tesSwitchFalse }) => props => tesSwitchFalse ? `1px solid ${props.theme.label.disabled}` : `1px solid ${props.theme.label.tertiary}`};
  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.warning.text};
      border: 1px solid ${props => props.theme.status.warning.text};
      box-shadow: inset 0px 0px 2px #000000;
    `};

  border-radius: 25px;
  opacity: 1;
  ${flexboxCenter};
`;

const P = styled.p`
  font-size: var(--space2);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
  ${({ color }) =>
    color &&
    css`
      color: ${props => props.theme.layout.card.bg};
    `}
  opacity: 1;
`;

const ContainerButton = styled.div`
  margin-right: 6px;
  width: 66px;
  height: 24px;

  background: ${({ tesSwitchFalse }) => props => tesSwitchFalse ? props.theme.input.disabled : props.theme.button.primary.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 19px;
  opacity: 1;
  ${({ color }) =>
    color &&
    css`
      background: ${props => props.theme.status.warning.text} 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 1px #000000;
    `};
  ${flexboxCenter}
`;
