package be.pxl.services.service;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;

import java.util.Date;
import java.util.List;

public interface IPostService {
    List<Post> getAllPosts();
    List<Post> getConceptPosts();
    List<Post> getPublishedPosts();
    Post findPostByTitle(String title);
    Post findPostByContent(String content);
    Post findPostByAuthor(String author);
    Post findPostByDate(Date date);
    Post addPost(PostRequest postRequest);
    void updatePost(Long id, PostRequest postRequest);
}
