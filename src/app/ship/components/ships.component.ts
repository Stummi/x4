import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Race, Ship } from '../../shared/services/model/model';
import { EntityListComponent } from '../../shared/components/entity-list.component';
import { ShipService } from '../../shared/services/ship.service';
import { RaceService } from '../../shared/services/race.service';
import { Size } from '../../shared/services/data/size-data';
import { ShipType } from '../../shared/services/data/ship-type-data';
import { ShipPurpose } from '../../shared/services/data/ship-purpose-data';

@Component({
   templateUrl: './ships.component.html'
})
export class ShipsComponent extends EntityListComponent<Ship> implements OnInit {
   sizes = Size.all;
   races: Race[];
   shipTypes: string[];
   purposes: string[];

   constructor(entityService: ShipService,
               private raceService: RaceService,
               private router: Router,
               private route: ActivatedRoute,
               private titleService: Title) {
      super(entityService);
   }

   ngOnInit(): void {
      this.titleService.setTitle('X4: Foundations - Ships');

      this.races = this.raceService.getEntities();
      this.shipTypes = Object.keys(ShipType).map(x => ShipType[x]);
      this.purposes = Object.keys(ShipPurpose).map(x => ShipPurpose[x]);

      super.ngOnInit();
   }

   onRowSelect(e: any) {
      if (e.rowType == 'data') {
         return this.router.navigate([ e.row.data.id ], { relativeTo: this.route });
      }
   }
}
