package be.pxl.services.domain;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
public class CommentTest {
    @Test void testCommentCreation() {
        // Arrange
        Comment comment = Comment.builder()
                .id(2L)
                .author("John Doe")
                .postId(1L)
                .content("This is a comment")
                .build();
        // Assert
        assertThat(comment).isNotNull();
        assertThat(comment.getId()).isEqualTo(2L);
        assertThat(comment.getPostId()).isEqualTo(1L);
        assertThat(comment.getAuthor()).isEqualTo("John Doe");
        assertThat(comment.getContent()).isEqualTo("This is a comment");
    }

    @Test
    void testCommentSettersAndGetters() {
        // Arrange
        Comment comment = new Comment();

        // Act
        comment.setId(2L);
        comment.setAuthor("Jane");
        comment.setContent("This is a comment");
        comment.setPostId(1L);

        // Assert
        assertThat(comment.getId()).isEqualTo(2L);
        assertThat(comment.getPostId()).isEqualTo(1L);
        assertThat(comment.getAuthor()).isEqualTo("Jane");
        assertThat(comment.getContent()).isEqualTo("This is a comment");
    }
}