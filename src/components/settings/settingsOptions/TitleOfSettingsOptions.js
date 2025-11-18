import styled from "styled-components";

function TitleOfSettingsOptions() {
  return (
    <WRAPPER>
      <P>SETTINGS OPTIONS</P>
    </WRAPPER>
  );
}

const WRAPPER = styled.div`
  width: 272px;
  height: 26px;

  background: ${props => props.theme.layout.card.bgGradient};
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 16px;
  opacity: 1;
  display: flex;
  align-items: center;
`;

const P = styled.p`
  font-size: var(--font-size3);
  margin-left: 12px;
  letter-spacing: 1.2px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;

export default TitleOfSettingsOptions;
