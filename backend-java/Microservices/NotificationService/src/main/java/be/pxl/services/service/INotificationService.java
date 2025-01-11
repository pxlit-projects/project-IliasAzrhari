package be.pxl.services.service;

import be.pxl.services.domain.Notification;

public interface INotificationService {
    void sendMessage(Notification notification);
    void sendEmail(String to, String subject, Notification notification);
}
