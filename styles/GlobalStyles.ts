import styled, { css, createGlobalStyle } from 'styled-components';
import cssReset from './Reset';
import cssNormalise from './Normalise';
import { themes } from './themes';

const gradient = css`
  @supports (background-clip: text) or (-webkit-background-clip: text) {
    --gradient-bg: var(--text-light-high);
    background-color: var(--gradient-bg);
    background-image: var(--gradient-bg);
    background-size: 100%;
    background-repeat: repeat;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    text-shadow: var(--box-shadow-1);
  }
`;

export const GlobalStyles = createGlobalStyle`
${cssReset}
${cssNormalise}
${themes}

html {
  box-sizing: border-box;

  &.ReactModal__Html--open {
    overflow-y: hidden;
  }
}
*, *:before, *:after {
  box-sizing: inherit;
}

:focus-visible {
  outline: 3px solid #78aeda !important;
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Inter',-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
		Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  background-color: var(--color-background-light);
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-light-high);
}

#__next {
  min-height: 100vh;
}

button {
  border:  none;
  background: none;
  cursor: pointer !important;
}

a {
  color: inherit;
}

ul, ol {
  margin: 0;
  padding: 0;
}

.sr-only {
  &:not(:where(:focus, :active, :focus-within)) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
}

.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  
  width: calc(100vw - 20px);
  max-width: 1246px;
}

.img-cover {
   object-fit: cover;
}
.img-contain {
   object-fit: contain;
}

.gradient {
  &-maple {
    ${gradient} {
      --gradient-bg: var(--gradient-maple);
    }
  }

  &-amazon {
    ${gradient} {
      --gradient-bg: var(--gradient-amazon);
    }
  }

  &-sapphire {
    ${gradient} {
      --gradient-bg: var(--gradient-sapphire);
    }
  }
}

.fill {
    flex-grow: 1;

    button {
      width: 100%;
    }
  }
`;

export const HomeTitle = styled.span`
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1.7;
`;
