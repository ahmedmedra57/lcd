import styled, { css } from 'styled-components';
import LoadingIcon from './LoadingIcon';
import LoadingWithTimerIcon from './LoadingWithTimerIcon';

const MainLoadingPage = ({ isTgs }) => {
  // Fading Out Loadbar on Finised
  // setTimeout(function () {
  //   $('.preloader-wrap').fadeOut(300);
  // }, time);

  return (
    <Wrapper>
      {isTgs ? (
        <LoadingWithTimerIcon isCenterPosition={true} />
      ) : (
        <LoadingIcon isCenterPosition={true} />
      )}

      <Position>
        <img src='./static/images/loadingPage-umbrella-sign.svg' />
      </Position>
    </Wrapper>
  );
};

export default MainLoadingPage;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;

  position: relative;
`;

const Position = styled.div`
  height: 80vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  flex-direction: column;
`;
