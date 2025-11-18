import { useMemo, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import {
  flexboxCenter,
  ItemBackgroundDisable,
} from '../../../styles/commonStyles';
import SelectButton from './SelectButton';
import RadioBox from './RadioBox';

import { useDispatch, useSelector } from 'react-redux';
import { selector } from '../../../store/slices/heaterStatusSlice';
import { selectTgsSwitch } from '../../../store/slices/tgsSwitchSlice';
import { updateSettingsValue } from '../../../helpers/helpers';
const select = [
  'tc-01',
  'tc-02',
  'tc-03',
  'tc-04',
  'tc-05',
  'tc-06',
  'tc-07',
  'tc-08',
  'tc-09',
  'tc-10',
  'tc-11',
];
const Select = ({ data, id, isEnable, isClicked, handleOpenSelectBox }) => {
  const dispatch = useDispatch();
  const systemData = useSelector(selectTgsSwitch);
  const { settings } = systemData;
  const [checked, setChecked] = useState(data || select[0]);
  const mode = JSON.parse(localStorage.getItem("themeMode"));
  const onSelectHandler = () => {
    dispatch(selector({ id: `ssr${id}`, data: checked }));
    const newValue = settings?.heater_thermocouple_map.map((value, index) => {
      if (index === id - 1) {
        return Number(checked.slice(3));
      }
      return value;
    });
    updateSettingsValue(settings, 'heater_thermocouple_map', newValue);
    handleOpenSelectBox(id);
  };
  const newSelectList = useMemo(() => {
    return select.map((item, index) => {
      return {
        disabled:
          process.env.NODE_ENV === 'production'
            ? settings?.active_thermocouples[index] === 0
            : false,
        data: item,
      };
    });
  }, [settings?.active_thermocouples]);

  useEffect(() => {
    if (data) {
      setChecked(data);
    }
  }, [data]);

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>select</Title>
      </TitleWrapper>

      <SelectorWrapper isClicked={isClicked} isEnable={isEnable} id={id}>
        <SelectedOneAndArrowWrapper>
          <SelectedOne isEnable={isEnable}>
            <SelectedSwitch>{checked}</SelectedSwitch>
          </SelectedOne>
          <ArrowWrapper onClick={() => isEnable && handleOpenSelectBox(id)}>
            <Arrow src={mode? '/static/images/selector_light.svg':'/static/images/selector.svg'} />
          </ArrowWrapper>
        </SelectedOneAndArrowWrapper>

        {isClicked && isEnable && (
          <>
            <SelectWrapper>
              {newSelectList.map((option) => (
                <RadioBox
                  data={`${option.data}`}
                  checked={checked}
                  onHandler={(item) => setChecked(item)}
                  key={option}
                  disabled={option.disabled}
                />
              ))}
            </SelectWrapper>
            <SelectButton onSelect={onSelectHandler} />
          </>
        )}
      </SelectorWrapper>
    </Wrapper>
  );
};

export default Select;

const Wrapper = styled.div`
  margin-top: 0.7rem;
  width: 86px;
`;
const TitleWrapper = styled.div`
  ${flexboxCenter}
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.span`
  font-size: 10px;
`;

const SelectorWrapper = styled.div`
  /* UI Properties */
  width: 86px;
  background: ${({ theme }) => theme.layout.main.bgGradientVertical};
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid ${({ theme }) => theme.button.primary.border};
  border-radius: 12px;
  opacity: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  /* position absolute => When select box unfolded  */

  padding-bottom: ${(p) => (p.isClicked ? '0.1rem' : '0')};
  height: ${(p) => (p.isClicked ? 'auto' : '24px')};
  position: ${(p) => (p.isClicked ? 'absolute' : 'none')};

  ${(p) =>
    p.isClicked &&
    css`
      z-index: 10;
    `}

  ${(p) =>
    p.id > 4 &&
    css`
      top: -253px;
    `}

  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;

const SelectedOneAndArrowWrapper = styled.div`
  width: 100%;
  ${flexboxCenter}
  justify-content: space-between;

  padding: 0.09rem 0.1rem;
  padding-right: 0.25rem;

  align-items: center;
`;

const ArrowWrapper = styled.button`
  cursor: pointer;
  width: 13px;
  height: 100%;
  padding-top: 0.1rem;
`;
const Arrow = styled.img``;

const SelectedOne = styled.div`
  width: 64px;
  height: 20px;

  background: ${({ theme }) => theme.layout.card.bg};
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 12px;

  ${flexboxCenter}
  ${(p) =>
    p.isEnable ||
    css`
      ${ItemBackgroundDisable}
    `}
`;

const SelectWrapper = styled.div`
  width: 82px;

  background: ${({ theme }) => theme.layout.sidebar.bgGradient};
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 11px;
  opacity: 1;

  ${flexboxCenter}
  flex-direction: column;
  /* space between options and button */
  margin-bottom: 0.2rem;
`;

const SelectedSwitch = styled.span`
  font-size: 10px;
  width: 100%;

  text-align: center;
`;
