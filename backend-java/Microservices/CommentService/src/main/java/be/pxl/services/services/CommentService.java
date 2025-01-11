package be.pxl.services.services;

import be.pxl.services.controller.request.CommentRequest;
import be.pxl.services.domain.Comment;
import be.pxl.services.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
    private final CommentRepository commentRepository;
    private static Logger logger = LoggerFactory.getLogger(CommentService.class.getName());

    @Override
    public Comment createComment(Long postId, CommentRequest commentRequest) {
        Comment comment = Comment.builder()
                .author(commentRequest.author())
                .content(commentRequest.content())
                .postId(postId)
                .build();
        commentRepository.save(comment);
        logger.info("Comment created: {}", comment);
        return comment;
    }

    @Override
    public Comment getCommentById(Long id) {
        logger.info("Fetching comment by id: {}", id);
        return commentRepository.findById(id).orElse(null);
    }

    @Override
    public Comment updateComment(Long id, CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if(commentRequest.author() != null){
            comment.setAuthor(commentRequest.author());
        }
        if (commentRequest.content() != null){
            comment.setContent(commentRequest.content());
        }
        commentRepository.save(comment);
        logger.info("Comment updated: {}", comment);
        return comment;
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
        logger.info("Comment deleted with id: {}", id);
    }

    @Override
    public List<Comment> getComments() {
        logger.info("Fetching all comments");
        return commentRepository.findAll();
    }

    @Override
    public List<Comment> getCommentsByAuthor(String author) {
        logger.info("Fetching comments by author: {}", author);
        return commentRepository.findAll().stream().filter(comment -> comment.getAuthor().equals(author)).toList();
    }
}
