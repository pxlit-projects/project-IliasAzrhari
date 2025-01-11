package be.pxl.services.services;

import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.domain.Comment;

import java.util.List;

public interface ICommentService {
    Comment createComment(Long postId, CommentRequest commentRequest);
    Comment getCommentById(Long id);
    Comment updateComment(Long id, CommentRequest commentRequest);
    void deleteComment(Long id);
    List<Comment> getComments();
    List<Comment> getCommentsByAuthor(String author);
}
