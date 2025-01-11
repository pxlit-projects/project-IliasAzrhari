package be.pxl.services.service;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.controller.request.NotificationRequest;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;


@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;
    private final NotificationClient notificationClient;
    private final RabbitTemplate rabbitTemplate;
    private static Logger logger = LoggerFactory.getLogger(PostService.class.getName());

    @Override
    public List<Post> getAllPosts() {
        logger.info("Fetching all posts");
        return postRepository.findAll();
    }
    @Override
    public List<Post> getConceptPosts() {
        logger.debug("Fetching concept posts");
        return postRepository.findAll().stream().filter(Post::isConcept).toList();
    }
    @Override
    public List<Post> getPublishedPosts() {
        logger.debug("Fetching published posts");
        return postRepository.findAll().stream().filter(post -> !post.isConcept()).toList();
    }
    @Override
    public Post findPostByTitle(String title) {
        logger.debug("Finding post by title: {}", title);
        return postRepository.findByTitle(title.toLowerCase().trim()).orElse(null);
    }
    @Override
    public List<Post> findAllPostWithTitle(String title) {
        logger.debug("Finding all posts with title: {}", title);
        return postRepository.findAll().stream().filter(post -> post.getTitle().contains(title) && !post.isConcept()).toList();
    }
    @Override
    public List<Post> findPostByContent(String content) {
        logger.debug("Finding posts by content: {}", content);
        return postRepository.findAll().stream().filter(post -> post.getContent().contains(content) && !post.isConcept()).toList();
    }
    @Override
    public List<Post> findPostByAuthor(String author) {
        logger.debug("Finding posts by author: {}", author);
        return postRepository.findAll().stream().filter(post -> post.getAuthor().equals(author) && !post.isConcept()).toList();
    }
    @Override
    public List<Post> findPostByDate(String date) {
        logger.debug("Finding posts by date: {}", date);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(date, formatter);
        return postRepository.findAll().stream().filter(post -> post.getDate().equals(localDate) && !post.isConcept()).toList();
    }
    @Override
    public Post addPost(PostRequest postRequest){
        logger.debug("Adding new post: {}", postRequest);
        Post post = new Post();
        BeanUtils.copyProperties(postRequest, post);
        post.setConcept(true);
        post.setDate(postRequest.date());
        postRepository.save(post);
        NotificationRequest notificationRequest = NotificationRequest.builder().message("New post added").sender("PostService").build();
        notificationClient.sendNotification(notificationRequest);
        notificationClient.sendEmail("iliasazrhari112@gmail.com", "New post added", notificationRequest);
        rabbitTemplate.convertAndSend("postCreatedQueue", post.getId());
        return post;
    }
    @Override
    public void deletePost() {
        logger.debug("Deleting all posts");
        postRepository.deleteAll();
    }
    @Override
    public void updatePost(Long id, PostRequest postRequest) {
        logger.debug("Updating post with id: {}", id);
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
            post.get().setConcept(true);
            Post updatedPost = post.get();
            postRepository.save(updatedPost);
        }
    }
    @Override
    public Post getById(Long id) {
        logger.debug("Getting post by id: {}", id);
        return postRepository.findById(id).orElse(null);
    }

    @RabbitListener(queues = "postApprovedQueue")
    @Override
    public void approvePost(Long id) {
        logger.debug("Approving post with id: {}", id);
        Optional<Post> post = postRepository.findById(id);
        if(post.isPresent()){
            post.get().setConcept(false);
            postRepository.save(post.get());
            NotificationRequest notificationRequest = NotificationRequest.builder().message("Post approved").sender("PostService").build();
            notificationClient.sendEmail("iliasazrhari112@gmail.com", "Post approved", notificationRequest);
            notificationClient.sendNotification(notificationRequest);
        }
    }
    @RabbitListener(queues = "postRejectedQueue")
    @Override
    public void rejectPost(Long id) {
        logger.debug("Rejecting post with id: {}", id);
        Optional<Post> post = postRepository.findById(id);
        if(post.isPresent()){
            //postRepository.delete(post.get());
            NotificationRequest notificationRequest = NotificationRequest.builder().message("Post rejected").sender("PostService").build();
            notificationClient.sendNotification(notificationRequest);
            notificationClient.sendEmail("iliasazrhari112@gmail.com", "Post rejected", notificationRequest);
        }
    }
}
