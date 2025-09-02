// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { TaskDetailComponent } from './task-detail.component';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClientTestingModule } from '@angular/common/http/testing';

// describe('TaskDetailComponent', () => {
//   let component: TaskDetailComponent;
//   let fixture: ComponentFixture<TaskDetailComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [TaskDetailComponent,ActivatedRoute,HttpClientTestingModule]
//     })
//     .compileComponents();
    
//     fixture = TestBed.createComponent(TaskDetailComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let mockActivatedRoute: any;
  let mockTaskService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ id: '1' }),  // <-- Provide params as observable
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    mockTaskService = {
      getTask: jasmine.createSpy('getTask').and.returnValue(of({
        id: 1,
        title: 'Sample Task',
        description: 'This is a sample task'
      })),
      toggleTaskStatus: jasmine.createSpy('toggleTaskStatus'),
      deleteTask: jasmine.createSpy('deleteTask')
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TaskDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
