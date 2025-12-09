package com.pdfconversion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;




@RestController
@RequestMapping("/api/convert")
public class ConversionController {
     private final PdfConversionService conversionService;

     @Autowired
     public ConversionController(PdfConversionService conversionService) {
         this.conversionService = conversionService;
     }

     @PostMapping(
             value = "/pdf-to-jpeg",
             consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
             produces = "application/zip" // <-- IMPORTANT: Changed to ZIP
     )
     public ResponseEntity<byte[]> convertPdfToJpeg(@RequestParam("file") MultipartFile file) {
         if (file.isEmpty()) {
             return ResponseEntity.badRequest().build();
         }
         try {
             byte[] zipBytes = conversionService.convertPdfToJpeg(file.getBytes());


             HttpHeaders headers = new HttpHeaders();
             headers.setContentDispositionFormData("attachment", "converted_images.zip");

             return ResponseEntity.ok()
                     .headers(headers)
                     .contentType(MediaType.parseMediaType("application/zip"))
                     .body(zipBytes);
         } catch (IOException e) {
             e.printStackTrace();
             return ResponseEntity.internalServerError().body(null);
         }
     }
}

