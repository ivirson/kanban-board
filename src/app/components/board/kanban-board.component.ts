import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { CardCategoryEnum } from 'src/app/constants/card-category.enum';
import { Card } from 'src/app/models/card.model';
import { KanbanService } from 'src/app/services/kanban.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {

  @ViewChild('newCardModal') public newCardModal!: TemplateRef<any>;

  public toDoCards: Card[] = [];
  public doingCards: Card[] = [];
  public doneCards: Card[] = [];

  public card!: Card | null;

  public form = new FormGroup({
    id: new FormControl(null),
    lista: new FormControl(null),
    titulo: new FormControl(null, [Validators.required]),
    conteudo: new FormControl(null, [Validators.required]),
  });

  constructor(
    private kanbanService: KanbanService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.login();
    this.getCards();
  }

  private login(): void {
    this.kanbanService.login()
      .pipe(first())
      .subscribe(res => {
        localStorage.setItem(environment.userToken, res);
      });
  }

  private getCards(): void {
    this.kanbanService.getCards()
      .pipe(first())
      .subscribe(res => {
        this.toDoCards = res.filter(card => card.lista === CardCategoryEnum.TODO);
        this.doingCards = res.filter(card => card.lista === CardCategoryEnum.DOING);
        this.doneCards = res.filter(card => card.lista === CardCategoryEnum.DONE);
      })
  }

  public openNewCardModal(card?: Card): void {
    const dialogRef = this.dialog.open(this.newCardModal, {
      width: '600px',
      disableClose: true
    });

    this.card = null;
    this.form.reset();

    if (!!card) {
      this.card = card;
      this.form.patchValue(card);
    }

    dialogRef.afterClosed().subscribe(result => {
      this.getCards();
    });
  }

  public saveCard(): void {
    const card: Card = this.form.getRawValue();
    card.lista = CardCategoryEnum.TODO;
    this.kanbanService.saveCard(card)
      .pipe(first())
      .subscribe(() => {
        this.getCards();
      });
  }

  public updateCard(): void {
    const card = this.form.getRawValue();
    this.kanbanService.updateCard(card)
      .pipe(first())
      .subscribe(res => {
        this.getCards();
      });
  }

  public handleUpdatedCard(): void {
    this.getCards();
  }
}
