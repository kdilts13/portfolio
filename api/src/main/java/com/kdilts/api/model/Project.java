package com.kdilts.api.model;

import java.time.Instant;

public class Project {
  private String id;
  private String name;
  private String description;
  private Instant createdAt;

  public Project() {}
  public Project(String id, String name, String description, Instant createdAt) {
    this.id = id; this.name = name; this.description = description; this.createdAt = createdAt;
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
