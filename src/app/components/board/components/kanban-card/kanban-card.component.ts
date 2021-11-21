import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { CardCategoryEnum } from 'src/app/constants/card-category.enum';
import { Card } from 'src/app/models/card.model';
import { KanbanService } from 'src/app/services/kanban.service';

@Component({
  selector: 'app-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss']
})
export class KanbanCardComponent implements OnInit {

  @Input() public card!: Card;
  @Output() public updateCardEmitter = new EventEmitter();
  @Output() public updatedCardEmitter = new EventEmitter();

  public cardCategory = CardCategoryEnum;

  constructor(private kanbanService: KanbanService) { }

  ngOnInit() {
  }

  public updateCard(): void {
    this.updateCardEmitter.emit(this.card);
  }

  public deleteCard(id: string): void {
    this.kanbanService.deleteCard(id)
      .pipe(first())
      .subscribe(() => {
        this.updatedCardEmitter.emit();
      });
  }

  public moveToNextList(): void {
    this.card.lista = this.card.lista === CardCategoryEnum.TODO ? CardCategoryEnum.DOING : CardCategoryEnum.DONE;
    this.moveCard();
  }

  public moveToPreviousList(): void {
    this.card.lista = this.card.lista === CardCategoryEnum.DONE ? CardCategoryEnum.DOING : CardCategoryEnum.TODO;
    this.moveCard();
  }

  public moveCard(): void {
    this.kanbanService.updateCard(this.card)
      .pipe(first())
      .subscribe(res => {
        this.updatedCardEmitter.emit(this.card);
      });
  }
}
