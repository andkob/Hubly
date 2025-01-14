package com.melon.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "upcoming_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Event name is required")
    @Size(max = 100)
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Event date is required")
    @Column(nullable = false)
    private LocalDate date;

    @NotNull(message = "Start time is required")
    @Column(nullable = false)
    private LocalTime startTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type;

    @Size(max = 200)
    private String location;

    @Size(max = 1000)
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    // Custom enum for event types
    public enum EventType {
        BROTHERHOOD,
        MANDATORY,
        SOCIAL,
        PHILANTHROPY,
        OTHER
    }

    /**
     * Constructor for testing purposes
     * @param type
     */
    public UpcomingEvent(Long id, String name) {
        this.id = id;
        this.name = name;
        this.date = LocalDate.now();
        this.startTime = LocalTime.now();
        this.type = EventType.OTHER;
        this.location = "Test Location";
    }

    // Helper method to validate event type
    public static boolean isValidEventType(String type) {
        try {
            EventType.valueOf(type.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UpcomingEvent)) return false;
        UpcomingEvent that = (UpcomingEvent) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : getClass().hashCode();
    }

    @Override
    public String toString() {
        return "UpcomingEvent{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", date=" + date +
                ", startTime=" + startTime +
                ", type=" + type +
                ", location='" + location + '\'' +
                ", description='" + (description != null ? description : "N/A") + '\'' +
                '}';
    }
}