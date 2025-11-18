import { useEffect, useState } from 'react';

import styled from 'styled-components';

import ToggleSWitch from './ToggleSwitch';
import Select from './Select';
import SSRInfoContainer from './SSRInfoContainer';
import SwitchNameSelector from './SwitchNameSelector';
import { changeSwitchName } from '../../../store/slices/heaterStatusSlice';
import { useDispatch } from 'react-redux';

const SSRDetail = ({ data, id, isSelected, handleOpenSelectBox, switchNamesList, localHeaters, setLocalHeaters, isUpdating, setIsUpdating }) => {
  const dispatch = useDispatch();
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const isEnable =
    data.buttonStatus === 'flt' ? false : data.buttonStatus ? true : false;

  useEffect(() => {
    dispatch(
      changeSwitchName({
        id: `ssr${id}`,
        name: data?.name && data.size ? `${data?.name} ${data?.size}` : '',
      })
    );
  }, [data?.name, data.size]);

  return (
    <Wrapper>
      <Select
        data={data.select}
        id={id}
        isEnable={isEnable}
        isClicked={isSelected}
        handleOpenSelectBox={handleOpenSelectBox}
      />

      <ToggleSWitchContainer>
        <ToggleSWitch data={data} id={id} 
           isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        localHeaters={localHeaters}
        setLocalHeaters={setLocalHeaters}
         />
      </ToggleSWitchContainer>

      <SSRInfoContainer
        data={data}
        id={id}
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
      />
      {isSettingOpen && (
        <SwitchNameSelectorWrapper>
          <SwitchNameSelector id={id} data={data} switchNamesList={switchNamesList} />
        </SwitchNameSelectorWrapper>
      )}
    </Wrapper>
  );
};

export default SSRDetail;

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;

  margin-bottom: 0.3rem;
  transition: all 200ms ease-in-out;

  /* For the switch name selection box*/
  position: relative;
`;

const ToggleSWitchContainer = styled.div``;

const SwitchNameSelectorWrapper = styled.div`
  position: absolute;
  bottom: 3.2rem;
`;
