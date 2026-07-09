/**
 * Notification Service Stub
 * 
 * TODO: Implementar con Firebase Cloud Messaging o Expo Notifications
 * Este es un placeholder para permitir que la aplicación compile.
 */

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    // TODO: Implementar solicitud de permisos de notificación
    console.warn('NotificationService.requestPermission() no implementado');
    return false;
  }

  static async getToken(): Promise<string | null> {
    // TODO: Implementar obtención de token FCM
    console.warn('NotificationService.getToken() no implementado');
    return null;
  }

  static onMessage(_callback: (message: unknown) => void) {
    // TODO: Implementar listener de mensajes
    console.warn('NotificationService.onMessage() no implementado');
    return () => {};
  }

  static onNotificationOpenedApp(_callback: (message: unknown) => void) {
    // TODO: Implementar listener de notificaciones abiertas
    console.warn('NotificationService.onNotificationOpenedApp() no implementado');
    return () => {};
  }

  static async getInitialNotification(): Promise<unknown> {
    // TODO: Implementar obtención de notificación inicial
    console.warn('NotificationService.getInitialNotification() no implementado');
    return null;
  }

  static async subscribeToTopic(_topic: string): Promise<void> {
    // TODO: Implementar suscripción a tema
    console.warn('NotificationService.subscribeToTopic() no implementado');
  }

  static async unsubscribeFromTopic(_topic: string): Promise<void> {
    // TODO: Implementar desuscripción de tema
    console.warn('NotificationService.unsubscribeFromTopic() no implementado');
  }
}
