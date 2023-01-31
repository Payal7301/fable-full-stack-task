package com.fable.imageuploader.controller;

import com.fable.imageuploader.Repository.Image;
import com.fable.imageuploader.Repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@RestController
public class ImageController {
    @Autowired
    private ImageRepository imageRepository;

    public ImageController(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @PostMapping("/save-image")
    public String saveImage(@RequestBody Map<String, String> data) throws IOException {
        String imageData = data.get("image");
        String[] imageParts = imageData.split(",");
        String imageBase64 = imageParts.length > 1 ? imageParts[1] : imageParts[0];
        byte[] imageBytes = Base64.getDecoder().decode(imageBase64);

        Image image = new Image();
        image.setData(imageBytes);
        imageRepository.save(image);
        return "Image saved successfully";
    }
}
