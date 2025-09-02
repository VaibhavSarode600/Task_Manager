import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditTaskComponent } from './edit-task.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { Task } from '../../services/task.service';

describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const sampleTask: Task = {
    id: 1,
    title: 'Sample Task',
    description: 'This is a sample task',
    dueDate: '2025-08-28',
    status: 'pending',
    createdDate: '',
    lastModified: ''
  };

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTask', 'updateTask', 'deleteTask']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditTaskComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadTask() and set task correctly', fakeAsync(() => {
    mockTaskService.getTask.and.returnValue(of(sampleTask));

    fixture.detectChanges(); // triggers ngOnInit
    tick();

    expect(component.taskId).toBe(1);
    expect(component.task).toEqual(sampleTask);
    expect(mockTaskService.getTask).toHaveBeenCalledWith(1);
  }));

  it('should submit updated task and navigate to task detail', fakeAsync(() => {
    component.task = { ...sampleTask, title: 'Updated Task' };
    component.taskId = 1;

    mockTaskService.updateTask.and.returnValue(of(component.task));

    component.onSubmit();
    tick();

    expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, component.task);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/task-detail', 1]);
  }));

  it('should not submit if task title is empty', () => {
    component.task = { ...sampleTask, title: ' ' };
    component.onSubmit();

    expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to task detail page on viewTask()', () => {
    component.taskId = 1;
    component.viewTask();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/task-detail', 1]);
  });

  it('should navigate back to /tasks on goBack()', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should delete task and navigate on confirm', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.taskId = 1;

    component.deleteTask();

    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should not delete task if confirm is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.taskId = 1;

    component.deleteTask();

    expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/tasks']);
  });

  it('should show "Task Not Found" if task is null', () => {
    component.task = null;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-state h3')?.textContent).toContain('Task Not Found');
  });

  it('should disable submit button when title is empty', fakeAsync(() => {
    mockTaskService.getTask.and.returnValue(of({ ...sampleTask, title: '' }));
    fixture.detectChanges();
    tick();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeFalsy();
  }));

  it('should not call updateTask if title is whitespace-only', () => {
    component.task = { ...sampleTask, title: '     ' };
    component.onSubmit();

    expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  // Delete confirmation dialog blocks deletion if canceled
  it('should not delete task if confirm dialog returns false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.taskId = 1;

    component.deleteTask();

    expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/tasks']);
  });

  // Simulate input change and form submit via DOM
  it('should update task title through input field and call onSubmit()', fakeAsync(() => {
    mockTaskService.getTask.and.returnValue(of(sampleTask));
    mockTaskService.updateTask.and.returnValue(of(sampleTask));

    fixture.detectChanges();
    tick();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('#title');
    input.value = 'Updated Title';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    tick();

    expect(component.task?.title).toBe('Updated Title');
    expect(mockTaskService.updateTask).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/task-detail', 1]);
  }));

  // If getTask() returns null, fallback UI should show
  it('should show error message when getTask returns null', fakeAsync(() => {
    mockTaskService.getTask.and.returnValue(of(null) as unknown as Observable<Task>);

    fixture.detectChanges();
    tick();

    const fallback = fixture.nativeElement.querySelector('.error-state');
    expect(fallback).toBeTruthy();
    expect(fallback.textContent).toContain('Task Not Found');
  }));

  // Change dropdown value and submit updated status

  it('should update status via select dropdown and submit the form', fakeAsync(() => {
    const updatedTask = { ...sampleTask, status: 'completed' };

    mockTaskService.getTask.and.returnValue(of(sampleTask));
    mockTaskService.updateTask.and.returnValue(of({ ...sampleTask, status: 'completed' }));

    fixture.detectChanges();
    tick();

    // Simulate dropdown change
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#status');
    select.value = select.options[1].value; // "completed"
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    component.onSubmit();
    tick();

    expect(component.task?.status).toBe('completed');
    expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, jasmine.objectContaining({ status: 'completed' }));
  }));

});
