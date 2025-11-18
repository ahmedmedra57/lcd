import styled from 'styled-components';
import { flexboxCenter, layer90Deg, layer1 } from '../styles/commonStyles';

const Footer = () => {
  const VERSION = 'v1.6.6';
const saved = JSON.parse(localStorage.getItem("themeMode"));
  return (
    <Wrapper>
      <InnerWrapper>
        <Title src={
            saved
              ? "/static/images/blueUmbrellaName.svg"
              : "/static/images/embrellaTitle.svg"
          } />
        <Version>{VERSION}</Version>
      </InnerWrapper>
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.footer`
  width: 100%;
  height: 50px;
  /* UI Properties */
  ${layer1}

  opacity: 1;

  border-radius: 13px 13px 13px 13px;

  ${flexboxCenter}
`;

const InnerWrapper = styled.div`
  width: 100%;
  height: 48px;

  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  ${layer90Deg}

  ${flexboxCenter}
  border-radius: 12px 12px 12px 12px;
`;

const Title = styled.img``;

const Version = styled.span`
  font-size: 12px;
  color: ${props => props.theme.label.tertiary};
  margin-left: 10px;
`;
