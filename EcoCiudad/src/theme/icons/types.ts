export interface IconProps {
  size?: number;
  color?: string;
  testID?: string;
}

export type IconName =
  | 'home'
  | 'map'
  | 'calendar'
  | 'list'
  | 'user'
  | 'settings'
  | 'search'
  | 'bell'
  | 'plus'
  | 'minus'
  | 'check'
  | 'close'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-up'
  | 'chevron-down'
  | 'edit'
  | 'delete'
  | 'camera'
  | 'image'
  | 'location'
  | 'phone'
  | 'email'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'star'
  | 'heart'
  | 'share'
  | 'download'
  | 'upload'
  | 'refresh'
  | 'filter'
  | 'sort'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'menu'
  | 'more-vertical'
  | 'more-horizontal'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'arrow-down';

export interface IconComponent {
  name: IconName;
  component: React.FC<IconProps>;
}
