// APIs
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useHeaterStatusStore,
  useFaultsStore,
  useUserStore,
  useTgsSwitchStore
} from "../../../store/zustand";

// Styling
import styled, { css } from "styled-components";
import { flexboxCenter } from "../../../styles/commonStyles";

// Components
import ApplyButton from "../controls/ApplyButton";
import SSRButton from "./SSRButton";
import SSRDetail from "./SSRDetail";
import ContainerLogin from "../../adminPassword/ContainerLogin";

const HeaterStatus = () => {
  const ssrState = useHeaterStatusStore((state) => state);
  const { receivedThermocoupleSetting } = useFaultsStore();
  const { isExpanded, isAdministrator, handleDisplaySSRDetails } = useUserStore();
  const {
    electricalInfo,
    electricalFaults,
    settings,
    ssr_setting,
    ssr_update,
  } = useTgsSwitchStore();
  const isFaults =
    electricalFaults.length > 0 && electricalInfo?.on_switch === 1;
  const { elementsOptions } = useHeaterStatusStore((state) => state.description);

  const [isUpdating, setIsUpdating] = useState(false);
  const [localHeaters, setLocalHeaters] = useState(settings?.activated_heaters);
  const [displayAdminLogin, setDisplayAdminLogin] = useState(false);
  const initialOpenOption = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const [openSelectOptions, setSelectOptions] = useState(initialOpenOption);
  const ssrStateArr = Object.values(ssrState);
  const handleOpenSelectBox = (ssrNum) => {
    switch (ssrNum) {
      case 1:
        openSelectOptions[0]
          ? setSelectOptions(initialOpenOption)
          : setSelectOptions([
              true,
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ]);
        break;
      case 2:
        openSelectOptions[1]
          ? setSelectOptions(initialOpenOption)
          : setSelectOptions([
              false,
              true,
              false,
              false,
              false,
              false,
              false,
              false,
            ]);
        break;
      case 3:
        openSelectOptions[2]
          ? setSelectOptions(initialOpenOption)
          : setSelectOptions([
              false,
              false,
              true,
              false,
              false,
              false,
              false,
              false,
            ]);
        break;
      case 4:
        openSelectOptions[3]
          ? setSelectOptions(initialOpenOption)
          : setSelectOptions([
              false,
              false,
              false,
              true,
              false,
              false,
              false,
              false,
            ]);
        break;
      case 5:
        openSelectOptions[4]
          ? setSelectOptions(initialOpenOption)
          : setSelectOptions([
              false,
              false,
              false,
              false,
              true,
              false,
              false,
              false,
            ]);
        break;
      case 6:
        openSelectOptions[5]
          ? setSelectOptions(initialOpenOption)
          : setSelectOptions([
              false,
              false,
              false,
              false,
              false,
              true,
              false,
              false,
            ]);
        break;
      case 7:
        openSelectOptions[6]
          ? setSelectOptions(initialOpenOption)
          : setSelectOptions([
              false,

              false,
              false,
              false,
              false,
              false,
              true,
              false,
            ]);
        break;
      case 8:
        openSelectOptions[7]
          ? setSelectOptions(initialOpenOption)
          : setSelectOptions([
              false,
              false,
              false,
              false,
              false,
              false,
              false,
              true,
            ]);
        break;
    }
  };

  useEffect(() => {
    if (isAdministrator) {
      setDisplayAdminLogin(false);
    }
  }, [isAdministrator]);

  useEffect(() => {
    const element = document.querySelector(".wrapper-class");
    if (element) {
      const mediaQuery = window.matchMedia("(min-height: 1024px)");
      
      const handleHeightChange = (e) => {
        if (e.matches) {
          element.style.height = isExpanded ? "195vh" : "125vh";
          if (!isExpanded) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        }
      };

      mediaQuery.addListener(handleHeightChange);
      handleHeightChange(mediaQuery);

      return () => mediaQuery.removeListener(handleHeightChange);
    }
  }, [isExpanded]);

  const srrStateArrFramwork = useMemo(() => {
    if (!!ssr_setting?.length && process.env.NODE_ENV === "production") {
      const result = ssr_setting.map((item, index) => {
        const specs = item.Heaters.map((el)=>{
              const matched=elementsOptions.find((ele)=> ele.partNumber == el);
              return matched ? matched : {pn:el};
        })
        return {
          ...ssrStateArr[index],
          ...item,
          select: `tc-${settings?.heater_thermocouple_map[index]}`,
          buttonStatus:
            item?.fault === true || item?.Load_exceeded === true
              ? "flt"
              : item?.active === true,
          specs: specs.length !== 0 ? specs : [{}],
        };
      });
      return result;
    }
    return ssrStateArr;
  }, [
    ssrStateArr,
    settings?.heater_thermocouple_map,
    ssr_setting,
    elementsOptions,
  ]);

  const ssrGroup = useCallback(
    (type) => {
      let result = [];
      const validation = (index) => (type === "one" ? index < 4 : index > 3);
      ssr_setting
        ?.filter((_, index) => validation(index))
        ?.forEach((item, idx) => {
          if (item?.fault || item?.Load_exceeded) {
            result.push("flt");
          } else {
            result.push(item?.active);
          }
        });
      return result;
    },
    [ssr_setting]
  );

  const onExpand = useCallback((event) => {
    event?.preventDefault();
    handleDisplaySSRDetails();
  }, [handleDisplaySSRDetails]);

  const handleSettingOption = () => {
    window.alert("setting");
  };

  return (
    <Wrapper isExpanded={isExpanded} isFaults={isFaults}>
      <Header>
        <TitleAndButtonWrapper>
          <Title>heater status</Title>
        </TitleAndButtonWrapper>
        <UnderLine />
      </Header>

      <StatusButtonsWrapper>
        <ButtonGroup>
          {ssrGroup("one").map((switchStatus, index) => (
            <SSRButton
              status={switchStatus}
              id={index + 1}
              key={index}
              data={srrStateArrFramwork[index]}
            />
          ))}
        </ButtonGroup>

        <ButtonGroup>
          {ssrGroup("two").map((switchStatus, index) => (
            <SSRButton
              status={switchStatus}
              id={index + 5}
              key={index}
              data={srrStateArrFramwork[index + 4]}
            />
          ))}
        </ButtonGroup>
      </StatusButtonsWrapper>
      {displayAdminLogin && (
        <LoginWrapper onClick={() => setDisplayAdminLogin(false)}>
          <ContainerLogin />
        </LoginWrapper>
      )}
      {isExpanded && (
        <DetailWrapper>
          {srrStateArrFramwork.map((data, index) => {
            return (
              // id is the ssr switch number
              <SSRDetail
              localHeaters={localHeaters}
              setLocalHeaters={setLocalHeaters}
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
                data={data}
                switchNamesList={settings?.switch_panels}
                key={index}
                id={index + 1}
                isSelected={openSelectOptions[index]}
                handleOpenSelectBox={handleOpenSelectBox}
              />
            )
          })}
        </DetailWrapper>
      )}
      <ApplyButtonWrapper>
        <ApplyButton
          name={isExpanded ? "close" : "expand"}
          buttonHandler={onExpand}
          isEnable={true}
          tabIndex="-1"
          readOnly
        />
      </ApplyButtonWrapper>
    </Wrapper>
  );
};

