import { Component, OnInit } from '@angular/core';
import { FacturasService } from './services/facturas.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  public factura: Factura;
  titulo: string = 'Factura';

  constructor(public facturasService: FacturasService,
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      this.facturasService.getFactura(id).subscribe(factura => {
        console.log(factura.total);
        this.factura = factura;
      })
    })
  }

}
