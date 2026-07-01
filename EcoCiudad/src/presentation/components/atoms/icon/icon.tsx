import {
  Home, Map, Calendar, List, User, Settings, Search, Bell,
  Plus, Minus, Check, X, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  Edit3, Trash2, Camera, Image, MapPin, Phone, Mail, Lock, Eye, EyeOff,
  Star, Heart, Share2, Download, Upload, RefreshCw, Filter, SortAsc,
  Info, AlertTriangle, AlertCircle, CheckCircle, Menu, MoreVertical,
  MoreHorizontal, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Leaf, Recycle, TreePine, Droplets, Volume2, HelpCircle,
  LogOut, ClipboardList, Truck, Route, Users, Award, Zap,
  MessageSquare, Send, Link as LinkIcon, ExternalLink,
} from 'lucide-react-native';

export const iconMap = {
  home: Home,
  map: Map,
  calendar: Calendar,
  list: List,
  user: User,
  settings: Settings,
  search: Search,
  bell: Bell,
  plus: Plus,
  minus: Minus,
  check: Check,
  close: X,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  edit: Edit3,
  delete: Trash2,
  camera: Camera,
  image: Image,
  location: MapPin,
  phone: Phone,
  email: Mail,
  lock: Lock,
  eye: Eye,
  'eye-off': EyeOff,
  star: Star,
  heart: Heart,
  share: Share2,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  filter: Filter,
  sort: SortAsc,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
  menu: Menu,
  'more-vertical': MoreVertical,
  'more-horizontal': MoreHorizontal,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  leaf: Leaf,
  recycle: Recycle,
  tree: TreePine,
  water: Droplets,
  noise: Volume2,
  help: HelpCircle,
  logout: LogOut,
  tasks: ClipboardList,
  report: ClipboardList,
  truck: Truck,
  route: Route,
  community: Users,
  achievement: Award,
  'eco-points': Zap,
  message: MessageSquare,
  send: Send,
  link: LinkIcon,
  'external-link': ExternalLink,
} as const;

export type IconName = keyof typeof iconMap;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, color, strokeWidth = 2 }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
}
