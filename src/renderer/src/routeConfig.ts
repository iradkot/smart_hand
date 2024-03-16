// routeConfig.ts
import ChooseOptions from './DynamicSteps/ChooseOptions/ChooseOptions';
import DirectoryPathInput from './DynamicSteps/DirectoryPathInput';
import Status from './DynamicSteps/Status';
import {GPTChat} from "./DynamicSteps";
import CopyConfigurationForm from "./DynamicSteps/CopyConfigurationForm";

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  label?: string;
  routes?: RouteConfig[];
}

export const routesConfig: RouteConfig[] = [
  {
    path: '/copy-configuration-form',
    component: CopyConfigurationForm,
    label: 'CopyConfigurationForm',
  },
  {
    path: '/choose-options',
    component: ChooseOptions,
    label: 'Choose Options',
  },
  {
    path: '/directory-path-input',
    component: DirectoryPathInput,
    label: 'Directory Path Input',
  },
  {
    path: '/gpt-chat',
    component: GPTChat,
    label: 'GPT Chat',
  },
  {
    path: '/status',
    component: Status,
    label: 'Status',
  },
];
