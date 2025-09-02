import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {

  task = {
    title: '',
    description: '',
    dueDate: '',
    status: 'pending' as const
  };
  taskForm: any;
  form: any;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.task.title.trim()) {
      this.taskService.addTask(this.task).subscribe((res) => {
        console.warn('Task added successfully:', res);
      },
        error => {
          console.error('Error adding task:', error);

        });
    }
    this.router.navigate(['/tasks']);
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
