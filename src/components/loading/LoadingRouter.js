import styled, { css } from 'styled-components';
import { flexboxCenter } from '../../styles/commonStyles';

const LoadingRouter = ({ isCenterPosition }) => {
  return (
    <PositionCenterWrapper isCenterPosition={isCenterPosition}>
      <Loader>
        <Spinner></Spinner>
        <Text>router connection</Text>
      </Loader>
    </PositionCenterWrapper>
  );
};

export default LoadingRouter;

const PositionCenterWrapper = styled.div`
  ${({ isCenterPosition }) =>
    isCenterPosition
      ? css`
          position: absolute;
          left: 40%;
          top: 50%;
        `
      : css``}
`;

const Loader = styled.div`
  width: 204px;
  height: 204px;

  position: relative;
  overflow: hidden;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  ${flexboxCenter}
`;

const Spinner = styled.div`
  width: 204px;

  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: ${props => props.theme.chart.conic.orange};
  -webkit-mask: repeating-conic-gradient(
      #0000 12deg,
      #000 1deg 20deg,
      #0000 21deg 28deg
    ),
    radial-gradient(
      farthest-side,
      #0000 calc(100% - 18px - 3px),
      #000 calc(100% - 20px)
    );
  -webkit-mask-composite: destination-in;
  mask-composite: intersect;
  animation: s4 3000ms infinite steps(23);

  @keyframes s4 {
    to {
      transform: rotate(1turn);
    }
  }
  position: absolute;
`;

const Text = styled.p`
  color: ${props => props.theme.label.primary};
  font-size: 20px;

  text-align: center;
`;
