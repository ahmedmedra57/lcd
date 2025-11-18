import styled from 'styled-components';
import { flexboxCenter } from '../../../../styles/commonStyles';
import ButtonCloseAndExpand from './ButtonCloseAndExpand';

function SysHeaderForceAndCommand({
  toggleButtonColor,
  // handleCloseExpandButton,
  name,
  index,
  handleSelect,
  options,
  tesSwitch,
  essSwitch,
}) {
  const tesSwitchFalse = !tesSwitch && index === 1 && !essSwitch;

  return (
    <Wrapper tesSwitchFalse={tesSwitchFalse}>
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
            return essSwitch
              ? handleSelect(index)
              : !tesSwitch && index === 1
              ? ''
              : handleSelect(index);
          }}
        />
      </ButtonHole>
      <Span></Span>
      <ContainerTitle tesSwitchFalse={tesSwitchFalse}>
        <Title>{name}</Title>
      </ContainerTitle>
      <ContainerButton
        onClick={() => {
          return essSwitch
            ? handleSelect(index)
            : !tesSwitch && index === 1
            ? ''
            : handleSelect(index);
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
            name={options === index ? 'close' : 'expand'}
            tesSwitchFalse={tesSwitchFalse}
            color={essSwitch ? index === 2 : index === 3}
          />
        )}
      </ContainerButton>
    </Wrapper>
  );
}

export default SysHeaderForceAndCommand;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  background: ${({ tesSwitchFalse }) =>
    tesSwitchFalse
      ? props => props.theme.status.neutral.bgGradient
      : props => props.theme.layout.main.bgGradientVertical};

  box-shadow: inset 0px 0px 2px rgb(255, 255, 255, 0.1);

  border: 1px solid ${props => props.theme.layout.card.border};
  border-radius: 27px;
  opacity: 1;
  ${flexboxCenter};
  justify-content: space-evenly;
`;

const ButtonHole = styled.div`
  ${flexboxCenter};
`;

const Img = styled.img`
  cursor: pointer;
  margin-left: 5px;
`;

const Span = styled.span`
  content: '';
  flex: 1;
  border-bottom: solid 2px ${props => props.theme.label.primary};
  margin: auto 0.25em;
`;

const ContainerTitle = styled.div`
  width: 194px;
  height: 36px;
  margin-right: 4px;
  margin-left: 2px;

  background: ${({ tesSwitchFalse }) => props => tesSwitchFalse ? props.theme.input.disabled : props.theme.layout.card.bg};
  box-shadow: inset 0px 0px 4px #000000;
  border: ${({ tesSwitchFalse }) => props => tesSwitchFalse ? `1px solid ${props.theme.layout.card.border}` : `1px solid ${props.theme.layout.card.border}`};
  border-radius: 25px;
  opacity: 1;
  ${flexboxCenter};
`;

const Title = styled.p`
  font-size: var(--space2);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;

const ContainerButton = styled.div`
  margin-right: 6px;
  width: 66px;
  height: 24px;

  background: ${({ tesSwitchFalse }) => props => tesSwitchFalse ? props.theme.input.disabled : props.theme.layout.sidebar.bg};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 19px;
  opacity: 1;
  ${flexboxCenter}
`;
