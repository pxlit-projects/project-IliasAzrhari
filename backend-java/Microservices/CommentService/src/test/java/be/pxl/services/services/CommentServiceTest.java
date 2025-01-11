package be.pxl.services.services;

import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import be.pxl.services.services.CommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CommentServiceTest {
    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateComment() {
        CommentRequest commentRequest = new CommentRequest("author", "content");
        Comment comment = Comment.builder()
                .author("author")
                .content("content")
                .postId(1L)
                .build();

        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        Comment createdComment = commentService.createComment(1L, commentRequest);

        assertNotNull(createdComment);
        assertEquals("author", createdComment.getAuthor());
        assertEquals("content", createdComment.getContent());
        assertEquals(1L, createdComment.getPostId());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testGetCommentById() {
        Comment comment = new Comment();
        comment.setId(1L);
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        Comment foundComment = commentService.getCommentById(1L);

        assertNotNull(foundComment);
        assertEquals(1L, foundComment.getId());
        verify(commentRepository, times(1)).findById(1L);
    }

    @Test
    void testUpdateComment() {
        CommentRequest commentRequest = new CommentRequest("newAuthor", "newContent");
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setAuthor("author");
        comment.setContent("content");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        Comment updatedComment = commentService.updateComment(1L, commentRequest);

        assertNotNull(updatedComment);
        assertEquals("newAuthor", updatedComment.getAuthor());
        assertEquals("newContent", updatedComment.getContent());
        verify(commentRepository, times(1)).findById(1L);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testUpdateCommentWithNullAuthor() {
        CommentRequest commentRequest = new CommentRequest(null, "newContent");
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setAuthor("author");
        comment.setContent("content");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        Comment updatedComment = commentService.updateComment(1L, commentRequest);

        assertNotNull(updatedComment);
        assertEquals("author", updatedComment.getAuthor());
        assertEquals("newContent", updatedComment.getContent());
        verify(commentRepository, times(1)).findById(1L);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testUpdateCommentWithNullContent() {
        CommentRequest commentRequest = new CommentRequest("newAuthor", null);
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setAuthor("author");
        comment.setContent("content");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        Comment updatedComment = commentService.updateComment(1L, commentRequest);

        assertNotNull(updatedComment);
        assertEquals("newAuthor", updatedComment.getAuthor());
        assertEquals("content", updatedComment.getContent());
        verify(commentRepository, times(1)).findById(1L);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testDeleteComment() {
        doNothing().when(commentRepository).deleteById(1L);

        commentService.deleteComment(1L);

        verify(commentRepository, times(1)).deleteById(1L);
    }

    @Test
    void testGetComments() {
        List<Comment> comments = List.of(new Comment(), new Comment());
        when(commentRepository.findAll()).thenReturn(comments);

        List<Comment> foundComments = commentService.getComments();

        assertNotNull(foundComments);
        assertEquals(2, foundComments.size());
        verify(commentRepository, times(1)).findAll();
    }

    @Test
    void testGetCommentsByAuthor() {
        Comment comment1 = new Comment();
        comment1.setAuthor("author");
        Comment comment2 = new Comment();
        comment2.setAuthor("author");
        List<Comment> comments = List.of(comment1, comment2);

        when(commentRepository.findAll()).thenReturn(comments);

        List<Comment> foundComments = commentService.getCommentsByAuthor("author");

        assertNotNull(foundComments);
        assertEquals(2, foundComments.size());
        verify(commentRepository, times(1)).findAll();
    }
}