package com.kdilts.api.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.kdilts.api.model.Project;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class ProjectService {
  private final Firestore db;
  public ProjectService(Firestore db) { this.db = db; }

  public Project create(Project p) throws ExecutionException, InterruptedException {
    if (p.getId() == null || p.getId().isBlank()) {
      p.setId(UUID.randomUUID().toString());
    }
    if (p.getCreatedAt() == null) p.setCreatedAt(Instant.now());
    ApiFuture<WriteResult> f = db.collection("projects").document(p.getId()).set(p);
    f.get(); // wait for write in this simple example
    return p;
  }

  public List<Project> list() throws ExecutionException, InterruptedException {
    ApiFuture<QuerySnapshot> f = db.collection("projects").get();
    List<QueryDocumentSnapshot> docs = f.get().getDocuments();
    List<Project> out = new ArrayList<>();
    for (DocumentSnapshot d : docs) {
      Project p = d.toObject(Project.class);
      if (p != null && p.getId() == null) p = new Project(d.getId(), p.getName(), p.getDescription(), p.getCreatedAt());
      out.add(p);
    }
    return out;
  }
}
