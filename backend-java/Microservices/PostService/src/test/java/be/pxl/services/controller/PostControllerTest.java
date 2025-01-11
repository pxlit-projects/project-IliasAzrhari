package be.pxl.services.controller;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import java.time.LocalDate;
import java.util.Arrays;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
public class PostControllerTest {

    @Mock
    private PostService postService;

    @InjectMocks
    private PostController postController;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

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
        postRepository.deleteAll();

        Post post1 = new Post(1L, "Author1", LocalDate.now(), "Title1", "Content1", false);
        Post post2 = new Post(2L, "Author2", LocalDate.now(), "Title2", "Content2", true);
        postRepository.saveAll(Arrays.asList(post1, post2));
    }

    @Test
    void testGetById() throws Exception {
        Post post = Post.builder()
                .id(3L)
                .title("Title1")
                .author("Author1")
                .content("Content1")
                .date(LocalDate.now())
                .concept(false)
                .build();
        postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/posts/findById/{id}", 3L))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/posts/concept"))
                .andExpect(status().isOk());
        assertEquals(2, postRepository.findAll().size());
    }

    @Test
    void testGetConceptPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/posts/concept"))
                .andExpect(status().isOk());
        assertEquals(1, postRepository.findAll().stream().filter(Post::isConcept).count());
    }

    @Test
    void testGetPublishedPosts() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/posts/published"))
                .andExpect(status().isOk());
        assertEquals(1, postRepository.findAll().stream().filter(post -> !post.isConcept()).count());
    }


    @Test
    void testAddPostWithEditorRole() throws Exception {
        Post post = Post.builder()
                .id(1L)
                .title("Title1")
                .author("Jane")
                .content("Content")
                .date(LocalDate.now())
                .concept(true)
                .build();
        String postString = objectMapper.writeValueAsString(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("User-Role", "editor")
                        .content(postString))
                .andExpect(status().isCreated());
    }

    @Test
    void testAddPostWithNonEditorRole() throws Exception {
        PostRequest postRequest = new PostRequest("Jane", LocalDate.now(), "Title", "Content");
        String postRequestString = objectMapper.writeValueAsString(postRequest);

        mockMvc.perform(post("/api/posts")
                        .contentType("application/json")
                        .header("User-Role", "user")
                        .content(postRequestString))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetPostByTitle() throws Exception {
        Post post = Post.builder()
                .id(1L)
                .title("Title1")
                .author("Author1")
                .content("Content1")
                .date(LocalDate.now())
                .concept(true)
                .build();

        mockMvc.perform(get("/api/posts/findByTitle")
                        .param("title", "Title1"))
                .andExpect(status().isOk());

        assertEquals(post.getTitle(), postRepository.findByTitle("Title1").get().getTitle());
    }

//    @Test
//    void testGetAllPostsWithTitle() throws Exception {
//        List<Post> posts = Arrays.asList(new Post(), new Post());
//        when(postService.findAllPostWithTitle("title")).thenReturn(posts);
//
//        mockMvc.perform(get("/api/posts/findAllPostWithTitle")
//                        .param("title", "title"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0]").exists())
//                .andExpect(jsonPath("$[1]").exists());
//    }

    @Test
    void testGetPostByContent() throws Exception {
        Post post = Post.builder()
                .id(1L)
                .title("Title1")
                .author("Author1")
                .content("Content1")
                .date(LocalDate.now())
                .concept(true)
                .build();

        mockMvc.perform(get("/api/posts/findByContent")
                        .param("content", "Content1"))
                .andExpect(status().isOk());
        assertEquals(post.getContent(), postRepository.findByContent("Content1").get().getContent());
    }

    @Test
    void testGetPostByAuthor() throws Exception {
        Post post = Post.builder()
                .id(1L)
                .title("Title1")
                .author("Author1")
                .content("Content1")
                .date(LocalDate.now())
                .concept(false)
                .build();

        mockMvc.perform(get("/api/posts/findByAuthor")
                        .param("author", "Jane"))
                .andExpect(status().isOk());
        assertEquals(post.getAuthor(), postRepository.findByAuthor("Author1").get().getAuthor());
    }

    @Test
    void testGetPostByDate() throws Exception {
        Post post = Post.builder()
                .id(1L)
                .title("Title1")
                .author("Author1")
                .content("Content1")
                .date(LocalDate.now())
                .concept(true)
                .build();

        mockMvc.perform(get("/api/posts/findByDate")
                        .param("date", LocalDate.now().toString()))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdatePostWithEditorRole() throws Exception {
        PostRequest postRequest = new PostRequest("Jane", LocalDate.now(), "Title", "Content");
        String postRequestString = objectMapper.writeValueAsString(postRequest);

        Post post = Post.builder()
                .id(1L)
                .title("Title")
                .author("Jane")
                .content("Content")
                .date(LocalDate.now())
                .concept(false)
                .build();

        mockMvc.perform(post("/api/posts/update/{id}", 1L)
                        .contentType("application/json")
                        .header("User-Role", "editor")
                        .content(postRequestString))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdatePostWithNonEditorRole() throws Exception {
        PostRequest postRequest = new PostRequest("Jane", LocalDate.now(), "Title", "Content");
        String postRequestString = objectMapper.writeValueAsString(postRequest);

        mockMvc.perform(post("/api/posts/update/1")
                        .contentType("application/json")
                        .header("User-Role", "user")
                        .content(postRequestString))
                .andExpect(status().isUnauthorized());
    }

}