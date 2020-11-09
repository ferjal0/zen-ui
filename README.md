# ZEN-UI
*A collection of UI components that are shared across Reciprocity applications*

## Dev environment setup
`npm install`
`npm run start`
Storybook should be available on `http://localhost:3000`

## Folder structure
`src/components` Stencil src folder. Implementation, tests and stories for all available Zen UI components.
`src/stories` General stories/guides, not based on an individual Zen UI component
`.storybook` Storybook configuration files

## How it works

### Stencil
Library is based on [Stencil](https://stenciljs.com/docs/introduction). Stencil is a lib to produce standard **web components**.

### Web components
Web components are part of the existing Web standards. Thus they're natively supported by modern web browsers (IE with polyfills). Therefore they can be consumed in any FE framework (React, Vue, Angular,...) or even in Vanilla js.

### Storybook
For presentation we're using [Storybook](https://storybook.js.org/). Storybook was originally created for presenting components written in React. Today they support all mayor FE frameworks.
Stencil support is under development since March 2019 (1.5 year since this writing), but there's nothing public yet.
Therefore this lib is based on Storybook config for web components. Setup was created from ground up, but was modeled on [dutscher/stencil-storybook](https://github.com/dutscher/stencil-storybook).
Under the hood it uses **lit-html** for rendering the components. This is why components in each story is implemented using lit-html. This allows us to use some powerfull stuff that are common for higher FE frameworks, like binding non-scalar props (arrays, objects) directly and listening to emitted events.

## Dev environment

### Hot module reloading
To achieve HMR (hot module reloading) of Storybook during development, we're using (http-proxy-middleware)[https://www.npmjs.com/package/http-proxy-middleware]. Storybook doesn't support HMR out of the box for Stencil components = You have to restart Storybook to view your changes. Stencil's built in dev-server supports HMR. Using Proxy we're injecting Storybook into Stencil dev-server (as an iframe) and update paths to Stencil bundles each time.

### Components documentation
Documentation for each component is auto-generated by stencil. Check [Stencil Docs Readme generation](https://stenciljs.com/docs/docs-readme) for detailed guides on how to tailor docs using special code comments. We pick this autogenerated `readme.md` of each component and use it inside the Storybook.
