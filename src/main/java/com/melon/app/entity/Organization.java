package com.melon.app.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "organizations")
@Getter
@Setter
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String organizationName;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = true) // TODO - should be false
    private User owner;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("org-memberships")
    private Set<OrganizationMembership> memberships = new HashSet<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private Set<Schedule> schedules = new HashSet<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private Set<UpcomingEvent> events = new HashSet<>();

    // Basic constructors
    public Organization() {}

    public Organization(String organizationName) {
        this.organizationName = organizationName;
    }

    public Organization(String organizationName, User owner) {
        this.organizationName = organizationName;
        this.owner = owner;
        // addUser(owner, Role.OWNER); // TODO - this should happen here idk why im doing it independently in OrgService
    }

    /**
     * Constructor for testing purposes
     * @param organizationName
     * @param id
     */
    public Organization(Long id, String organizationName) {
        this.id = id;
        this.organizationName = organizationName;
    }

    // Helper methods for managing users
    public boolean addUser(User user, Role role) {
        OrganizationMembership membership = new OrganizationMembership(user, this, role);
        if (memberships.add(membership)) {
            user.getOrganizationMemberships().add(membership);
            return true;
        }
        return false;
    }

    public boolean removeUser(User user) {
        return memberships.removeIf(membership -> {
            if (membership.getUser().getId().equals(user.getId())) {
                user.getOrganizationMemberships().remove(membership);
                return true;
            }
            return false;
        });
    }

    // Helper methods for managing events
    public boolean addEvent(UpcomingEvent event) {
        if (events.add(event)) {
            event.setOrganization(this);
            return true;
        }
        return false;
    }

    public boolean removeEvent(UpcomingEvent event) {
        if (events.remove(event)) {
            event.setOrganization(null);
            return true;
        }
        return false;
    }

    // Helper methods for managing schedules
    public boolean addSchedule(Schedule schedule) {
        if (schedules.add(schedule)) {
            schedule.setOrganization(this);
            return true;
        }
        return false;
    }

    public boolean removeSchedule(Schedule schedule) {
        if (schedules.remove(schedule)) {
            schedule.setOrganization(null);
            return true;
        }
        return false;
    }

    // Override equals() and hashCode() based on the ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Organization)) return false;
        Organization that = (Organization) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // Override toString() for better logging
    @Override
    public String toString() {
        String owner = "NONE";
        if (this.owner != null) {
            owner = this.owner.getUsername();
        }
        return "Organization{" +
            "id=" + id +
            ", name='" + organizationName + '\'' +
            ", owner='" + owner + '\'' +
            '}';
    }

    // For compatibility with older code
    public String getName() {
        return organizationName;
    }
}