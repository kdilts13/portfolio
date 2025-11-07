package com.kdilts.api.web;

import com.kdilts.api.model.Project;
import com.kdilts.api.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
  private final ProjectService svc;
  public ProjectController(ProjectService svc) { this.svc = svc; }

  @GetMapping
  public List<Project> list() throws ExecutionException, InterruptedException {
    return svc.list();
  }

  @PostMapping
  public Project create(@RequestBody Project p) throws ExecutionException, InterruptedException {
    return svc.create(p);
  }
}
