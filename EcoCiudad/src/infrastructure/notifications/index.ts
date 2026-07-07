/**
 * Notification Service Stub
 * 
 * TODO: Implementar con Firebase Cloud Messaging o Expo Notifications
 * Este es un placeholder para permitir que la aplicación compile.
 */

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    // TODO: Implementar solicitud de permisos de notificación
    console.warn('NotificationService.requestPermission() not implemented');
    return false;
  }

  static async getToken(): Promise<string | null> {
    // TODO: Implementar obtención de token FCM
    console.warn('NotificationService.getToken() not implemented');
    return null;
  }

  static onMessage(callback: (message: unknown) => void) {
    // TODO: Implementar listener de mensajes
    console.warn('NotificationService.onMessage() not implemented');
    return () => {};
  }

  static onNotificationOpenedApp(callback: (message: unknown) => void) {
    // TODO: Implementar listener de notificaciones abiertas
    console.warn('NotificationService.onNotificationOpenedApp() not implemented');
    return () => {};
  }

  static async getInitialNotification(): Promise<unknown> {
    // TODO: Implementar obtención de notificación inicial
    console.warn('NotificationService.getInitialNotification() not implemented');
    return null;
  }

  static async subscribeToTopic(topic: string): Promise<void> {
    // TODO: Implementar suscripción a topic
    console.warn('NotificationService.subscribeToTopic() not implemented');
  }

  static async unsubscribeFromTopic(topic: string): Promise<void> {
    // TODO: Implementar desuscripción de topic
    console.warn('NotificationService.unsubscribeFromTopic() not implemented');
  }
}
