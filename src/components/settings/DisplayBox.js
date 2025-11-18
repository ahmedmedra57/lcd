import styled from 'styled-components';

const DisplayBox = ({ data, label }) => {
  const displayData = data;
  return (
    <Wrapper>
      <InnerLayer>
        <DisplayData>{displayData ? displayData : '__'}&deg;C</DisplayData>
        <DisplayLabel>
          {label.split()[0]} <br></br> {label.split()[1]}
        </DisplayLabel>
      </InnerLayer>
    </Wrapper>
  );
};

export default DisplayBox;

const Wrapper = styled.div`
  width: 132px;
  height: 40px;
  box-shadow: 0px 0px 2px var(--unnamed-color-000000);
  background: ${props => props.theme.status.warning.bg};
  box-shadow: 0px 0px 2px #000000;
  border-radius: 6px;
  opacity: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const InnerLayer = styled.div`
  width: 124px;
  height: 33px;
  background: ${props => props.theme.status.warning.bgLight};
  border: 1px solid ${props => props.theme.layout.container.bg};
  border-radius: 4px;
  opacity: 1;
`;
const DisplayData = styled.span`
  position: absolute;
  top: 2px;
  left: 10px;
  width: 14px;
  height: 22px;
  color: var(--unnamed-color-1b2b44);
  text-align: left;
  font-size: 14px;
  letter-spacing: 1.8px;
  color: ${props => props.theme.label.primary};
`;
const DisplayLabel = styled.span`
  position: absolute;
  top: 15px;
  right: 7px;
  line-height: 10px;
  color: var(--unnamed-color-1b2b44);
  text-align: right;
  font-size: 10px;
  letter-spacing: 0.8px;
  color: ${props => props.theme.label.primary};
  opacity: 1;
`;
