package com.fable.imageuploader.Repository;

import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;



@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    }

