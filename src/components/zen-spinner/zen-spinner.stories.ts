import { html } from 'lit-html';
import markdown from './readme.md';

export default {
  title: 'Icons/Spinner',
  component: 'zen-spinner',
  parameters: {
    notes: { markdown },
  },
};

const Template = () => {
  return html` <zen-spinner></zen-spinner> `;
};

const TemplateSpinners = () => {
  return html`
    <zen-spinner style="color: blue"></zen-spinner>
    <zen-spinner style="color: #34835b"></zen-spinner>
    <zen-spinner style="color: rgb(219, 52, 68)"></zen-spinner>
    <zen-spinner style="color: hsl(38, 100%, 56%)"></zen-spinner>
  `;
};

export const Default = Template.bind({});
export const BlueSpinnerStory = TemplateSpinners.bind({});
