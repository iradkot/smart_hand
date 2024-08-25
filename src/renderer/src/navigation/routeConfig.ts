import {GPTChat, CopyConfigurationForm, Status} from "../screens";

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
