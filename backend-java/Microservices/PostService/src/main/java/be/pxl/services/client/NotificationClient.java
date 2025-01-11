package be.pxl.services.client;

import be.pxl.services.controller.request.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/notification")
    void sendNotification(@RequestBody NotificationRequest notificationRequest);

    @PostMapping("/notification/sendEmail")
    void sendEmail(@RequestParam String to, @RequestParam String subject, @RequestBody NotificationRequest notificationRequest);
}
