import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WareService } from '../../../shared/services/ware.service';
import { ResourceCalculator, StationModuleModel, StationResourceModel } from '../station-calculator.model';
import { StationSummaryService } from '../station-summary/services/station-summary.service';

/**
 * The Station Resources component
 */
@Component({
    selector: 'app-station-resources',
    templateUrl: './station-resources.component.html',
})
export class StationResourcesComponent implements OnChanges, OnDestroy {
    private expandState: { [resourceId: number]: boolean } = {};

    totalWorkforce = 0;
    totalWorkforceCapacity = 0;
    partialWorkforce = 0;
    resources: StationResourceModel[] = [];

    workforceSubscription: Subscription;

    @Input()
    modules: StationModuleModel[];

    @Input()
    sunlight = 100;

    constructor(private wareService: WareService, private stationSummaryService: StationSummaryService) {
        this.workforceSubscription = this.stationSummaryService.partialWorkforceChanged.subscribe(
            (workforce: number) => {
                this.partialWorkforce = workforce;
                this.update();
            }
        );
    }

    ngOnChanges() {
        this.update();
    }

    ngOnInit(): void {
    }

    toggleExpanded(item: any) {
        item.expanded = !item.expanded;
        this.expandState[item.ware.id] = item.expanded;
    }

    update() {
        this.totalWorkforce = 0;

        if (this.modules == null) {
            return;
        }

        this.totalWorkforce = this.modules.reduce((acc, item) => {
            if (item.module && item.module.workForce && item.module.workForce.max) {
                return acc + item.count * item.module.workForce.max;
            }
            return acc;
        }, 0);

        const workforce = this.modules.reduce((acc, item) => {
            if (item.module && item.module.workForce && item.module.workForce.capacity) {
                return acc + item.count * item.module.workForce.capacity;
            }
            return acc;
        }, 0);
        if (this.totalWorkforceCapacity != workforce) {
            this.totalWorkforceCapacity = workforce;
            this.partialWorkforce = workforce;
        }

        this.resources = ResourceCalculator.calculate(this.modules, this.sunlight, this.partialWorkforce);
        this.resources.forEach((x) => {
            x.expanded = this.expandState[x.items[0].ware.id];
        });

        this.resources.sort((a, b) => this.wareService.compareWares(a.ware, b.ware));
    }

    ngOnDestroy(): void {
        this.workforceSubscription.unsubscribe();
    }
}
