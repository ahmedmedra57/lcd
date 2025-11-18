import styled from 'styled-components';
import Button from '../settingsOptions/Button';
import { flexboxCenter } from '../../../styles/commonStyles';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInterfaceMode } from '../../../store/slices/settingsOfEssSlice';
import { selectSettingsOfEss } from '../../../store/slices/settingsOfEssSlice';

function Interface() {
  const modesData = ['light mode', 'dark mode'];
  // redux
  const dispatch = useDispatch();
  const state = useSelector(selectSettingsOfEss);
  const mode = state.interfaceMode;
  // states - initialize based on current theme mode
  const [interfaceModeButton, setInterfaceModeButton] = useState(mode ? 0 : 1);

  // Sync radio button state with Redux theme mode
  useEffect(() => {
    setInterfaceModeButton(mode ? 0 : 1);
  }, [mode]);
  // functions
  const handleClick = (index) => {
    if (index !== interfaceModeButton) return setInterfaceModeButton(index);
  };

  const handleMode = () => {
    // Redux reducer will automatically save to localStorage
    if (interfaceModeButton === 0) {
      return dispatch(setInterfaceMode(true));
    } else {
      return dispatch(setInterfaceMode(false));
    }
  };

  return (
    <Wrapper mode={mode}>
      <InterfaceContainer mode={mode}>
        <InterfaceP mode={mode}>INTERFACE MODE</InterfaceP>
      </InterfaceContainer>
      <ControlContainer mode={mode}>
        {modesData.map((data, index) => {
          return (
            <ContainerDarkLight key={index}>
              <ContainerImages>
                <OutsideRingGreenCircle
                  onClick={() => {
                    handleClick(index);
                  }}
                  mode={mode}
                >
                  <InsideFilledGreenCircle
                    mode={mode}
                    color={index === interfaceModeButton ? true : false}
                  ></InsideFilledGreenCircle>
                </OutsideRingGreenCircle>
              </ContainerImages>
              <IndividualContainer mode={mode}>
                <ModeP mode={mode}>{data}</ModeP>
              </IndividualContainer>
            </ContainerDarkLight>
          );
        })}
      </ControlContainer>
      <ContainerButton onClick={() => handleMode()}>
        <Button name={'apply'} />
      </ContainerButton>
    </Wrapper>
  );
}

export default Interface;

const Wrapper = styled.div`
  width: 280px;
  height: 160px;
  margin-top: 4px;
  border-radius: 4px;
  opacity: 1;

  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;

  box-sizing: border-box;

  border: 0.5px solid ${props => props.theme.layout.card.border};
  background-image: ${props => props.theme.layout.header.bgGradientVertical_180degree};
  box-shadow: ${props => props.theme.layout.main.shadow};
`;

const InterfaceContainer = styled.div`
  width: 272px;
  height: 26px;

  background: ${props => props.theme.layout.main.bg};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border: none;
  border-radius: 16px;
  opacity: 1;
  display: flex;
  align-items: center;
`;

const InterfaceP = styled.p`
  font-size: var(--font-size3);
  margin-left: 12px;
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  opacity: 1;
`;

const ControlContainer = styled.div`
  width: 267px;
  height: 74px;

  background: ${props => props.theme.layout.header.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 19px;
  opacity: 1;
  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;
`;

const ContainerDarkLight = styled.div`
  display: flex;
  justify-content: center;
  margin-left: -1px;
`;

const ContainerImages = styled.div``;

const OutsideRingGreenCircle = styled.span`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  margin-top: 2px;
  border: 1.5px solid ${props => props.theme.status.success.border};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.layout.main.bg};
`;

const InsideFilledGreenCircle = styled.div`
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-color: ${(props) => theme => props.color ? props.theme.status.success.text : 'none'};
  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 224px;
  height: 32px;
  margin-left: 10px;
  border: 1.5px solid ${props => props.theme.layout.card.border};
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
  justify-content: start;
`;

const ModeP = styled.p`
  font-size: var(--font-size7);
  margin-left: 10px;
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  opacity: 1;
`;

const ContainerButton = styled.div`
  width: 80px;
  height: 37px;
  background: ${props => props.theme.layout.sidebar.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 19px;
  opacity: 1;
  ${flexboxCenter}
  margin-left: 192px;
`;
