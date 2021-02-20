import { BaseType, plainToClass, Serializable } from '../serializable';
import { Type } from 'class-transformer';

abstract class ChartSeries {
  type: string; // unique type
  print(str?: string): void {
    console.log(
      `${str || ''}`,
      `accept ${this.type}`,
      `constructor.name ${this.constructor.name}`,
    );
  }
}

@Serializable({
  discriminator: { key: 'type', value: 'line' },
})
class LineChartSeries extends ChartSeries {
  type: 'line' = 'line';

  print(): void {
    super.print('____LINE____');
  }
}

@Serializable({
  // discriminator by custom function
  discriminatorFn: (x: BarChartSeries) => x.type === 'bar',
})
class BarChartSeries extends ChartSeries {
  type: 'bar' = 'bar';

  print(): void {
    super.print('____BAR____');
  }
}

class Transition {
  type: 'fade' | 'blur';
  duration: number;
}

class ChartConfig {
  @Type(() => Transition)
  transition: Transition;

  // here we indicate the base class
  @BaseType(() => ChartSeries)
  series: ChartSeries[];
}
const plainObject = {
  transition: {
    type: 'fade',
    duration: 200,
  },
  series: [
    {
      type: 'line',
    },
    {
      type: 'bar',
    },
  ],
};

export const chartSeriesExample = () => {
  const instance = plainToClass<ChartConfig>(ChartConfig, plainObject);
  instance.series.map((series) => series.print());
  console.log(
    'Transition instanceof',
    instance.transition instanceof Transition,
  );
};
