package be.pxl.services.controller;

import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;


    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<Review>> getReviewsByPostId(@PathVariable Long postId) {
        List<Review> reviews = reviewService.getAllReviewsByPostId(postId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestParam Long postId) {
        reviewService.createReview(postId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/review/{postId}")
    public ResponseEntity<Review> completeReview(@RequestHeader("User-Role") String userRole, @PathVariable Long postId, @RequestBody ReviewRequest review) {
        if(userRole.equals("editor")) {
            Review updatedReview = reviewService.completeReview(postId, review);
            return new ResponseEntity<>(updatedReview, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

//    @DeleteMapping("/{postId}")
//    public ResponseEntity<Review> deleteReview(@PathVariable Long postId) {
//        reviewService.deleteReview(postId);
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }
}
