import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {

   task: Task | null = null;
  taskId: number = 0;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = +params['id'];
      this.loadTask();
    });
  }

  loadTask(): void {
    const foundTask = this.taskService.getTask(this.taskId);
    if (foundTask) {
      // Create a copy to avoid modifying the original
      foundTask.subscribe((task: Task | null) => {
        this.task = task ? { ...task } : null;
      });
    }
  }

  onSubmit(): void {
    if (this.task && this.task.title.trim()) {
      this.taskService.updateTask(this.taskId, this.task).subscribe((res) => {
        console.warn('Task updated successfully:', res);
      })
      this.router.navigate(['/task-detail', this.taskId]);
    }
  }

  viewTask(): void {
    this.router.navigate(['/task-detail', this.taskId]);
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      this.taskService.deleteTask(this.taskId);
      this.router.navigate(['/tasks']);
    }
  }
}
