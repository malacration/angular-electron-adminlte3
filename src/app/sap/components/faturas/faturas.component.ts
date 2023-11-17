import { Component, OnInit } from '@angular/core';
import { FaturasService } from '../../service/fatura/faturas.service';



@Component({
  selector: 'app-faturas',
  templateUrl: './faturas.component.html',
  styleUrls: ['./faturas.component.scss']
  
})
export class FaturasComponent implements OnInit {
  
  finalizado = false;
  faturas : Array<string> = ["1","2"]
  
  faturaSelecionada : any;

  constructor(private faturaService : FaturasService){
      
  }

  ngOnInit(): void {
    this.faturaService.getFaturas().subscribe((faturas) => {
      this.faturas = faturas;
    })
  }

  selecionaFatura($event){
    this.faturaSelecionada = $event;
    console.log($event)
  }

  descelecionarFatura($event){
    this.faturaSelecionada = undefined;
  }


}
