package be.pxl.services.service;

import be.pxl.services.domain.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationService {

    public void sendMessage(Notification notification){
        log.info("Receiving notification...");
        log.info("Sending... {} ", notification.getMessage());
        log.info("TO  {}", notification.getSender());

    }
}
