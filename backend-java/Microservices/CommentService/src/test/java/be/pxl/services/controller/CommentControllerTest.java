package be.pxl.services.controller;

import be.pxl.services.controller.CommentController;
import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import be.pxl.services.services.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @Autowired
    private CommentRepository commentRepository;

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
        commentRepository.deleteAll();
        Comment comment1 = new Comment(1L, "Author1", 2L,"Content1");
        Comment comment2 = new Comment(2L, "Author2", 2L, "Content2");
        commentRepository.saveAll(Arrays.asList(comment1, comment2));
    }

    @Test
    void testGetComments() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/comments"))
                .andExpect(status().isOk());
        assertEquals(2, commentRepository.findAll().size());
    }

    @Test
    void testGetCommentById() throws Exception {
        Comment comment = Comment.builder()
                .id(1L)
                .author("Author1")
                .postId(2L)
                .content("Content1")
                .build();
        mockMvc.perform(MockMvcRequestBuilders.get("/api/comments/{id}", 1L))
                .andExpect(status().isOk());
    }

    @Test
    void testGetCommentsByAuthor() throws Exception {

        mockMvc.perform(get("/api/comments/findByAuthor").param("author", "Author1"))
                .andExpect(status().isOk());

        assertEquals(1, commentRepository.findAll().stream().filter(comment -> comment.getAuthor().equals("Author1")).count());
    }

    @Test
    void testCreateComment() throws Exception {
        Comment comment = Comment.builder()
                .id(1L)
                .author("Author1")
                .postId(2L)
                .content("Content1")
                .build();

        String commentString = objectMapper.writeValueAsString(comment);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/comments/{postId}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(commentString))
                .andExpect(status().isCreated());
    }

    @Test
    void testUpdateComment() throws Exception {
        CommentRequest commentRequest = new CommentRequest("Author1", "UpdatedContent");
        String commentString = objectMapper.writeValueAsString(commentRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/comments/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(commentString))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteComment() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/comments/{id}", 1L))
                .andExpect(status().isNoContent());
    }
}