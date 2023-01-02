<h1 align="center">District Dashboard</h1>
<h2 align="center">Part of the <a href="https://openbudgetsindia.org/">Open Budgets India</a> Project</h2>
<br/>
<p align="center">
<img alt="" src="https://github.com/CivicDataLab/opub/raw/constituency/public/assets/images/readme.png"  />
<br/>
<br/>
<a href="https://github.com/CivicDataLab/opub/blob/main/LICENSE">
<img alt="MIT License" src="https://img.shields.io/apm/l/atomic-design-ui.svg?"/>
</a>
</p>
<p align="center">A unique, one-of-its-kind dashboard that opens up district-wise fiscal information for several centrally sponsored and central sector schemes.</p>

- [Features](#features)
- [Getting Started](#getting-started)
- [Guide](#guide)
  - [Styling](#styling)
  - [Backend](#backend)
  - [Pages](#pages)
  - [Directory Structure](#directory-structure)
  - [Data fetching](#data-fetching)
    - [Pre-fetch data in the server-side](#pre-fetch-data-in-the-server-side)
  - [ESLint](#eslint)
- [Developers](#developers)
  - [Boot the local instance](#boot-the-local-instance)
  - [Architecture](#architecture)
- [Contributing](#contributing)

## Features

- ♿ Accessible: The platform is screen-reader friendly and keyboard accessible.
- 👩‍💻 Developer friendly: built with NextJS, CSS-in-JS, and REST API to make the developer experience a treat.
- 🚀 Styled-components: CSS-in-JS to get styling on steroids with fantastic developer experience.
- 📋 Typescript: Developed using typescript to improve development experience by catching errors and providing fixes.
- 🧱 Extensible: quickly extend and develop/import your own React components
- 📝 Well documented: complete set of documentation plus the documentation of NextJS and CKAN

## Getting Started

- Install a recent version of Node.
- After cloning the repo, create an `.env.local` file in the root of directory.
- If using VSCode, install the recommened extensions.

## Guide

### Styling

This project uses [styled-components]('https://github.com/styled-components/styled-components') to handle all of the stylings. It provides lots of features to improve the developer experience.

Pages and most component styles are available in the same file, although some components have a separate file, e.g.: `ButtonComp.ts.`

To make the styling scalable, we use a `theme.ts` file in the `/config` directory. It contains all the colors and gradients from the Design System.

### Backend

The project requires a CKAN URL to fetch datasets. You can save them in the `.env.local` file in the following format. [Read more about env]('https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables').

> We can also pass a Google Analytics Id in the same file

```js
CKAN_URL = 'CKAN_URL/api/3/action';
NEXT_PUBLIC_GOOGLE_ANALYTICS = '';
```

### Pages

- Home `/`
- States `/[state]`
- Explorer `/explorer`
- About `/about`

### Directory Structure

The component directory contains all the components required to build the platform. The components are categorized depending on their purpose. You can [read more about components](/components/README.md).

Each directory contains an `index.ts` file to manage Default Exports.

### Data fetching

The project uses [REST APIs provided by CKAN]('http://docs.ckan.org/en/2.9/api/') to access, filter, sort, and search datasets.

We can find data fetching functions at `/utils/fetch.ts.` [Read more in utils](/utils/README.md)

#### Pre-fetch data in the server-side

When visiting a page, you may want to fetch the data on the server side. To do so, you can use `getServerSideProps` function from NextJS:

```javascript
import { GetServerSideProps } from 'next';
import { stateSchemeFetch } from 'utils/fetch';

...

export const getServerSideProps: GetServerSideProps = async (context) => {
  export const getServerSideProps: GetServerSideProps = async () => {
  const stateData = await stateSchemeFetch();

  return {
    props: {
      stateData,
    },
  };
};
};
```

### ESLint

The project uses the ESLint config provided by Next.js, [eslint-config-next]('https://nextjs.org/docs/basic-features/eslint'). We can modify the rules on a project basis in the `.eslintrc.js` file.

## Developers

### Boot the local instance

Install the dependencies:

```bash
npm i
```

Boot the demo frontend:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the home page 🎉

You can start editing the page by modifying `/pages/index.tsx`. The page auto-updates as you edit the file.

### Architecture

- Language: Javascript
- Framework: [Next.js](https://nextjs.com/)
- Styling: [styled-components](https://github.com/styled-components/styled-components/)

## Contributing

For any new feature or bug reports, please request them in [issues](https://github.com/CivicDataLab/opub/issues).

See [CONTRIBUTING.md](https://github.com/CivicDataLab/opub/blob/main/CONTRIBUTING.md) for ways to get started.

Please adhere to [Code of Conduct](https://github.com/CivicDataLab/opub/blob/main/CODE_OF_CONDUCT.md).
