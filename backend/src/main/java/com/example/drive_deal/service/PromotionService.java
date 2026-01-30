package com.example.drive_deal.service;

import com.example.drive_deal.domain.command.Command;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class PromotionService {
    private final List<Command> history = new ArrayList<>();

    public void runCommand(Command command) {
        command.execute();
        history.add(command);
    }
}