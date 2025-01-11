package be.pxl.services.controller;

import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<Comment>> getComments() {
        List<Comment> comments = commentService.getComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        Comment comment = commentService.getCommentById(id);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @GetMapping("/findByAuthor")
    public ResponseEntity<List<Comment>> getCommentsByAuthor(@RequestParam String author) {
        List<Comment> comments = commentService.getCommentsByAuthor(author);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping("/{postId}")
    public ResponseEntity<Comment> createComment(@PathVariable Long postId, @RequestBody CommentRequest comment) {
        Comment newComment = commentService.createComment(postId, comment);
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody CommentRequest comment) {
        Comment updatedComment = commentService.updateComment(id, comment);
        return new ResponseEntity<>(updatedComment, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Comment> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
