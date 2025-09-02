import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  createdDate: string;
  lastModified: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  // GET all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // GET a single task by ID
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // POST a new task
  addTask(task: Omit<Task, 'id' | 'createdDate' | 'lastModified'>){
    const now = new Date().toISOString().split('T')[0];
    const newTask = {
      ...task,
      createdDate: now,
      lastModified: now,
      status: 'pending'
    };
    console.warn(newTask);
    
    return this.http.post(this.apiUrl, newTask);
  }

  // PUT to update an existing task
  updateTask(id: number, updates: Partial<Task>): Observable<Task> {
    const now = new Date().toISOString().split('T')[0];
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, {
      ...updates,
      lastModified: now
    });
  }

  // DELETE a task
  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Toggle task status
  toggleTaskStatus(task: any): Observable<Task> {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    return this.updateTask(task.id, { status: newStatus });
  }
}
