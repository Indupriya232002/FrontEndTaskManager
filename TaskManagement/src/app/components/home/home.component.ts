import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/models/Task.model';
import { HomeService } from 'src/app/services/Task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('createtaskmodal')createtaskmodal!:ElementRef;
  @ViewChild('edittaskmodal')edittaskmodal!:ElementRef;

  email: string | null = '';
  taskList : Task[] = [];
  modaltaskList : Task = {
    taskID:0,
    taskName :"", 
    taskDescription: "",
    status  :"Not Completed"
  };
  minDate: Date = new Date();
  isPastDate: boolean = false; 

  selectedTask : Task = new Task; 

  filteredTaskList: Task[] = [];
  searchQuery: string = '';

  errorMessage : string = "";

  validateTaskId = false;
  validateTaskName = false;
  validateTaskDescription = false;
  validateTaskDate = false;
  validateTaskStatus = false;

  updateValidateTaskId = false;
  updateValidateTaskName = false;
  updateValidateTaskDescription = false;
  updateValidateTaskDate = false;
  updateValidateTaskStatus = false;


  constructor(private homeservice:HomeService) { }

  ngOnInit(): void {
    this.email = window.localStorage.getItem("email");
    this.getTaskList();
    this.resetForm();
  }

  getTaskList()
  {
    this.homeservice.getAllTasks().subscribe({
      next:(response)=>{
        this.taskList = response;
        this.filteredTaskList = this.taskList;
      },
      error:(error)=>
      {
        Swal.fire({
          icon:'error',
          title:'Error....!!!',
          showConfirmButton:true,
        });
      }
    });
  }

  filterTasks(query: string): void{
    this.filteredTaskList = this.taskList.filter(task =>
    (task.status?.toLocaleLowerCase().includes(query.toLocaleLowerCase())) ||
    ( task.taskName?.toLowerCase().includes(query.toLowerCase()))
    );
  }

  resetForm()
  {
    this.modaltaskList = {
      taskID: 0,
      taskName: "",
      taskDescription: "",
      status: "Not Completed", // Reset status to default
    };
  this.modaltaskList.taskDate
  this.isPastDate = false;
  this.validateTaskId = false;
  this.validateTaskName = false;
  this.validateTaskDescription = false;
  this.validateTaskDate = false;
  this.validateTaskStatus = false;

  this.updateValidateTaskId = false;
  this.updateValidateTaskName = false;
  this.updateValidateTaskDescription = false;
  this.updateValidateTaskDate = false;
  this.updateValidateTaskStatus = false;

  }

  createTask() {
    // Reset validation flags
    this.validateTaskName = false;
    this.validateTaskDescription = false;
    this.validateTaskDate = false;
    this.validateTaskStatus = false;
    this.isPastDate = false;
     
    // Validate Task Name
    if (!this.modaltaskList.taskName || this.modaltaskList.taskName.trim() === '') {
      this.validateTaskName = true;
      this.errorMessage = "Task Name is Required.";
    }

    // Validate Task Description
    if (!this.modaltaskList.taskDescription || this.modaltaskList.taskDescription.trim() === '') {
      this.validateTaskDescription = true;
      this.errorMessage = "Task Description is Required.";
    }

    // Validate Task Date
    if (!this.modaltaskList.taskDate) {
      this.validateTaskDate = true;
      this.errorMessage = "Task Date is Required.";
      
    } else {
      const selectedDate = new Date(this.modaltaskList.taskDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison
      
      // Check if the selected date is in the past (excluding today)
      if (selectedDate < currentDate) {
        this.validateTaskDate = true;
        this.isPastDate = true;
        this.errorMessage = "Task Date cannot be in the past.";
      }
    }

    // If any validation errors exist, stop execution
    if (this.validateTaskName || this.validateTaskDescription || this.validateTaskDate) {
      return;
    }
    
    // Proceed with task creation if no validation errors
    this.homeservice.addTask(this.modaltaskList).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Task Created Successfully...!',
          showConfirmButton: true,
        });
        this.getTaskList();
        this.resetForm();
        this.closeModal();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error...!',
          showConfirmButton: true,
        });
      }
    });
  }



  openEditModal(task: Task)
  {
    this.selectedTask = { ...task };
  }


  updateTask()
  {
    this.updateValidateTaskName = false;
    this.updateValidateTaskDescription = false;
    this.updateValidateTaskDate = false;
    this.updateValidateTaskStatus = false;
    if(!this.selectedTask.taskName || this.selectedTask.taskName.trim() === '')
    {
      this.updateValidateTaskName = true;
      this.errorMessage = "Task Name is Required.";
    }
    if(!this.selectedTask.taskDescription || this.selectedTask.taskDescription.trim() === '')
    {
      this.updateValidateTaskDescription = true;
      this.errorMessage = "Task Description is Required.";
    }
    if(!this.selectedTask.taskDate)
    {
      this.updateValidateTaskDate = true;
      this.errorMessage = "Task Date is Required.";
    }
    if(!this.selectedTask.status)
    {
      this.updateValidateTaskStatus = true;
      this.errorMessage = "Task Status is Required.";
    }

    if( this.updateValidateTaskName || this.updateValidateTaskDescription || this.updateValidateTaskDate ||
      this.updateValidateTaskStatus)
      {
        return;
      }

    this.homeservice.updateTaskDetails(this.selectedTask).subscribe({
      next:(response) =>{
        Swal.fire({
          icon: 'success',
          title:'Task Updated Successfully',
          showConfirmButton: true
        });
        this.getTaskList();
        this.resetForm();
        this.updateTaskCloseModel();
      },
      error:(error)=>{
        Swal.fire({
          icon:'error',
          title: 'Error Occured While Updating Task',
          showConfirmButton: true
        });
      }
      
    });
  }


  updateTaskCloseModel()
  {

    const modal: HTMLElement = this.edittaskmodal.nativeElement as HTMLElement;

    if (modal) {
      modal.style.display =  "none";
      modal.classList.remove('show');
  
      const backdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (backdrop) {
        backdrop.remove();
      }
  
      document.body.classList.remove('modal-open');
    }
  }

  closeModal()
  {
    const modal: HTMLElement = this.createtaskmodal.nativeElement as HTMLElement;

    if (modal) {
      modal.style.display =  "none";
      modal.classList.remove('show');
  
      const backdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (backdrop) {
        backdrop.remove();
      }
  
      document.body.classList.remove('modal-open');
    }

  }

  deleteTaskDetails(id:number)
  {
    this.homeservice.deleteTaskDetailsById(id).subscribe({
      next:(response) =>{
        Swal.fire({
          icon: 'success',
          title:'Task Deleted Successfully',
          showConfirmButton: true
        });
        this.getTaskList();
      },
      error:(error)=>{
        Swal.fire({
          icon:'error',
          title: 'Error Occured While Deleting Task',
          showConfirmButton: true
        });
      }   
    });
  }


  executeFunctionOnConfirm(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete the Task',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTaskDetails(id);
      }
    });
  }

}
