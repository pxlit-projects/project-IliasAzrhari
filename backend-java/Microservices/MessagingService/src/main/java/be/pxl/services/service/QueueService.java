package be.pxl.services.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class QueueService {

//    @RabbitListener(queues = "postCreatedQueue")
//    public void listenPostCreated(Long id) {
//        //System.out.println("Post created for post with id: " + id);
//    }
//
//    @RabbitListener(queues = "postReviewQueue")
//    public void listenPostReview(Long id) {
//        //System.out.println("Message read from postReviewQueue: " + id);
//    }
//
//    @RabbitListener(queues = "postCommentQueue")
//    public void listenPostComment(String in) {
//        //System.out.println("Message read from postCommentQueue: " + in);
//    }
}
