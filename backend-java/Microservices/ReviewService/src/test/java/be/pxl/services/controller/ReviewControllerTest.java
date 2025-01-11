package be.pxl.services.controller;

import be.pxl.services.controller.request.ReviewRequest;
import be.pxl.services.domain.Review;
import be.pxl.services.repository.ReviewRepository;
import be.pxl.services.service.ReviewService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import java.util.Arrays;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class ReviewControllerTest {

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Container
    private static final MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        reviewRepository.deleteAll();
        Review review1 = new Review(1L, 3L, "description", true);
        Review review2 = new Review(2L, 8L, "description", false);
        reviewRepository.saveAll(Arrays.asList(review1, review2));
    }

    @Test
    void testGetAllReviews() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/reviews"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetReviewsByPostId() throws Exception {
       mockMvc.perform(MockMvcRequestBuilders.get("/api/reviews/{id}", 1L))
               .andExpect(status().isOk());
    }

    @Test
    void testCreateReview() throws Exception {
        Review review = Review.builder()
                .id(4L)
                .postId(3L)
                .description("description")
                .approved(false)
                .build();
        String reviewString = objectMapper.writeValueAsString(review);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/reviews")
                .contentType("application/json")
                .param("postId", "3")
                .content(reviewString))
                .andExpect(status().isCreated());
    }

    @Test
    void testCompleteReviewWithEditorRole() throws Exception {
        ReviewRequest reviewRequest = new ReviewRequest("description", true);
        String reviewString = objectMapper.writeValueAsString(reviewRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/reviews/review/{id}", 3L)
                .contentType(MediaType.APPLICATION_JSON)
                .header("User-Role", "editor")
                .content(reviewString))
                .andExpect(status().isOk());
    }

    @Test
    void testCompleteReviewWithUnauthorizedRole() throws Exception {
        ReviewRequest reviewRequest = new ReviewRequest("description", true);
        String reviewString = objectMapper.writeValueAsString(reviewRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/reviews/review/{id}", 8L)
                .contentType("application/json")
                .header("User-Role", "user")
                .content(reviewString))
                .andExpect(status().isUnauthorized());
    }
}