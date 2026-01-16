// DocumentEntity.java
package com.example.drive_deal.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
public class DocumentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private com.example.drive_deal.domain.singleton.DocumentType type;
    
    @Column(nullable = false)
    private String title;
    
    @Lob // Pour les grands textes
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(nullable = false)
    private String format; // "HTML" ou "PDF"
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private OrderEntity order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private ClientEntity client;
    
    @Column(nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type")
    private String mimeType;

    @Lob
    @Column(name = "binary_content", columnDefinition = "LONGBLOB")
    private byte[] binaryContent;
    
    private String fileName;
    private String filePath; // Chemin vers le fichier PDF si généré
}