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
  constructor(
    private formBuilder: FormBuilder,
    private developerService: DevelopersService
  ) { }

  ngOnInit(): void {
    this.developerForm = this.formBuilder.group({
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

  submitDevAddForm(){
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

  onEdit(dev: Developer){
    this.developerForm.controls['name'].setValue(dev.devTeam_name);
  }
}