package be.pxl.services.service;

import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public List<Post> getConceptPosts() {
        return postRepository.findAll().stream().filter(Post::isConcept).toList();
    }

    @Override
    public List<Post> getPublishedPosts() {
        return postRepository.findAll().stream().filter(post -> !post.isConcept()).toList();
    }

    @Override
    public Post findPostByTitle(String title) {
        return postRepository.findByTitle(title).orElse(null);
    }

    @Override
    public Post findPostByContent(String content) {
        return postRepository.findByContent(content).orElse(null);
    }

    @Override
    public Post findPostByAuthor(String author) {
        return postRepository.findByAuthor(author).orElse(null);
    }

    @Override
    public Post findPostByDate(Date date) {
        return postRepository.findByDate(date).orElse(null);
    }

    @Override
    public Post addPost(PostRequest postRequest){
        Post post = new Post();
        BeanUtils.copyProperties(postRequest, post);
        post.setConcept(true);
        postRepository.save(post);
        return post;
    }

    @Override
    public void updatePost(Long id, PostRequest postRequest) {
        Optional<Post> post = postRepository.findById(id);
        if(post.isPresent()){
            if(postRequest.title() != null){
                post.get().setTitle(postRequest.title());
            }
            if (postRequest.content() != null){
                post.get().setContent(postRequest.content());
            }
            Post updatedPost = post.get();
            postRepository.save(updatedPost);
        }
    }
}
