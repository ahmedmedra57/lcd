import styled from 'styled-components';
import { flexboxCenter } from '../../../../styles/commonStyles';
const Clock = ({ time }) => {
  return (
    <Wrapper>
      <WatchBackground src={'/static/images/watch.svg'} />
      <Hour>
        <ClockHr
          time={time.hour * 30 + (Number(time.minute) / 12) * 6}
        ></ClockHr>
      </Hour>
      <Minute>
        <ClockMm time={time.minute * 6}></ClockMm>
      </Minute>
      <Center></Center>
    </Wrapper>
  );
};
export default Clock;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexboxCenter}
  position: relative;
`;
const WatchBackground = styled.img``;

const Hour = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;
`;

const ClockHr = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  position: absolute;
  border-radius: 50%;
  z-index: 10;

  ::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 45px;
    z-index: 10;
    border-radius: 6px 6px 0 0;
    background-color: ${props => props.theme.label.primary};
  }
  transform: rotateZ(${(p) => p.time}deg);
`;

const Minute = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;
`;
const ClockMm = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  position: absolute;
  border-radius: 50%;
  transform: rotateZ(${(p) => p.time}deg);
  ::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 45px;
    z-index: 10;
    border-radius: 6px 6px 0 0;
    background-color: ${props => props.theme.label.success};
  }
`;

const Center = styled.div`
  height: 0.7rem;
  width: 0.7rem;
  position: absolute;
  background-color: ${props => props.theme.label.primary};
  border-radius: 50%;
  z-index: 12;
`;
