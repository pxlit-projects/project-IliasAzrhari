package be.pxl.services.service;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.controller.request.NotificationRequest;
import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final ReviewRepository reviewRepository;
    private final NotificationClient notificationClient;
    private final RabbitTemplate rabbitTemplate;
    private static Logger logger = LoggerFactory.getLogger(ReviewService.class.getName());


    @Override
    public List<Review> getAllReviews() {
        logger.info("Fetching all reviews");
        return reviewRepository.findAll();
    }

    @Override
    public List<Review> getAllReviewsByPostId(Long postId) {
        logger.info("Fetching all reviews by post id: {}", postId);
        return reviewRepository.findAllByPostId(postId);
    }

    @RabbitListener(queues = "postCreatedQueue")
    @Override
    public void createReview(Long postId) {
        Review review = new Review();
        review.setPostId(postId);
        reviewRepository.save(review);
        sendNotification("New review intitialized for post " + postId, "ReviewService");
        rabbitTemplate.convertAndSend("postReviewQueue", postId);
        log.info("Review created for post with id: " + postId);
        logger.info("Review created for post with id: {}", postId);
    }


    @Override
    public Review completeReview(Long postId, ReviewRequest reviewRequest) {
        Review review = reviewRepository.findFirstByPostId(postId);
        if(review.isApproved() || review.getDescription() != null){
            Review newReview = new Review();
            newReview.setPostId(postId);
            newReview.setDescription(reviewRequest.description());
            newReview.setApproved(reviewRequest.approved());
            reviewRepository.save(newReview);
            sendNotification("New review added for post " + postId, "ReviewService");
            sendMassTransitNotification(postId, reviewRequest);
            logger.info("Review completed for post with id: {}", postId);
            return newReview;
        }

        review.setDescription(reviewRequest.description());
        review.setApproved(reviewRequest.approved());
        reviewRepository.save(review);
        sendNotification("Review updated for post " + postId, "ReviewService");
        sendMassTransitNotification(postId, reviewRequest);
        logger.info("Review completed for post with id: {}", postId);
        return review;
    }

    public void sendNotification(String message, String sender){
        NotificationRequest notificationRequest =  NotificationRequest.builder().message(message).sender(sender).build();
        notificationClient.sendNotification(notificationRequest);
    }

    public void sendMassTransitNotification(Long postId, ReviewRequest reviewRequest){
        if(reviewRequest.approved()){
            rabbitTemplate.convertAndSend("postApprovedQueue", postId);
        }else{
            rabbitTemplate.convertAndSend("postRejectedQueue", postId);
        }
        rabbitTemplate.convertAndSend("postReviewQueue", postId);
    }
}
