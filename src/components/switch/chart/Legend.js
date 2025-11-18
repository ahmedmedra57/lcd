import styled, { css } from 'styled-components';

function Legend() {
  return (
    <Wrapper>
      <Title>LEGEND:</Title>

      <Img src={'/static/images/orange-dot.svg'} />
      <Title for='heaterTemp'>HT-HEATER TEMPERATURE</Title>
      <Img src={'/static/images/green-dot.svg'} />
      <Title for='enclosureTemp'>ET-ENCLOSURE TEMPERATURE</Title>
      <Img src={'/static/images/blue-dot.svg'} />
      <Title for='outsideTemp'>OT-OUTSIDE TEMPERATURE</Title>
    </Wrapper>
  );
}

export default Legend;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.span`
  font-size: 10px;
  color: ${props => props.theme.label.primary};
  letter-spacing: 1px;

  ${(p) =>
    p.for === 'heaterTemp' &&
    css`
      color: ${props => props.theme.chart.line.secondary};
    `}
  ${(p) =>
    p.for === 'enclosureTemp' &&
    css`
      color: ${props => props.theme.chart.line.primary};
    `}
  ${(p) =>
    p.for === 'outsideTemp' &&
    css`
      color: ${props => props.theme.chart.line.tertiary};
    `}
`;

const Img = styled.img`
  width: 6px;
  margin-right: 2px;
  margin-left: 5px;
`;
