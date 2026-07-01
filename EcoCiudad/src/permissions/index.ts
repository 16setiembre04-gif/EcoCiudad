import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { NotificationService } from '@/infrastructure/notifications';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

export async function requestLocationPermission(): Promise<PermissionResult> {
  const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
  return { status: status as PermissionStatus, canAskAgain };
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

export async function getLocationAsync() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }
  return Location.getCurrentPositionAsync({});
}
