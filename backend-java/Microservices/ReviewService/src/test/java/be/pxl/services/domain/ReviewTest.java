package be.pxl.services.domain;  import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.assertj.core.api.Assertions.assertThat;

public class ReviewTest { @Test void testReviewCreation() {
    // Arrange
    Review review = Review.builder()
            .id(2L)
            .postId(1L)
            .description("This is a review")
            .approved(false)
            .build();

    // Assert
    assertThat(review).isNotNull();
    assertThat(review.getId()).isEqualTo(2L);
    assertThat(review.getPostId()).isEqualTo(1L);
    assertThat(review.getDescription()).isEqualTo("This is a review");
    assertThat(review.isApproved()).isFalse();
}

    @Test
    void testReviewSettersAndGetters() {
        // Arrange
        Review review = new Review();

        // Act
        review.setId(2L);
        review.setPostId(1L);
        review.setDescription("This is a review");
        review.setApproved(false);

        // Assert
        assertThat(review.getId()).isEqualTo(2L);
        assertThat(review.getPostId()).isEqualTo(1L);
        assertThat(review.getDescription()).isEqualTo("This is a review");
        assertThat(review.isApproved()).isEqualTo(false);
    }
}