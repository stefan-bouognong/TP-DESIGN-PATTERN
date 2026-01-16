package com.example.drive_deal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.drive_deal.entity.User;

public interface UserRepository  extends JpaRepository<User, Long>{

     Optional<User> findByEmail(String email);
}


