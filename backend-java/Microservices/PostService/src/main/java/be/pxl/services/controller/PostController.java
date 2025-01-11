package be.pxl.services.controller;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.controller.request.NotificationRequest;
import be.pxl.services.controller.request.PostRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

  

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/concept")
    public ResponseEntity<List<Post>> getConceptPosts() {
        List<Post> posts = postService.getConceptPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/published")
    public ResponseEntity<List<Post>> getPublishedPosts() {
        List<Post> posts = postService.getPublishedPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        Post post = postService.getById(id);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Post> addPost(@RequestHeader("User-Role") String userRole, @RequestBody PostRequest postRequest) {
        if(userRole.equals("editor")) {
            Post newPost = postService.addPost(postRequest);
            return new ResponseEntity<>(newPost, HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/findByTitle")
    public ResponseEntity<Post> getPostByTitle(@RequestParam String title) {
        Post post = postService.findPostByTitle(title);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @GetMapping("/findAllPostWithTitle")
    public ResponseEntity<List<Post>> getAllPostsWithTitle(@RequestParam String title) {
        List<Post> posts = postService.findAllPostWithTitle(title);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/findByContent")
    public ResponseEntity<List<Post>> getPostByContent(@RequestParam String content) {
        List<Post> posts = postService.findPostByContent(content);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/findByAuthor")
    public ResponseEntity<List<Post>> getPostByAuthor(@RequestParam String author) {
        List<Post> posts = postService.findPostByAuthor(author);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/findByDate")
    public ResponseEntity<List<Post>> getPostByDate(@RequestParam String date) {
        List<Post> posts = postService.findPostByDate(date);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Post> updatePost(@RequestHeader("User-Role") String userRole, @PathVariable Long id, @RequestBody PostRequest postRequest) {
        if(userRole.equals("editor")) {
            postService.updatePost(id, postRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

}
