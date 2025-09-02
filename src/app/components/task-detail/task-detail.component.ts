import { Component } from '@angular/core';
import { Task, TaskService } from '../../services/task.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,HttpClientModule ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {
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
    this.taskService.getTask(this.taskId).subscribe(
      (task: Task | null) => {
        this.task = task;
      },
      (error) => {
        this.task = null;
      }
    );
  }

  toggleTaskStatus(): void {
    if (this.task) {
      this.taskService.toggleTaskStatus(this.taskId);
      this.loadTask(); // Reload to get updated task
    }
  }

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      this.taskService.deleteTask(this.taskId);
      this.router.navigate(['/tasks']);
    }
  }

  isUpcoming(dueDate: string): boolean {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }

  getDaysUntilDue(dueDate: string): string {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'today';
    } else if (diffDays === 1) {
      return 'tomorrow';
    } else if (diffDays > 1) {
      return `in ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days overdue`;
    }
  }
}
