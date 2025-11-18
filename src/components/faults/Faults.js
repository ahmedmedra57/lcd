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
  }, [ess.messages, handleEsFaultsReset]);

  useEffect(() => {
    // reset tgs faults
    handleGsFaultsReset(null);
  }, [tgs.messages, handleGsFaultsReset]);

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
            number={ess.messages.length}
            message={ess.messages}
            comments={ess.comments}
            isTesSwitch={true}
          />
        ) : (
          <>
            <FaultSwitch
              name="tgs"
              title="typhoon gas system"
              number={tgs.messages.length}
              message={tgs.messages}
              comments={tgs.comments}
              isTesSwitch={true}
            />
            <FaultSwitch
              name="tes"
              isTesSwitch={isTesSwitch}
              title="typhoon electric system"
              number={ess.messages.length}
              message={ess.messages}
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
