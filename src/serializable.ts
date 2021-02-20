import { plainToClass as _plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import 'reflect-metadata';

type MatchFn = (x: any) => boolean | Array<(x: any) => boolean>;
const discriminators = new Map<MatchFn, ClassConstructor<any>>();

export function Serializable(config: {
  discriminatorFn?: (x: any) => boolean;
  discriminator?: { key: string; value: any };
}): any {
  return (constructor: ClassConstructor<any>) => {
    const dynamicFn = (x: any) => x[config.discriminator.key] == config.discriminator.value;
    const fn = config.discriminatorFn || dynamicFn;
    discriminators.set(fn, constructor);
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function BaseType(baseClassFn: () => Function) {
  return (target: any, property: PropertyKey): any => {
    Reflect.defineMetadata(
      `baseClass`,
      baseClassFn(),
      target.constructor,
      property.toString(),
    );
  };
}

export function plainToClass<T>(
  toClass: ClassConstructor<T>,
  plainObject: any,
): T {
  const instance = _plainToClass(toClass, plainObject);
  for (const [prop, propValue] of Object.entries(instance)) {
    if (typeof propValue !== 'object') {
      continue;
    }
    const baseClass =
      Reflect.getMetadata('baseClass', plainObject) ||
      Reflect.getMetadata('baseClass', toClass, prop);
    if (baseClass) {
      if (Array.isArray(propValue)) {
        Reflect.defineMetadata(`baseClass`, baseClass, propValue);
      }
      const destinationCls = findCls(propValue, baseClass);
      instance[prop] = plainToClass(destinationCls, propValue);
    }
  }
  return instance;
}

function findCls(
  plainObject: any,
  baseCls: ClassConstructor<any>,
): ClassConstructor<any> {
  for (const [matchFn, cls] of discriminators) {
    const match = matchFn.call(null, plainObject);
    if (match) {
      if (new cls() instanceof baseCls) {
        return cls;
      }
    }
  }
  return Object;
}
