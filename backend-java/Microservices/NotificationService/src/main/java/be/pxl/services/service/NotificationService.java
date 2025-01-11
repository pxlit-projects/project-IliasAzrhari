package be.pxl.services.service;

import be.pxl.services.domain.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationService implements INotificationService {
    @Value("${spring.mail.username}")
    private String fromEmail;

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendMessage(Notification notification){
        log.info("Receiving notification...");
        log.info("Sending... {} ", notification.getMessage());
        log.info("TO  {}", notification.getSender());
    }

    @Override
    public void sendEmail(String to, String subject, Notification notification) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(notification.getMessage());
        mailSender.send(message);
    }


}
