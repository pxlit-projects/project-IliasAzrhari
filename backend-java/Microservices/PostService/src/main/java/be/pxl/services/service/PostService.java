package be.pxl.services.service;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.controller.request.NotificationRequest;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;
    private final NotificationClient notificationClient;

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

        return postRepository.findByTitle(title.toLowerCase().trim()).orElse(null);
    }

    @Override
    public List<Post> findAllPostWithTitle(String title) {
        return postRepository.findAll().stream().filter(post -> post.getTitle().contains(title) && !post.isConcept()).toList();
    }

    @Override
    public List<Post> findPostByContent(String content) {
        return postRepository.findAll().stream().filter(post -> post.getContent().contains(content) && !post.isConcept()).toList();

    }

    @Override
    public List<Post> findPostByAuthor(String author) {

        return postRepository.findAll().stream().filter(post -> post.getAuthor().equals(author) && !post.isConcept()).toList();
    }

    @Override
    public List<Post> findPostByDate(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(date, formatter);
        return postRepository.findAll().stream().filter(post -> post.getDate().equals(localDate) && !post.isConcept()).toList();
    }

    @Override
    public Post addPost(PostRequest postRequest){
        Post post = new Post();
        BeanUtils.copyProperties(postRequest, post);
        post.setConcept(true);
        post.setDate(LocalDate.now());
        postRepository.save(post);

        NotificationRequest notificationRequest = NotificationRequest.builder().message("New post added").sender("PostService").build();
        notificationClient.sendNotification(notificationRequest);

        return post;
    }

    @Override
    public void deletePost() {
        postRepository.deleteAll();
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
            if (postRequest.author() != null){
                post.get().setAuthor(postRequest.author());
            }
            if (postRequest.date() != null){
                post.get().setDate(postRequest.date());
            }
            Post updatedPost = post.get();
            postRepository.save(updatedPost);
        }
    }

    @Override
    public Post getById(Long id) {
        return postRepository.findById(id).orElse(null);
    }
}
