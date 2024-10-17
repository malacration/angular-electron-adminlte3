
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LinhaItem, VendaFutura } from '../../../model/venda/venda-futura';

import * as $ from 'jquery';
import { AlertService } from '../../../service/alert.service';
import { Option } from '../../../model/form/option';
import { SelectComponent } from '../../form/select/select.component';
import { ItemRetirada, PedidoRetirada } from '../../../model/venda/pedido-retirada';
import { VendaFuturaService } from '../../../service/venda-futura.service';

@Component({
  selector: 'app-venda-futura-troca',
  templateUrl: './troca.component.html',
  styleUrls: ['./troca.component.scss']
})
export class TrocaComponent implements OnInit {
  

  @Input() 
  vendaFutura: VendaFutura = new VendaFutura();

  branchId : number

  @ViewChild('selectComponent', {static: true}) selectComponent: SelectComponent;

  @Output()
  retirados = new EventEmitter<Array<any>>();

  loadingSalvar = false
  selectedItem: LinhaItem | null = null;
  quantity: number | null = null;
  itensRetirados: Array<ItemRetirada> = new Array();
  dtEntrega

  constructor(
    private alertService: AlertService,
    private service : VendaFuturaService){
    
  }

  ngOnInit(): void {
    //TODO ajustar filial
    this.branchId = 2
  }

  get filteredItems(): Array<Option> {
    // Filtra os itens que já foram retirados
    const retiradosCodes = this.itensRetirados.map(it => it.itemCode);
    return this.vendaFutura.AR_CF_LINHACollection.filter(
      item => !retiradosCodes.includes(item.U_itemCode)
    ).filter(it => it.qtdDisponivel > 0).map(it => new Option(it,it.U_description+" - Qtd: "+it.qtdDisponivel));
  }

  selecionado($event){
    this.selectedItem = $event
  }

  validateEhAdiciona() {
    if (this.selectedItem && this.quantity && this.quantity > this.selectedItem.U_quantity) {
      this.alertService.info("Formulário inválido ou quantidade superior ao disponível.");
    } else {
      this.adiciona();
    }
  }

  removerItem(index: number) {
    const itemRemovido = this.itensRetirados[index];
    this.itensRetirados.splice(index, 1);
  }


  adiciona() {
    if (this.selectedItem && this.quantity && this.quantity <= this.selectedItem.U_quantity) {
      this.itensRetirados.push(new ItemRetirada(this.selectedItem.U_itemCode,this.quantity,this.selectedItem.U_description));
      this.clearForm()
    }
  }

  salvarPedido(){
    this.loadingSalvar = true
    let pedidoRetireada = this.vendaFutura.getPedidoRetirada(this.itensRetirados,this.dtEntrega)
    this.service.retirar(pedidoRetireada).subscribe({
      next : documento => {
        this.alertService.info("Cotação de venda gerada com sucesso.").then(it => {
          this.retirados.emit(this.itensRetirados)
          this.clearForm()
        })
      },
      error : () => {this.loadingSalvar = false},
      complete : () => {this.loadingSalvar = false}
    })
  }

  clearForm(){
    this.selectedItem = null;
    this.quantity = null
    this.selectComponent.unselect()
  }

  novoProduto($event){
    console.log($event)
  }

  totalBalanco() : number{
    return 0
  }


}