export default HeaterStatus;

const Wrapper = styled.div`
  /* Layout Properties */
  width: 895px;
  border-radius: 15px;
  height: 100%;
  border: 1px solid ${props => props.theme.layout.switch_controls.border};
  background: ${props => props.theme.layout.switch_controls.bgGradientVertical};
  ${flexboxCenter}
  flex-direction: column;
  gap: 16px;
  /* ****************************************************************** */
  /* Margin-top for fitting the bottom line of the SVG background image */
  margin-top: 0.6rem;
  
  padding: 0.3rem ;

  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid ${props => props.theme.status.error.border};
    `}

  position:relative;
`;

const Header = styled.div`
  width: 100%;
  height: 22px;

  background: ${props => props.theme.layout.switch_controls.headerbg};
  border-radius: 16px;
  opacity: 1;

  padding: 0 var(--space2);
  ${flexboxCenter}
`;
const TitleAndButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #fff;
  /* border: 1px solid red; */
  margin-bottom: 0.4rem;
`;

const Title = styled.div`
  /* Layout Properties */

  height: 68%;
  /* UI Properties */
  color: var(--unnamed-color-ffffff);
  text-align: left;
  font-size: 12px;
`;

const UnderLine = styled.div``;

const StatusButtonsWrapper = styled.div`
  /* Layout Properties */

  width: 100%;
  height: 71px;
  border-radius: 36px;

  /* UI Properties */
  background: ${props => props.theme.layout.switch_controls.bg};
  box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.3);

  ${flexboxCenter}
  justify-content: space-between;
  padding: 8px 70px;
  margin: 0.3rem 0;
`;

const ButtonGroup = styled.div`
  width: 43%;
  ${flexboxCenter}
  justify-content: space-between;
`;

const DetailWrapper = styled.div`
  width: 100%;

`;

const ApplyButtonWrapper = styled.div`
  width: 129px;
  height: 32px;

  /* background: ${props => props.theme.layout.card.bgGradient};
  border: 0.25px solid ${props => props.theme.layout.sidebar.bg};

  opacity: 1; */

  border-radius: 17px;
  background: ${props => props.theme.layout.card.bg};
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  opacity: 1;
  padding: 0;

  ${flexboxCenter}

  /* Add these properties to prevent touch keyboard */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
`;

const LoginWrapper = styled.div`
  width: 895px;

  border: 1px solid red;
  ${flexboxCenter}
  z-index: 10000;
  position: absolute;
  top: 0px;
`;
