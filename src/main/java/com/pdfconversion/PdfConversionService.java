package com.pdfconversion;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.springframework.stereotype.Service;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ByteArrayInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfConversionService {

    public byte[] convertPdfToJpeg(byte[] pdfBytes) throws IOException {

        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(pdfBytes);
             RandomAccessReadBuffer rarBuffer = new RandomAccessReadBuffer(inputStream);
             PDDocument document = Loader.loadPDF(rarBuffer);


             ByteArrayOutputStream zipOutputStream = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(zipOutputStream)) {

            PDFRenderer pdfRenderer = new PDFRenderer(document);
            int numberOfPages = document.getNumberOfPages();

            for (int i = 0; i < numberOfPages; i++) {

                BufferedImage bim = pdfRenderer.renderImageWithDPI(i, 300, ImageType.RGB);

                ByteArrayOutputStream jpegOutput = new ByteArrayOutputStream();
                ImageIOUtil.writeImage(bim, "jpeg", jpegOutput, 300);

                String fileName = String.format("page-%d.jpeg", i + 1);
                zos.putNextEntry(new ZipEntry(fileName));

                zos.write(jpegOutput.toByteArray());
                zos.closeEntry();
            }

            zos.close();
            return zipOutputStream.toByteArray();
        }
    }
}