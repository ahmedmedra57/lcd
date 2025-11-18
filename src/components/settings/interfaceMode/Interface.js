import styled from 'styled-components';
import { flexboxCenter } from '../../../styles/commonStyles';
import { useEffect } from 'react';
import { useSettingsStore } from '../../../store/zustand';

function Interface() {
  const modesData = [
    { id: 'light', label: 'light mode', icon: '☀️' },
    { id: 'dark', label: 'dark mode', icon: '🌙' }
  ];

  // Zustand - use themeMode (not interfaceMode) for theme color
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setTheme = useSettingsStore((state) => state.setTheme);

  // Instant theme switching - no apply button or local state needed
  const handleThemeSelect = (themeId) => {
    if (themeId !== themeMode) {
      setTheme(themeId);
    }
  };

  // Keyboard shortcut: Ctrl/Cmd + Shift + T to toggle theme
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setTheme(themeMode === 'light' ? 'dark' : 'light');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [themeMode, setTheme]);

  return (
    <Wrapper>
      <InterfaceContainer>
        <InterfaceP>INTERFACE MODE</InterfaceP>
        <KeyboardHint>Ctrl+Shift+T</KeyboardHint>
      </InterfaceContainer>
      <ControlContainer>
        {modesData.map((mode) => {
          const isSelected = mode.id === themeMode;
          return (
            <ThemeOption
              key={mode.id}
              onClick={() => handleThemeSelect(mode.id)}
              isSelected={isSelected}
            >
              <RadioButton>
                <OutsideRing>
                  <InsideDot isSelected={isSelected} />
                </OutsideRing>
              </RadioButton>
              <ThemeLabel>
                <Icon>{mode.icon}</Icon>
                <LabelText>{mode.label}</LabelText>
              </ThemeLabel>
            </ThemeOption>
          );
        })}
      </ControlContainer>
      <InfoText>Theme changes apply instantly</InfoText>
    </Wrapper>
  );
}

export default Interface;

const Wrapper = styled.div`
  width: 280px;
  min-height: 160px;
  margin-top: 4px;
  padding: 12px;
  border-radius: 4px;
  opacity: 1;

  ${flexboxCenter}
  flex-direction: column;
  justify-content: space-evenly;
  gap: 10px;

  box-sizing: border-box;
  border: 0.5px solid ${props => props.theme.layout.card.border};
  background-image: ${props => props.theme.layout.header.bgGradientVertical_180degree};
  box-shadow: ${props => props.theme.layout.main.shadow};
`;

const InterfaceContainer = styled.div`
  width: 100%;
  height: 26px;
  padding: 0 12px;

  background: ${props => props.theme.layout.main.bg};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border: none;
  border-radius: 16px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InterfaceP = styled.p`
  font-size: var(--font-size3);
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  opacity: 1;
  margin: 0;
`;

const KeyboardHint = styled.span`
  font-size: 9px;
  color: ${props => props.theme.label.secondary};
  opacity: 0.7;
  font-family: monospace;
  background: ${props => props.theme.layout.container.bg};
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.layout.card.border};
`;

const ControlContainer = styled.div`
  width: 100%;
  background: ${props => props.theme.layout.header.bgGradient};
  box-shadow: ${props => props.theme.layout.card.shadow};
  border-radius: 19px;
  opacity: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ThemeOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected
    ? props.theme.layout.main.bg
    : 'transparent'};
  border: 1.5px solid ${props => props.isSelected
    ? props.theme.status.success.border
    : props.theme.layout.card.border};

  &:hover {
    background: ${props => props.theme.layout.main.bg};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const RadioButton = styled.div`
  flex-shrink: 0;
`;

const OutsideRing = styled.span`
  cursor: pointer;
  width: 20px;
  height: 20px;
  border: 1.5px solid ${props => props.theme.status.success.border};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.layout.main.bg};
`;

const InsideDot = styled.div`
  cursor: pointer;
  width: 12px;
  height: 12px;
  background-color: ${props => props.isSelected
    ? props.theme.status.success.text
    : 'transparent'};
  border-radius: 50%;
  transition: all 0.2s ease;
`;

const ThemeLabel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: ${props => props.theme.layout.container.bg};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.layout.card.border};
`;

const Icon = styled.span`
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LabelText = styled.p`
  font-size: var(--font-size7);
  text-transform: uppercase;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1.2px;
  margin: 0;
  font-weight: 500;
`;

const InfoText = styled.p`
  font-size: 9px;
  color: ${props => props.theme.label.secondary};
  opacity: 0.7;
  margin: 0;
  text-align: center;
  font-style: italic;
`;
