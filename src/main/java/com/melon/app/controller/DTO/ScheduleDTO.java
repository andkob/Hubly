package com.melon.app.controller.DTO;

import java.util.List;
import java.util.stream.Collectors;

import com.melon.app.entity.Schedule;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleDTO {
    private Long id;
    private String name;
    private List<EntryDTO> entries;

    public ScheduleDTO(Long id, String name, List<EntryDTO> entries) {
        this.id = id;
        this.name = name;
        this.entries = entries;
    }

    public ScheduleDTO(Schedule schedule) {
        this.id = schedule.getId();
        this.name = schedule.getScheduleName();
        this.entries = schedule.getEntries().stream()
            .map(entry -> new EntryDTO(
                entry.getId(),
                entry.getEventDay(),
                entry.getEventStartTime(),
                entry.getEventEndTime(),
                entry.getEventName()
            ))
            .collect(Collectors.toList());
    }
}
