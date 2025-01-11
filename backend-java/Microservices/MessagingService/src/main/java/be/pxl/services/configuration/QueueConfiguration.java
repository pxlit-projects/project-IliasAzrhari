package be.pxl.services.configuration;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class QueueConfiguration {

    @Bean
    public Queue postCreatedQueue() {
        return new Queue("postCreatedQueue", false);
    }

    @Bean
    public Queue postReviewQueue() {
        return new Queue("postReviewQueue", false);
    }

    @Bean
    public Queue postApproved(){
        return new Queue("postApprovedQueue", false);
    }

    @Bean
    public Queue postRejected(){
        return new Queue("postRejectedQueue", false);
    }

    @Bean
    public Queue postCommentQueue() {
        return new Queue("postCommentQueue", false);
    }
}
