package be.pxl.services.service;

import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.domain.Review;

import java.util.List;

public interface IReviewService {
    List<Review> getAllReviews();
    List<Review> getAllReviewsByPostId(Long postId);
    void createReview(Long postId);
    Review completeReview(Long postId, ReviewRequest reviewRequest);
//    void deleteReview(Long postId);

}
