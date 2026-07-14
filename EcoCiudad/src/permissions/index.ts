import * as ImagePicker from 'expo-image-picker';

import { LocationService } from '@/infrastructure/maps/location.service';
import { NotificationService } from '@/infrastructure/notifications';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

export async function requestLocationPermission(): Promise<PermissionResult> {
  const status = await LocationService.requestPermission();
  return { status: status as PermissionStatus, canAskAgain: status !== 'denied' };
}

export async function getLocationPermissionStatus(): Promise<PermissionResult> {
  const status = await LocationService.getPermissionStatus();
  return { status: status as PermissionStatus, canAskAgain: status !== 'denied' };
}

export async function requestCameraPermission(): Promise<PermissionResult> {
  const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
  return { status: status as PermissionStatus, canAskAgain };
}

export async function requestPhotoLibraryPermission(): Promise<PermissionResult> {
  const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return { status: status as PermissionStatus, canAskAgain };
}

export async function requestNotificationPermission(): Promise<PermissionResult> {
  const granted = await NotificationService.requestPermission();
  return { status: granted ? 'granted' : 'denied', canAskAgain: !granted };
}

/**
 * @deprecated Usa LocationService.getCurrentLocation() directamente.
 */
export async function getLocationAsync() {
  return LocationService.getCurrentLocation();
}

export { LocationService };
