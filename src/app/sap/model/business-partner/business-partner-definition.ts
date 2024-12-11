import { Column } from "../../../shared/components/table/column.model"

export class BusinessPartnerDefinition{

    getDefinition() {
        return [
            new Column('Id', 'CardCode'),
            new Column('Nome', 'CardName'),
            new Column('Doc.', 'CpfCnpjStr'),
            new Column('Limite Autorizado', 'limiteAutorizadoCurrency'),
            new Column('Limite Disponível', 'limiteDisponivelCurrency')
        ]   
    }
}