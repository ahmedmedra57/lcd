import useSettingsStore from '../../../store/zustand/settingsStore';
import { useState, useEffect } from 'react';
import useUserStore from '../../../store/zustand/userStore';

import { flexboxCenter } from '../../../styles/commonStyles';
import styled, { css } from 'styled-components';

import ContainerLogin from '../../adminPassword/ContainerLogin';
import AdminSSRItemDetails from './AdminSSRItemDetails';
import SSRItemDetails from './SSRItemDetails';

const SSRInfoContainer = ({ data, id, isSettingOpen, setIsSettingOpen }) => {
  const { isAdministrator, isPasswordOpen, setAdminAccess, openPasswordModal, closePasswordModal } = useUserStore();
  const [openPasswordBox, setOpenPasswordBox] = useState(false);

  const { unitsMeasurement } = useSettingsStore();

  // Compare current and currentCurrent
  const [isOverAmp, setIsOverAmp] = useState(false);

  useEffect(() => {
    if (openPasswordBox) {
      openPasswordModal();
    } else {
      closePasswordModal();
    }
  }, [openPasswordBox, openPasswordModal, closePasswordModal]);

  useEffect(() => {
    if (isAdministrator) {
      setOpenPasswordBox(false);
    }
  }, [isAdministrator]);

  // check current amp

  useEffect(() => {
    const maxTemp = data.specs[0]?.current * 0.2 + data.specs[0]?.current;
    const minTemp = -data.specs[0]?.current * 0.2 + data.specs[0]?.current;

    const check =
      data.specs[0]?.currentCurrent > maxTemp ||
      data.specs[0]?.currentCurrent < minTemp;

    check ? setIsOverAmp(true) : setIsOverAmp(false);
  }, [data]);

  // add styling by using isOverAmp state
  const isEnable =
    data.buttonStatus === 'flt' ? false : data.buttonStatus ? true : false;

  // isEnable is for styling  [true:red border]
  const isFault = data.buttonStatus === 'flt' ? true : false;

  const handleButtonClick = (id) => {
    if (id === 1) {
      if (isAdministrator) {
        // admin? open the settings
        setIsSettingOpen(true);
      } else {
        // no admin ?
        if (openPasswordBox) {
          // 1. close password box

          setOpenPasswordBox(false);
        } else {
          // 2. Login process => Display Password require box
          isPasswordOpen || setOpenPasswordBox(true);
        }
      }
    } else {
      // id === 2  Close the setting and logout
      setIsSettingOpen(false);
      setAdminAccess(false);
    }
  };

  return (
    <Wrapper>
      <TitleWrapper>
        {isSettingOpen ? (
          <>
            <AdminTitle>part number</AdminTitle>
            <AdminTitle>current (a)</AdminTitle>
            <AdminTitle>wattage (w)</AdminTitle>
            <AdminTitle>voltage (v)</AdminTitle>
            {/* {unitsMeasurement ? ( */}
              <AdminTitle>length (ft)</AdminTitle>
            {/* // ) : ( */}
              {/* // <AdminTitle>length (m)</AdminTitle> */}
            {/* )} */}

            <AdminTitle>description</AdminTitle>
          </>
        ) : (
          <>
            <Title>current (a)</Title>
            <Title>wattage (w)</Title>
            <Title>voltage (v)</Title>
            {/* {unitsMeasurement ? ( */}
              <Title>length (ft)</Title>
            {/* ) : ( */}
              {/* <Title>length (m)</Title> */}
            {/* )} */}

            <Title>description</Title>
          </>
        )}
      </TitleWrapper>

      {isSettingOpen ? (
        <AdminSSRItemDetails
          isEnable={isEnable}
          isFault={isFault}
          // To distinguish between admin or not
          option={2}
          // id is column number
          id={id}
          data={data}
          isSettingOpen={isSettingOpen}
          setIsSettingOpen={setIsSettingOpen}
          handleButtonClick={handleButtonClick}
          openPasswordBox={openPasswordBox}
          isAdministrator={isAdministrator}
        />
      ) : (
        // I need map depends on the column number

        <SSRItemDetails
          isEnable={isEnable}
          isFault={isFault}
          // id is column number
          id={id}
          // To distinguish between admin or not
          option={1}
          data={data}
          isSettingOpen={isSettingOpen}
          setIsSettingOpen={setIsSettingOpen}
          handleButtonClick={handleButtonClick}
          openPasswordBox={openPasswordBox}
          isAdministrator={isAdministrator}
          overAmp={isOverAmp}
        />
      )}

      {openPasswordBox && (
        <PasswordWrapper
          onClick={() => {
            setOpenPasswordBox(false);
          }}
          position={id}
        >
          <ContainerLogin
            setIsSettingOpen={setIsSettingOpen}
            isReadyToClose={true}
          />
        </PasswordWrapper>
      )}
    </Wrapper>
  );
};

export default SSRInfoContainer;
const Wrapper = styled.div`
  margin-top: 0.7rem;
  position: relative;
`;

const TitleWrapper = styled.div`
  ${flexboxCenter}
  justify-content: flex-start;
  margin-bottom: 0.5rem;
  padding: 0 0rem;
`;

const AdminTitle = styled.span`
  font-size: 10px;

  &:first-child {
    margin-left: 6px;
    margin-right: 1.3rem;
  }
  &:nth-child(2) {
    margin-right: 1.4rem;
  }
  &:nth-child(3) {
    margin-right: 1.4rem;
  }
  &:nth-child(4) {
    margin-right: 1.7rem;
  }
  &:nth-child(5) {
    margin-right: 3.7rem;
  }
`;
const Title = styled.span`
  font-size: 10px;
  &:first-child {
    margin-left: 15px;
    margin-right: 19px;
  }
  &:nth-child(2) {
    margin-right: 23px;
  }
  &:nth-child(3) {
    margin-right: 28px;
  }
  &:nth-child(4) {
    margin-right: 7.2rem;
  }
`;

const PasswordWrapper = styled.button`
  margin-top: 0.5rem;
  width: 895px;
  display: flex;
  justify-content: center;
  border-radius: 1rem;
  padding: 1rem;
  position: absolute;
  right: 0rem;

  ${(p) =>
    p.position === 1 &&
    css`
      top: -5px;
    `};

  ${(p) =>
    p.position === 2 &&
    css`
      top: -65px;
    `};
  ${(p) =>
    p.position === 3 &&
    css`
      top: -125px;
    `};

  ${(p) =>
    p.position === 4 &&
    css`
      top: -185px;
    `};

  ${(p) =>
    p.position === 5 &&
    css`
      top: -245px;
    `};

  ${(p) =>
    p.position === 6 &&
    css`
      top: -305px;
    `};

  ${(p) =>
    p.position === 7 &&
    css`
      top: -365px;
    `};

  ${(p) =>
    p.position === 8 &&
    css`
      top: -425px;
    `};

  z-index: 100;
`;
