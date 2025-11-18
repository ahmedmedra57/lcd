import styled from "styled-components";
import { flexboxCenter } from "../../../../../src/styles/commonStyles";
import { useSelector } from "react-redux";
import { selectSettingsOfEss } from "../../../../store/slices/settingsOfEssSlice";

function TitleOfSelectUnitsOfMeasurement() {
  const state = useSelector(selectSettingsOfEss);
  const mode = state.interfaceMode;

  return (
    <>
      <Container mode={mode}>
        <P mode={mode}>SELECT UNITS OF MEASUREMENT</P>
      </Container>
    </>
  );
}
export default TitleOfSelectUnitsOfMeasurement;

const Container = styled.div`
  width: 583px;
  height: 32px;

  background: ${props => props.theme.layout.header.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border: none;
  border-radius: 16px;
  opacity: 1;
  ${flexboxCenter}
`;

const P = styled.p`
  font-size: var(--font-size3);
  letter-spacing: 1.4px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;
