import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const SidebarButton = ({ src, onClickHandler, id, link, isTesSwitch, wrapperClass }) => {
  const isAble = id !== 'tes' ? true : isTesSwitch ? true : false;

  return (
    <WrapperLink to={isAble && link} onClick={() => onClickHandler(id,wrapperClass)}>
      <ButtonImage src={src} disable={isAble} />
    </WrapperLink>
  );
};

export default SidebarButton;

const WrapperLink = styled(NavLink)`
  width: 50px;
  height: 50px;
  padding: 0;
  background: transparent;
  outline: 0;
  border: 0;
  position: relative;

  transition: all 100ms ease-in;
  &:hover {
    ${(p) =>
      css`
        transform: scale(102%);
        img:last-child {
          filter: invert(5%);
        }
      `}
  }
`;

const ButtonImage = styled.img`
  height: 100%;
  width: 100%;
`;
