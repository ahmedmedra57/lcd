import styled, { css } from 'styled-components';
import { useSettingsStore } from '../../../store/zustand';
import { BUTTON_STATE } from '../../../constants/storeConstants';
import Button from './Button';
import ApplyButtonInvisibleDiv from './editAndApplyMessageBoxes/ApplyButtonInvisibleDiv';

function EditCancelApplyButtons({ handleClick, buttonsName }) {
  const mode = useSettingsStore((state) => state.interfaceMode);
  const buttonState = useSettingsStore((state) => state.buttonState);
  const editState = buttonState === BUTTON_STATE.EDIT;
  const settingsApplyButton = buttonState === BUTTON_STATE.APPLY;

  return (
    <ContainerButtons mode={mode}>
      {buttonsName.map((name, index) => {
        return (
          <div key={index}>
            <Button
              id={index}
              handleClick={handleClick}
              name={name}
              editState={editState}
            />
          </div>
        );
      })}
    </ContainerButtons>
  );
}

export default EditCancelApplyButtons;

const ContainerButtons = styled.div`
  width: 270px;
  height: 37px;
  
  border-radius: 19px; */
  opacity: 1;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1px;
`;
// const WrapperApplyButton = styled.div`
//   width: 78px;
//   height: 35px;
//   position: absolute;
// `;
