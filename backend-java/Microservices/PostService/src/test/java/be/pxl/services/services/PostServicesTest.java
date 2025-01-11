package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.controller.request.NotificationRequest;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.service.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class PostServicesTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private NotificationClient notificationClient;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private PostService postService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllPosts() {
        Post post = new Post();
        when(postRepository.findAll()).thenReturn(Collections.singletonList(post));

        List<Post> posts = postService.getAllPosts();

        assertNotNull(posts);
        assertEquals(1, posts.size());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    void testGetConceptPosts() {
        Post conceptPost = new Post();
        conceptPost.setConcept(true);
        when(postRepository.findAll()).thenReturn(Collections.singletonList(conceptPost));

        List<Post> result = postService.getConceptPosts();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).isConcept());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    void testGetPublishedPosts() {
        Post publishedPost = new Post();
        publishedPost.setConcept(false);
        when(postRepository.findAll()).thenReturn(Collections.singletonList(publishedPost));

        List<Post> result = postService.getPublishedPosts();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertFalse(result.get(0).isConcept());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    void testAddPost() {
        PostRequest postRequest = new PostRequest("Title", LocalDate.now(),"Content", "Author");
        Post post = new Post();
        when(postRepository.save(any(Post.class))).thenReturn(post);

        Post result = postService.addPost(postRequest);

        assertNotNull(result);
        verify(postRepository, times(1)).save(any(Post.class));
        verify(notificationClient, times(1)).sendNotification(any(NotificationRequest.class));
        verify(notificationClient, times(1)).sendEmail(anyString(), anyString(), any(NotificationRequest.class));
    }

    @Test
    void testFindPostByTitle() {
        Post post = new Post();
        when(postRepository.findByTitle(anyString())).thenReturn(Optional.of(post));

        Post result = postService.findPostByTitle("Title");

        assertNotNull(result);
        verify(postRepository, times(1)).findByTitle(anyString());
    }

    @Test
    void testFindAllPostWithTitle() {
        Post post = new Post();
        post.setTitle("Test Title");
        post.setConcept(false);
        when(postRepository.findAll()).thenReturn(Collections.singletonList(post));

        List<Post> result = postService.findAllPostWithTitle("Test");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Title", result.get(0).getTitle());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    void testFindPostByContent() {
        Post post = new Post();
        post.setContent("Test Content");
        post.setConcept(false);
        when(postRepository.findAll()).thenReturn(Collections.singletonList(post));

        List<Post> result = postService.findPostByContent("Test");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Content", result.get(0).getContent());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    void testFindPostByAuthor() {
        Post post = new Post();
        post.setAuthor("Test Author");
        post.setConcept(false);
        when(postRepository.findAll()).thenReturn(Collections.singletonList(post));

        List<Post> result = postService.findPostByAuthor("Test Author");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Author", result.get(0).getAuthor());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    void testFindPostByDate() {
        Post post = new Post();
        post.setDate(LocalDate.of(2023, 10, 10));
        post.setConcept(false);
        when(postRepository.findAll()).thenReturn(Collections.singletonList(post));

        List<Post> result = postService.findPostByDate("2023-10-10");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(LocalDate.of(2023, 10, 10), result.get(0).getDate());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    void testGetById() {
        Post post = new Post();
        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));

        Post result = postService.getById(1L);

        assertNotNull(result);
        verify(postRepository, times(1)).findById(anyLong());
    }

    @Test
    void testDeletePost() {
        doNothing().when(postRepository).deleteAll();

        postService.deletePost();

        verify(postRepository, times(1)).deleteAll();
    }

    @Test
    void testUpdatePost() {
        Post post = new Post();
        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostRequest postRequest = new PostRequest("Updated Title", LocalDate.now(),"Updated Content", "Updated Author");
        postService.updatePost(1L, postRequest);

        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void testUpdatePostWithTitle() {
        Post post = new Post();
        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostRequest postRequest = new PostRequest(null, null, "Updated Title", null);
        postService.updatePost(1L, postRequest);

        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, times(1)).save(any(Post.class));
        assertEquals("Updated Title", post.getTitle());
    }

    @Test
    void testUpdatePostWithContent() {
        Post post = new Post();
        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostRequest postRequest = new PostRequest(null, null, null, "Updated Content");
        postService.updatePost(1L, postRequest);

        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, times(1)).save(any(Post.class));
        assertEquals("Updated Content", post.getContent());
    }

    @Test
    void testUpdatePostWithAuthor() {
        Post post = new Post();
        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostRequest postRequest = new PostRequest("Updated Author", null, null, null);
        postService.updatePost(1L, postRequest);

        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, times(1)).save(any(Post.class));
        assertEquals("Updated Author", post.getAuthor());
    }

    @Test
    void testApprovePost() {
        Post post = new Post();
        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));

        postService.approvePost(1L);

        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, times(1)).save(any(Post.class));
        verify(notificationClient, times(1)).sendNotification(any(NotificationRequest.class));
        verify(notificationClient, times(1)).sendEmail(anyString(), anyString(), any(NotificationRequest.class));
    }

    @Test
    void testRejectPost() {
        Post post = new Post();
        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));

        postService.rejectPost(1L);

        verify(postRepository, times(1)).findById(anyLong());
        verify(notificationClient, times(1)).sendNotification(any(NotificationRequest.class));
        verify(notificationClient, times(1)).sendEmail(anyString(), anyString(), any(NotificationRequest.class));
    }

    @Test
    void testUpdatePostWithDate() {
        Post post = new Post();
        when(postRepository.findById(anyLong())).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        LocalDate updatedDate = LocalDate.now();
        PostRequest postRequest = new PostRequest(null, updatedDate, null, null);
        postService.updatePost(1L, postRequest);

        verify(postRepository, times(1)).findById(anyLong());
        verify(postRepository, times(1)).save(any(Post.class));
        assertEquals(updatedDate, post.getDate());
    }
}