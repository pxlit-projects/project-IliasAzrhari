package be.pxl.services.controller.request;
import java.time.LocalDate;

public record PostRequest (String author, LocalDate date, String title, String content) {
}
