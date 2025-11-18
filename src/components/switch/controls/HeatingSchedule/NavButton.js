import styled from 'styled-components';

const NavButton = ({ children, onClick }) => {
  return (
    <MovingButton type='button' onClick={onClick}>
      {children}
    </MovingButton>
  );
};

export default NavButton;

const MovingButton = styled.button`
  border: 1px solid ${props => props.theme.label.primary};
  background: transparent;
  padding: 8px;
  font-size: 12px;
`;
