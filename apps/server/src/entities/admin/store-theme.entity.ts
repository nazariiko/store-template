import { Column, Entity, OneToMany } from 'typeorm';
import { BaseCreatedUpdated } from '../base/base-created-updated.entity';
import { StoreMainSettings } from './store-main-settings.entity';

@Entity()
export class StoreTheme extends BaseCreatedUpdated {
  @Column({ nullable: false, type: 'character varying', length: 50 })
  name: string;

  @Column({ nullable: false, type: 'character varying', length: 50 })
  alias: string;

  @OneToMany(
    () => StoreMainSettings,
    (storeMainSettings) => storeMainSettings.storeTheme,
  )
  storeMainSettings?: StoreMainSettings[];
}
