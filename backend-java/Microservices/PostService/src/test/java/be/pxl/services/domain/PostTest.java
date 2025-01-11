package be.pxl.services.domain;  import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.assertj.core.api.Assertions.assertThat;
public class PostTest { @Test void testPostCreation() {
    // Arrange
    Post post = Post.builder()
            .id(2L)
            .author("John Doe")
            .title("Title")
            .content("This is a post")
            .date(LocalDate.parse("2021-10-10"))
            .concept(false)
            .build();
    // Assert
    assertThat(post).isNotNull();
    assertThat(post.getId()).isEqualTo(2L);
    assertThat(post.getTitle()).isEqualTo("Title");
    assertThat(post.getAuthor()).isEqualTo("John Doe");
    assertThat(post.getContent()).isEqualTo("This is a post");
    assertThat(post.getDate().isEqual(LocalDate.parse("2021-10-10")));
    assertThat(post.isConcept()).isFalse();
}

    @Test
    void testPostSettersAndGetters() {
        // Arrange
        Post post = new Post();

        // Act
        post.setId(2L);
        post.setAuthor("Jane");
        post.setContent("This is a post");
        post.setTitle("Title");
        post.setDate(LocalDate.parse("2021-10-10"));
        post.setConcept(false);

        // Assert
        assertThat(post.getId()).isEqualTo(2L);
        assertThat(post.getTitle()).isEqualTo("Title");
        assertThat(post.getAuthor()).isEqualTo("Jane");
        assertThat(post.getContent()).isEqualTo("This is a post");
        assertThat(post.getDate().isEqual(LocalDate.parse("2021-10-10")));
        assertThat(post.isConcept()).isFalse();
    }

    @Test
    void testPostToString() {
        // Arrange
        Post post = Post.builder()
                .id(2L)
                .author("John Doe")
                .title("Title")
                .content("This is a post")
                .date(LocalDate.parse("2021-10-10"))
                .concept(false)
                .build();

        // Act
        String postString = post.toString();

        // Assert
        assertThat(postString).contains("Post");
        assertThat(postString).contains("id=2");
        assertThat(postString).contains("author=John Doe");
        assertThat(postString).contains("title=Title");
        assertThat(postString).contains("content=This is a post");
        assertThat(postString).contains("date=2021-10-10");
        assertThat(postString).contains("concept=false");
    }

    @Test
    void testPostEqualsAndHashCode() {
        // Arrange
        Post post1 = Post.builder()
                .id(2L)
                .author("John Doe")
                .title("Title")
                .content("This is a post")
                .date(LocalDate.parse("2021-10-10"))
                .concept(false)
                .build();

        Post post2 = Post.builder()
                .id(2L)
                .author("John Doe")
                .title("Title")
                .content("This is a post")
                .date(LocalDate.parse("2021-10-10"))
                .concept(false)
                .build();

        // Assert
        assertThat(post1).isEqualTo(post2);
        assertThat(post1.hashCode()).isEqualTo(post2.hashCode());
    }
}