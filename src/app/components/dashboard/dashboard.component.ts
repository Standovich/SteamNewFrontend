import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Developer } from 'src/app/models/developer.model';
import { User } from 'src/app/models/user.model';
import { Game } from 'src/app/models/game.model';
import { DevelopersService } from 'src/app/services/developers.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  games: Game[] = [];
  users: User[] = [];
  developers: Developer[] = [];
  public developerForm !: FormGroup;
  showAdd !: boolean;
  showEdit !: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private developerService: DevelopersService
  ) { }

  ngOnInit(): void {
    this.developerForm = this.formBuilder.group({
      id: 0,
      name: ['']
    })

    this.refreshDevData();
  }

  refreshDevData(){
    this.developerService.getAllDevelopers()
    .subscribe({
      next: (developers) => {
        console.log(developers);
        this.developers = developers;
      },
      error: (response) => {
        console.log(response)
      }
    });
  }

  addDeveloper(){
    var formData: any = new FormData();
    formData.append('Name', this.developerForm.get('name')?.value);

    this.developerService.addDeveloper(formData)
    .subscribe({
      next: (developer) => {
        console.log(developer);
        this.developerForm.reset();
        let ref = document.getElementById('devCancel');
        ref?.click();
        this.refreshDevData();
      }
    })
  }

  deleteDeveloper(id: number){
    this.developerService.deleteDeveloper(id)
    .subscribe({
      next: (developer) => {
        console.log(developer);
        this.refreshDevData();
      }
    });
  }

  updateDeveloper(){
    var formData: any = new FormData();
    formData.append('Id', this.developerForm.get('id')?.value);
    formData.append('DevTeam_name', this.developerForm.get('name')?.value);

    this.developerService.updateDeveloper(formData)
    .subscribe({
      next: (developer) => {
        console.log(developer);
        let ref = document.getElementById('devCancel');
        ref?.click();
        this.refreshDevData();
      }
    })
  }

  onAdd(){
    this.developerForm.reset();
    this.showAdd = true;
    this.showEdit = false;
  }

  onEdit(dev: Developer){
    this.showAdd = false;
    this.showEdit = true;
    this.developerForm.controls['id'].setValue(dev.id);
    this.developerForm.controls['name'].setValue(dev.devTeam_name);
  }
}