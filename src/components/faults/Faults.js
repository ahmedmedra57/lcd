import { useUserStore, useFaultsStore } from "../../store/zustand";

import styled from "styled-components";

import Titles from "../settings/headings/Titles";
import FaultSwitch from "./FaultSwitch";
import { useEffect } from "react";

const Faults = () => {
  const { isEssSwitch, isTesSwitch } = useUserStore();
  const { ess, tgs, handleEsFaultsReset, handleGsFaultsReset } = useFaultsStore();

  useEffect(() => {
    // reset ess faults
    handleEsFaultsReset(null);
  }, [ess.message, handleEsFaultsReset]);

  useEffect(() => {
    // reset tgs faults
    handleGsFaultsReset(null);
  }, [tgs.message, handleGsFaultsReset]);

  return (
    <Wrapper>
      <TitleWrapper>
        <Titles name="faults" />
      </TitleWrapper>

      <ContentsWrapper>
        {isEssSwitch ? (
          <FaultSwitch
            name="ess"
            title="electric switch system"
            number={ess.message.length}
            message={ess.message}
            comments={ess.comments}
            isTesSwitch={true}
          />
        ) : (
          <>
            <FaultSwitch
              name="tgs"
              title="typhoon gas system"
              number={tgs.message.length}
              message={tgs.message}
              comments={tgs.comments}
              isTesSwitch={true}
            />
            <FaultSwitch
              name="tes"
              isTesSwitch={isTesSwitch}
              title="typhoon electric system"
              number={ess.message.length}
              message={ess.message}
              comments={ess.comments}
            />
          </>
        )}
      </ContentsWrapper>
    </Wrapper>
  );
};

export default Faults;

const Wrapper = styled.div`
  width: 901px;
  min-height: 500px;
`;

const TitleWrapper = styled.div`
  width: 901px;
  height: 22px;
`;

const ContentsWrapper = styled.div``;
