package be.pxl.services.service;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;

import java.util.List;

public interface IPostService {
    List<Post> getAllPosts();
    List<Post> getConceptPosts();
    List<Post> getPublishedPosts();
    Post findPostByTitle(String title);
    List<Post> findPostByContent(String content);
    List<Post> findAllPostWithTitle(String title);
    List<Post> findPostByAuthor(String author);
    List<Post> findPostByDate(String date);
    Post addPost(PostRequest postRequest);
    void deletePost( );
    void updatePost(Long id, PostRequest postRequest);
    Post getById(Long id);
}
