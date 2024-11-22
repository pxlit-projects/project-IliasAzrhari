package be.pxl.services.controller.request;

import java.util.Date;

public record PostRequest (String author, Date date, String title, String content) {
}
