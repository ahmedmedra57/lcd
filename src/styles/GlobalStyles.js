import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
:root {
	--space0 :12px;
	--space1 : 10px;
	--space2 : 8px;
	--space3 : 5px;
	--space4: 3px;
	--controller-width:278px;
	--chart-width:580px

	--font-size3: 14px;
	--font-size4: 16px;
	--font-size5: 18px;
	--font-size6: 20px;
	--font-size7: 12px;

	/* New component-based CSS variables */
	--bg-main: ${({ theme }) => theme.layout.main.bgGradientVertical};
	--bg-border: ${({ theme }) => theme.layout.main.border};
	--bg-button: ${({ theme }) => theme.button.primary.bg};
	--border-button: ${({ theme }) => theme.button.primary.border};
	--text-color: ${({ theme }) => theme.label.primary};
	--button-highlight: ${({ theme }) => theme.button.primary.active};
	--button-hover: ${({ theme }) => theme.button.primary.hover};
	--button-active: ${({ theme }) => theme.button.primary.active};
	--button-selected: ${({ theme }) => theme.button.selected.bg};
	--button-disabled: ${({ theme }) => theme.button.primary.disabled};
	--button-pressed: ${({ theme }) => theme.button.primary.pressed};
	--button-gradient: ${({ theme }) => theme.button.primary.bgGradient};
}
* {
	box-sizing: border-box;
	margin: 0;
  padding: 0;
	/* transition: all 300ms ease-in; */

}
body {	
::-webkit-scrollbar{
	display: none;
}

@font-face {
	font-family: 'Orbitron';
	font-style: normal;
	font-weight: 800;
	font-display: swap;
	src: url(./static/fonts/orbitron.woff2) format('woff2');
	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}


	
  /* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
font-family: 'Orbitron', sans-serif;
text-transform: uppercase;

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	vertical-align: baseline;
	color: ${props => props.theme.label.primary};
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;

}
button {
	outline: none;
	border: none;
	cursor: pointer;
	background-color: transparent;
	margin: 0;
  padding: 0;
	font-family: 'Orbitron', sans-serif;
	color: ${props => props.theme.label.primary};
	text-transform: uppercase;
}
*:focus {
	outline: none;
}
input, textarea {
	border: none;
	text-align: center;
	font-family: 'Orbitron', sans-serif;
	color: ${props => props.theme.input.text};
	background: ${props => props.theme.input.bg};

	::placeholder {
		font-family: 'Orbitron', sans-serif;
		text-transform: uppercase;
		color: ${props => props.theme.input.textPlaceholder};
	}

	&:focus {
		background: ${props => props.theme.input.bgFocus};
		border: 1px solid ${props => props.theme.input.borderFocus};
	}
}

ol, ul,li {
	list-style: none;
	padding: 0;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
input:focus {
	outline:none
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
}
`;

export default GlobalStyle;
