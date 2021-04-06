import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'zen-ui',
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '..',
      proxiesFile: './react/components.ts',
      includeDefineCustomElements: false,
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      footer: '',
    },
    {
      type: 'docs-json',
      file: 'stencilDocs.json',
    },
  ],
  plugins: [sass()],
  testing: {
    transform: {
      '^.+\\.js?$': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!query-selector-shadow-dom/)'],
  },
  extras: {
    tagNameTransform: true,
  },
};
