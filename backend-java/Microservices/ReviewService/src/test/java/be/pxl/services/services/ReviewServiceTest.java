package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import be.pxl.services.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private NotificationClient notificationClient;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private ReviewService reviewService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllReviews() {
        Review review1 = new Review();
        Review review2 = new Review();
        when(reviewRepository.findAll()).thenReturn(Arrays.asList(review1, review2));

        List<Review> reviews = reviewService.getAllReviews();

        assertEquals(2, reviews.size());
        verify(reviewRepository, times(1)).findAll();
    }

    @Test
    public void testGetAllReviewsByPostId() {
        Long postId = 1L;
        Review review1 = new Review();
        Review review2 = new Review();
        when(reviewRepository.findAllByPostId(postId)).thenReturn(Arrays.asList(review1, review2));

        List<Review> reviews = reviewService.getAllReviewsByPostId(postId);

        assertEquals(2, reviews.size());
        verify(reviewRepository, times(1)).findAllByPostId(postId);
    }

    @Test
    public void testCreateReview() {
        Long postId = 1L;
        doNothing().when(rabbitTemplate).convertAndSend(anyString(), anyLong());
        doNothing().when(notificationClient).sendNotification(any());

        reviewService.createReview(postId);

        verify(reviewRepository, times(1)).save(any(Review.class));
        verify(rabbitTemplate, times(1)).convertAndSend("postReviewQueue", postId);
    }

    @Test
    public void testCompleteReview() {
        Long postId = 1L;
        ReviewRequest reviewRequest = new ReviewRequest("description", true);
        Review review = new Review();
        review.setPostId(postId);
        when(reviewRepository.findFirstByPostId(postId)).thenReturn(review);

        Review completedReview = reviewService.completeReview(postId, reviewRequest);

        assertEquals("description", completedReview.getDescription());
        assertEquals(true, completedReview.isApproved());
        verify(reviewRepository, times(1)).save(review);
        verify(notificationClient, times(1)).sendNotification(any());
        verify(rabbitTemplate, times(1)).convertAndSend("postApprovedQueue", postId);
    }

    @Test
    public void testCompleteReviewWithNewReview() {
        Long postId = 1L;
        ReviewRequest reviewRequest = new ReviewRequest("description", true);
        Review existingReview = new Review();
        existingReview.setPostId(postId);
        existingReview.setApproved(true); // This will trigger the if condition

        when(reviewRepository.findFirstByPostId(postId)).thenReturn(existingReview);

        Review completedReview = reviewService.completeReview(postId, reviewRequest);

        assertEquals("description", completedReview.getDescription());
        assertEquals(true, completedReview.isApproved());
        verify(reviewRepository, times(1)).save(any(Review.class));
        verify(notificationClient, times(1)).sendNotification(any());
        verify(rabbitTemplate, times(1)).convertAndSend("postApprovedQueue", postId);
    }

    @Test
    public void testCompleteReviewWithDescription() {
        Long postId = 1L;
        ReviewRequest reviewRequest = new ReviewRequest("description", true);
        Review existingReview = new Review();
        existingReview.setPostId(postId);
        existingReview.setDescription("existing description"); // This will trigger the if condition

        when(reviewRepository.findFirstByPostId(postId)).thenReturn(existingReview);

        Review completedReview = reviewService.completeReview(postId, reviewRequest);

        assertEquals("description", completedReview.getDescription());
        assertEquals(true, completedReview.isApproved());
        verify(reviewRepository, times(1)).save(any(Review.class));
        verify(notificationClient, times(1)).sendNotification(any());
        verify(rabbitTemplate, times(1)).convertAndSend("postApprovedQueue", postId);
    }
}